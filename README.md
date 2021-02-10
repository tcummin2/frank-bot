# FrankBot

A simple Discord bot named Frank.

## Setup

You will need to add a file named `config.json` to the root directory with the following structure, where `token` is the bot's token and `botId` is the Client ID.

```json
{
  "token": "...",
  "botId": "..."
}
```

### Add Bot to server


Replace `[clientId]` in this url with your Client ID (same as above), which is found in in the Discord developer portal.

https://discordapp.com/oauth2/authorize?client_id=[clientId]&scope=bot&permissions=1

## Getting Started

Use yarn or NPM.

```bash
yarn # or npm install
yarn start # or npm run start
```