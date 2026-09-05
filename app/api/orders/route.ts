import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
    try {
        // Vérifier que l'utilisateur est connecté
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Récupérer les données
        const {
            fullName,
            phone,
            address,
            city,
            deliveryNotes,
            paymentMethod,
            items,
            subtotal,
            deliveryFee,
            total,
        } = await request.json();

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Récupérer le restaurant (du premier plat)
        const firstMeal = await prisma.meal.findUnique({
            where: { id: items[0].mealId },
        });

        if (!firstMeal) {
            return NextResponse.json(
                { error: 'Meal not found' },
                { status: 404 }
            );
        }

        // Créer la commande
        const order = await prisma.order.create({
            data: {
                customerId: user.id,
                restaurantId: firstMeal.restaurantId,
                deliveryAddress: address,
                deliveryCity: city,
                deliveryNotes,
                paymentMethod,
                subtotal,
                deliveryFee,
                total,
                status: 'PENDING',
                items: {
                    createMany: {
                        data: items.map((item: any) => ({
                            mealId: item.mealId,
                            quantity: item.quantity,
                            priceAtOrderTime: item.price,
                        })),
                    },
                },
            },
            include: {
                items: true,
            },
        });

        // Si COD (Cash On Delivery), marquer comme confirmée
        if (paymentMethod === 'COD') {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'CONFIRMED',
                    confirmedAt: new Date(),
                },
            });
        }

        // Créer Payment (pour traçabilité)
        await prisma.payment.create({
            data: {
                orderId: order.id,
                method: paymentMethod,
                status: paymentMethod === 'COD' ? 'PENDING' : 'PROCESSING',
                amount: total,
            },
        });

        return NextResponse.json(
            {
                message: 'Order created successfully',
                orderId: order.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
