# Starting and Stopping AI Dashboard

## Overview

AI Dashboard has a comprehensive system control mechanism that allows you to start and stop all processes from both the UI and API.

---

## Quick Start

### From the UI

1. Navigate to **Settings** → **System Control** or go directly to `/system`
2. Click **Start All Services** to initialize everything
3. Monitor the status of each service in real-time
4. Click **Stop All Services** to gracefully shut down

### From the API

```bash
# Start all services
curl -X POST http://localhost:3000/api/system \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'

# Stop all services  
curl -X POST http://localhost:3000/api/system \
  -H "Content-Type: application/json" \
  -d '{"action": "shutdown"}'

# Restart all services
curl -X POST http://localhost:3000/api/system \
  -H "Content-Type: application/json" \
  -d '{"action": "restart"}'

# Check system status
curl http://localhost:3000/api/system?action=status

# Check if system is running
curl http://localhost:3000/api/system?action=isRunning

# Health check
curl http://localhost:3000/api/system?action=health
```

---

## Services Managed

When you start the system, the following services are initialized in order:

### 1. Database
- **File:** `src/lib/database/sqlite.ts`
- **Purpose:** SQLite persistence layer
- **Status:** Required - must be running for most features

### 2. Memory Service
- **File:** `src/lib/services/memory-file.ts`
- **Purpose:** Loads MEMORY.md and SOUL.md for persistent context
- **Status:** Optional - falls back to defaults if not loaded

### 3. Task Scheduler
- **File:** `src/lib/services/task-scheduler.ts`
- **Purpose:** Runs scheduled tasks (intelligence, security, reflection, etc.)
- **Status:** Background - runs tasks based on schedule

### 4. Security Scanner
- **File:** `src/lib/agent/security-agent.ts`
- **Purpose:** Periodic vulnerability scanning
- **Status:** Event-driven - triggered by task scheduler

### 5. Intelligence Service
- **File:** `src/lib/intelligence/report-generator.ts`
- **Purpose:** Daily intelligence reports
- **Status:** Event-driven - triggered by task scheduler

---

## Task Scheduler Control

The task scheduler can be controlled independently:

```bash
# Check scheduler status
curl http://localhost:3000/api/tasks?action=status

# Start scheduler only
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'

# Stop scheduler only
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"action": "stop"}'

# List all tasks
curl http://localhost:3000/api/tasks?action=list

# Run a specific task immediately
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"action": "run", "id": "task-id"}'
```

---

## Startup Sequence

When you click **Start All Services**:

```
1. Database Initialize
   └── Creates tables if needed
   └── Opens SQLite connection

2. Memory Service Load
   └── Reads data/MEMORY.md
   └── Reads data/SOUL.md
   └── Falls back to defaults if not found

3. Task Scheduler Initialize
   └── Ensures default tasks exist
   └── Start interval timer (1 minute checks)

4. Security Scanner Ready
   └── Waiting for scheduled task

5. Intelligence Service Ready
   └── Waiting for scheduled task
```

---

## Shutdown Sequence

When you click **Stop All Services**:

```
1. Task Scheduler Stop
   └── Clear interval timer
   └── No new tasks will run

2. Close Database
   └── Flush pending writes
   └── Close SQLite connection

3. Mark Services Stopped
   └── Update all service statuses
```

---

## Environment Variables

No additional environment variables needed. The system uses:
- `data/assistant.db` - SQLite database
- `data/MEMORY.md` - Persistent memory
- `data/SOUL.md` - AI personality

---

## Programmatic Control

### In Node.js/Next.js

```typescript
import { systemManager } from '@/lib/system/manager';

// Start system
await systemManager.start();

// Check status
const status = systemManager.getStatus();
console.log(status.running);

// Stop system
await systemManager.shutdown();

// Register custom service
systemManager.registerService('myService', async () => {
  // Initialization logic
});

// Register shutdown hook
systemManager.registerShutdownHook(async () => {
  // Cleanup logic
});
```

### Task Scheduler

```typescript
import { taskScheduler } from '@/lib/services/task-scheduler';

// Initialize and start
await taskScheduler.initialize();
taskScheduler.start();

// Check status
const { isRunning } = taskScheduler.getStatus();

// Stop
taskScheduler.stop();

// Run task immediately
await taskScheduler.runTaskNow('task-id');

// Get all tasks
const tasks = taskScheduler.getTasks();

// Get task templates
const templates = taskScheduler.getTaskTemplates();
```

---

## Troubleshooting

### System won't start

1. Check database file permissions: `data/assistant.db`
2. Check if another process is using the database
3. Review logs for error messages

### Services show "error" status

1. Check console output for detailed errors
2. Verify all dependencies are installed (`npm install`)
3. Verify database is not corrupted

### Task scheduler not running tasks

1. Verify scheduler is started: `/api/tasks?action=status`
2. Check task is enabled in database
3. Verify task schedule is valid

---

## Default Tasks

The following tasks are created by default:

| Task | Type | Schedule | Enabled |
|------|------|----------|---------|
| Intelligence Report | intelligence | daily | Yes |
| Security Scan | security | every:12:hours | Yes |
| Research Agent | research | every:24:hours | No |
| Self-Reflection | reflection | every:6:hours | Yes |

---

## Health Endpoint

Use the health endpoint for monitoring:

```bash
curl http://localhost:3000/api/system?action=health
```

Response:
```json
{
  "healthy": true,
  "services": [
    { "name": "Database", "status": "running" },
    { "name": "Memory Service", "status": "running" },
    { "name": "Task Scheduler", "status": "running" },
    { "name": "Security Scanner", "status": "running" },
    { "name": "Intelligence Service", "status": "running" }
  ]
}
```

---

## UI Navigation

- **Home Page:** System status widget in sidebar
- **Settings Page:** Full system control panel
- **System Page (`/system`):** Dedicated control dashboard
- **Tasks Page (`/tasks`):** Task scheduler management