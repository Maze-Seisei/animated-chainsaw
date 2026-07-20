import prisma from "../database";

export const getSettingsForGuild = async (guildId: number) => {
  let settings = await prisma.settings.findUnique({ where: { guildId } });
  if (!settings) {
    // create defaults
    settings = await prisma.settings.create({
      data: { guildId, prefix: "!" },
    });
  }
  return settings;
};

export const setSetting = async (guildId: number, key: string, value: any) => {
  const data: any = {};
  data[key] = value;
  return prisma.settings.upsert({
    where: { guildId },
    create: { guildId, ...data },
    update: data,
  });
};
