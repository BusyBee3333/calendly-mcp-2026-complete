import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerWebhooksTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_list_webhooks',
      description: 'List all webhook subscriptions for an organization',
      inputSchema: z.object({
        organization: z.string().describe('The URI of the organization'),
        scope: z.enum(['organization', 'user']).describe('Scope of webhooks to list'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        page_token: z.string().optional().describe('Token for pagination'),
      }),
      handler: async (args: {
        organization: string;
        scope: string;
        count?: number;
        page_token?: string;
      }) => {
        const result = await calendly.listWebhooks(args);
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
      name: 'calendly_get_webhook',
      description: 'Get details of a specific webhook subscription',
      inputSchema: z.object({
        webhook_uri: z.string().describe('The URI of the webhook subscription'),
      }),
      handler: async (args: { webhook_uri: string }) => {
        const webhook = await calendly.getWebhook(args.webhook_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(webhook, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_create_webhook',
      description: 'Create a new webhook subscription',
      inputSchema: z.object({
        url: z.string().url().describe('The callback URL for webhook events'),
        events: z
          .array(
            z.enum([
              'invitee.created',
              'invitee.canceled',
              'routing_form_submission.created',
              'invitee_no_show.created',
              'invitee_no_show.deleted',
            ])
          )
          .describe('Array of event types to subscribe to'),
        organization: z.string().describe('The URI of the organization'),
        scope: z.enum(['organization', 'user']).describe('Scope of the webhook'),
        signing_key: z.string().optional().describe('Signing key for webhook verification'),
        user: z.string().optional().describe('User URI (required if scope is user)'),
      }),
      handler: async (args: {
        url: string;
        events: string[];
        organization: string;
        scope: string;
        signing_key?: string;
        user?: string;
      }) => {
        const webhook = await calendly.createWebhook(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(webhook, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_delete_webhook',
      description: 'Delete a webhook subscription',
      inputSchema: z.object({
        webhook_uri: z.string().describe('The URI of the webhook subscription to delete'),
      }),
      handler: async (args: { webhook_uri: string }) => {
        await calendly.deleteWebhook(args.webhook_uri);
        return {
          content: [
            {
              type: 'text',
              text: 'Webhook subscription deleted successfully',
            },
          ],
        };
      },
    },
  ];
}
