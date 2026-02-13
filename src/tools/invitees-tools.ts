import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerInviteesTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_list_event_invitees',
      description: 'List all invitees for a specific event',
      inputSchema: z.object({
        event_uri: z.string().describe('The URI of the event'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        email: z.string().optional().describe('Filter by invitee email'),
        page_token: z.string().optional().describe('Token for pagination'),
        sort: z.string().optional().describe('Sort field and direction (e.g., created_at:asc)'),
        status: z.string().optional().describe('Filter by status: active or canceled'),
      }),
      handler: async (args: {
        event_uri: string;
        count?: number;
        email?: string;
        page_token?: string;
        sort?: string;
        status?: string;
      }) => {
        const { event_uri, ...params } = args;
        const result = await calendly.listEventInvitees(event_uri, params);
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
      name: 'calendly_get_invitee',
      description: 'Get details of a specific invitee',
      inputSchema: z.object({
        invitee_uri: z.string().describe('The URI of the invitee'),
      }),
      handler: async (args: { invitee_uri: string }) => {
        const invitee = await calendly.getInvitee(args.invitee_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(invitee, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_create_no_show',
      description: 'Mark an invitee as a no-show',
      inputSchema: z.object({
        invitee_uri: z.string().describe('The URI of the invitee to mark as no-show'),
      }),
      handler: async (args: { invitee_uri: string }) => {
        const noShow = await calendly.createNoShow(args.invitee_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(noShow, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_get_no_show',
      description: 'Get details of a no-show record',
      inputSchema: z.object({
        no_show_uri: z.string().describe('The URI of the no-show record'),
      }),
      handler: async (args: { no_show_uri: string }) => {
        const noShow = await calendly.getNoShow(args.no_show_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(noShow, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_delete_no_show',
      description: 'Remove a no-show marking from an invitee',
      inputSchema: z.object({
        no_show_uri: z.string().describe('The URI of the no-show record to delete'),
      }),
      handler: async (args: { no_show_uri: string }) => {
        await calendly.deleteNoShow(args.no_show_uri);
        return {
          content: [
            {
              type: 'text',
              text: 'No-show record deleted successfully',
            },
          ],
        };
      },
    },
  ];
}
