import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import Config from "../config";
import Logger from "../lib/logger";

const MAX_SAFE_LINES = Number.MAX_SAFE_INTEGER - 1000; // 安全行数阈值
const MAX_DURATION_MS = 12 * 60 * 60 * 1000;          // 12小时限制

export class LoggerHandler {
    private path: string;
    private currentFile: string = '';
    private lineCount: number = 0;
    private startTime: number = 0;
    private writeStream: ReturnType<typeof createWriteStream> | null = null;

    constructor(private logger: Logger) {
        this.path = Config.logPath;
        if(Config.logToFile){
            this.path = Config.logPath;
            this.initializeLogSystem();
        }

        logger.on('message', logData => {
            // 控制台输出原始日志对象
            if (Config.logOnConsole) {
                console.log(logData);
            }

            if (Config.logToFile) {
                // 文件记录处理
                this.checkFileRotation();
                this.writeToFile(logData);
            }
        });
    }

    private initializeLogSystem(): void {
        this.rotateLogFile();
        if (!existsSync(this.path)) {
            mkdirSync(this.path, { recursive: true });
        }
    }

    private generateFilename(): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const now = new Date();
        return [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate()),
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join('') + '.log';
    }

    private rotateLogFile(): void {
        if (this.writeStream) {
            this.writeStream.end();
        }

        this.currentFile = join(this.path, this.generateFilename());
        this.writeStream = createWriteStream(this.currentFile, {
            flags: 'a',
            encoding: 'utf8'
        });

        this.startTime = Date.now();
        this.lineCount = 0;
    }

    private checkFileRotation(): void {
        const isLineLimit = this.lineCount >= MAX_SAFE_LINES;
        const isTimeLimit = (Date.now() - this.startTime) > MAX_DURATION_MS;

        if (isLineLimit || isTimeLimit) {
            console.log(`Rotating log file due to ${isLineLimit ? 'line limit' : 'time limit'}`);
            this.rotateLogFile();
        }
    }

    private writeToFile(logData: any): void {
        const entry = (this.lineCount + 1) + "|" + JSON.stringify({
            ...logData
        }) + '\n';

        (this.writeStream as ReturnType<typeof createWriteStream>).write(entry);
        this.lineCount++;
    }
}
