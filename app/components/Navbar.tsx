'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
    const { data: session, status } = useSession();
    const cartItems = useCartStore((state) => state.items.length);

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    🍽️ eatinCotonou
                </Link>

                {/* Menu */}
                <div className="flex gap-6 items-center">
                    <Link
                        href="/restaurants"
                        className="hover:text-blue-600 font-bold"
                    >
                        Restaurants
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        className="relative hover:text-blue-600 font-bold text-lg"
                    >
                        🛒 Panier
                        {cartItems > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {cartItems}
                            </span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {status === 'authenticated' && session?.user ? (
                        <div className="flex gap-4 items-center">
                            <span className="text-sm text-gray-600">
                                Bienvenue, {session.user.name}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}