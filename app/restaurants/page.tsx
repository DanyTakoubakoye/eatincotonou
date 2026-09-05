'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

interface Meal {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    discountPrice?: number;
    appetiteLevel: string;
    cuisine: string;
    flavorProfile: string;
    rating: number;
    reviewCount: number;
    restaurant: {
        id: string;
        name: string;
        logo: string;
        rating: number;
    };
}

export default function RestaurantsPage() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [appetiteLevel, setAppetiteLevel] = useState<string>(''); // LEGER ou CONSISTANT
    const [flavorProfile, setFlavorProfile] = useState<string>(''); // SUCRE, SALE, EPICE, MIX
    const [cuisine, setCuisine] = useState<string>(''); // LOCAL, INDIAN, etc
    const addToCart = useCartStore((state) => state.addToCart);

    // Charger les plats
    useEffect(() => {
        fetchMeals();
    }, [appetiteLevel, flavorProfile, cuisine]);

    const fetchMeals = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (appetiteLevel) params.append('appetiteLevel', appetiteLevel);
            if (flavorProfile) params.append('flavorProfile', flavorProfile);
            if (cuisine) params.append('cuisine', cuisine);

            const response = await fetch(`/api/meals?${params.toString()}`);
            const data = await response.json();

            // Vérifier que c'est un array
            if (Array.isArray(data)) {
                setMeals(data);
            } else {
                console.error('API did not return an array:', data);
                setMeals([]);
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
            setMeals([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold mb-4">Qu'est-ce que tu as envie de manger aujourd'hui?</h1>
                    <p className="text-gray-600">Filtre par appétit, saveur ou cuisine</p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6">Filtres</h2>

                    {/* Appetite Level - LÉGER vs CONSISTANT */}
                    <div className="mb-6">
                        <h3 className="font-bold mb-3">Appétit</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setAppetiteLevel(appetiteLevel === 'LEGER' ? '' : 'LEGER')}
                                className={`px-6 py-2 rounded-lg font-bold transition ${appetiteLevel === 'LEGER'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                🥗 Léger
                            </button>
                            <button
                                onClick={() => setAppetiteLevel(appetiteLevel === 'CONSISTANT' ? '' : 'CONSISTANT')}
                                className={`px-6 py-2 rounded-lg font-bold transition ${appetiteLevel === 'CONSISTANT'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                🍲 Consistant
                            </button>
                        </div>
                    </div>

                    {/* Flavor Profile - Sucré, Salé, Épicé */}
                    <div className="mb-6">
                        <h3 className="font-bold mb-3">Saveur</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {['SUCRE', 'SALE', 'EPICE', 'MIX'].map((flavor) => (
                                <button
                                    key={flavor}
                                    onClick={() =>
                                        setFlavorProfile(flavorProfile === flavor ? '' : flavor)
                                    }
                                    className={`px-4 py-2 rounded-lg font-bold transition ${flavorProfile === flavor
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {flavor === 'SUCRE' && '🍫 Sucré'}
                                    {flavor === 'SALE' && '🧂 Salé'}
                                    {flavor === 'EPICE' && '🌶️ Épicé'}
                                    {flavor === 'MIX' && '🎨 Mix'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cuisine */}
                    <div className="mb-6">
                        <h3 className="font-bold mb-3">Cuisine</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {['LOCAL', 'INDIAN', 'CHINESE', 'ITALIAN', 'EUROPEAN'].map(
                                (c) => (
                                    <button
                                        key={c}
                                        onClick={() => setCuisine(cuisine === c ? '' : c)}
                                        className={`px-4 py-2 rounded-lg font-bold transition ${cuisine === c
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {c === 'LOCAL' && '🇧🇯 Local'}
                                        {c === 'INDIAN' && '🇮🇳 Indien'}
                                        {c === 'CHINESE' && '🇨🇳 Chinois'}
                                        {c === 'ITALIAN' && '🇮🇹 Italien'}
                                        {c === 'EUROPEAN' && '🇪🇺 Européen'}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Reset Filters */}
                    <button
                        onClick={() => {
                            setAppetiteLevel('');
                            setFlavorProfile('');
                            setCuisine('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Réinitialiser filtres
                    </button>
                </div>

                {/* Meals Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Chargement des plats...</p>
                    </div>
                ) : meals.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Aucun plat ne correspond à vos filtres</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                            >
                                {/* Meal Image */}
                                {meal.image && (
                                    <img
                                        src={meal.image}
                                        alt={meal.name}
                                        className="w-full h-48 object-cover"
                                    />
                                )}

                                {/* Meal Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-2">{meal.name}</h3>

                                    {/* Restaurant Info */}
                                    <div className="flex items-center gap-2 mb-3">
                                        {meal.restaurant.logo && (
                                            <img
                                                src={meal.restaurant.logo}
                                                alt={meal.restaurant.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        )}
                                        <span className="text-sm text-gray-600">
                                            {meal.restaurant.name}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-yellow-500">⭐</span>
                                        <span className="font-bold">{meal.rating.toFixed(1)}</span>
                                        <span className="text-gray-600 text-sm">
                                            ({meal.reviewCount} avis)
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {meal.price.toLocaleString()} XOF
                                            </span>
                                            {meal.discountPrice && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    {meal.discountPrice.toLocaleString()} XOF
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {meal.appetiteLevel === 'LEGER' ? '🥗 Léger' : '🍲 Consistant'}
                                        </span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            {meal.flavorProfile}
                                        </span>
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                            {meal.cuisine}
                                        </span>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => {
                                            addToCart({
                                                id: `${meal.id}-${Date.now()}`,
                                                mealId: meal.id,
                                                mealName: meal.name,
                                                price: meal.discountPrice || meal.price,
                                                quantity: 1,
                                                restaurantId: meal.restaurant.id,
                                                restaurantName: meal.restaurant.name,
                                                restaurantLogo: meal.restaurant.logo,
                                                image: meal.image,
                                            });
                                            alert('✅ Plat ajouté au panier!');
                                        }}
                                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        + Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}