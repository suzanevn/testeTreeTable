import axios from 'axios';

export class NodeService {
    
    getTreeTableNodes() {
        //return axios.get('showcase/resources/demo/data/treetablenodes.json')
        //return axios.get('./data/treetablenodes.json')
        return axios.get('./data/treetabledados.json')
                .then(res => res.data.root);
    }

    getTreeNodes() {
        return axios.get('./data/treenodes.json')
                .then(res => res.data.root);
    }
}