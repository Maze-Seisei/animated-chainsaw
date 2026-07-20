import prisma from "../database";
import fs from "fs/promises";
import path from "path";

export const backupGuildData = async (guildId: number) => {
  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    include: { settings: true, gangs: { include: { members: true, invites: true } }, auditLogs: true, gangLogs: true },
  });
  const json = JSON.stringify(guild, null, 2);
  const filename = `backup-guild-${guildId}-${Date.now()}.json`;
  await fs.writeFile(path.join(process.cwd(), filename), json, "utf8");
  return filename;
};

export const restoreGuildDataFromJson = async (jsonString: string) => {
  // Restoration is application-specific — use with caution.
  const payload = JSON.parse(jsonString);
  // Example: upsert guild + settings (extend as needed)
  await prisma.guild.upsert({
    where: { guildId: payload.guildId },
    create: { guildId: payload.guildId, name: payload.name },
    update: { name: payload.name },
  });
  return true;
};

export const deleteGuild = async (guildId: number) => {
  // careful: this cascades or deletes related entities depending on schema
  await prisma.gang.deleteMany({ where: { guildId } });
  await prisma.settings.deleteMany({ where: { guildId } });
  await prisma.guild.delete({ where: { id: guildId } });
};
