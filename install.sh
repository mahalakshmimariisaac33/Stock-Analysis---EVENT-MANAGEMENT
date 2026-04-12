#!/bin/bash

echo "========================================"
echo " AI Event Decor Material Analyzer"
echo " Automated Installation Script"
echo "========================================"
echo

echo "[1/4] Setting up Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed."
fi

echo "Running backend setup..."
npm run setup

echo
echo "[2/4] Setting up Frontend..."
cd ..
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi

echo
echo "[3/4] Creating startup scripts..."

# Create backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting Backend Server..."
cd backend
npm run dev
EOF

# Create frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting Frontend Server..."
npm start
EOF

# Create combined startup script
cat > start-both.sh << 'EOF'
#!/bin/bash
echo "Starting AI Event Decor Material Analyzer..."
echo

echo "[1] Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "[2] Waiting for backend to start..."
sleep 3

echo "[3] Starting Frontend..."
npm start &
FRONTEND_PID=$!

echo
echo "=========================================="
echo " Both servers are running!"
echo "=========================================="
echo " Backend:  http://localhost:5000"
echo " Frontend: http://localhost:3000"
echo "=========================================="
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait
EOF

# Make scripts executable
chmod +x start-backend.sh
chmod +x start-frontend.sh
chmod +x start-both.sh

echo
echo "[4/4] Installation Complete!"
echo
echo "========================================"
echo " Installation Successful!"
echo "========================================"
echo
echo "Available commands:"
echo "  ./start-both.sh     - Start both servers"
echo "  ./start-backend.sh  - Start backend only"
echo "  ./start-frontend.sh - Start frontend only"
echo
echo "Manual start:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: npm start"
echo
echo "URLs:"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:3000"
echo
echo "Press Enter to start the application..."
read
./start-both.sh