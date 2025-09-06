@echo off
echo Starting HMS Backend Server...
cd /d "M:\hms\Newhms-fixed-v11\backend"
call venv\Scripts\activate.bat
echo Applying migrations...
python manage.py migrate --run-syncdb
echo Collecting static files...
python manage.py collectstatic --noinput
echo Starting Django development server on http://127.0.0.1:8000
python manage.py runserver 127.0.0.1:8000
pause
