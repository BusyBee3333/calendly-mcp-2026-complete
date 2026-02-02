> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/calendly)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 📅 Calendly MCP Server — Scheduling Intelligence on Autopilot

## 💡 What This Unlocks

**This MCP server gives AI direct access to your Calendly scheduling data.** Stop manually checking calendars, canceling events, or digging through invitee lists. Ask Claude questions in plain English, and get instant answers.

### 🎯 Calendly-Specific Power Moves

| Use Case | What It Does | Tools Used |
|----------|-------------|-----------|
| **Meeting audit** | Pull all scheduled events for a date range with invitees | `list_events`, `list_invitees` |
| **Bulk cancellations** | Cancel multiple meetings (e.g., all on a specific day) | `list_events`, `cancel_event` |
| **Availability planning** | Check open slots for an event type before booking | `list_event_types`, `get_availability` |
| **Invitee tracking** | See who's booked which events, track no-shows | `list_events`, `list_invitees` |
| **Event type management** | List all your event types and their configurations | `list_event_types`, `get_user` |

### 🔗 The Real Power: Natural Language Scheduling Ops

Instead of clicking through Calendly dashboards:

- *"Show me all events scheduled for this week"*
- *"Cancel my 3pm meeting tomorrow with a note saying I'm sick"*
- *"What times are available for my '30 Minute Meeting' next Friday?"*
- *"Who's booked calls with me in the last 7 days?"*
- *"List all my event types"*

## 📦 What's Inside

**7 scheduling-focused API tools** covering Calendly's core functionality:

- **Events:** `list_events`, `get_event`, `cancel_event` — Scheduled meetings and cancellations
- **Event Types:** `list_event_types`, `get_availability` — Meeting templates and open slots
- **Invitees:** `list_invitees` — Who's booked what
- **User:** `get_user` — Your account information

All with personal access token authentication, proper error handling, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Recommended)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Calendly-MCP-2026-Complete.git
   cd calendly-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Calendly API key:**
   - Log into Calendly
   - Go to [Integrations → API & Webhooks](https://calendly.com/integrations/api_webhooks)
   - Click **"Get a Personal Access Token"**
   - Copy your token

3. **Configure Claude Desktop:**
   
   **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "calendly": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/calendly-mcp-2026-complete/dist/index.js"],
         "env": {
           "CALENDLY_API_KEY": "your-personal-access-token"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop** — you'll see 7 Calendly tools appear in the MCP section

### Option 2: Local Development

```bash
cp .env.example .env
# Edit .env with your Calendly API key
npm run dev
```

## 🔐 Authentication

Calendly uses **Personal Access Tokens** for API authentication:

1. Log into [Calendly](https://calendly.com/)
2. Navigate to **Integrations** → **API & Webhooks**
3. Click **"Get a Personal Access Token"**
4. Copy the token and set it as `CALENDLY_API_KEY`

**API Docs:** [https://developer.calendly.com/](https://developer.calendly.com/)

**⚠️ Security:** Keep your access token secret! It provides full access to your Calendly account.

## 🎯 Example Prompts

Once connected to Claude:

**Event Management:**
- *"List all events scheduled for next week"*
- *"Show me details for event UUID abc123"*
- *"Cancel event xyz789 with reason 'emergency conflict'"*
- *"What events do I have today?"*

**Availability:**
- *"Show me all my event types"*
- *"What time slots are available for '30 Minute Meeting' on Friday?"*
- *"Check availability for my 'Sales Demo' event type next Monday"*

**Invitee Tracking:**
- *"List all invitees for event abc123"*
- *"Who booked calls with me this week?"*
- *"Show me all canceled invitees"*

**User Info:**
- *"Get my Calendly user information"*
- *"What's my scheduling link?"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Calendly account (free or paid)

### Local Setup

```bash
git clone https://github.com/BusyBee3333/Calendly-MCP-2026-Complete.git
cd calendly-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Personal Access Token
npm run build
npm start
```

### Project Structure

```
calendly-mcp-2026-complete/
├── src/
│   └── index.ts          # Main MCP server + Calendly API client
├── dist/                 # Compiled JavaScript (npm run build)
├── package.json
├── tsconfig.json
└── .env.example
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Calendly API error: 401 Unauthorized"
- Your access token is invalid or missing
- Generate a new Personal Access Token in Calendly
- Verify you've set `CALENDLY_API_KEY` correctly in your config

### "Calendly API error: 404 Not Found"
- The event UUID or resource doesn't exist
- Check that you're using the correct UUID (not the event name)
- UUIDs look like: `abc123de-f456-7890-gh12-ijklmnop3456`

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating `claude_desktop_config.json`
- Verify the path is **absolute** (no `~` or relative paths)
- Check that `npm run build` completed successfully
- Look for the `dist/index.js` file

### "event_uuid required"
- Most event-specific calls need an event UUID
- Get UUIDs via `list_events()` first
- The UUID is in the event's `uri` field (last part of the URL)

## 📖 Resources

- [Calendly API Documentation](https://developer.calendly.com/)
- [API & Webhooks Settings](https://calendly.com/integrations/api_webhooks)
- [API Reference](https://developer.calendly.com/api-docs)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Setup](https://claude.ai/desktop)

## 🤝 Contributing

Contributions welcome! To add new Calendly API endpoints:

1. Fork the repo
2. Add tool definitions to `src/index.ts` (tools array)
3. Implement handlers in `handleTool()` function
4. Update README with new capabilities
5. Submit a PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

**Want more MCP servers?** Check out our [full catalog](https://mcpengage.com) covering 30+ business platforms (Toast, Gusto, Stripe, QuickBooks, and more).

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
