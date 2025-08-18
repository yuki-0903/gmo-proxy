export interface LogData {
  message: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  timestamp: string;
  meta?: Record<string, any>;
}

export class Logger {
  private formatLog(data: LogData): string {
    return JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  info(message: string, meta?: Record<string, any>) {
    const logData: LogData = {
      message,
      level: 'info',
      timestamp: new Date().toISOString(),
      meta
    };
    console.log(this.formatLog(logData));
  }

  warn(message: string, meta?: Record<string, any>) {
    const logData: LogData = {
      message,
      level: 'warn',
      timestamp: new Date().toISOString(),
      meta
    };
    console.warn(this.formatLog(logData));
  }

  error(message: string, meta?: Record<string, any>) {
    const logData: LogData = {
      message,
      level: 'error',
      timestamp: new Date().toISOString(),
      meta
    };
    console.error(this.formatLog(logData));
  }

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const logData: LogData = {
        message,
        level: 'debug',
        timestamp: new Date().toISOString(),
        meta
      };
      console.debug(this.formatLog(logData));
    }
  }
}

export const logger = new Logger();