import { DbService } from "../../db/conexion";
import { MessageResponse } from "../../interfaces";

export class ManodeObraModel {
    private db = new DbService()
    async list(json:any) : Promise<MessageResponse> {
        return await this.db.SQLConsult({action: 'Mano_de_obra', json})
    }
    async getUnidadMedidas(json: any): Promise<MessageResponse> {
        return await this.db.SQLConsult({action: 'unidad_medida', json})
    }
}