docker-compose -f docker-compose.yml build web
docker-compose -f docker-compose.yml stop web
docker-compose -f docker-compose.yml up web -d