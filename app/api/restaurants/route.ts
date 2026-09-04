import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Récupérer tous les restaurants
        const restaurants = await prisma.restaurant.findMany({
            where: {
                status: 'OPEN',
            },
            select: {
                id: true,
                name: true,
                description: true,
                logo: true,
                address: true,
                city: true,
                phone: true,
                rating: true,
                reviewCount: true,
                openTime: true,
                closeTime: true,
                _count: {
                    select: { meals: true },
                },
            },
            orderBy: {
                rating: 'desc',
            },
        });

        return NextResponse.json(restaurants, { status: 200 });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return NextResponse.json(
            { error: 'Failed to fetch restaurants' },
            { status: 500 }
        );
    }
}