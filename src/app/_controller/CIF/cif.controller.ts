import { Socket } from "socket.io";
import { UsuarioSchema, _console } from "../../interfaces";
import { CifModel } from "./cif.model";

export class CifController {
    model = new CifModel()
    constructor(private socket: Socket, private io: Socket, user: UsuarioSchema) {
    this.list()
    }
    private list(): void {
        this.socket.on('ListCif', async (data: any, callback: any) => {
            _console.error(data)
            const aa = await this.model.list(data)
            callback(aa)
        })
    }
}