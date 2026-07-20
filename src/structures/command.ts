export type CommandRunContext = {
  guildId?: number;
  userId: string;
  channelId?: string;
  interaction?: any; // adapt to your framework (discord.js Interaction, etc)
};

export interface BotCommand {
  name: string;
  description: string;
  // Minimal metadata for /help and deployment
  options?: any[];
  execute(ctx: CommandRunContext, args?: Record<string, any>): Promise<void>;
}
