echo Initializing the dockerized web application. Please wait...
sleep 0.75
docker compose up -d
sleep 3
docker ps
sleep 2
docker compose exec backend python manage.py makemigrations 
sleep 2
docker compose exec backend python manage.py migrate
sleep 2
docker compose exec backend python manage.py createsuperuser
sleep 0.5
echo Initialization complete.
sleep 0.75
