import { Client, GatewayIntentBits, Partials } from "discord.js"
import "dotenv/config"
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initSupport } from "./support.js";
import { initStorage } from "./storage.js";
import { sendPunishmentInfo } from "./info.js";
import { initModeration } from "./moderation.js";
import { initClear } from "./clear.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "public");
const app = express();
app.use(express.static(publicPath));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.once("clientReady", async () => {
  console.log(`Bot eingeloggt als ${client.user.tag}`);
  await initStorage(client);
  initSupport(client);
  initClear(client);
  client.user.setPresence({
    activities: [{ name: ".help", type: 0 }],
    status: "online"
  });
  initModeration(client);
});
client.login(process.env.BOT_TOKEN);
