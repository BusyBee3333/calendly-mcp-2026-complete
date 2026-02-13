import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerRoutingFormsTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_list_routing_forms',
      description: 'List all routing forms for an organization',
      inputSchema: z.object({
        organization_uri: z.string().describe('The URI of the organization'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        page_token: z.string().optional().describe('Token for pagination'),
        sort: z.string().optional().describe('Sort field and direction (e.g., created_at:desc)'),
      }),
      handler: async (args: {
        organization_uri: string;
        count?: number;
        page_token?: string;
        sort?: string;
      }) => {
        const { organization_uri, ...params } = args;
        const result = await calendly.listRoutingForms(organization_uri, params);
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
      name: 'calendly_get_routing_form',
      description: 'Get details of a specific routing form',
      inputSchema: z.object({
        routing_form_uri: z.string().describe('The URI of the routing form'),
      }),
      handler: async (args: { routing_form_uri: string }) => {
        const form = await calendly.getRoutingForm(args.routing_form_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(form, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_list_routing_form_submissions',
      description: 'List all submissions for a routing form',
      inputSchema: z.object({
        routing_form_uri: z.string().describe('The URI of the routing form'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        page_token: z.string().optional().describe('Token for pagination'),
        sort: z.string().optional().describe('Sort field and direction (e.g., created_at:desc)'),
      }),
      handler: async (args: {
        routing_form_uri: string;
        count?: number;
        page_token?: string;
        sort?: string;
      }) => {
        const { routing_form_uri, ...params } = args;
        const result = await calendly.listRoutingFormSubmissions(routing_form_uri, params);
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
      name: 'calendly_get_routing_form_submission',
      description: 'Get details of a specific routing form submission',
      inputSchema: z.object({
        submission_uri: z.string().describe('The URI of the routing form submission'),
      }),
      handler: async (args: { submission_uri: string }) => {
        const submission = await calendly.getRoutingFormSubmission(args.submission_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(submission, null, 2),
            },
          ],
        };
      },
    },
  ];
}
