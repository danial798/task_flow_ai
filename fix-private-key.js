const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Firebase Admin Private Key format...\n');

try {
  const envPath = path.join(__dirname, '.env.local');
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Find the private key section
  const keyStart = content.indexOf('FIREBASE_ADMIN_PRIVATE_KEY=');
  if (keyStart === -1) {
    console.error('❌ Could not find FIREBASE_ADMIN_PRIVATE_KEY in .env.local');
    process.exit(1);
  }
  
  // Extract the private key value
  const keyLineStart = keyStart + 'FIREBASE_ADMIN_PRIVATE_KEY='.length;
  let keyLineEnd = content.indexOf('\n', keyLineStart);
  
  // Handle multiline key
  let keyValue = '';
  let currentPos = keyLineStart;
  let inQuotes = content[keyLineStart] === '"';
  
  if (inQuotes) {
    // Find the closing quote
    currentPos++; // Skip opening quote
    let searchPos = currentPos;
    while (searchPos < content.length) {
      if (content[searchPos] === '"' && content[searchPos - 1] !== '\\') {
        keyLineEnd = searchPos + 1;
        keyValue = content.substring(keyLineStart + 1, searchPos);
        break;
      }
      searchPos++;
    }
  } else {
    keyLineEnd = content.indexOf('\n', keyLineStart);
    if (keyLineEnd === -1) keyLineEnd = content.length;
    keyValue = content.substring(keyLineStart, keyLineEnd).trim();
  }
  
  // Check if key has actual newlines
  if (keyValue.includes('\n') && !keyValue.includes('\\n')) {
    console.log('✓ Found private key with actual newlines');
    console.log('✓ Converting to escaped format...\n');
    
    // Replace actual newlines with \n
    const fixedKey = keyValue.replace(/\n/g, '\\n');
    
    // Rebuild the content
    const before = content.substring(0, keyLineStart);
    const after = content.substring(keyLineEnd);
    const newContent = `${before}"${fixedKey}"${after}`;
    
    // Write back
    fs.writeFileSync(envPath, newContent, 'utf8');
    
    console.log('✅ Private key format fixed!');
    console.log('✅ Restart your dev server with: npm run dev\n');
  } else if (keyValue.includes('\\n')) {
    console.log('✅ Private key is already in correct format!');
    console.log('ℹ️  No changes needed.\n');
  } else {
    console.log('⚠️  Could not determine private key format.');
    console.log('ℹ️  Please ensure FIREBASE_ADMIN_PRIVATE_KEY is on a single line with \\n for newlines\n');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

