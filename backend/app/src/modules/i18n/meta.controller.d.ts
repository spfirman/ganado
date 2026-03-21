export declare class MetaController {
    getMeta(): {
        hostname: string;
        environment: string;
        version: string;
        git: {
            commit: string;
            branch: string;
            tag: string;
        };
        docker: {
            image: string;
            containerId: string;
        };
        runtime: {
            node: string;
            platform: NodeJS.Platform;
            arch: NodeJS.Architecture;
            pid: number;
        };
        uptime: {
            seconds: number;
            formatted: string;
            startedAt: string;
        };
        features: {
            mqtt: boolean;
            massEvents: boolean;
        };
        timestamp: string;
    };
    getMetrics(): {
        success: boolean;
        data: {
            timestamp: string;
            system: {
                hostname: string;
                platform: NodeJS.Platform;
                arch: string;
                cpuCount: number;
                cpuModel: string;
                loadAverage: number[];
                memoryTotal: number;
                memoryFree: number;
                memoryUsedPercent: string;
                osUptime: number;
                osUptimeHuman: string;
            };
            process: {
                pid: number;
                nodeVersion: string;
                uptime: number;
                uptimeHuman: string;
                memoryRss: number;
                memoryHeapUsed: number;
                memoryHeapTotal: number;
                memoryExternal: number;
            };
            environment: {
                nodeEnv: string;
                appVersion: string;
                gitCommit: string;
                gitBranch: string;
                buildTime: string;
            };
        };
    };
}
