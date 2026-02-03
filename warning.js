import { PermissionsBitField } from "discord.js";

export async function warning(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    function isDangerous(msg) {
      const suspiciousKeywords = ["steam", "discord", "labymod", "epic", "gift", "redeem"];
      const words = msg.content.split(/\s+/);
      const lowered = msg.content.toLowerCase();
      const hasCodeKeyword = lowered.includes("code");

      const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
      if (emailPattern.test(msg.content)) return "email";

      for (const word of words) {
        const lower = word.toLowerCase();
        const alnum = word.replace(/-/g, "");

        if (suspiciousKeywords.some(k => lower.includes(k)) || hasCodeKeyword) {
          if (/^[A-Z0-9-]{6,20}$/i.test(word) && /[0-9]/.test(alnum)) {
            return "code";
          }
        }
      }

      return null;
    }

    const result = isDangerous(message);
    if (!result) return;

    await message.delete().catch(() => {});

    const warnMsg = await message.channel.send({
      content: `<@${message.author.id}>, unser System hat einen ${
        result === "email" ? "E-Mail-Adresse" : "Gutschein-Code"
      } erkannt. Bitte achte darauf, dass du keine sensiblen Daten in öffentliche Chats schreibst. Bei Missverständnissen erstelle ein Ticket in <#1423413348493430905>`
    });

    setTimeout(() => warnMsg.delete().catch(() => {}), 10000);
  });
}
