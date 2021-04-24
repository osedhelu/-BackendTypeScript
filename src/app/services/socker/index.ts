import { Socket } from "socket.io";
import WinstonLog from "../../setting/winston";
import {
  BasesCostoController,
  CifController,
  IndexController,
  ManodeObraController,
  SeccionController,
} from "../../_controller";
import { Token } from "../../_function";
const { _console } = new WinstonLog();

export class SocketService {
  public start(io: any) {
    io.on("connection", async (socket: Socket) => {
      const jwt = new Token();
      const token: any = socket.handshake.headers["x-token"];
      const { ok, message, data } = jwt.validar(token);
      new IndexController(socket, io);
      _console.error(token)
      socket.on('disconnect', (resp) => {
        if(typeof(data) === 'undefined') {
          io.disconnectSockets()

          _console.error(`Se desconecto`)
        }else {

          _console.error(`Se desconecto ${data.NOMBRE}`)
        }
      })
      if(ok) {
        socket.emit("my_info", {
          ok,
          message: `Hola ${data.NOMBRE}`,
          data,
        });
        
        new SeccionController(socket, io, data);
        new ManodeObraController(socket, io, data);
        new BasesCostoController(socket, io, data);
        new CifController(socket, io, data);
      }else {
        socket.emit("my_info", {
          ok,
          message,
          data: 'login',
        });
        _console.error(message)
      }
  
      if (token === "null") {
        socket.disconnect();
        io.close();
      }

    
      //   if (token === "null") {
      //     return new IndexController(socket, io);
      //   } else {

      //     if (ok) {
      //       socket.emit("my_info", {
      //         ok,
      //         message: `Hola ${data.NOMBRE}`,
      //         data
      //       });
      //       _console.info(data.NOMBRE);
      //

      //     } else {
      //       socket.emit("my_info", {
      //         ok,
      //         message,
      //       });
      //     }
      // })
    });
  }
}
