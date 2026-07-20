import { BotCommand } from "../../structures/command";
import * as gangService from "../../services/gangService";

const command: BotCommand = {
  name: "gang create",
  description: "Create a new gang",
  options: [
    { name: "name", type: "STRING", description: "Gang name", required: true },
  ],
  async execute(ctx, args) {
    const guildId = ctx.guildId!;
    const userId = ctx.userId;
    const name = args?.name;
    if (!guildId) throw new Error("Guild context required");
    const existing = await gangService.findGangByName(guildId, name);
    if (existing) {
      // reply: already exists
      return;
    }
    const gang = await gangService.createGang(guildId, name, userId);
    // reply with success embed / message
    return;
  },
};

export default command;
