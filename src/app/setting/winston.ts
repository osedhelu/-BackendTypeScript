import * as winston from 'winston';
import { WinstonInter } from '../interfaces/winston';
export default class WinstonLog {
  public winston = winston;
  public _console!: WinstonInter
  constructor() {
    const { format, transports } = this.winston;
    const logFormat = format.printf((info: any) => {
      if (info.level==='info') {
        return `${info.timestamp} \x1b[34m${info.level}\x1b[0m:  \n\x1b[44m\x1b[30m${info.message}\x1b[0m`
      }
      if (info.level==='error') {
        return `${info.timestamp} \x1b[31m${info.level}\x1b[0m: \n\x1b[41m${info.message}\x1b[0m`
      }
      if (info.level==='debug') {
        return `${info.timestamp} \x1b[33m\x1b[30m${info.level}\x1b[0m: \n\x1b[42m\x1b[30m${info.message}\x1b[0m`
      }
      if (info.level==='warn') {
        return `${info.timestamp} \x1b[32m${info.level}\x1b[0m: \n\x1b[42m\x1b[30m${info.message}\x1b[0m`
      }
      if (info.level==='http') {
        return `${info.timestamp} \x1b[32m${info.level}\x1b[0m: \n\x1b[35m\x1b[4m${info.message}\x1b[0m`
      }
      return info
    })
    this._console = this.winston.createLogger({
      // level: 'desarrollo' === 'production' ? 'info' : 'debug',
      format: format.combine(
        // format.label({ label: path.basename(module.parent.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Format the metadata object
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
      ),
      transports: [
        new transports.File({
          filename: `${__dirname}/../logs/log-api.log`,
          format: format.combine(
            // Render in one line in your log file.
            // If you use  here it will be really
            // difficult to exploit your logs files afterwards.
            format.prettyPrint()
          )
        }),
        new transports.Console({
          format: format.combine(
            logFormat,
            format.splat(),
          )
        })

      ],
      exitOnError: false
    })

  }


}