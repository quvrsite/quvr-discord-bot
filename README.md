# quvr-discord-bot

A community Discord bot for [QUVR](https://quvr.site) — check live stock token / USDG prices, browse bridge source chains, and get a scheduled price digest, right inside your Discord server.

- Website: https://quvr.site
- Twitter/X: https://x.com/QUVRsite
- Org: https://github.com/quvrsite

## Slash commands

| Command | Description |
|---|---|
| `/price [symbol]` | Live prices from the QUVR ticker (TSLA, NVDA, SPY, USDG, ...) |
| `/tokens [query]` | Search QUVR stock tokens / assets |
| `/chains` | List bridge source chains available for Robinhood Chain |

## Setup

1. Create a Discord application at https://discord.com/developers/applications, add a bot user, and invite it to your server with the `applications.commands` and `bot` scopes.
2. Clone this repo and install dependencies:

   ```bash
   git clone https://github.com/quvrsite/quvr-discord-bot
   cd quvr-discord-bot
   npm install
   cp .env.example .env
   ```

3. Fill in `.env`:

   ```
   DISCORD_TOKEN=your-bot-token
   DISCORD_CLIENT_ID=your-application-id
   DISCORD_GUILD_ID=your-test-server-id   # optional, for fast local registration
   QUVR_BASE_URL=https://quvr.site
   DIGEST_CHANNEL_ID=                     # optional, enables the hourly digest
   DIGEST_CRON=0 * * * *
   ```

4. Register the slash commands, then start the bot:

   ```bash
   npm run deploy-commands
   npm start
   ```

## Scheduled price digest

If `DIGEST_CHANNEL_ID` is set, the bot posts a price digest to that channel on the schedule defined by `DIGEST_CRON` (cron syntax, default hourly).

## Disclaimer

This is an unofficial, community-built bot based on QUVR's publicly observable API surface. Response shapes may change without notice.

## License

MIT
