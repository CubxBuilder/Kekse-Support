import { 
  ChannelType, 
  PermissionsBitField, 
  EmbedBuilder 
} from "discord.js";
import { getData, setData } from "./storage.js";

const CATEGORY_ID = "1465790388517474397";

let OPEN_HELP = new Map();
let MAIN_GUILD = null;

export async function initSupport(client) {
  MAIN_GUILD = client.guilds.cache.first();
  const savedData = getData("tickets") || {};
  OPEN_HELP = new Map(Object.entries(savedData));

  client.on("messageCreate", async msg => {
    if (msg.author.bot) return;

    /* === .help === */
    if (msg.guild && msg.content === ".help") {
      msg.delete().catch(() => {});
      if (OPEN_HELP.has(msg.author.id)) {
        return msg.channel.send(`<@${msg.author.id}>, du hast bereits einen offenen Support-Channel.`).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      }

      const userMsg = msg;
      const botMsg = await msg.channel.send("Reagiere mit ✅ um Hilfe zu erhalten.");
      await botMsg.react("✅");

      const filter = (reaction, user) =>
        reaction.emoji.name === "✅" && user.id === msg.author.id;

      botMsg.awaitReactions({ filter, max: 1, time: 20000, errors: ["time"] })
        .then(async (collected) => {
          const lastId = getData("last_ticket_id") || 0;
          const nextId = lastId + 1;
          const index = String(nextId).padStart(4, "0");

          const channel = await MAIN_GUILD.channels.create({
            name: `support-${msg.author.username}-${index}`,
            type: ChannelType.GuildText,
            parent: CATEGORY_ID,
            permissionOverwrites: [
              { id: MAIN_GUILD.id, deny: [PermissionsBitField.Flags.ViewChannel] },
              { id: msg.author.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
              { id: "1457906448234319922", allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]}
            ]
          });

          OPEN_HELP.set(msg.author.id, channel.id);
          await setData("tickets", Object.fromEntries(OPEN_HELP));
          await setData("last_ticket_id", nextId);

          const welcomeText = `Hallo **${msg.author.username}**, dein Support-Ticket wurde geöffnet! Du kannst jetzt einfach hier schreiben, um mit dem Team zu kommunizieren. Mit \`.close\` kannst du das Ticket jederzeit schließen.`;

          await channel.send(welcomeText);
          await msg.author.send(welcomeText).catch(() => console.log("Konnte DM nicht senden."));
          
          userMsg.delete().catch(() => {});
          botMsg.delete().catch(() => {});
        })
        .catch(() => {
          botMsg.delete().catch(() => {});
        });
    }

    /* === .close === */
    const CLOSED_CATEGORY_ID = "1465452886657077593";
    if (msg.content === ".close" && OPEN_HELP.has(msg.author.id)) {
      const channelId = OPEN_HELP.get(msg.author.id);
      const channel = MAIN_GUILD.channels.cache.get(channelId);
      
      const closeMsg = "Support-Verbindung wird getrennt und das Ticket geschlossen...";
      if (channel) await channel.send(closeMsg).catch(() => {});
      await msg.author.send(closeMsg).catch(() => {});

      if (channel) {
        await channel.setParent(CLOSED_CATEGORY_ID, { lockPermissions: false }).catch(() => {});
        await channel.send("Support-Verbindung getrennt. Der Channel wurde archiviert.");
      }
      
      OPEN_HELP.delete(msg.author.id);
      await setData("tickets", Object.fromEntries(OPEN_HELP));
      await msg.author.send("Support geschlossen. Die Verbindung zum Team wurde getrennt.").catch(() => {});
    }

    /* === DM → Channel === */
    if (msg.channel.type === ChannelType.DM) {
      const channelId = OPEN_HELP.get(msg.author.id);
      if (!channelId) return;
      const channel = MAIN_GUILD.channels.cache.get(channelId);
      if (!channel) return;

      await channel.send(`**${msg.author.username}**: ${msg.content}`);
    }

    /* === Channel → DM === */
    if (msg.guild) {
      for (const [userId, channelId] of OPEN_HELP) {
        if (msg.channel.id === channelId && !msg.author.bot) {
          const user = await client.users.fetch(userId);
          await user.send(msg.content).catch(() => {});
        }
      }
    }
  });
}
