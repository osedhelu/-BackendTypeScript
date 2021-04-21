import { DbService } from "../../db/conexion";
import { MessageResponse } from "../../interfaces";
const db = new DbService()

export class SeccionModel {
    async listSeccion(json: any): Promise<MessageResponse> {
     return  await db.SQLConsult({action: 'getSecciones', json})
    
    }

    async listEmpleados(json: any):Promise<MessageResponse> {

        return await db.SQLConsult({action: 'getEmpleados', json})
    }
}