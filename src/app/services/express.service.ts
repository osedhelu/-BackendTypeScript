import {Router, Application} from 'express'
import { BconstoExpress, ExpressUsers } from './rutesExpress'

export default class ExpresService {
    constructor(public app: Application){
        
        app.use('/login',  ExpressUsers(Router()))
        app.use('/bcostos',  BconstoExpress(Router()))
        app.use('/admin',  ExpressUsers(Router()))

    }
}