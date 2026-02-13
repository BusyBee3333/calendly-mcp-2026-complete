import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerAvailabilityTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_list_user_availability_schedules',
      description: 'List all availability schedules for a user',
      inputSchema: z.object({
        user_uri: z.string().describe('The URI of the user'),
      }),
      handler: async (args: { user_uri: string }) => {
        const result = await calendly.listUserAvailabilitySchedules(args.user_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_get_user_availability_schedule',
      description: 'Get details of a specific availability schedule',
      inputSchema: z.object({
        schedule_uri: z.string().describe('The URI of the availability schedule'),
      }),
      handler: async (args: { schedule_uri: string }) => {
        const schedule = await calendly.getUserAvailabilitySchedule(args.schedule_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(schedule, null, 2),
            },
          ],
        };
      },
    },
  ];
}
