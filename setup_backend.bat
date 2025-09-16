@echo off
echo Setting up Quantum Mercator Backend...
echo.

cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Backend setup complete!
echo.
echo To start the backend server, run:
echo   cd backend
echo   python start.py
echo.
echo The API will be available at: http://localhost:8000
echo API documentation at: http://localhost:8000/docs
echo.
pause
