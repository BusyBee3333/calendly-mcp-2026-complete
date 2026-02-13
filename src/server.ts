import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CalendlyClient } from './clients/calendly.js';
import { registerUsersTools } from './tools/users-tools.js';
import { registerOrganizationsTools } from './tools/organizations-tools.js';
import { registerEventTypesTools } from './tools/event-types-tools.js';
import { registerEventsTools } from './tools/events-tools.js';
import { registerInviteesTools } from './tools/invitees-tools.js';
import { registerWebhooksTools } from './tools/webhooks-tools.js';
import { registerSchedulingTools } from './tools/scheduling-tools.js';
import { registerRoutingFormsTools } from './tools/routing-forms-tools.js';
import { registerAvailabilityTools } from './tools/availability-tools.js';
import { registerComplianceTools } from './tools/compliance-tools.js';

export interface ServerConfig {
  apiKey?: string;
  accessToken?: string;
}

export function createCalendlyServer(config: ServerConfig) {
  const server = new Server(
    {
      name: 'calendly-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize Calendly client
  const calendly = new CalendlyClient({
    apiKey: config.apiKey,
    accessToken: config.accessToken,
  });

  // Register all tools
  const allTools = [
    ...registerUsersTools(calendly),
    ...registerOrganizationsTools(calendly),
    ...registerEventTypesTools(calendly),
    ...registerEventsTools(calendly),
    ...registerInviteesTools(calendly),
    ...registerWebhooksTools(calendly),
    ...registerSchedulingTools(calendly),
    ...registerRoutingFormsTools(calendly),
    ...registerAvailabilityTools(calendly),
    ...registerComplianceTools(calendly),
  ];

  // Create tools map
  const toolsMap = new Map(allTools.map((tool) => [tool.name, tool]));

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = toolsMap.get(request.params.name);
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    try {
      const result = await tool.handler(request.params.arguments as any || {});
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function runStdioServer(config: ServerConfig) {
  const server = createCalendlyServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Calendly MCP server running on stdio');
}
