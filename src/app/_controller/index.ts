import { Socket } from "socket.io";
import { PublicController } from "./public/public.controller";
import { SeccionController} from "./secciones/Seccion.controller";

class IndexController {
  constructor(public socket: Socket, public io: Socket) {
    new PublicController(socket)

  }
}

export {
    IndexController,
    SeccionController
}