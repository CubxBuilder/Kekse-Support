export const ruleMap = {
  "§1a1n1": { section: "Respekt und Freundlichkeit", text: "Sei respektvoll. Beleidigungen, Diskriminierung, Mobbing oder Drohungen werden nicht toleriert." },
  "§1a1n2": { section: "Respekt und Freundlichkeit", text: "Diskutiere sachlich und vermeide provokative Streitigkeiten." },
  "§1a2n1": { section: "Keine unangemessenen Inhalte", text: "Keine anstößigen, pornografischen, rassistischen oder gewalttätigen Inhalte posten." },
  "§1a2n2": { section: "Keine unangemessenen Inhalte", text: "Illegale Inhalte oder Diskussionen über illegale Aktivitäten sind verboten." },
  "§1a3n1": { section: "Spam, Werbung und Links", text: "Spam jeglicher Art ist nicht erlaubt." },
  "§1a3n2": { section: "Spam, Werbung und Links", text: "Werbung oder Links nur in genehmigten Kanälen mit Zustimmung der Moderatoren." },
  "§2a1n1": { section: "Datenschutz", text: "Keine persönlichen Informationen ohne Erlaubnis teilen. Respektiere die Privatsphäre anderer Mitglieder." },
  "§2a2n1": { section: "Keine unerwünschte Kontaktaufnahme", text: "Keine unaufgeforderten Direktnachrichten, insbesondere Werbung oder Anfragen." },
  "§2a2n2": { section: "Keine unerwünschte Kontaktaufnahme", text: "Wünsche nach Ruhe respektieren." },
  "§3a1n1": { section: "Richtige Kanäle", text: "Poste nur im passenden Kanal." },
  "§3a1n2": { section: "Richtige Kanäle", text: "Nutze die richtigen Kanäle für Fragen, Diskussionen oder Medien." },
  "§3a1n3": { section: "Richtige Kanäle", text: "Bots dürfen nur in den dafür vorgesehenen Channels verwendet werden." },
  "§3a2n1": { section: "Sprache und Ausdruck", text: "Freundlich und konstruktiv kommunizieren. Fluchen nur in Maßen." },
  "§3a2n2": { section: "Sprache und Ausdruck", text: "Server-Sprache: Deutsch." },
  "§3a3n1": { section: "Voice Chats", text: "Störgeräusche vermeiden." },
  "§3a3n2": { section: "Voice Chats", text: "Dauerhaftes Stummschalten oder wiederholtes Verlassen und Betreten ist nicht erlaubt." },
  "§4a1n1": { section: "Tickets", text: "Missbrauch von Tickets, z. B. ohne Grund öffnen, wird bestraft." },
  "§5a1n1": { section: "Giveaways", text: "Tickets für Giveaways müssen innerhalb von 2 Tagen nach Ende geöffnet werden, sonst erfolgt ein Reroll." },
  "§5a1n2": { section: "Giveaways", text: "Mitglieder, die aktuell gebannt sind, dürfen nicht am Giveaway teilnehmen." },
  "§6a1n1": { section: "Verhalten gegenüber Moderatoren", text: "Entscheidungen der Moderatoren respektieren. Probleme über ein Ticket klären." },
  "§6a1n2": { section: "Verhalten gegenüber Moderatoren", text: "Den Anweisungen der Moderatoren Folge leisten." }
};

export async function sendPunishmentInfo(user, type, reason, duration = null) {
  let ruleText = "";
  let sectionTitle = "";
  
  const ruleMatch = reason ? reason.match(/§\d+a\d+n\d+/) : null;
  if (ruleMatch) {
    const code = ruleMatch[0];
    const ruleInfo = ruleMap[code];
    if (ruleInfo) {
      sectionTitle = ruleInfo.section;
      ruleText = `\n\nRegelauszug (${code}):\n[...] "${ruleInfo.text}" [...]`;
    }
  }

  const durationText = duration ? `\n\nDauer: ${duration}` : "";
  const typeLabels = {
    "ban": "Bann",
    "kick": "Kick",
    "timeout": "Timeout"
  };
  const label = typeLabels[type] || type;
  
  const message = `Hey ${user.username},

dein Account auf \`Kekse Clan\` hat eine Strafe erhalten: **${label}**.

Grund: ${reason}${sectionTitle ? ` (${sectionTitle})` : ""}${durationText}${ruleText}

Um sicherzustellen, dass unsere Community sicher und freundlich bleibt, befolge bitte unsere Regeln. Die vollständigen Regeln findest du hier: https://discord.com/channels/1423413347168157718/1423413348065611949

  await user.send(message).catch(() => console.log(`Konnte DM an ${user.tag} nicht senden.`));
}
