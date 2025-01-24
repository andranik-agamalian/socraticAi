#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit
fi

# Pull and run the Redis Docker container
echo "Starting Redis container..."
docker run --name redis-dev -p 6379:6379 -d redis

if [ $? -eq 0 ]; then
    echo "Redis is running on localhost:6379"
else
    echo "Failed to start Redis. Check Docker logs for details."
fi
