export async function warning(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content;
    const lower = content.toLowerCase();

    function isDangerous(msg) {
      const suspiciousKeywords = ["steam", "discord", "labymod", "epic", "gift", "redeem"];
      const words = msg.split(/\s+/);
      const hasCodeKeyword = lower.includes("code");

      // E-Mail erkennen
      const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
      if (emailPattern.test(msg)) return "E-Mail-Adresse";

      // Telefonnummern erkennen (mit +, Leerzeichen, Bindestrich)
      const phonePattern = /(\+?\d[\d\s-]{7,20}\d)/;
      if (phonePattern.test(msg)) return "Telefonnummer";

      const codePattern = /^(?=.*[0-9])[A-Z0-9-]{6,20}$/i;

      for (const word of words) {
        const alnum = word.replace(/-/g, "");

        if (codePattern.test(word)) {
          return "Gutschein-Code";
        }
        if ((suspiciousKeywords.some(k => word.toLowerCase().includes(k)) || hasCodeKeyword) && codePattern.test(word)) {
          return "Gutschein-Code";
      }

      return null;
    }

    const result = isDangerous(content);
    if (!result) return;

    // Nachricht sofort löschen
    await message.delete().catch(() => {});

    // Warnnachricht senden
    const warnMsg = await message.channel.send({
      content: `<@${message.author.id}>, unser System hat einen ${result} erkannt. Bitte achte darauf, dass du keine sensiblen Daten in öffentliche Chats schreibst. Bei Missverständnissen erstelle ein Ticket in <#1423413348493430905>`
    });

    // Warnnachricht nach 10 Sekunden löschen
    setTimeout(() => warnMsg.delete().catch(() => {}), 10000);
  });
}
