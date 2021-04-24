import { Socket } from "socket.io";
import { Idominios, UsuarioSchema, _console } from "../../interfaces";
import { BasesCostoModel } from "./Bcosto.model";
const model = new BasesCostoModel()

export class BasesCostoController {
    constructor(private socket: Socket, private io?: Socket, user?: UsuarioSchema) {
        this.ListDominios()
        this.actualizarDominio()
    }
    ListDominios(): void {
        this.socket.on('ListarDominios', async (data: any, callback: any)  => {
            const aa = await model.dominios(data);
            callback(aa)
        })
    }
    actualizarDominio(): void {
        this.socket.on('updateDominios', async(data: Idominios, callback: any) => {
            const bb = await model.updateDominio(data);    
            callback(bb)
        })
    }
}