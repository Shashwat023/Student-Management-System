#!/bin/bash

echo "Deploying Student Management System..."

# Build frontend
echo "Building frontend..."
npm run build

if [ $? -ne 0 ]; then
  echo "Frontend build failed"
  exit 1
fi

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..

if [ $? -ne 0 ]; then
  echo "Backend build failed"
  exit 1
fi

echo "Build successful! Ready for deployment."
echo ""
echo "Deployment options:"
echo "1. Vercel: git push to deploy frontend"
echo "2. Docker: docker build -t sms-frontend . && docker build -t sms-backend ./backend"
echo "3. Railway/Render: Connect GitHub repository"
