import { prisma } from './lib/prisma.js';

console.log('Prisma instance:', prisma ? '✅ EXISTS' : '❌ UNDEFINED');

try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✅ Prisma works! Users count:', users.length);
} catch (error) {
    console.error('❌ Prisma error:', error.message);
}

process.exit(0);