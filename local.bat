@echo off
echo ==========================================
echo   Hope Travel - Local Setup & Start
echo ==========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] node_modules not found. Installing dependencies...
    call npm install
) else (
    echo [1/3] Dependencies already installed.
)

echo.
echo [2/3] Starting development server...
echo.

:: Open the browser in the background after a short delay
:: We use 'start' with the URL, and vite will also usually handle this if configured
:: But 'npm run dev -- --open' is more reliable for Vite projects.

call npm run dev -- --open

echo.
echo [3/3] Application is running!
pause
