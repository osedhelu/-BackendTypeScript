import { DbService } from "../../db/conexion";
import { MessageResponse } from "../../interfaces";

export class BasesCostoModel {
    private db = new DbService()
    async dominios(json: any): Promise<MessageResponse> {
        return await this.db.SQLConsult({action: 'get_dominios', json})
    }
    async updateDominio(json: any): Promise<MessageResponse>{
        return await this.db.SQLConsult({action: 'update_dominios', json })
    }
}