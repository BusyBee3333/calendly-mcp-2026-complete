#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "calendly";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.calendly.com";

// ============================================
// API CLIENT - Calendly API v2
// ============================================
class CalendlyClient {
  private apiKey: string;
  private baseUrl: string;
  private currentUserUri: string | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Calendly API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }

  async getCurrentUser(): Promise<string> {
    if (!this.currentUserUri) {
      const result = await this.get("/users/me");
      this.currentUserUri = result.resource.uri;
    }
    return this.currentUserUri!;
  }
}

// ============================================
// TOOL DEFINITIONS - Calendly API v2
// ============================================
const tools = [
  {
    name: "list_events",
    description: "List scheduled events. Returns events for the authenticated user within the specified time range.",
    inputSchema: {
      type: "object" as const,
      properties: {
        count: { type: "number", description: "Number of events to return (max 100)" },
        min_start_time: { type: "string", description: "Start of time range (ISO 8601 format)" },
        max_start_time: { type: "string", description: "End of time range (ISO 8601 format)" },
        status: { type: "string", enum: ["active", "canceled"], description: "Filter by event status" },
        page_token: { type: "string", description: "Token for pagination" },
      },
    },
  },
  {
    name: "get_event",
    description: "Get details of a specific scheduled event by its UUID",
    inputSchema: {
      type: "object" as const,
      properties: {
        event_uuid: { type: "string", description: "The UUID of the scheduled event" },
      },
      required: ["event_uuid"],
    },
  },
  {
    name: "cancel_event",
    description: "Cancel a scheduled event. Optionally provide a reason for cancellation.",
    inputSchema: {
      type: "object" as const,
      properties: {
        event_uuid: { type: "string", description: "The UUID of the scheduled event to cancel" },
        reason: { type: "string", description: "Reason for cancellation (optional)" },
      },
      required: ["event_uuid"],
    },
  },
  {
    name: "list_event_types",
    description: "List all event types available for the authenticated user",
    inputSchema: {
      type: "object" as const,
      properties: {
        count: { type: "number", description: "Number of event types to return (max 100)" },
        active: { type: "boolean", description: "Filter by active status" },
        page_token: { type: "string", description: "Token for pagination" },
      },
    },
  },
  {
    name: "get_availability",
    description: "Get available time slots for an event type",
    inputSchema: {
      type: "object" as const,
      properties: {
        event_type_uuid: { type: "string", description: "The UUID of the event type" },
        start_time: { type: "string", description: "Start of availability window (ISO 8601)" },
        end_time: { type: "string", description: "End of availability window (ISO 8601)" },
      },
      required: ["event_type_uuid", "start_time", "end_time"],
    },
  },
  {
    name: "list_invitees",
    description: "List invitees for a scheduled event",
    inputSchema: {
      type: "object" as const,
      properties: {
        event_uuid: { type: "string", description: "The UUID of the scheduled event" },
        count: { type: "number", description: "Number of invitees to return (max 100)" },
        status: { type: "string", enum: ["active", "canceled"], description: "Filter by invitee status" },
        page_token: { type: "string", description: "Token for pagination" },
      },
      required: ["event_uuid"],
    },
  },
  {
    name: "get_user",
    description: "Get the current authenticated user's information",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: CalendlyClient, name: string, args: any) {
  switch (name) {
    case "list_events": {
      const userUri = await client.getCurrentUser();
      const params = new URLSearchParams({ user: userUri });
      if (args.count) params.append("count", String(args.count));
      if (args.min_start_time) params.append("min_start_time", args.min_start_time);
      if (args.max_start_time) params.append("max_start_time", args.max_start_time);
      if (args.status) params.append("status", args.status);
      if (args.page_token) params.append("page_token", args.page_token);
      return await client.get(`/scheduled_events?${params.toString()}`);
    }

    case "get_event": {
      const { event_uuid } = args;
      return await client.get(`/scheduled_events/${event_uuid}`);
    }

    case "cancel_event": {
      const { event_uuid, reason } = args;
      const body: any = {};
      if (reason) body.reason = reason;
      return await client.post(`/scheduled_events/${event_uuid}/cancellation`, body);
    }

    case "list_event_types": {
      const userUri = await client.getCurrentUser();
      const params = new URLSearchParams({ user: userUri });
      if (args.count) params.append("count", String(args.count));
      if (args.active !== undefined) params.append("active", String(args.active));
      if (args.page_token) params.append("page_token", args.page_token);
      return await client.get(`/event_types?${params.toString()}`);
    }

    case "get_availability": {
      const { event_type_uuid, start_time, end_time } = args;
      const params = new URLSearchParams({
        start_time,
        end_time,
      });
      return await client.get(`/event_type_available_times?event_type=https://api.calendly.com/event_types/${event_type_uuid}&${params.toString()}`);
    }

    case "list_invitees": {
      const { event_uuid, count, status, page_token } = args;
      const params = new URLSearchParams();
      if (count) params.append("count", String(count));
      if (status) params.append("status", status);
      if (page_token) params.append("page_token", page_token);
      const queryString = params.toString();
      return await client.get(`/scheduled_events/${event_uuid}/invitees${queryString ? '?' + queryString : ''}`);
    }

    case "get_user": {
      return await client.get("/users/me");
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) {
    console.error("Error: CALENDLY_API_KEY environment variable required");
    console.error("Get your Personal Access Token from: https://calendly.com/integrations/api_webhooks");
    process.exit(1);
  }

  const client = new CalendlyClient(apiKey);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
