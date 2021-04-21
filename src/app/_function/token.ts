import * as jwt from 'jsonwebtoken'
import { Env } from '../../../env'
import { MessageResponse } from '../interfaces'

export class Token {
    semilla!: any
    constructor() {
        const {SEED_TOKEN}:any = new Env()
        this.semilla = SEED_TOKEN
    }
    validar(token: any): any{
      return jwt.verify(token, this.semilla,(err:any , data: any): MessageResponse  => {
            if(err){
                return {ok: false, message: 'Este roken no es valido'}
            }
            return {
                ok: true,
                data
            }
        })
    }  
    
    generarToken(data: any) {
        return jwt.sign(data,this.semilla,{expiresIn: 10080})
    }
}