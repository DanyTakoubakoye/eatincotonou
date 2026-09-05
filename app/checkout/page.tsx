'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();

    // State
    const [step, setStep] = useState<1 | 2>(1); // Étape 1: adresse, Étape 2: paiement
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('Cotonou');
    const [deliveryNotes, setDeliveryNotes] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MOOV' | 'MTN' | 'COD'>('CARD');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subtotal = getTotalPrice();
    const deliveryFee = items.length > 0 ? 500 : 0;
    const total = subtotal + deliveryFee;

    // Panier vide?
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Passer la commande</h1>

                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-2xl text-gray-600 mb-6">Votre panier est vide</p>
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

    // Étape 1 : Adresse de livraison
    if (step === 1) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Adresse de livraison</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulaire */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!fullName || !phone || !address) {
                                        setError('Tous les champs sont requis');
                                        return;
                                    }
                                    setError('');
                                    setStep(2);
                                }}
                            >
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        {error}
                                    </div>
                                )}

                                {/* Nom */}
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                        placeholder="Jean Dupont"
                                        required
                                    />
                                </div>

                                {/* Téléphone */}
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                        placeholder="+229 XXXXXXXXXX"
                                        required
                                    />
                                </div>

                                {/* Adresse */}
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Adresse complète</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                        placeholder="123 rue principale, Cadjehoun"
                                        rows={3}
                                        required
                                    />
                                </div>

                                {/* Ville */}
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Ville</label>
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                    >
                                        <option value="Cotonou">Cotonou</option>
                                        <option value="Porto-Novo">Porto-Novo</option>
                                        <option value="Parakou">Parakou</option>
                                    </select>
                                </div>

                                {/* Notes de livraison */}
                                <div className="mb-6">
                                    <label className="block font-bold mb-2">Notes de livraison (optionnel)</label>
                                    <textarea
                                        value={deliveryNotes}
                                        onChange={(e) => setDeliveryNotes(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                        placeholder="Ex: Sonnez 2 fois, maison bleue..."
                                        rows={2}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <Link
                                        href="/cart"
                                        className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 text-center"
                                    >
                                        ← Retour
                                    </Link>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600"
                                    >
                                        Continuer →
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Résumé panier */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                                <h2 className="text-xl font-bold mb-6">Résumé</h2>

                                <div className="space-y-2 mb-4 pb-4 border-b max-h-48 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.mealName} x{item.quantity}
                                            </span>
                                            <span className="font-bold">
                                                {(item.price * item.quantity).toLocaleString()} XOF
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between mb-4 pb-4 border-b">
                                    <span>Sous-total</span>
                                    <span className="font-bold">{subtotal.toLocaleString()} XOF</span>
                                </div>

                                <div className="flex justify-between mb-4 pb-4 border-b">
                                    <span>Livraison</span>
                                    <span className="font-bold">{deliveryFee.toLocaleString()} XOF</span>
                                </div>

                                <div className="flex justify-between text-2xl font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">{total.toLocaleString()} XOF</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Étape 2 : Paiement
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Méthode de paiement</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Paiement */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <h2 className="text-xl font-bold mb-6">Choisir une méthode de paiement</h2>

                        {/* Payment Methods */}
                        <div className="space-y-4 mb-6">
                            {/* CARD */}
                            <button
                                onClick={() => setPaymentMethod('CARD')}
                                className={`w-full p-4 border-2 rounded-lg text-left font-bold transition ${paymentMethod === 'CARD'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                💳 Carte Bancaire
                            </button>

                            {/* MOOV */}
                            <button
                                onClick={() => setPaymentMethod('MOOV')}
                                className={`w-full p-4 border-2 rounded-lg text-left font-bold transition ${paymentMethod === 'MOOV'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                📱 Moov Money
                            </button>

                            {/* MTN */}
                            <button
                                onClick={() => setPaymentMethod('MTN')}
                                className={`w-full p-4 border-2 rounded-lg text-left font-bold transition ${paymentMethod === 'MTN'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                📱 MTN Money
                            </button>

                            {/* COD */}
                            <button
                                onClick={() => setPaymentMethod('COD')}
                                className={`w-full p-4 border-2 rounded-lg text-left font-bold transition ${paymentMethod === 'COD'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                💰 Paiement à la livraison
                            </button>
                        </div>

                        {/* Adresse info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-bold mb-2">Adresse de livraison</h3>
                            <p className="text-gray-700">{fullName}</p>
                            <p className="text-gray-700">{address}</p>
                            <p className="text-gray-700">{city}</p>
                            <p className="text-gray-700">Tél: {phone}</p>
                            {deliveryNotes && (
                                <p className="text-gray-600 text-sm mt-2">
                                    <strong>Notes:</strong> {deliveryNotes}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400"
                            >
                                ← Retour
                            </button>
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    setError('');

                                    try {
                                        // Créer la commande
                                        const response = await fetch('/api/orders', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
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
                                            }),
                                        });

                                        const data = await response.json();

                                        if (!response.ok) {
                                            setError(data.error || 'Erreur lors de la création de la commande');
                                            return;
                                        }

                                        // Succès
                                        clearCart();
                                        router.push(`/order-confirmation/${data.orderId}`);
                                    } catch (err) {
                                        setError('Une erreur s\'est produite');
                                        console.error(err);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {loading ? 'Traitement...' : `Confirmer (${total.toLocaleString()} XOF)`}
                            </button>
                        </div>
                    </div>

                    {/* Résumé */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-xl font-bold mb-6">Résumé</h2>

                            <div className="space-y-2 mb-4 pb-4 border-b max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>
                                            {item.mealName} x{item.quantity}
                                        </span>
                                        <span className="font-bold">
                                            {(item.price * item.quantity).toLocaleString()} XOF
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mb-4 pb-4 border-b">
                                <span>Sous-total</span>
                                <span className="font-bold">{subtotal.toLocaleString()} XOF</span>
                            </div>

                            <div className="flex justify-between mb-4 pb-4 border-b">
                                <span>Livraison</span>
                                <span className="font-bold">{deliveryFee.toLocaleString()} XOF</span>
                            </div>

                            <div className="flex justify-between text-2xl font-bold">
                                <span>Total</span>
                                <span className="text-blue-600">{total.toLocaleString()} XOF</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}