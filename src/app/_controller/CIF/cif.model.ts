import { DbService } from "../../db/conexion";
import { MessageResponse } from "../../interfaces";

export class CifModel {
  private db = new DbService();
  async list(json: any): Promise<MessageResponse> {
    return await this.db.SQLConsult({ action: "getCif", json });
  }
}
