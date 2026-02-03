import { getData } from "./storage.js";

const LOG_CHANNEL_ID = "1423413348220796991";
const PING_ID = "1151971830983311441";

export async function violations(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const violations = getData("violations");
    if (!violations) return;

    const entry = violations[message.author.id];
    if (!entry) return;

    const count = entry.count;
    let duration = null;

    if (count >= 50) duration = 31 * 24 * 60 * 60 * 1000;
    else if (count >= 25) duration = 7 * 24 * 60 * 60 * 1000;
    else if (count >= 10) duration = 2 * 24 * 60 * 60 * 1000;
    else if (count >= 5) duration = 1 * 24 * 60 * 60 * 1000;

    if (!duration) return;

    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
    if (!member) return;
    if (member.isCommunicationDisabled()) return;

    try {
      await member.timeout(duration, "§2a1n1");
    } catch {
      const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send(
          `<@${PING_ID}> Die Person <@${member.id}> konnte nicht getimeoutet werden, da sie Administrator ist.`
        );
      }
    }
  });
}
