import { Socket } from "socket.io";
import { PublicController } from "./public/public.controller";
import { SeccionController} from "./secciones/Seccion.controller";
import { BasesCostoController} from "./BasesCostos/Bconsto.controller";
import { ManodeObraController} from "./ManoObra/ManoObra.controller";
import {CifController } from "./CIF/cif.controller";

class IndexController {
  constructor(public socket: Socket, public io: Socket) {
    new PublicController(socket)

  }
}

export {
    IndexController,
    SeccionController,
    BasesCostoController,
    ManodeObraController,
    CifController
}