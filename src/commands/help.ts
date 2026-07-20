import { BotCommand } from "../structures/command";

export const generateHelp = (commands: BotCommand[], commandName?: string) => {
  if (commandName) {
    const cmd = commands.find((c) => c.name === commandName);
    if (!cmd) return `No help found for ${commandName}`;
    return `/${cmd.name}\n\n${cmd.description}\n\nOptions:\n${(cmd.options || []).map((o: any) => `- ${o.name}: ${o.description}`).join("\n")}`;
  }
  return commands.map((c) => `/${c.name} — ${c.description}`).join("\n");
};
