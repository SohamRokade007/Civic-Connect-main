#!/bin/bash

# Civic Issue Reporting App Setup Script
echo "🏛️ Setting up Civic Issue Reporting App..."

# Create project directory
mkdir civic-issue-reporting-app
cd civic-issue-reporting-app

# Initialize npm project
npm init -y

# Install dependencies
echo "📦 Installing dependencies..."
npm install react@latest react-dom@latest
npm install -D vite@latest @vitejs/plugin-react@latest typescript@latest @types/react@latest @types/react-dom@latest
npm install lucide-react@latest
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install -D @types/node@latest

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create directory structure
mkdir -p src/components/Admin
mkdir -p src/components/Auth  
mkdir -p src/components/Dashboard
mkdir -p src/components/Layout
mkdir -p src/components/Report
mkdir -p src/contexts
mkdir -p src/types
mkdir -p public

echo "📁 Project structure created!"

# Initialize git repository
git init
git add .
git commit -m "Initial commit: Civic Issue Reporting App setup"

echo "✅ Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/civic-issue-reporting-app.git"
echo "3. Run: git branch -M main"
echo "4. Run: git push -u origin main"