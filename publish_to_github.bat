@echo off
title GitHub Setup & Publisher - Santhoshkumar S
color 0b
echo ======================================================================
echo    GitHub Automated Repository & Profile Publisher for Santhoshkumar S
echo ======================================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    pause
    exit /b
)

echo [1/3] Checking Git status...
git status

echo.
echo [2/3] Adding and committing any pending changes...
git add .
git commit -m "feat: complete professional portfolio and profile setup" >nul 2>nul

echo.
echo [3/3] Choose an action:
echo.
echo   [1] Push Portfolio repository to GitHub (https://github.com/SanthoshkumarS2407/Portfolio)
echo   [2] Login to GitHub with GitHub CLI (gh auth login)
echo   [3] Create and Publish Special GitHub Profile Repository (SanthoshkumarS2407/SanthoshkumarS2407)
echo   [4] Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Pushing to origin main...
    git push -u origin main
    echo.
    echo If repository was not found, make sure you created "Portfolio" on https://github.com/new
)

if "%choice%"=="2" (
    echo.
    echo Launching GitHub CLI authentication...
    gh auth login
)

if "%choice%"=="3" (
    echo.
    echo Creating special profile repository via GitHub CLI...
    gh repo create SanthoshkumarS2407/SanthoshkumarS2407 --public --description "Santhoshkumar S - Professional Profile README"
    mkdir profile_temp 2>nul
    copy PROFILE_README.md profile_temp\README.md >nul
    cd profile_temp
    git init
    git add README.md
    git commit -m "feat: setup high-impact GitHub profile README"
    git branch -M main
    git remote add origin https://github.com/SanthoshkumarS2407/SanthoshkumarS2407.git
    git push -u origin main
    cd ..
    rmdir /s /q profile_temp
    echo.
    echo Profile README published to https://github.com/SanthoshkumarS2407 !
)

echo.
echo Done!
pause
