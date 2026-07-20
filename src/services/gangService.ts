import prisma from "../database";
import { v4 as uuidv4 } from "uuid";

export const createGang = async (guildId: number, name: string, leaderId: string) => {
  const id = uuidv4();
  const gang = await prisma.gang.create({
    data: {
      id,
      guildId,
      name,
      leaderId,
    },
  });
  // add leader as member
  await prisma.gangMember.create({
    data: {
      id: uuidv4(),
      gangId: gang.id,
      userId: leaderId,
      role: "LEADER",
    },
  });
  return gang;
};

export const findGangById = (id: string) =>
  prisma.gang.findUnique({ where: { id }, include: { members: true } });

export const findGangByName = (guildId: number, name: string) =>
  prisma.gang.findFirst({ where: { guildId, name } });

export const renameGang = (id: string, newName: string) =>
  prisma.gang.update({ where: { id }, data: { name: newName } });

export const disbandGang = async (id: string) =>
  prisma.gang.update({ where: { id }, data: { disbandedAt: new Date() } });

// membership helpers
export const addMember = (gangId: string, userId: string, role = "MEMBER") =>
  prisma.gangMember.create({
    data: { id: uuidv4(), gangId, userId, role },
  });

export const removeMember = (gangId: string, userId: string) =>
  prisma.gangMember.updateMany({ where: { gangId, userId }, data: { isActive: false } });

export const promoteMember = (memberId: string, role: "OFFICER" | "LEADER") =>
  prisma.gangMember.update({ where: { id: memberId }, data: { role } });
