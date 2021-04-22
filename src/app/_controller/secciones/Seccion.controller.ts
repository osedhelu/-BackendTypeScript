import { Socket } from 'socket.io';
import { UsuarioSchema, _console } from '../../interfaces';
import { TreeListFunction } from '../../_function';
import { SeccionModel } from './seccion.model';

export class SeccionController {
  model = new SeccionModel();
  constructor(private socket: Socket, private io: Socket, user: UsuarioSchema) {
    this.allEmpleados();
    this.EditSeccion();
    this.ListSeccion();
  }

  async allSeccion(): Promise<void> {
    const { ok, data, message } = await this.model.listSeccion({ id_unidad: '00' });

    if (ok) {
      const treeData = TreeListFunction({ idKey: 'ITEM', parentKey: 'ANTERIOR', childrenKey: 'items', data });
      this.socket.emit('allSeccion', treeData);
    } else {
      this.socket.emit('allSeccion', {
        ok,
        message,
      });
    }
  }

  allEmpleados() {
    this.socket.on('allEmpleados', async (data, callback) => {
      const resp = await this.model.listEmpleados({id_unidad:"00", seccion: data});
      callback(resp)
    });
  }

  EditSeccion() {
    return {ok: false}
  }

  ListSeccion() {
    this.socket.on('GetSeccion', async (emit: any) => {
        try {
            this.allSeccion()
     
        } catch (error) {
          _console.error(JSON.stringify(error));
        }
      });
  }
}
