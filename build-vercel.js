// build-vercel.js
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🏗️ Building for Vercel...');

// Build frontend
console.log('📦 Building frontend...');
execSync('cd frontend/myLogicAgent && npm run build', { stdio: 'inherit' });

// Verificar que dist existe
const distPath = 'frontend/myLogicAgent/dist';
if (!fs.existsSync(distPath)) {
  console.error('❌ DIST folder not found at:', distPath);
  process.exit(1);
}

console.log('✅ Build completed successfully!');