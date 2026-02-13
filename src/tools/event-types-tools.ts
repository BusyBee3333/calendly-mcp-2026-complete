import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

const customQuestionSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'text', 'phone_number', 'multiple_choice', 'radio_buttons', 'checkboxes']),
  position: z.number(),
  enabled: z.boolean(),
  required: z.boolean(),
  answer_choices: z.array(z.string()).optional(),
  include_other: z.boolean().optional(),
});

export function registerEventTypesTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_list_event_types',
      description: 'List all event types for a user or organization',
      inputSchema: z.object({
        user: z.string().optional().describe('Filter by user URI'),
        organization: z.string().optional().describe('Filter by organization URI'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        page_token: z.string().optional().describe('Token for pagination'),
        sort: z.string().optional().describe('Sort field and direction (e.g., name:asc)'),
        active: z.boolean().optional().describe('Filter by active status'),
      }),
      handler: async (args: {
        user?: string;
        organization?: string;
        count?: number;
        page_token?: string;
        sort?: string;
        active?: boolean;
      }) => {
        const result = await calendly.listEventTypes(args);
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
      name: 'calendly_get_event_type',
      description: 'Get details of a specific event type',
      inputSchema: z.object({
        event_type_uri: z.string().describe('The URI of the event type'),
      }),
      handler: async (args: { event_type_uri: string }) => {
        const eventType = await calendly.getEventType(args.event_type_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(eventType, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_create_event_type',
      description: 'Create a new event type',
      inputSchema: z.object({
        name: z.string().describe('Name of the event type'),
        duration: z.number().describe('Duration in minutes'),
        owner: z.string().describe('User URI of the event type owner'),
        type: z.string().optional().describe('Type of event (default: StandardEventType)'),
        kind: z.string().optional().describe('Kind of event: solo, group, collective, round_robin'),
        description_plain: z.string().optional().describe('Plain text description'),
        description_html: z.string().optional().describe('HTML description'),
        color: z.string().optional().describe('Color hex code (e.g., #0000ff)'),
        internal_note: z.string().optional().describe('Internal note for team members'),
        secret: z.boolean().optional().describe('Whether the event type is secret'),
        custom_questions: z.array(customQuestionSchema).optional().describe('Custom questions to ask invitees'),
      }),
      handler: async (args: {
        name: string;
        duration: number;
        owner: string;
        type?: string;
        kind?: string;
        description_plain?: string;
        description_html?: string;
        color?: string;
        internal_note?: string;
        secret?: boolean;
        custom_questions?: any[];
      }) => {
        const { owner, ...rest } = args;
        const eventType = await calendly.createEventType({
          ...rest,
          profile: { type: 'User', owner },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(eventType, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_update_event_type',
      description: 'Update an existing event type',
      inputSchema: z.object({
        event_type_uri: z.string().describe('The URI of the event type to update'),
        name: z.string().optional().describe('New name'),
        duration: z.number().optional().describe('New duration in minutes'),
        description_plain: z.string().optional().describe('New plain text description'),
        description_html: z.string().optional().describe('New HTML description'),
        color: z.string().optional().describe('New color hex code'),
        internal_note: z.string().optional().describe('New internal note'),
        secret: z.boolean().optional().describe('New secret status'),
        active: z.boolean().optional().describe('New active status'),
        custom_questions: z.array(customQuestionSchema).optional().describe('New custom questions'),
      }),
      handler: async (args: {
        event_type_uri: string;
        name?: string;
        duration?: number;
        description_plain?: string;
        description_html?: string;
        color?: string;
        internal_note?: string;
        secret?: boolean;
        active?: boolean;
        custom_questions?: any[];
      }) => {
        const { event_type_uri, ...params } = args;
        const eventType = await calendly.updateEventType(event_type_uri, params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(eventType, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_delete_event_type',
      description: 'Delete an event type',
      inputSchema: z.object({
        event_type_uri: z.string().describe('The URI of the event type to delete'),
      }),
      handler: async (args: { event_type_uri: string }) => {
        await calendly.deleteEventType(args.event_type_uri);
        return {
          content: [
            {
              type: 'text',
              text: 'Event type deleted successfully',
            },
          ],
        };
      },
    },
  ];
}
