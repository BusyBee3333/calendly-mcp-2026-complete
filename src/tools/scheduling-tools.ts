import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerSchedulingTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_create_scheduling_link',
      description: 'Create a single-use scheduling link for an event type or user',
      inputSchema: z.object({
        max_event_count: z.number().describe('Maximum number of events that can be scheduled'),
        owner: z.string().describe('URI of the event type or user'),
        owner_type: z.enum(['EventType', 'User']).describe('Type of owner'),
      }),
      handler: async (args: {
        max_event_count: number;
        owner: string;
        owner_type: string;
      }) => {
        const link = await calendly.createSchedulingLink(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(link, null, 2),
            },
          ],
        };
      },
    },
  ];
}
