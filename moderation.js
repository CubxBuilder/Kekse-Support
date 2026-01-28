import { sendPunishmentInfo } from "./info.js";
import { AuditLogEvent } from "discord.js";

const PROBOT_LOG_CHANNEL_ID = "1423413348220796991";

export function initModeration(client) {
  client.on("guildAuditLogEntryCreate", async (entry, guild) => {
    const { action, targetId, reason, executorId } = entry;
    if (executorId === client.user.id) return; 

    let type = "";
    let duration = null;

    if (action === AuditLogEvent.MemberBanAdd) type = "ban";
    else if (action === AuditLogEvent.MemberKick) type = "kick";
    else if (action === AuditLogEvent.MemberUpdate) {
      const timeoutChange = entry.changes.find(c => c.key === "communication_disabled_until");
      if (timeoutChange && timeoutChange.new) {
        type = "timeout";
        duration = "Check Audit Log";
      }
    }

    if (type) {
      const target = await client.users.fetch(targetId).catch(() => null);
      if (target) {
        if (type === "timeout") {
          const timeoutChange = entry.changes.find(c => c.key === "communication_disabled_until");
          if (timeoutChange && timeoutChange.new) {
            const until = new Date(timeoutChange.new);
            const now = new Date();
            const diffMs = until - now;
            const diffMin = Math.round(diffMs / 60000);
            
            if (diffMin >= 60 * 24) {
              duration = `${Math.round(diffMin / (60 * 24))} Tag(e)`;
            } else if (diffMin >= 60) {
              duration = `${Math.round(diffMin / 60)} Stunde(n)`;
            } else {
              duration = `${diffMin} Minute(n)`;
            }
          }
        }
        await sendPunishmentInfo(target, type, reason || "Kein Grund angegeben.", duration);
      }
    }
  });

  client.on("messageCreate", async msg => {
    if (msg.channel.id === PROBOT_LOG_CHANNEL_ID && msg.author.bot) {
    }
  });
}
