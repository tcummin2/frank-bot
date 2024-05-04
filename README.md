# FrankBot

A simple Discord bot named Frank that interjects with a sound clip every 30 to 60 minutes.

## Prerequisites

- Docker
- Docker Compose

## Setup

Clone the repo.

You will need to add a `.env` file containing the following parameters:
```
TOKEN=<YOUR_TOKEN>
BOT_ID=<THE_BOT_ID>
MIN_MINUTES_BETWEEN_SOUND=<CHOOSE_A_MINIMUM>
MAX_MINUTES_BETWEEN_SOUND=<CHOOSE_A_MAXIMUM>
```

Modify the sample `docker-compose.yml` as needed.

## Run Bot
`docker compose up`