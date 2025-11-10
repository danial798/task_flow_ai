#!/usr/bin/env node

/**
 * TaskFlow AI - Automated Setup
 * This script guides you through the complete setup process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n');
console.log('████████╗ █████╗ ███████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗');
console.log('╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║');
console.log('   ██║   ███████║███████╗█████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║');
console.log('   ██║   ██╔══██║╚════██║██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║');
console.log('   ██║   ██║  ██║███████║██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝');
console.log('   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ ');
console.log('\n');
console.log('🎯 Automated Setup Script\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

function exec(command, silent = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return output;
  } catch (error) {
    if (!silent) {
      console.error(`Error executing: ${command}`);
      console.error(error.message);
    }
    return null;
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  return fs.existsSync(envPath);
}

function printInstructions() {
  console.log('📋 SETUP INSTRUCTIONS\n');
  console.log('This setup requires accounts with:\n');
  console.log('  1. 🔑 OpenAI (https://platform.openai.com/)');
  console.log('  2. 🔥 Firebase (https://console.firebase.google.com/)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('🔑 STEP 1: Get OpenAI API Key (2 minutes)\n');
  console.log('   1. Open: https://platform.openai.com/api-keys');
  console.log('   2. Login/Sign up');
  console.log('   3. Click "Create new secret key"');
  console.log('   4. Copy the key (starts with sk-)\n');
  console.log('   ⚠️  IMPORTANT: Add billing at https://platform.openai.com/settings/organization/billing\n');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('🔥 STEP 2: Set Up Firebase Project (3 minutes)\n');
  console.log('   A. Create Project:');
  console.log('      1. Open: https://console.firebase.google.com/');
  console.log('      2. Click "Add project"');
  console.log('      3. Name: "taskflow-ai" (or your choice)');
  console.log('      4. Disable Analytics (optional)');
  console.log('      5. Click "Create project"\n');
  
  console.log('   B. Enable Authentication:');
  console.log('      1. Click "Build" → "Authentication"');
  console.log('      2. Click "Get started"');
  console.log('      3. Enable "Email/Password"');
  console.log('      4. Toggle the first switch ON');
  console.log('      5. Click "Save"\n');
  
  console.log('   C. Create Firestore Database:');
  console.log('      1. Click "Build" → "Firestore Database"');
  console.log('      2. Click "Create database"');
  console.log('      3. Select "Start in production mode"');
  console.log('      4. Choose your region');
  console.log('      5. Click "Enable"\n');
  
  console.log('   D. Get Web App Config:');
  console.log('      1. Go to Project Settings (⚙️ gear icon)');
  console.log('      2. Scroll to "Your apps"');
  console.log('      3. Click Web icon (</>) ');
  console.log('      4. App nickname: "TaskFlow AI Web"');
  console.log('      5. Copy the firebaseConfig object\n');
  
  console.log('   E. Get Service Account Key:');
  console.log('      1. Still in Project Settings');
  console.log('      2. Click "Service accounts" tab');
  console.log('      3. Click "Generate new private key"');
  console.log('      4. Click "Generate key"');
  console.log('      5. Save the JSON file\n');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📝 STEP 3: Run the Credential Setup\n');
  console.log('   Once you have your credentials ready, run:\n');
  console.log('   node setup-credentials.js\n');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('💡 TIP: Open the links in your browser now!\n');
}

async function main() {
  // Check if .env.local exists
  if (checkEnvFile()) {
    console.log('✅ .env.local file found!\n');
    console.log('Proceeding with Firebase setup...\n');
    
    // Login to Firebase
    console.log('🔐 Step 1: Login to Firebase\n');
    console.log('A browser window will open for authentication...\n');
    exec('firebase login');
    
    console.log('\n✅ Firebase login complete!\n');
    
    // Check if already initialized
    const firebaseRcExists = fs.existsSync(path.join(__dirname, '.firebaserc'));
    
    if (!firebaseRcExists) {
      console.log('🔧 Step 2: Initialize Firebase\n');
      console.log('When prompted:');
      console.log('  - Select: Firestore only');
      console.log('  - Use existing project');
      console.log('  - Use default files (firestore.rules, firestore.indexes.json)\n');
      
      exec('firebase init firestore');
    } else {
      console.log('✅ Firebase already initialized\n');
    }
    
    // Deploy Firestore rules
    console.log('\n🚀 Step 3: Deploy Firestore Rules\n');
    exec('firebase deploy --only firestore:rules,firestore:indexes');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SETUP COMPLETE! 🎉\n');
    console.log('Your TaskFlow AI is ready to run!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open: http://localhost:3000');
    console.log('  3. Create your account and start planning!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } else {
    console.log('⚠️  .env.local file not found!\n');
    console.log('You need to set up your credentials first.\n');
    printInstructions();
  }
}

main().catch(console.error);

