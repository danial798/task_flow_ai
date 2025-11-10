#!/usr/bin/env node

/**
 * TaskFlow AI - Credential Setup Script
 * This script helps you configure your environment variables
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 TaskFlow AI - Credential Setup\n');
console.log('This script will help you set up your environment variables.\n');

const credentials = {};

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setup() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 STEP 1: OpenAI Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    credentials.OPENAI_API_KEY = await question('Enter your OpenAI API key (starts with sk-): ');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔥 STEP 2: Firebase Web Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    credentials.NEXT_PUBLIC_FIREBASE_API_KEY = await question('Enter Firebase API Key: ');
    credentials.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = await question('Enter Firebase Auth Domain: ');
    credentials.NEXT_PUBLIC_FIREBASE_PROJECT_ID = await question('Enter Firebase Project ID: ');
    credentials.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = await question('Enter Firebase Storage Bucket: ');
    credentials.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = await question('Enter Firebase Messaging Sender ID: ');
    credentials.NEXT_PUBLIC_FIREBASE_APP_ID = await question('Enter Firebase App ID: ');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 STEP 3: Firebase Admin SDK');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    credentials.FIREBASE_ADMIN_PROJECT_ID = credentials.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    credentials.FIREBASE_ADMIN_CLIENT_EMAIL = await question('Enter Service Account Email: ');
    
    console.log('\nPaste your private key (including BEGIN/END lines), then press Enter twice:\n');
    
    let privateKey = '';
    let emptyLineCount = 0;
    
    await new Promise((resolve) => {
      const keyReader = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });
      
      keyReader.on('line', (line) => {
        if (line.trim() === '') {
          emptyLineCount++;
          if (emptyLineCount >= 2) {
            keyReader.close();
            resolve();
          }
        } else {
          emptyLineCount = 0;
          privateKey += line + '\\n';
        }
      });
    });
    
    credentials.FIREBASE_ADMIN_PRIVATE_KEY = `"${privateKey}"`;
    credentials.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    
    // Create .env.local file
    const envContent = `# OpenAI Configuration
OPENAI_API_KEY=${credentials.OPENAI_API_KEY}

# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=${credentials.NEXT_PUBLIC_FIREBASE_API_KEY}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${credentials.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${credentials.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${credentials.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${credentials.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
NEXT_PUBLIC_FIREBASE_APP_ID=${credentials.NEXT_PUBLIC_FIREBASE_APP_ID}

# Firebase Admin (for backend)
FIREBASE_ADMIN_PROJECT_ID=${credentials.FIREBASE_ADMIN_PROJECT_ID}
FIREBASE_ADMIN_PRIVATE_KEY=${credentials.FIREBASE_ADMIN_PRIVATE_KEY}
FIREBASE_ADMIN_CLIENT_EMAIL=${credentials.FIREBASE_ADMIN_CLIENT_EMAIL}

# Application
NEXT_PUBLIC_APP_URL=${credentials.NEXT_PUBLIC_APP_URL}
`;

    fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
    
    console.log('\n✅ SUCCESS! .env.local file created!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Next steps:');
    console.log('1. Run: firebase login');
    console.log('2. Run: firebase init firestore');
    console.log('3. Run: firebase deploy --only firestore:rules');
    console.log('4. Run: npm run dev');
    console.log('\n🚀 Your TaskFlow AI is ready to launch!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

setup();

