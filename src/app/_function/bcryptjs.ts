import * as bcryp from 'bcryptjs'

export class PassFn { 
    comprar(password1: string,  password2: string) {
      return bcryp.compareSync(password1, password2)
    }
    async generate(password1: string) {
        return bcryp.hashSync(password1, 10)
    }
}