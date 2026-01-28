const STORAGE_CHANNEL_ID = "1423413348220796996";
let storageMessage = null;
let data = {};

export async function initStorage(client) {
  try {
    const channel = await client.channels.fetch(STORAGE_CHANNEL_ID).catch(() => null);
    if (!channel || !channel.isTextBased()) {
      console.error("❌ Storage-Kanal nicht gefunden!");
      return;
    }

    const messages = await channel.messages.fetch({ limit: 10 }).catch(() => []);
    storageMessage = messages.find(m => m.author.id === client.user.id);

    if (!storageMessage) {
      storageMessage = await channel.send("{\"_init\": true}");
      data = { _init: true };
    } else {
      try {
        data = JSON.parse(storageMessage.content);
      } catch (e) {
        console.error("❌ Fehler beim Parsen der Storage-Daten, erstelle neu.");
        data = { _init: true };
      }
    }
    console.log("✅ Storage geladen.");
  } catch (err) {
    console.error("❌ Kritischer Fehler bei initStorage:", err);
  }
}

export function getData(key) {
  return data[key];
}

export async function setData(key, value) {
  data[key] = value;
  if (storageMessage) {
    await storageMessage.edit(JSON.stringify(data, null, 2)).catch(console.error);
  }
}
