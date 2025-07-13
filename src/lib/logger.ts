export type LogData = {
    level: string;
    message: string;
    timestamp: number;
};

class Logger {
    private listeners: { [key: string]: ((data: LogData) => void)[] } = {};

    public info(message: string): void {
        this.emitLog('info', message);
    }

    public error(message: string): void {
        this.emitLog('error', message);
    }

    public warn(message: string): void {
        this.emitLog('warn', message);
    }

    public log(key: string, message: string): void {
        this.emitLog(key, message);
    }

    public on(event: string, callback: (data: LogData) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    private emitLog(level: string, message: string): void {
        const logData: LogData = {
            level,
            message,
            timestamp: Date.now()
        };

        // 触发特定等级事件
        this.emit(level, logData);
        // 触发全局消息事件
        this.emit('message', logData);
    }

    private emit(event: string, data: LogData): void {
        (this.listeners[event] || []).forEach(callback => callback(data));
    }
}

export default Logger