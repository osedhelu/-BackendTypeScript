import { Socket } from "socket.io";
import { UsuarioSchema, _console } from "../../interfaces";
import { ManodeObraModel } from "./ManoObra.model";

const model = new ManodeObraModel();
export class ManodeObraController {
  constructor(private socket: Socket, private io: Socket, user: UsuarioSchema) {
    this.Listar();
    this.ListMedidas();
  }

  Listar(): void {
    this.socket.on('ManoDeObra', async (resp: any, callback) => {
        const aa = await model.list(resp)
        callback(aa)
    })
  }
  ListMedidas(): void {
    this.socket.on('UnidadMedidas', async(data: any, callback: any) => {
        const bb = await model.getUnidadMedidas(data)
        callback(bb)
    })
  }
}
