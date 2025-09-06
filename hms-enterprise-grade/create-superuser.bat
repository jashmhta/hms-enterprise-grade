@echo off
echo Creating Django Superuser...
cd /d "M:\hms\Newhms-fixed-v11\backend"
call venv\Scripts\activate.bat
echo Creating superuser (username: admin, email: admin@localhost)
python manage.py createsuperuser --username admin --email admin@localhost
pause
