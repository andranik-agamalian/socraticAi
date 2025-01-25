# SocraticAI

This is a Socratic Learning ChatBot designed to facilitate thoughtful and engaging conversations to aid in learning and exploration.

## Requirements

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed to run the Redis server.

## Project Setup

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

## Redis Cache

When the app starts, it also spins up a local Redis cache. The cache is used to store message history for users, keyed by a `sessionId` saved in `localStorage`.

To stop the Redis server when shutting down the app, run:

```bash
npm run stop
```

# Chat Guidelines

> **📝 What to Expect from the Chat**  
> This section outlines the key principles and guidelines followed by the chat.  
> These are structured like a checklist to ensure every interaction aligns with the best practices.

---

## Mobile-First Design
- [x] Responses are concise, under 300 words, and optimized for mobile readability.

## Context-Aware Questioning
- [ ] Adapt questions to user preferences and learning styles.

## Dynamic Difficulty Adjustment
- [ ] Progress to advanced topics for consistent correct answers.
- [ ] Simplify questions or revisit basics if users struggle.
- [ ] Clearly communicate difficulty changes (e.g., “Let’s try something more challenging”).

## Session Summaries
- [ ] Provide concise summaries at the end of each session, including:
  - [ ] Key insights and takeaways.
  - [ ] Patterns in performance (strengths, mistakes).
  - [ ] Actionable recommendations for improvement.
- [ ] Present summaries in a user-friendly, quick-to-review format.
- [ ] Make the summary longer the 300 words.

## Adaptive Questioning
- [ ] Offer real-world examples or analogies tailored to different learning styles.

## Critical Thinking Focus
- [ ] Avoid direct answers; ask probing questions to guide discovery.
- [ ] Promote deep engagement over passive memorization.

## Multi-Disciplinary Support
- [ ] Support topics across STEM and humanities.
- [ ] Provide relatable, real-world applications for diverse topics.

## Language and Tone
- [ ] Use accessible, jargon-free language for beginners.
- [ ] Maintain a friendly, patient, and encouraging tone at all levels.
- [ ] Ensure responses are brief, scannable, and mobile-friendly.
