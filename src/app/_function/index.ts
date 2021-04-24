import {Token} from './token'
import {PassFn} from './bcryptjs'

interface TreeInter {
  data: any;
  idKey: string;
  parentKey: string;
  childrenKey: string;
}

const TreeListFunction = ({data, idKey, parentKey,childrenKey}: TreeInter): any[] => {
    
    const ID_KEY = idKey || 'id';
    const PARENT_KEY = parentKey || 'parent';
    const CHILDREN_KEY = childrenKey || 'children';
  
    // const item, id, parentId;
    const map:any = {};
    for (let i = 0; i < data.length; i++) { // make cache
        if (data[i][ID_KEY]) {
            map[data[i][ID_KEY]] = data[i];
            data[i][CHILDREN_KEY] = [];
        }
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i][PARENT_KEY]) { // is a child
            if (map[data[i][PARENT_KEY]]) // for dirty data
            {
                map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
                data.splice(i, 1); // remove from root
                i--; // iterator correction
            } else {
                data[i][PARENT_KEY] = 0; // clean dirty data
            }
        }
    };
    return data;
  }
const r = {
    _400: (res: any, error:any) => {
       return res.status(400).json({
            ok: false,
            error
        })
    },
    _200: (res: any, data: any) => {
        return res.status(200).json(data)
    },
    
    _201: (res: any, data: any) => {
        return res.status(201).json({
            ok: true,
            data
        })
    },
    _401: (res: any, error: any) => {
        return res.status(401).json({
            ok: false,
            error
        })
    },
    _500: (res: any, error: any) => {
        return res.status(500).json({
            ok: false,
            error
        })
    },
    _message: (res: any, message: any) => {
        return res.status(200).json({
            message
        })
    }
}
interface Ireq {
    params: any;
    query: any;
    body: any;
  }

export {
    Token, 
    PassFn,
    TreeListFunction,
    r,
    Ireq
}
