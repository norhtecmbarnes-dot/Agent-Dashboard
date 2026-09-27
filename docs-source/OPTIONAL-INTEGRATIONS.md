# Optional Integrations Guide

This document covers optional integrations that require additional setup and are not included in the default AI Dashboard installation.

---

## Agent Zero Integration

Agent Zero is a powerful autonomous AI agent that runs in an isolated Docker container. It provides secure shell access, Python execution, and multi-agent orchestration capabilities.

### Why Agent Zero?

- **Secure Isolation**: All operations run in a Docker container, keeping your main system safe
- **Full Stack Capabilities**: Shell commands, Python scripts, file operations
- **Autonomous Agents**: Multi-agent task orchestration for complex workflows
- **API Communication**: Clean REST API interface for easy integration

### Prerequisites

1. Docker installed on your system
2. At least 4GB RAM available for the container
3. Network access between AI Dashboard and Agent Zero container

### Installation

#### 1. Build or Pull Agent Zero Image

```bash
# Option A: Pull from registry (if available)
docker pull ghcr.io/agent-zero/agent-zero:latest

# Option B: Build from source
git clone https://github.com/your-org/agent-zero.git
cd agent-zero
docker build -t agent-zero:latest .
```

#### 2. Create Configuration

Create `agent-zero-config.yaml`:

```yaml
server:
  port: 8080
  host: 0.0.0.0

security:
  api_key: ${AGENT_ZERO_API_KEY}
  allowed_origins:
    - http://localhost:3000

limits:
  timeout_ms: 60000
  max_file_size_mb: 50
  max_concurrent_tasks: 5

capabilities:
  shell: true
  python: true
  agent: true
  file_ops: true
  web: true
```

#### 3. Run the Container

```bash
docker run -d \
  --name agent-zero \
  -p 8080:8080 \
  -v agent-zero-data:/data \
  -v $(pwd)/agent-zero-config.yaml:/app/config.yaml \
  -e AGENT_ZERO_API_KEY=your-secure-api-key-here \
  --restart unless-stopped \
  agent-zero:latest
```

#### 4. Configure AI Dashboard

Add to your `.env` file:

```env
# Agent Zero Configuration
AGENT_ZERO_API_URL=http://localhost:8080
AGENT_ZERO_API_KEY=your-secure-api-key-here
```

#### 5. Verify Connection

```bash
# Check Agent Zero status
curl http://localhost:8080/api/status

# Expected response:
# {"version": "1.0.0", "capabilities": ["shell", "python", "agent", "file"]}
```

### Usage

#### Via Chat Commands

```
/agent shell: ls -la
/agent python: import os; print(os.getcwd())
/agent task: Find all PDF files in /data and summarize their content
```

#### Programmatically

```typescript
import { agentZeroService } from '@/lib/integrations/agent-zero';

// Check connection
const status = await agentZeroService.checkStatus();
if (!status.connected) {
  console.error('Agent Zero not available');
}

// Execute shell command (runs in container)
const result = await agentZeroService.executeShell('ls -la /data');
console.log(result.stdout);

// Run Python code
const pythonResult = await agentZeroService.executePython(`
import pandas as pd
df = pd.read_csv('/data/sales.csv')
print(df.describe())
`);

// Run autonomous agent task
const agentResult = await agentZeroService.runAgentTask(
  'Analyze all log files in /var/log and create a summary report',
  { maxSteps: 20, timeout: 120000 }
);
```

### API Endpoints

The Agent Zero service exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Connection status and capabilities |
| `/api/sessions` | POST | Create isolated session |
| `/api/execute/shell` | POST | Execute shell command |
| `/api/execute/python` | POST | Execute Python code |
| `/api/agent/task` | POST | Run autonomous agent task |
| `/api/files/read` | POST | Read file content |
| `/api/files/write` | POST | Write file content |
| `/api/files/list` | POST | List directory contents |
| `/api/files/delete` | POST | Delete file |

### Security Considerations

- **Container Isolation**: Agent Zero runs in Docker, so shell commands cannot access your host machine
- **API Key Authentication**: All requests require the API key
- **Rate Limiting**: Configure limits in `agent-zero-config.yaml`
- **Network**: Agent Zero should not be exposed to the public internet

### Troubleshooting

**Container won't start:**
```bash
docker logs agent-zero
# Check for port conflicts or missing configuration
```

**Connection refused:**
```bash
# Verify container is running
docker ps | grep agent-zero

# Check port binding
docker port agent-zero
```

**Authentication errors:**
- Verify `AGENT_ZERO_API_KEY` matches in both container and AI Dashboard

---

## Remotion Video Generation

Remotion allows programmatic video creation using React components. This integration enables AI-generated videos.

### Why Remotion?

- **Programmatic Videos**: Create videos from templates using code
- **React Components**: Use familiar React patterns for video composition
- **AI Integration**: Generate video content dynamically from AI
- **High Quality**: Output MP4, WebM, GIF formats

### Prerequisites

1. Node.js 18+ installed
2. FFmpeg for video encoding
3. Remotion license (for commercial use)

### Installation

#### 1. Install Remotion Server

```bash
# Create Remotion project
npx create-video@latest ai-dashboard-videos

# Navigate to project
cd ai-dashboard-videos

# Install dependencies
npm install @remotion/player @remotion/cli @remotion/renderer
```

#### 2. Configure Remotion Server

Create `remotion.config.ts`:

```typescript
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCpuUsage('maximum');
```

#### 3. Start Remotion Studio (for development)

```bash
npx remotion studio
```

#### 4. Start Remotion Server (for production)

```bash
# Build renderer
npx remotion bundle

# Start server
npx remotion render-server --port 3001
```

#### 5. Configure AI Dashboard

Add to your `.env` file:

```env
# Remotion Configuration
REMOTION_API_URL=http://localhost:3001
REMOTION_API_KEY=your-api-key-here
REMOTION_WEBHOOK_URL=http://localhost:3000/api/remotion/callback
```

### Usage

#### Via Chat Commands

```
/video create presentation --template business-pitch --duration 60
/video create slideshow --images /data/images --music background.mp3
/video render --id video_abc123 --format mp4
```

#### Programmatically

```typescript
import { remotionService } from '@/lib/integrations/remotion';

// Create video from template
const video = await remotionService.createVideo({
  template: 'presentation',
  composition: 'BusinessPitch',
  props: {
    title: 'Q4 Sales Report',
    slides: [
      { title: 'Overview', content: '...' },
      { title: 'Revenue', content: '...' },
    ],
    duration: 60,
  },
  format: 'mp4',
  quality: 'high',
});

// Check render status
const status = await remotionService.getRenderStatus(video.renderId);
console.log(status.progress); // 0-100

// Download completed video
const downloadUrl = await remotionService.getDownloadUrl(video.renderId);
```

### Video Templates

#### Business Pitch Template

```typescript
// templates/BusinessPitch.tsx
import { Composition } from 'remotion';

export const BusinessPitchComposition = () => {
  return (
    <Composition
      id="BusinessPitch"
      component={BusinessPitch}
      durationInFrames={900} // 30 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

const BusinessPitch: React.FC<{ title: string; slides: Slide[] }> = ({
  title,
  slides,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TitleSlide title={title} />
      {slides.map((slide, i) => (
        <ContentSlide key={i} slide={slide} index={i} />
      ))}
    </AbsoluteFill>
  );
};
```

#### Slideshow Template

```typescript
// templates/Slideshow.tsx
export const SlideshowComposition = () => {
  return (
    <Composition
      id="Slideshow"
      component={ImageSlideshow}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### API Reference

| Method | Description |
|--------|-------------|
| `createVideo(options)` | Create video from template |
| `getRenderStatus(renderId)` | Check render progress |
| `getDownloadUrl(renderId)` | Get download link |
| `listTemplates()` | List available templates |
| `previewTemplate(templateId)` | Preview in browser |
| `cancelRender(renderId)` | Cancel active render |

### Best Practices

1. **Limit Video Length**: Keep videos under 5 minutes for faster rendering
2. **Optimize Assets**: Use compressed images and audio
3. **Use Templates**: Pre-built templates render faster than custom compositions
4. **Async Processing**: Videos render asynchronously; use webhooks for completion
5. **Quality Settings**: Use 'medium' for previews, 'high' for final output

### Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Best Practices](https://skills.sh/remotion-dev/skills/remotion-best-practices)
- [Template Gallery](https://www.remotion.dev/templates)

---

## Configuration Summary

### Environment Variables

Add these to `.env` for optional integrations:

```env
# Agent Zero (Optional)
AGENT_ZERO_API_URL=http://localhost:8080
AGENT_ZERO_API_KEY=your-secure-api-key

# Remotion (Optional)
REMOTION_API_URL=http://localhost:3001
REMOTION_API_KEY=your-api-key
REMOTION_WEBHOOK_URL=http://localhost:3000/api/remotion/callback
```

### Docker Compose (Optional)

For easier management, use Docker Compose:

```yaml
# docker-compose.optional.yml
version: '3.8'

services:
  agent-zero:
    image: agent-zero:latest
    container_name: agent-zero
    ports:
      - "8080:8080"
    volumes:
      - agent-zero-data:/data
      - ./agent-zero-config.yaml:/app/config.yaml
    environment:
      - AGENT_ZERO_API_KEY=${AGENT_ZERO_API_KEY}
    restart: unless-stopped
    networks:
      - ai-dashboard-network

  remotion:
    image: remotion/render-server
    container_name: remotion-server
    ports:
      - "3001:3001"
    environment:
      - REMOTION_API_KEY=${REMOTION_API_KEY}
    restart: unless-stopped
    networks:
      - ai-dashboard-network

volumes:
  agent-zero-data:

networks:
  ai-dashboard-network:
    external: true
```

Start optional services:

```bash
docker-compose -f docker-compose.optional.yml up -d
```

---

## Need Help?

- **Agent Zero Issues**: Check container logs with `docker logs agent-zero`
- **Remotion Issues**: Verify FFmpeg is installed and Remotion server is running
- **Configuration Help**: See the main documentation at `/docs`