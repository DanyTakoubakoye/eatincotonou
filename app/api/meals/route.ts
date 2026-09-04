import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Récupérer les filtres
        const appetiteLevel = searchParams.get('appetiteLevel'); // LEGER ou CONSISTANT
        const cuisine = searchParams.get('cuisine'); // LOCAL, INDIAN, etc
        const flavorProfile = searchParams.get('flavorProfile'); // SUCRE, SALE, EPICE
        const city = searchParams.get('city') || 'Cotonou';

        // Construire les filtres
        const where: any = {
            isAvailable: true,
            restaurant: {
                city: city,
                status: 'OPEN',
            },
        };

        if (appetiteLevel) {
            where.appetiteLevel = appetiteLevel;
        }

        if (cuisine) {
            where.cuisine = cuisine;
        }

        if (flavorProfile) {
            where.flavorProfile = flavorProfile;
        }

        // Récupérer les plats
        const meals = await prisma.meal.findMany({
            where,
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                price: true,
                discountPrice: true,
                appetiteLevel: true,
                cuisine: true,
                flavorProfile: true,
                rating: true,
                reviewCount: true,
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        rating: true,
                        openTime: true,
                        closeTime: true,
                    },
                },
            },
            orderBy: {
                rating: 'desc',
            },
            take: 50, // Max 50 plats
        });

        return NextResponse.json(meals, { status: 200 });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meals' },
            { status: 500 }
        );
    }
}