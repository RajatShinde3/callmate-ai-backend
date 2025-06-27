import express from 'express';

const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
  const uptime = process.uptime(); // in seconds
  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      readable: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Advanced health check (placeholder for database or AI service checks)
router.get('/detailed', async (req, res) => {
  // Example of how you might expand this:
  // const dbStatus = await checkDatabaseConnection();
  // const aiStatus = await checkAIModelAvailability();

  res.json({
    status: 'healthy',
    services: {
      api: 'operational',
      // db: dbStatus,
      // ai: aiStatus
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
