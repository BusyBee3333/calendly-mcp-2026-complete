import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerUsersTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_get_current_user',
      description: 'Get information about the currently authenticated user',
      inputSchema: z.object({}),
      handler: async () => {
        const user = await calendly.getCurrentUser();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_get_user',
      description: 'Get information about a specific user by URI',
      inputSchema: z.object({
        user_uri: z.string().describe('The URI of the user to retrieve'),
      }),
      handler: async (args: { user_uri: string }) => {
        const user = await calendly.getUser(args.user_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      },
    },
  ];
}
