import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          🍽️ eatinCotonou
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Commande tes plats favoris en ligne
        </p>

        {/* Main CTA */}
        <Link
          href="/restaurants"
          className="inline-block bg-blue-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-600 text-xl mb-12"
        >
          Découvrir les restaurants →
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl mb-3">🥗 Filtre Léger</h3>
            <p className="text-gray-600">Salades, fruits, snacks</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl mb-3">🍲 Filtre Consistant</h3>
            <p className="text-gray-600">Plats complets, vrais repas</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl mb-3">⚡ Livraison Rapide</h3>
            <p className="text-gray-600">Reçois ta commande en 30min</p>
          </div>
        </div>
      </div>
    </div>
  );
}