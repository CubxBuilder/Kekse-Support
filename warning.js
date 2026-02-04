import { getData, setData } from "./storage.js";

export async function warning(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content;
    const lower = content.toLowerCase();

    function isDangerous(msg) {
      const suspiciousKeywords = ["steam", "discord", "labymod", "epic", "gift", "redeem"];
      const words = msg.split(/\s+/);
      const hasCodeKeyword = lower.includes("code");

      const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
      if (emailPattern.test(msg)) return "E-Mail-Adresse";

      const phonePattern = /(?<![@#\w])\+?\d[\d\s-]{7,20}\d/;
      if (phonePattern.test(msg)) return "Telefonnummer";


      const codePattern = /^(?=.*[0-9])[A-Z0-9-]{6,20}$/i;

      for (const word of words) {
        if (word.startsWith(":") && word.endsWith(":")) continue;

        if (codePattern.test(word)) return "Gutschein-Code";
        if ((suspiciousKeywords.some(k => word.toLowerCase().includes(k)) || hasCodeKeyword) && codePattern.test(word)) {
          return "Gutschein-Code";
        }
      }

      return null;
    }

    const result = isDangerous(content);
    if (!result) return;

    const violations = getData("violations") || {};

    if (!violations[message.author.id]) {
      violations[message.author.id] = {
        name: message.author.username,
        count: 1
      };
    } else {
      violations[message.author.id].count += 1;
    }

    await setData("violations", violations);

    await message.delete().catch(() => {});

    const warnMsg = await message.channel.send({
      content: `<@${message.author.id}>, unser System hat einen ${result} erkannt. Bitte achte darauf, dass du keine sensiblen Daten in öffentliche Chats schreibst. Bei Missverständnissen erstelle ein Ticket in <#1423413348493430905>`
    });

    setTimeout(() => warnMsg.delete().catch(() => {}), 10000);
  });
}
