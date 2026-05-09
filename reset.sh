#!/bin/bash

echo 'it's all gone!'

docker compose down -v
sleep 3
docker system prune -a
