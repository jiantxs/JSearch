import { Request } from 'express';

class WebLog {
    private path: string;
    private method: string;
    private params: object;
    private body: object;
    private time: string;
    private query: object;

    constructor(private req: Request) {
        this.path = req.path;
        this.method = req.method;
        this.params = req.params;
        this.body = req.body;
        this.query = req.query;

        // 创建标准北京时间 (无需本地时区转换)
        const beijingOffset = 8 * 60 * 60 * 1000; // UTC+8 毫秒数
        const utcTimestamp = Date.now(); // 获取UTC时间戳
        const beijingTimestamp = utcTimestamp + beijingOffset;

        // 转换为北京时间对象
        const beijingDate = new Date(beijingTimestamp);

        // 获取标准化时间组件
        const year = beijingDate.getUTCFullYear();
        const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(beijingDate.getUTCDate()).padStart(2, '0');
        const hours = String(beijingDate.getUTCHours()).padStart(2, '0');
        const minutes = String(beijingDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(beijingDate.getUTCSeconds()).padStart(2, '0');

        // 组合成标准格式
        this.time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    }


    public logString(): string {
        return `Request arrived:
            1    time: ${this.time}
            2    path: ${this.path}
            3    method: ${this.method}
            4    params: ${JSON.stringify(this.params)}
            5    body: ${JSON.stringify(this.body)}
            6    query: ${JSON.stringify(this.query)}
        `;
    }
}

class Logger {
    private onMessage: (message: string) => void = () => { };

    private onLine: (line: string) => void = () => { };


    constructor() {

    }

    public on(event: 'line' | 'message', listener: (line: string) => void) {
        switch (event) {
            case 'line':
                this.onLine = listener
                break
            case 'message':
                this.onMessage = listener
                break
            default:
                break
        }
    }

    public log(req: Request): void {
        const webLog = new WebLog(req)
        const message = webLog.logString()
        this.onMessage(message)
        let lines = message.split('\n')
        lines.forEach(line => {
            this.onLine(line)
        })
    }
}

export default Logger
export { WebLog }