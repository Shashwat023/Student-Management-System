#!/bin/bash

echo "Setting up Student Management System..."

# Create .env files if they don't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local from template..."
  cp .env.example .env.local
fi

if [ ! -f backend/.env ]; then
  echo "Creating backend/.env from template..."
  cp backend/.env.example backend/.env
fi

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Build backend TypeScript
echo "Building backend TypeScript..."
cd backend
npm run build
cd ..

echo ""
echo "Setup complete! Next steps:"
echo "1. Update .env.local and backend/.env with your configuration"
echo "2. Run 'npm run dev' in one terminal for frontend"
echo "3. Run 'cd backend && npm run dev' in another terminal for backend"
echo "4. Visit http://localhost:3000"
