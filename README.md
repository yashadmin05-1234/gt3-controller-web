# GT3 Controller Web

Next.js dashboard for managing GT3 remote desktop sessions.

## Features

- **Session Management**: Create, view, and close remote desktop sessions
- **Real-time Updates**: Auto-polling every 5 seconds for session status
- **Agent Download**: One-click PowerShell command generation
- **Click-to-Copy**: Easy session ID and token copying
- **Railway Integration**: Connects to hosted signaling server

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Server-side API routes

## Environment Variables

```env
# Optional - override the default Railway URL
NEXT_PUBLIC_SIGNALING_SERVER=https://gt3-signal.up.railway.app
SIGNALING_SERVER=https://gt3-signal.up.railway.app
```

If not set, defaults to `SERVER_URL` in `src/config/server.ts`.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yashadmin05-1234/gt3-controller-web)

### Manual Deploy

1. Go to https://vercel.com/new
2. Import `yashadmin05-1234/gt3-controller-web`
3. Configure (optional):
   - Add environment variables if using custom signaling server
   - Framework preset: Next.js (auto-detected)
4. Click **Deploy**

Vercel will automatically:
- Detect Next.js
- Run `npm install`
- Run `npm run build`
- Deploy to a public URL

### Environment Variables (Optional)

Only needed if using a different signaling server:

```
NEXT_PUBLIC_SIGNALING_SERVER=https://your-custom-server.com
SIGNALING_SERVER=https://your-custom-server.com
```

## Usage

1. Open the deployed dashboard
2. Click **"Create Session"**
3. Copy the PowerShell command
4. Run on the source machine (Windows PC to be controlled)
5. Copy the Session ID
6. Enter Session ID in the GT3 client app
7. Connect and control remotely

## Architecture

- **Dashboard**: Real-time session list with status indicators
- **Session Creator**: Generates tokens and agent commands
- **Agent Download Modal**: Shows download link and run instructions
- **API Routes**: Server-side session management via signaling server

## Session States

- 🟡 **waiting** - Created, no peers connected
- 🔵 **connecting** - One peer joined
- 🟢 **active** - Both source and client connected
- ⚫ **closed** - Session terminated

## Related Repositories

- [gt3-signaling](https://github.com/yashadmin05-1234/gt3-signaling) - Signaling server
- [gt3-launcher](https://github.com/yashadmin05-1234/gt3-launcher) - PowerShell launcher script

## License

MIT
