# Kekse Clan Discord Bot Setup Guide

To get this bot running, you need to configure it in the [Discord Developer Portal](https://discord.com/developers/applications).

## 1. Create a New Application
- Go to the Discord Developer Portal.
- Click **"New Application"** and give it a name.

## 2. Bot Configuration
- Go to the **"Bot"** tab in the left sidebar.
- Click **"Reset Token"** (or "Copy Token") to get your `BOT_TOKEN`.
- **Privileged Gateway Intents**: You MUST enable these for the bot to work:
  - [x] **Presence Intent**
  - [x] **Server Members Intent**
  - [x] **Message Content Intent** (Crucial for command handling)

## 3. Invite the Bot
- Go to the **"OAuth2"** tab -> **"URL Generator"**.
- Select the `bot` and `applications.commands` scopes.
- Select the permissions (e.g., `Administrator` for ease of setup, or specific ones like `Send Messages`, `Manage Channels`, etc.).
- Copy the generated URL and paste it into your browser to invite the bot to your server.

## 4. Replit Environment Variables
- In Replit, go to the **Secrets** (Lock icon) or use the environment variables tool.
- Add a secret:
  - Key: `BOT_TOKEN`
  - Value: `YOUR_DISCORD_BOT_TOKEN_HERE`

## How to use
The current bot uses `!help` as a command prefix.
- `!ping`: Check bot latency.
- `!support`: Open a support request.
