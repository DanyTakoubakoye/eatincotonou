'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
        useCartStore();

    const totalPrice = getTotalPrice();
    const deliveryFee = items.length > 0 ? 500 : 0;
    const subtotal = totalPrice;
    const total = subtotal + deliveryFee;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Votre panier</h1>

                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-2xl text-gray-600 mb-6">
                            Votre panier est vide
                        </p>
                        <Link
                            href="/restaurants"
                            className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600"
                        >
                            ← Retour aux restaurants
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Votre panier</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="border-b last:border-b-0 p-6 flex gap-4"
                                >
                                    {/* Item Image */}
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.mealName}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    )}

                                    {/* Item Details */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold">{item.mealName}</h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {item.restaurantName}
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 mb-4">
                                            {item.price.toLocaleString()} XOF
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.mealId, item.quantity - 1)
                                                }
                                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                −
                                            </button>

                                            <span className="font-bold text-lg w-8 text-center">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.mealId, item.quantity + 1)
                                                }
                                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                +
                                            </button>

                                            <span className="flex-1 text-right font-bold">
                                                {(item.price * item.quantity).toLocaleString()} XOF
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.mealId)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <Link
                            href="/restaurants"
                            className="inline-block mt-6 bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600"
                        >
                            ← Continuer vos achats
                        </Link>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-xl font-bold mb-6">Résumé</h2>

                            {/* Subtotal */}
                            <div className="flex justify-between mb-4 pb-4 border-b">
                                <span>Sous-total</span>
                                <span className="font-bold">{subtotal.toLocaleString()} XOF</span>
                            </div>

                            {/* Delivery Fee */}
                            <div className="flex justify-between mb-4 pb-4 border-b">
                                <span>Livraison</span>
                                <span className="font-bold">{deliveryFee.toLocaleString()} XOF</span>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between mb-6 text-2xl font-bold">
                                <span>Total</span>
                                <span className="text-blue-600">{total.toLocaleString()} XOF</span>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className="block w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 text-center mb-4"
                            >
                                Passer la commande →
                            </Link>

                            {/* Clear Cart Button */}
                            <button
                                onClick={() => clearCart()}
                                className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                            >
                                Vider le panier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}