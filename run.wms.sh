docker-compose -f docker-compose.yml build wms
docker-compose -f docker-compose.yml stop wms
docker-compose -f docker-compose.yml up wms -d