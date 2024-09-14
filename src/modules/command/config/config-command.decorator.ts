import { createCommandGroupDecorator } from 'necord';

export const ConfigCommandDecorator = createCommandGroupDecorator({
  name: 'config',
  description: 'Manage all bot configuration',
});
