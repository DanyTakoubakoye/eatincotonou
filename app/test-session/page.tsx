'use client';

import { useSession } from 'next-auth/react';

export default function TestSessionPage() {
    const { data: session, status } = useSession();

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Test Session</h1>

            <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Session:</strong> {session ? 'YES ✅' : 'NO ❌'}</p>
                {session?.user && (
                    <>
                        <p><strong>Email:</strong> {session.user.email}</p>
                        <p><strong>Name:</strong> {session.user.name}</p>
                    </>
                )}
            </div>
        </div>
    );
}