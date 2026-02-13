import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerEventsTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_list_events',
      description: 'List scheduled events with various filters',
      inputSchema: z.object({
        user: z.string().optional().describe('Filter by user URI'),
        organization: z.string().optional().describe('Filter by organization URI'),
        invitee_email: z.string().optional().describe('Filter by invitee email'),
        status: z.string().optional().describe('Filter by status: active or canceled'),
        min_start_time: z.string().optional().describe('Minimum start time (ISO 8601 format)'),
        max_start_time: z.string().optional().describe('Maximum start time (ISO 8601 format)'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        page_token: z.string().optional().describe('Token for pagination'),
        sort: z.string().optional().describe('Sort field and direction (e.g., start_time:asc)'),
      }),
      handler: async (args: {
        user?: string;
        organization?: string;
        invitee_email?: string;
        status?: string;
        min_start_time?: string;
        max_start_time?: string;
        count?: number;
        page_token?: string;
        sort?: string;
      }) => {
        const result = await calendly.listEvents(args);
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
      name: 'calendly_get_event',
      description: 'Get details of a specific scheduled event',
      inputSchema: z.object({
        event_uri: z.string().describe('The URI of the scheduled event'),
      }),
      handler: async (args: { event_uri: string }) => {
        const event = await calendly.getEvent(args.event_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(event, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_cancel_event',
      description: 'Cancel a scheduled event',
      inputSchema: z.object({
        event_uri: z.string().describe('The URI of the event to cancel'),
        reason: z.string().optional().describe('Reason for cancellation'),
      }),
      handler: async (args: { event_uri: string; reason?: string }) => {
        const event = await calendly.cancelEvent(args.event_uri, args.reason);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(event, null, 2),
            },
          ],
        };
      },
    },
  ];
}
