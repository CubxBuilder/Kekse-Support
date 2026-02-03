import { PermissionsBitField } from "discord.js";

export async function clear(client) {
  client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!clear")) return;

    const allowedRole = "1457906448234319922";
    if (!message.member.roles.cache.has(allowedRole)) {
      await message.delete().catch(() => {});
      const warnMsg = await message.channel.send("Du hast keine Berechtigung für diesen Befehl!");
      setTimeout(() => warnMsg.delete().catch(() => {}), 5000);
      return;
    }

    await message.delete().catch(() => {});

    const args = message.content.split(/\s+/).slice(1);
    if (args.length < 2) {
      const errMsg = await message.channel.send(
        "Falscher Befehl! Richtige Syntax:\n`!clear [channel id] <user id> [user id …] <anzahl> [zeitraum]`"
      );
      setTimeout(() => errMsg.delete().catch(() => {}), 5000);
      return;
    }

    let channel = message.channel;
    let userIds = [];
    let amount = null;
    let timeframe = null;

    if (/^\d{17,19}$/.test(args[0])) {
      const possibleChannel = message.guild.channels.cache.get(args[0]);
      if (possibleChannel) {
        channel = possibleChannel;
        args.shift();
      }
    }

    while (args.length && /^\d{17,19}$/.test(args[0])) {
      userIds.push(args.shift());
    }

    if (userIds.length === 0) {
      const errMsg = await message.channel.send(
        "Mindestens eine User ID muss angegeben werden!"
      );
      setTimeout(() => errMsg.delete().catch(() => {}), 5000);
      return;
    }

    if (args.length) {
      if (/^\d+$/.test(args[0])) {
        amount = Math.min(Number(args.shift()), 500);
      } else {
        timeframe = args.shift();
      }
    }

    if (!amount && !timeframe) {
      const errMsg = await message.channel.send(
        "Du musst entweder eine Anzahl oder einen Zeitraum angeben!"
      );
      setTimeout(() => errMsg.delete().catch(() => {}), 5000);
      return;
    }

    const statusMsg = await channel.send("Analyzing messages…");

    const messagesToDelete = [];
    const fetched = await channel.messages.fetch({ limit: 100 });
    for (const msg of fetched.values()) {
      if (userIds.includes(msg.author.id)) {
        if (timeframe) {
          const now = Date.now();
          const msgTime = msg.createdTimestamp;
          const ms = parseTimeframe(timeframe);
          if (now - msgTime <= ms) messagesToDelete.push(msg);
        } else {
          messagesToDelete.push(msg);
        }
      }
      if (amount && messagesToDelete.length >= amount) break;
    }

    await statusMsg.delete().catch(() => {});

    if (messagesToDelete.length) {
      await channel.bulkDelete(messagesToDelete, true).catch(() => {});
    }
  });
}

function parseTimeframe(tf) {
  const match = tf.match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const num = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s": return num * 1000;
    case "m": return num * 60 * 1000;
    case "h": return num * 60 * 60 * 1000;
    case "d": return num * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}
