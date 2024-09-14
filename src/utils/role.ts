import { GuildMember } from 'discord.js';

export const AdminRoles = ['Admin'];

export const hasAdminRoles = ({ roles }: GuildMember) =>
  roles.cache.some((role) => AdminRoles.includes(role.name));
