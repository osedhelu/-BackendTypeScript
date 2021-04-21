import express from 'express';
import { DbService } from '../db/conexion';
import WinstonLog from './winston';
import * as bodyParser from "body-parser";
import { createServer } from 'http';
import {Server, Socket} from 'socket.io';
import { Env } from '../../../env';
import { SocketService } from '../services/socker';
const { _console } = new WinstonLog()

export class InitService {
public app!: express.Application
  




private middelewares(app: express.Application) {
    // tslint:disable-next-line: only-arrow-functions
    app.use(function (req: any, res: any, next: any) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, token');
      next();
    });
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
  }




  public start() {
    const sqlService = new Env
    const  app = express();
    this.middelewares(app)
    const httpServer = createServer(app)
    const io = new Server(httpServer, {
      cors: {
        origin: sqlService.IP_FRONTEND,
        allowedHeaders: ["x-Token"],
        credentials: true,
        methods: ["GET", "POST"]
      }
    })
    this.app = app
    httpServer.listen(sqlService.PORT, () => {
      _console.info(`Servidor Corriendo en el puerto ${sqlService.PORT}`);  
      const _socket = new SocketService();
      _socket.start(io);
    });
  }

}