# Charger les variables d'environnement
$env:DATABASE_URL="postgresql://postgres.eknlfyekljfhfalrrrgz:Benin825680@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require"
$env:NEXTAUTH_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
$env:NEXTAUTH_URL="http://localhost:3000"

# Vérifier
Write-Host "✓ Variables loaded"
Write-Host "✓ DATABASE_URL: OK"

# Lancer le serveur
npm run dev