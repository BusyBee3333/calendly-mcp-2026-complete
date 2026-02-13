import { z } from 'zod';
import type { CalendlyClient } from '../clients/calendly.js';

export function registerOrganizationsTools(calendly: CalendlyClient) {
  return [
    {
      name: 'calendly_get_organization',
      description: 'Get information about a specific organization by URI',
      inputSchema: z.object({
        organization_uri: z.string().describe('The URI of the organization'),
      }),
      handler: async (args: { organization_uri: string }) => {
        const org = await calendly.getOrganization(args.organization_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(org, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_list_organization_invitations',
      description: 'List all invitations for an organization',
      inputSchema: z.object({
        organization_uri: z.string().describe('The URI of the organization'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        email: z.string().optional().describe('Filter by invitee email'),
        page_token: z.string().optional().describe('Token for pagination'),
        sort: z.string().optional().describe('Sort field and direction (e.g., created_at:asc)'),
        status: z.string().optional().describe('Filter by status: pending, accepted, declined, revoked'),
      }),
      handler: async (args: {
        organization_uri: string;
        count?: number;
        email?: string;
        page_token?: string;
        sort?: string;
        status?: string;
      }) => {
        const { organization_uri, ...params } = args;
        const result = await calendly.listOrganizationInvitations(organization_uri, params);
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
      name: 'calendly_get_organization_invitation',
      description: 'Get details of a specific organization invitation',
      inputSchema: z.object({
        invitation_uri: z.string().describe('The URI of the invitation'),
      }),
      handler: async (args: { invitation_uri: string }) => {
        const invitation = await calendly.getOrganizationInvitation(args.invitation_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(invitation, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_create_organization_invitation',
      description: 'Invite a user to join an organization',
      inputSchema: z.object({
        organization_uri: z.string().describe('The URI of the organization'),
        email: z.string().email().describe('Email address of the person to invite'),
      }),
      handler: async (args: { organization_uri: string; email: string }) => {
        const invitation = await calendly.createOrganizationInvitation(
          args.organization_uri,
          args.email
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(invitation, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_revoke_organization_invitation',
      description: 'Revoke a pending organization invitation',
      inputSchema: z.object({
        invitation_uri: z.string().describe('The URI of the invitation to revoke'),
      }),
      handler: async (args: { invitation_uri: string }) => {
        await calendly.revokeOrganizationInvitation(args.invitation_uri);
        return {
          content: [
            {
              type: 'text',
              text: 'Invitation revoked successfully',
            },
          ],
        };
      },
    },
    {
      name: 'calendly_list_organization_memberships',
      description: 'List all memberships for an organization',
      inputSchema: z.object({
        organization_uri: z.string().describe('The URI of the organization'),
        count: z.number().optional().describe('Number of results per page (max 100)'),
        email: z.string().optional().describe('Filter by member email'),
        page_token: z.string().optional().describe('Token for pagination'),
        role: z.string().optional().describe('Filter by role: owner, admin, user'),
      }),
      handler: async (args: {
        organization_uri: string;
        count?: number;
        email?: string;
        page_token?: string;
        role?: string;
      }) => {
        const { organization_uri, ...params } = args;
        const result = await calendly.listOrganizationMemberships(organization_uri, params);
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
      name: 'calendly_get_organization_membership',
      description: 'Get details of a specific organization membership',
      inputSchema: z.object({
        membership_uri: z.string().describe('The URI of the membership'),
      }),
      handler: async (args: { membership_uri: string }) => {
        const membership = await calendly.getOrganizationMembership(args.membership_uri);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(membership, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'calendly_remove_organization_membership',
      description: 'Remove a user from an organization',
      inputSchema: z.object({
        membership_uri: z.string().describe('The URI of the membership to remove'),
      }),
      handler: async (args: { membership_uri: string }) => {
        await calendly.removeOrganizationMembership(args.membership_uri);
        return {
          content: [
            {
              type: 'text',
              text: 'Membership removed successfully',
            },
          ],
        };
      },
    },
  ];
}
