import { Client, GatewayIntentBits, Partials } from "discord.js";
import { initSupport } from "./support.js";
import { initStorage } from "./storage.js";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.once("clientReady", async () => {
  console.log(`Bot eingeloggt als ${client.user.tag}`);
  await initStorage(client);
  initSupport(client);
});
client.user.setPresence({
    activities: [{ name: ".help", type: 0 }],
    status: "online"
  });
client.login(process.env.BOT_TOKEN);
