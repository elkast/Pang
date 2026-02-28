@echo off
echo ====================================
echo Demarrage du serveur IvoCulture
echo ====================================
echo.

echo Etape 1: Arret de tout processus sur le port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Arret du processus %%a sur le port 8000...
    taskkill /F /PID %%a 2>nul
)

echo.
echo Etape 2: Lancement du serveur...
echo.
cd /d C:\niveau2
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

pause
