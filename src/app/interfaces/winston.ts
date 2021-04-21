export interface WinstonInter {
    info: LeveledLogMethod,
    debug: LeveledLogMethod,
    error: LeveledLogMethod,
    warn: LeveledLogMethod,
    http: LeveledLogMethod,
    
}
export interface Wso {
    info: {
        level: any,
    },
    timestamp: any,
    level: any
}
export interface LeveledLogMethod {
    (message: string, callback: LogCallback): void;
    (message: string, meta: any, callback: LogCallback): void;
    (message: string, ...meta: any[]): void;
    (message: any): void;
  }

  type LogCallback = (error?: any, level?: string, message?: string, meta?: any) => void;
