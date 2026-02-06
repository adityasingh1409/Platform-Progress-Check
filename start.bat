@echo off
echo ========================================
echo Starting Backend Server...
echo ========================================
cd backend
start cmd /k "npm run dev"

timeout /t 5 /nobreak

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
cd ..\frontend
start cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
