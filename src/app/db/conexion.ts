import { SqlInterface, SqlSchema } from '../interfaces/sql';
import * as _sql from 'mssql';
import { WinstonInter } from '../interfaces/winston';
import { Env } from '../../../env';
import WinstonLog from '../setting/winston';
import { MessageResponse } from '../interfaces/sockerResp';
const { _console } = new WinstonLog();
export class DbService {
  db = new Env()
  public async SQLConsult(xx: SqlInterface, type = 'json'): Promise<MessageResponse> {
    try {
      const pool = new _sql.ConnectionPool(this.db.configSQL);
      const conexion = await pool.connect();
      if (conexion) {
        const request = new _sql.Request(pool);
        const ssql = `exec AAProArtdecon '${xx.action}', '${JSON.stringify(xx.json)}'`;
        _console.warn(ssql)
        let data = await request.query(ssql)
        if(type === 'json') {
          const aa = data.recordset[0];
          data = JSON.parse(aa.data)
        }


        // if (type === 'json') {

        //   if (aa === undefined) {
        //     return [];
        //   } else {
        //     if (aa.data === undefined) {
        //       return result1.recordset;
        //     }
        //     if (aa.data === null) {
        //       return false;
        //     }
        //     const xxjson = aa.data === '' ? [] : JSON.parse(aa.data);
        //     return xxjson;
        //   }
        // }













        return { ok: true, data };
      }else{
        return { ok: false, message: 'Algo salio malll en la consulta' };

      }

      // //     // const pool = await _sql.connect(this.config);
      //     if (type === 'json') {
      //       _console.info(`${type} ->> ${ssql}`);

      //       const result1 = await pool.request().query(ssql);
      //       _console.info(`${result1}`);
      //       const aa = result1.recordset[0];
      //       if (aa === undefined) {
      //         return [];
      //       } else {
      //         if (aa.data === undefined) {
      //           return result1.recordset;
      //         }
      //         if (aa.data === null) {
      //           return false;
      //         }
      //         const xxjson = aa.data === '' ? [] : JSON.parse(aa.data);
      //         return xxjson;
      //       }
      //     }

      //     if (type === 'xml') {
      //     const bbsql = `select (${xx.action} for json path) data`
      //     _console.info(`${type} ->> ${bbsql}`)

      //     const result1 = await pool.request().query(bbsql);
      //     const aa = result1.recordset[0];
      //     const xxjson = JSON.parse(aa.data)
      //     return xxjson;

      // }
    } catch (error) {
        
        _console.error('Error ----->>>', error);
        return { ok: false, message: 'Error em la conexion' };
    }
  }
}
