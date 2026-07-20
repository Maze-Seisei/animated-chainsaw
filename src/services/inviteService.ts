import prisma from "../database";
import { v4 as uuidv4 } from "uuid";

export const createInvite = async (gangId: string, inviterId: string, inviteeId?: string, ttlMinutes = 1440) => {
  const id = uuidv4();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);
  const code = uuidv4().split("-")[0]; // short code
  return prisma.gangInvite.create({
    data: { id, gangId, inviterId, inviteeId, code, expiresAt },
  });
};

export const acceptInvite = async (inviteIdOrCode: string, accepterId: string) => {
  const invite = await prisma.gangInvite.findFirst({
    where: {
      OR: [{ id: inviteIdOrCode }, { code: inviteIdOrCode }],
      expiresAt: { gt: new Date() },
      acceptedAt: null,
    },
  });
  if (!invite) throw new Error("Invite not found or expired");
  // mark accepted
  await prisma.gangInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });
  // add member
  await prisma.gangMember.create({
    data: { id: uuidv4(), gangId: invite.gangId, userId: accepterId },
  });
  return invite;
};

export const expireOldInvites = () =>
  prisma.gangInvite.updateMany({ where: { expiresAt: { lt: new Date() }, acceptedAt: null }, data: { /* no-op */ } });
