import { getData, setData } from "./storage.js";

const LOG_CHANNEL_ID = "1423413348220796991";
const PING_ID = "1151971830983311441";

const LEVELS = [
  { count: 5,  duration: 1 * 86400000 },
  { count: 10, duration: 2 * 86400000 },
  { count: 25, duration: 7 * 86400000 },
  { count: 50, duration: 31 * 86400000 }
];

export async function violations(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const data = getData("violations");
    if (!data) return;

    const entry = data[message.author.id];
    if (!entry) return;

    if (!entry.appliedLevel) entry.appliedLevel = 0;

    const level = LEVELS.find(l => entry.count >= l.count && entry.appliedLevel < l.count);
    if (!level) return;

    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
    if (!member) return;

    try {
      await member.timeout(level.duration, "§2a1n1");
      entry.appliedLevel = level.count;
      await setData("violations", data);
    } catch {
      if (entry.adminNotified) return;

      const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
      if (logChannel?.isTextBased()) {
        await logChannel.send(
          `<@${PING_ID}> <@${member.id}> konnte nicht getimeoutet werden (Administrator).`
        );
      }

      entry.adminNotified = true;
      await setData("violations", data);
    }
  });
}
