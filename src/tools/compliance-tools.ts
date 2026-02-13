import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerComplianceTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_create_data_compliance_deletion',
      description: 'Create a GDPR data deletion request for invitees',
      inputSchema: z.object({
        emails: z.array(z.string().email()).describe('Array of invitee email addresses to delete'),
      }),
      handler: async (args: { emails: string[] }) => {
        const request = await calendly.createDataComplianceDeletion(args.emails);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(request, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_get_data_compliance_deletion',
      description: 'Get status of a data compliance deletion request',
      inputSchema: z.object({
        request_uri: z.string().describe('The URI of the deletion request'),
      }),
      handler: async (args: { request_uri: string }) => {
        const request = await calendly.getDataComplianceDeletion(args.request_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(request, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_get_activity_log',
      description: 'Get activity log entries for an organization',
      inputSchema: z.object({
        organization_uri: z.string().describe('The URI of the organization'),
        action: z.string().optional().describe('Filter by action type'),
        actor: z.string().optional().describe('Filter by actor URI'),
        max_occurred_at: z.string().optional().describe('Maximum occurrence time (ISO 8601)'),
        min_occurred_at: z.string().optional().describe('Minimum occurrence time (ISO 8601)'),
        namespace: z.string().optional().describe('Filter by namespace'),
        search_term: z.string().optional().describe('Search term to filter entries'),
        sort: z.string().optional().describe('Sort field and direction (e.g., occurred_at:desc)'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        page_token: z.string().optional().describe('Token for pagination'),
      }),
      handler: async (args: {
        organization_uri: string;
        action?: string;
        actor?: string;
        max_occurred_at?: string;
        min_occurred_at?: string;
        namespace?: string;
        search_term?: string;
        sort?: string;
        count?: number;
        page_token?: string;
      }) => {
        const { organization_uri, ...params } = args;
        const result = await calendly.getActivityLog(organization_uri, params);
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
  ];
}
