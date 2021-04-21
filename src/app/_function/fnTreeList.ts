export class TreeListService {
  map: any = {};
  info: {ID_KEY: any,
    PARENT_KEY: any,
    CHILDREN_KEY: any
}
  constructor(public data: any, idKey: string, parentKey: string, childrenKey: string) {
    this.info = {
      ID_KEY: idKey || 'id',
      PARENT_KEY: parentKey || 'parent',
      CHILDREN_KEY: childrenKey || 'children',
    };
  }

  ejecute() {
    for(let i = 0; i <this.data.length; i++){
        if(this.data[i][this.info.ID_KEY]){
            this.map[this.data[i][this.info.ID_KEY]] = this.data[i];
            this.data[i][this.info.CHILDREN_KEY] = []
        }
    }    
  }
}
