import { Socket } from 'socket.io';
import WinstonLog from '../../setting/winston';
import { IndexController, SeccionController } from '../../_controller';
import { Token } from '../../_function';
const {_console} = new WinstonLog 


export class SocketService {
  public start(io: any) {
    io.on('connection', async (socket: Socket) => {
      const token = socket.handshake.headers['x-token'];
      if (token === 'login') {
            new IndexController(socket, io)
    } else {
        const jwt = new Token()
        const {ok, message, data} = jwt.validar(token)
        if(ok) {
          _console.info(`en linea ${data.NOMBRE}`)
          new SeccionController(socket, io, data)
        } else {
          socket.emit('my_info',{
            ok: false,
            message
          })
          _console.error('Error en el Token', message)
        }
      }
    });
  }
}
