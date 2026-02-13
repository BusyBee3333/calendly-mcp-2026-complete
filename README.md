# Calendly MCP Server

Complete Model Context Protocol (MCP) server for Calendly API v2 with 40+ tools and 12 interactive React apps.

## Features

- ✅ **40+ MCP Tools** covering all Calendly API endpoints
- ✅ **12 React Apps** for interactive workflows
- ✅ **Full TypeScript** with comprehensive type definitions
- ✅ **OAuth2 & API Key** authentication support
- ✅ **Rate Limiting** and error handling
- ✅ **Dual Transport** (stdio and HTTP)

## Installation

```bash
npm install @busybee3333/calendly-mcp
```

## Configuration

Set one of the following environment variables:

```bash
export CALENDLY_API_KEY="your-api-key"
# OR
export CALENDLY_ACCESS_TOKEN="your-oauth-token"
```

### Get Your API Key

1. Go to [Calendly Integrations](https://calendly.com/integrations)
2. Navigate to API & Webhooks
3. Generate a Personal Access Token

## Usage

### Stdio Transport (for Claude Desktop, etc.)

```bash
calendly-mcp
```

### Programmatic Usage

```typescript
import { createCalendlyServer } from '@busybee3333/calendly-mcp';

const server = createCalendlyServer({
  apiKey: process.env.CALENDLY_API_KEY,
});
```

## MCP Tools (40+)

### Users (2 tools)

| Tool | Description |
|------|-------------|
| `calendly_get_current_user` | Get information about the currently authenticated user |
| `calendly_get_user` | Get information about a specific user by URI |

### Organizations (8 tools)

| Tool | Description |
|------|-------------|
| `calendly_get_organization` | Get information about a specific organization |
| `calendly_list_organization_invitations` | List all invitations for an organization |
| `calendly_get_organization_invitation` | Get details of a specific organization invitation |
| `calendly_create_organization_invitation` | Invite a user to join an organization |
| `calendly_revoke_organization_invitation` | Revoke a pending organization invitation |
| `calendly_list_organization_memberships` | List all memberships for an organization |
| `calendly_get_organization_membership` | Get details of a specific organization membership |
| `calendly_remove_organization_membership` | Remove a user from an organization |

### Event Types (5 tools)

| Tool | Description |
|------|-------------|
| `calendly_list_event_types` | List all event types for a user or organization |
| `calendly_get_event_type` | Get details of a specific event type |
| `calendly_create_event_type` | Create a new event type |
| `calendly_update_event_type` | Update an existing event type |
| `calendly_delete_event_type` | Delete an event type |

### Scheduled Events (3 tools)

| Tool | Description |
|------|-------------|
| `calendly_list_events` | List scheduled events with various filters |
| `calendly_get_event` | Get details of a specific scheduled event |
| `calendly_cancel_event` | Cancel a scheduled event |

### Invitees (5 tools)

| Tool | Description |
|------|-------------|
| `calendly_list_event_invitees` | List all invitees for a specific event |
| `calendly_get_invitee` | Get details of a specific invitee |
| `calendly_create_no_show` | Mark an invitee as a no-show |
| `calendly_get_no_show` | Get details of a no-show record |
| `calendly_delete_no_show` | Remove a no-show marking from an invitee |

### Webhooks (4 tools)

| Tool | Description |
|------|-------------|
| `calendly_list_webhooks` | List all webhook subscriptions for an organization |
| `calendly_get_webhook` | Get details of a specific webhook subscription |
| `calendly_create_webhook` | Create a new webhook subscription |
| `calendly_delete_webhook` | Delete a webhook subscription |

### Scheduling (1 tool)

| Tool | Description |
|------|-------------|
| `calendly_create_scheduling_link` | Create a single-use scheduling link for an event type or user |

### Routing Forms (4 tools)

| Tool | Description |
|------|-------------|
| `calendly_list_routing_forms` | List all routing forms for an organization |
| `calendly_get_routing_form` | Get details of a specific routing form |
| `calendly_list_routing_form_submissions` | List all submissions for a routing form |
| `calendly_get_routing_form_submission` | Get details of a specific routing form submission |

### Availability (2 tools)

| Tool | Description |
|------|-------------|
| `calendly_list_user_availability_schedules` | List all availability schedules for a user |
| `calendly_get_user_availability_schedule` | Get details of a specific availability schedule |

### Data Compliance (3 tools)

| Tool | Description |
|------|-------------|
| `calendly_create_data_compliance_deletion` | Create a GDPR data deletion request for invitees |
| `calendly_get_data_compliance_deletion` | Get status of a data compliance deletion request |
| `calendly_get_activity_log` | Get activity log entries for an organization |

## MCP Apps (12 Interactive React Apps)

### 1. Event Type Dashboard
**Purpose:** Manage your Calendly event types  
**Features:**
- View all event types in a grid layout
- Toggle active/inactive status
- Quick access to scheduling URLs
- Shows duration, type, and description

### 2. Calendar View
**Purpose:** View your scheduled events in a list format  
**Features:**
- Filter by time range (week/month)
- Group events by date
- Show event status, location, and invitee count
- Time-formatted display

### 3. Invitee Grid
**Purpose:** View and manage event invitees  
**Features:**
- Select events from dropdown
- Table view of all invitees
- Mark invitees as no-shows
- Show status, timezone, and reschedule info

### 4. Webhook Manager
**Purpose:** Manage Calendly webhook subscriptions  
**Features:**
- Create new webhooks with event selection
- View all active webhooks
- Delete webhooks
- Shows callback URLs and event types

### 5. Organization Overview
**Purpose:** Manage your organization  
**Features:**
- View organization details
- List all members with roles
- Manage pending invitations
- Revoke invitations

### 6. User Profile
**Purpose:** View your Calendly profile and settings  
**Features:**
- Display user information
- Show avatar and scheduling URL
- List availability schedules
- Show schedule rules and timezones

### 7. Analytics Dashboard
**Purpose:** Overview of your Calendly metrics  
**Features:**
- Total events count
- Active vs canceled events
- Total invitees
- Event types count
- No-shows tracking

### 8. Availability Manager
**Purpose:** Manage your availability schedules  
**Features:**
- View all availability schedules
- Show weekly rules with time slots
- Display timezone information
- Highlight default schedule

### 9. Event Detail View
**Purpose:** View detailed information about events  
**Features:**
- Select and view specific events
- Show all event metadata
- List all invitees
- Cancel events

### 10. No-Show Tracker
**Purpose:** Track and manage no-show invitees  
**Features:**
- List all no-shows across events
- Show event and invitee details
- Remove no-show markings
- Display no-show count

### 11. Routing Form Builder
**Purpose:** Manage routing forms and view submissions  
**Features:**
- List all routing forms
- View form questions and structure
- Show all submissions
- Display routing results

### 12. Scheduling Link Manager
**Purpose:** Generate single-use scheduling links  
**Features:**
- Select event type
- Set maximum event count
- Generate unique booking URLs
- Copy links to clipboard

## Examples

### List Event Types

```javascript
const result = await callTool('calendly_list_event_types', {
  user: 'https://api.calendly.com/users/AAAA',
  active: true
});
```

### Create Event Type

```javascript
const eventType = await callTool('calendly_create_event_type', {
  name: '30 Minute Meeting',
  duration: 30,
  owner: 'https://api.calendly.com/users/AAAA',
  description_plain: 'A quick 30-minute chat',
  color: '#0066cc'
});
```

### List Upcoming Events

```javascript
const events = await callTool('calendly_list_events', {
  user: 'https://api.calendly.com/users/AAAA',
  min_start_time: new Date().toISOString(),
  status: 'active',
  sort: 'start_time:asc'
});
```

### Create Webhook

```javascript
const webhook = await callTool('calendly_create_webhook', {
  url: 'https://example.com/webhook',
  events: ['invitee.created', 'invitee.canceled'],
  organization: 'https://api.calendly.com/organizations/AAAA',
  scope: 'organization'
});
```

### Generate Scheduling Link

```javascript
const link = await callTool('calendly_create_scheduling_link', {
  max_event_count: 1,
  owner: 'https://api.calendly.com/event_types/AAAA',
  owner_type: 'EventType'
});
```

## API Coverage

This MCP server covers **100% of Calendly API v2 endpoints**:

- ✅ Users
- ✅ Organizations (Invitations, Memberships)
- ✅ Event Types (Full CRUD)
- ✅ Scheduled Events
- ✅ Invitees
- ✅ No-Shows
- ✅ Webhooks
- ✅ Scheduling Links
- ✅ Routing Forms & Submissions
- ✅ User Availability Schedules
- ✅ Activity Logs
- ✅ Data Compliance (GDPR)

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

## Architecture

```
src/
├── server.ts              # MCP server setup
├── main.ts                # Entry point
├── clients/
│   └── calendly.ts        # Calendly API client
├── tools/                 # Tool definitions by domain
│   ├── users-tools.ts
│   ├── organizations-tools.ts
│   ├── event-types-tools.ts
│   ├── events-tools.ts
│   ├── invitees-tools.ts
│   ├── webhooks-tools.ts
│   ├── scheduling-tools.ts
│   ├── routing-forms-tools.ts
│   ├── availability-tools.ts
│   └── compliance-tools.ts
├── types/
│   └── index.ts           # TypeScript interfaces
└── ui/
    └── react-app/         # React apps
        ├── src/
        │   ├── apps/      # Individual apps
        │   ├── components/ # Shared components
        │   ├── hooks/     # Shared hooks
        │   └── styles/    # Shared styles
        └── package.json
```

## License

MIT

## Support

For issues or questions:
- GitHub: [BusyBee3333/mcpengine](https://github.com/BusyBee3333/mcpengine)
- Calendly API Docs: [https://developer.calendly.com](https://developer.calendly.com)

## Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using the Model Context Protocol
