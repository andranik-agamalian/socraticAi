# About the App

This is a Socratic Learning ChatBot designed to facilitate thoughtful and engaging conversations to aid in learning and exploration.

# Requirements

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed to run the Redis server.

# Project Setup

This project is organized into two main parts:
- **Client**: Located in the `client` folder.
- **Server**: Located in the `server` folder.

## Installation

You can install both client and server dependencies from the root directory with the following command:

```bash
npm run install:all
```

## Starting the App

To start both the client and server simultaneously, run:

```bash
npm start
```

Once the app is running, you can access it in your browser at [http://localhost:5173](http://localhost:5173).

### Redis Cache

When the app starts, it also spins up a local Redis cache. The cache is used to store message history for users, keyed by a `sessionId` saved in `localStorage`.

To stop the Redis server when shutting down the app, run:

```bash
npm run stop
```
