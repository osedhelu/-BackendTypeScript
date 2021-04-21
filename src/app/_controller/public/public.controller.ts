import { Socket } from 'socket.io';
import { PublicNodel } from './public.model';
const model = new PublicNodel();

export class PublicController {
  constructor(public socket: Socket) {
    socket.on('list_empresa', async (emit: any, callback: any) => {
      try {
        // console.log(emit);

        const { ok, data, message } = await model.listEmpresa(emit);

        if (ok) {
          callback({ ok, data });
        } else {
          callback({ ok, message });
        }
      } catch (erro) {
        callback({ ok: false, message: erro });
      }
    });

    socket.on('loginSeccion', async (resp: any, callback) => {
      try {
        const data = await model.initSeccion(resp)
        callback(data)
    } catch (error) {
        callback({ ok: false, message: error });
      }
    });
  }
}
