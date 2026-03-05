import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as os from 'os';

const startedAt = new Date();

@ApiTags('System')
@Controller()
export class MetaController {
  @Get('/__meta')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Runtime metadata (admin only)' })
  getMeta() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return {
      hostname: os.hostname(),
      environment: process.env.NODE_ENV || process.env.ENVIRONMENT || 'development',
      version: process.env.APP_VERSION || '0.1.0',
      git: {
        commit: process.env.GIT_COMMIT || 'unknown',
        branch: process.env.GIT_BRANCH || 'unknown',
        tag: process.env.GIT_TAG || '',
      },
      docker: {
        image: process.env.DOCKER_IMAGE || '',
        containerId: os.hostname(),
      },
      runtime: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
      },
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${hours}h ${minutes}m ${seconds}s`,
        startedAt: startedAt.toISOString(),
      },
      features: {
        mqtt: process.env.MQTT_ENABLED === 'true',
        massEvents: process.env.MASS_EVENTS_ENABLED !== 'false',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api/v1/admin/metrics')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin system metrics' })
  getMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpus = os.cpus();
    const memUsage = process.memoryUsage();
    const uptimeSec = process.uptime();
    const d = Math.floor(uptimeSec / 86400);
    const h = Math.floor((uptimeSec % 86400) / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const uptimeHuman = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;

    return {
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        system: {
          hostname: os.hostname(),
          platform: os.platform(),
          arch: os.arch(),
          cpuCount: cpus.length,
          cpuModel: cpus[0]?.model,
          loadAverage: os.loadavg(),
          memoryTotal: totalMem,
          memoryFree: freeMem,
          memoryUsedPercent: ((totalMem - freeMem) / totalMem * 100).toFixed(1),
          osUptime: os.uptime(),
          osUptimeHuman: uptimeHuman,
        },
        process: {
          pid: process.pid,
          nodeVersion: process.version,
          uptime: uptimeSec,
          uptimeHuman,
          memoryRss: memUsage.rss,
          memoryHeapUsed: memUsage.heapUsed,
          memoryHeapTotal: memUsage.heapTotal,
          memoryExternal: memUsage.external,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          appVersion: process.env.APP_VERSION || '0.0.1',
          gitCommit: process.env.GIT_COMMIT || 'dev',
          gitBranch: process.env.GIT_BRANCH || 'unknown',
          buildTime: process.env.BUILD_TIME || 'unknown',
        },
      },
    };
  }
}
