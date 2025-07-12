import { Router, Request, Response, NextFunction } from 'express';
import Logger from '../lib/logger';
import Config from '../config';
import { createWriteStream, WriteStream } from 'fs';
import { join } from "path";

const logRouter = Router();
const logger = new Logger();

// 日志文件管理对象
const logManager = {
    currentStream: null as WriteStream | null,
    fileStartTime: Date.now(),
    lineNumber: 0,

    // 获取当前日志流
    getCurrentLogStream: async function () {
        const elapsed = Date.now() - this.fileStartTime;
        const hoursElapsed = elapsed / (1000 * 60 * 60);

        // 24小时轮转或计数器保护
        if (hoursElapsed >= 24 || this.lineNumber >= Number.MAX_SAFE_INTEGER - 1000) {
            await this.rotateLogFile();
        }
        return this.currentStream!;
    },

    // 轮转日志文件
    rotateLogFile: async function () {
        if (this.currentStream) {
            await new Promise((resolve) => this.currentStream!.end(resolve));
        }

        this.fileStartTime = Date.now();
        this.lineNumber = 0;
        const newPath = join(Config.logPath, `${this.fileStartTime}.log`);
        this.currentStream = createWriteStream(newPath, { flags: 'a' });

        // 添加错误处理
        this.currentStream.on('error', (error) => {
            console.error('Log stream error:', error);
        });
    }
};

// 初始化日志流
logManager.rotateLogFile();

// 安全的计数器递增
const safeIncrement = (current: number) => {
    return current < Number.MAX_SAFE_INTEGER ? current + 1 : 0;
};

// 日志写入处理
logger.on('line', async (str) => {
    try {
        const stream = await logManager.getCurrentLogStream();
        const logLine = `${logManager.lineNumber}|   ${str}\n`;

        console.log(logLine.trim());
        stream.write(logLine);

        logManager.lineNumber = safeIncrement(logManager.lineNumber);
    } catch (error) {
        console.error('Log write failed:', error);
    }
});

// 中间件
if (Config.log) {
    logRouter.get('/*', (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.log(req);
            next();
        } catch (error) {
            next(error);
        }
    });
} else {
    logRouter.get('/*', (req: Request, res: Response, next: NextFunction) => {
        next()
    });
}

export default logRouter;
