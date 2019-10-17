import axios from 'axios';

export class NodeService {
    
    getTreeTableNodes() {
        //return axios.get('showcase/resources/demo/data/treetablenodes.json')
        //return axios.get('./data/treetablenodes.json')
        return axios.get('./data/treetabledados.json')
                .then(res => res.data.root);
    }

    getTreeNodes() {
        return axios.get('./data/treetablenodes.json')
                .then(res => res.data.root);
    }

    convertJson(){
        var json = axios.get('./data/dados.json').then(res => res.data.root);
        console.log('json ', json)
        console.log('stringfy',JSON.stringify(json))
        // JSON.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}', (key, value) => {
        //     console.log(key); // mostra o nome da propriedade atual, o último é "".
        //     console.log(value);     // retorna o valor da propriedade inalterada.
        //   });
        // JSON.parse(json, (key, value) => {
        //     console.log('key',key); // mostra o nome da propriedade atual, o último é "".
        //     console.log('value',value);     // retorna o valor da propriedade inalterada.
        //   });
        //var obj = JSON.parse(json);
        //console.log('json', obj.cc, obj.conta, obj.item)
    }
}