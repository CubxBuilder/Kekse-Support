export const ruleMap = {
  "§1a1n1": "Sei respektvoll. Beleidigungen, Diskriminierung, Mobbing oder Drohungen werden nicht toleriert.",
  "§1a1n2": "Diskutiere sachlich und vermeide provokative Streitigkeiten.",
  "§1a2n1": "Keine anstößigen, pornografischen, rassistischen oder gewalttätigen Inhalte posten.",
  "§1a2n2": "Illegale Inhalte oder Diskussionen über illegale Aktivitäten sind verboten.",
  "§1a3n1": "Spam jeglicher Art ist nicht erlaubt.",
  "§1a3n2": "Werbung oder Links nur in genehmigten Kanälen mit Zustimmung der Moderatoren.",
  "§2a1n1": "Keine persönlichen Informationen ohne Erlaubnis teilen. Respektiere die Privatsphäre anderer Mitglieder.",
  "§2a2n1": "Keine unaufgeforderten Direktnachrichten, insbesondere Werbung oder Anfragen.",
  "§2a2n2": "Wünsche nach Ruhe respektieren.",
  "§3a1n1": "Poste nur im passenden Kanal.",
  "§3a1n2": "Nutze die richtigen Kanäle für Fragen, Diskussionen oder Medien.",
  "§3a1n3": "Bots dürfen nur in den dafür vorgesehenen Channels verwendet werden.",
  "§3a2n1": "Freundlich und konstruktiv kommunizieren. Fluchen nur in Maßen.",
  "§3a2n2": "Server-Sprache: Deutsch.",
  "§3a3n1": "Störgeräusche vermeiden.",
  "§3a3n2": "Dauerhaftes Stummschalten oder wiederholtes Verlassen und Betreten ist nicht erlaubt.",
  "§4a1n1": "Missbrauch von Tickets, z. B. ohne Grund öffnen, wird bestraft.",
  "§5a1n1": "Tickets für Giveaways müssen innerhalb von 2 Tagen nach Ende geöffnet werden, sonst erfolgt ein Reroll.",
  "§5a1n2": "Mitglieder, die aktuell gebannt sind, dürfen nicht am Giveaway teilnehmen.",
  "§6a1n1": "Entscheidungen der Moderatoren respektieren. Probleme über ein Ticket klären.",
  "§6a1n2": "Den Anweisungen der Moderatoren Folge leisten."
};

export async function sendPunishmentInfo(user, type, reason, duration = null) {
  let ruleText = "";
  
  const ruleMatch = reason ? reason.match(/§\d+a\d+n\d+/) : null;
  if (ruleMatch) {
    const code = ruleMatch[0];
    const description = ruleMap[code];
    if (description) {
      ruleText = `\n\nRegelauszug (${code}):\n[...] "${description}" [...]`;
    }
  }

  const durationText = duration ? `\n\nDuration: ${duration}` : "";
  
  const message = `Hey ${user.username},

Your account on Kekse Clan received a ${type}.

Reason: ${reason}${durationText}${ruleText}

To ensure our community remains safe and friendly, please follow our rules. You can find the full rules here: https://discord.com/channels/1423413347168157718/1423413348065611949`;

  await user.send(message).catch(() => console.log(`Konnte DM an ${user.tag} nicht senden.`));
}
