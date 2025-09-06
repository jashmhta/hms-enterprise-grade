@echo off
echo ================================
echo HMS - Hospital Management System
echo ================================
echo.

echo Setting up the application...
echo.

:: Navigate to backend directory
cd /d "M:\hms\Newhms-fixed-v11\backend"

:: Activate virtual environment
echo Activating Python virtual environment...
call venv\Scripts\activate.bat

:: Run migrations
echo Running database migrations...
python manage.py migrate --run-syncdb

:: Collect static files
echo Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ================================
echo Starting HMS Backend Server...
echo ================================
echo Backend will be available at: http://127.0.0.1:8000
echo Django Admin will be available at: http://127.0.0.1:8000/admin/
echo API Documentation: http://127.0.0.1:8000/api/schema/swagger-ui/
echo.
echo Note: Open another command window and run start-frontend.bat to start the frontend
echo.

:: Start Django server
python manage.py runserver 127.0.0.1:8000
