@echo off
echo ========================================
echo  AI Event Decor Material Analyzer
echo  Automated Installation Script
echo ========================================
echo.

echo [1/4] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

echo Running backend setup...
call npm run setup

echo.
echo [2/4] Setting up Frontend...
cd ..
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

echo.
echo [3/4] Creating startup scripts...

echo @echo off > start-backend.bat
echo echo Starting Backend Server... >> start-backend.bat
echo cd backend >> start-backend.bat
echo npm run dev >> start-backend.bat

echo @echo off > start-frontend.bat
echo echo Starting Frontend Server... >> start-frontend.bat
echo npm start >> start-frontend.bat

echo @echo off > start-both.bat
echo echo Starting AI Event Decor Material Analyzer... >> start-both.bat
echo echo. >> start-both.bat
echo echo [1] Starting Backend... >> start-both.bat
echo start "Backend Server" cmd /k "cd backend && npm run dev" >> start-both.bat
echo timeout /t 3 /nobreak ^> nul >> start-both.bat
echo echo [2] Starting Frontend... >> start-both.bat
echo start "Frontend Server" cmd /k "npm start" >> start-both.bat
echo echo. >> start-both.bat
echo echo Both servers are starting... >> start-both.bat
echo echo Backend: http://localhost:5000 >> start-both.bat
echo echo Frontend: http://localhost:3000 >> start-both.bat
echo pause >> start-both.bat

echo.
echo [4/4] Installation Complete!
echo.
echo ========================================
echo  Installation Successful!
echo ========================================
echo.
echo Available commands:
echo   start-both.bat     - Start both servers
echo   start-backend.bat  - Start backend only
echo   start-frontend.bat - Start frontend only
echo.
echo Manual start:
echo   Backend:  cd backend && npm run dev
echo   Frontend: npm start
echo.
echo URLs:
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo Press any key to start the application...
pause > nul
call start-both.bat