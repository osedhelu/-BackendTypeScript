import { DbService } from "../../db/conexion"
import { LoginSchema, MessageResponse, UsuarioSchema } from "../../interfaces"
import WinstonLog from "../../setting/winston"
import { PassFn, Token } from "../../_function"

const {_console} = new WinstonLog()

export class PublicNodel extends DbService{
    async listEmpresa(json: any): Promise<MessageResponse> {
        const aa = await this.SQLConsult({action: 'get_empresa', json})
        return aa
    }


    async initSeccion(emit: LoginSchema): Promise<MessageResponse> {
        const password = emit.password
        emit.password = ''
        const info = await this.SQLConsult({action: 'login', json: emit})
        const user: UsuarioSchema = info.data
        if(!info.data) {
            return {
                ok: false,
                message: 'el usuario no existe -- cc' 
            }
        }else {
            const validate = new PassFn()
            const acti = validate.comprar(password, user.CLAVE_SECUNDARIA)
            if(!acti) {
                return {
                    ok: false,
                    message: 'el usuario no existe -- password' 
                }
            }else {
                const jwt= new Token()
                user.CLAVE_SECUNDARIA = ''
                return {
                    ok: true,
                    data: user,
                    token: jwt.generarToken(user)
                    
                }
            }
            
        }
    }
}