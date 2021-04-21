import { Socket } from 'socket.io';
import WinstonLog from '../../setting/winston';
import { IndexController, SeccionController } from '../../_controller';
import { Token } from '../../_function';
const {_console} = new WinstonLog 


export class SocketService {
  public start(io: any) {
    io.on('connection', async (socket: Socket) => {
      const token = socket.handshake.headers['x-token'];
      
      console.log(token === "null")
      if (token === "null") {
            return new IndexController(socket, io)
    } else {
        const jwt = new Token()
        const {ok, message, data} = jwt.validar(token)
        if(ok) {
          socket.emit('my_info', {
            ok,
            message: `Hola ${data.NOMBRE}`,
          })
          _console.info(data.NOMBRE)
          new SeccionController(socket, io, data)

        }
      }
    });
  }
}
