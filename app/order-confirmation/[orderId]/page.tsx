'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params.orderId as string;

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                {/* Success Icon */}
                <div className="mb-6 text-6xl">✅</div>

                <h1 className="text-4xl font-bold mb-4 text-green-600">
                    Commande confirmée!
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    Votre commande a été créée avec succès
                </p>

                {/* Order ID */}
                <div className="bg-white rounded-lg shadow p-8 mb-8">
                    <p className="text-gray-600 mb-2">Numéro de commande</p>
                    <p className="text-3xl font-bold text-blue-600 mb-4">#{orderId}</p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left mb-4">
                        <p className="font-bold mb-2">Prochaines étapes :</p>
                        <ul className="space-y-2 text-gray-700">
                            <li>✓ Vous recevrez un SMS de confirmation</li>
                            <li>✓ Le restaurant commencera la préparation</li>
                            <li>✓ Un livreur sera assigné à votre commande</li>
                            <li>✓ Vous recevrez un SMS quand il est en route</li>
                        </ul>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row justify-center">
                    <Link
                        href="/restaurants"
                        className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600"
                    >
                        Retour aux restaurants
                    </Link>
                    <Link
                        href="/"
                        className="bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-400"
                    >
                        Accueil
                    </Link>
                </div>

                {/* Info Box */}
                <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-yellow-800">
                        💡 <strong>Besoin d'aide?</strong> Appelez-nous au +229 XXXXXXXX
                    </p>
                </div>
            </div>
        </div>
    );
}