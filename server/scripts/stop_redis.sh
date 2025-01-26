#!/bin/bash

echo "Stopping and removing Redis container..."
docker stop redis-dev
docker rm redis-dev

echo "Redis container stopped and removed."
