import { _console } from "../../interfaces";
import { BasesCostoModel } from "../../_controller/BasesCostos/Bcosto.model";
import { Ireq, r } from "../../_function";
const model = new BasesCostoModel()

export const BconstoExpress = (app: any):any => {
    app.post('/', async (req: Ireq, res: any, next: any): Promise<void> => {
        _console.error(JSON.stringify(req.body))

        const aa = await model.dominios({id_unidad: '00'})
        r._200(res, aa)
    })

    return app;
}


