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
      const token = socket.handshake.headers["x-token"];
      if (token === "null") {
        return new IndexController(socket, io);
      } else {
        const jwt = new Token();
        const { ok, message, data } = jwt.validar(token);

        if (ok) {
          socket.emit("my_info", {
            ok,
            message: `Hola ${data.NOMBRE}`,
            data
          });
          _console.info(data.NOMBRE);
          new SeccionController(socket, io, data);
          new ManodeObraController(socket, io, data);
          new BasesCostoController(socket, io, data);
          new CifController(socket, io, data)
          socket.on('disconnect', (resp) => {
            _console.error(`Se desconecto ${data.NOMBRE}`)
            _console.info(JSON.stringify(resp))
            socket.disconnect()
          })
        } else {
          socket.emit("my_info", {
            ok,
            message,
          });
        }
      }
    });
  }
}
