import React, { Component } from 'react';
//import ContentWrapper from '../Layout/ContentWrapper';
//import { Container} from 'reactstrap';
//import ReactDataGrid from 'react-data-grid';
import { NodeService } from 'C:/workspace/angle4-0/reactjs/src/service/NodeService';
import { InputText } from 'primereact/inputtext';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";

class DataGrid extends Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            count: 0,
            nodes: [],
            expandedKeys:{},
            corFundo:''
        };
        this.nodeservice = new NodeService();

        //this.sizeEditor = this.sizeEditor.bind(this);
        this.valueEditor = this.valueEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
        this.rowClassName = this.rowClassName.bind(this);
        this.selectRow = this.selectRow.bind(this);
    }

    componentDidMount() {
        this.nodeservice.getTreeTableNodes().then(data => this.setState({ nodes: data }));
        let expandedKeys = {...this.state.expandedKeys};
        expandedKeys['0'] = true
        expandedKeys['1'] = true
        expandedKeys['0-0'] = true
        expandedKeys['1-0'] = true
        expandedKeys['0-0-0'] = true
        expandedKeys['1-0-0'] = true
        this.setState({expandedKeys: expandedKeys});
    }

    onEditorValueChange(props, value) {
        console.log('change props node data size', props.node.data.size, 'new value', value)
         //let valueAnt=props.node.data.total;
//console.log('props', props, field)
        let separado = props.node.key.split('-')
        //console.log('node',props.node,'splitttttttt',separado)
        let noPai = this.findNodeByKey(this.state.nodes, props.node.key.split('-')[0])
        console.log('no pai', noPai)
        console.log('props node data total',props.node.data.total)
        //console.log('calculo',parseInt(noPai.data.total)-parseInt(valueAnt)+parseInt(value))


        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        console.log('newnodes ', newNodes)
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = value;
console.log('node by key ',this.findNodeByKey(newNodes, separado[0]+'-'+separado[1]+'-'+separado[2]))
        console.log('children ',newNodes[separado[0]].children[separado[1]])

        this.setState({
            nodes: newNodes
        });
    }

    findNodeByKey(nodes, key) {
        let path = key.split('-');
        let node;
        while (path.length) {
            let list = node ? node.children : nodes;
            node = list[parseInt(path[0], 10)];
            path.shift();
        }
        //console.log('node return',node)
        return node;
    }

    inputTextEditor(props, field) {
        return (
            <InputText type="text" value={props.node.data[field]}
            onChange={(e) => this.onEditorValueChange(props, e.target.value)} />
                );
    }
        
    // sizeEditor(props) {
    //     return this.inputTextEditor(props, 'total');
    // }
    
    //se não for nó do item não deixa aparecer o input para editar
    valueEditor(props) {
        let separado = props.node.key.split('-')
        if(separado.length>=4){
            return this.inputTextEditor(props, props.field);
        }
    }

    requiredValidator(props) {
        let value = props.node.data[props.field];

        return value && value.length > 0;
    }

    rowClassName(node) {    
        console.log('node',node)    
        return {'p-highlight' : (node.children )};
    }
    
    selectRow(node) {    
        console.log('node select row',node)    
        console.log('props',this.state.props)
        this.setState({
            corFundo:'#e6e6e6'
        });
        console.log('state cor',this.state.corFundo)
    }

    render() {
        return (
            <div className="App">

                <div className="content-section introduction treetableeditdemo">
                    <div className="feature-intro">
                        <h1>TreeTable - Edit</h1>
                        <p>Incell editing provides a quick and user friendly way to manipulate data.</p>
                    </div>
                </div>

                <div className="content-section implementation treetableedit-demo">
                    <TreeTable value={this.state.nodes} expandedKeys={this.state.expandedKeys} onToggle={e => this.setState({expandedKeys: e.value})} 
                    onRowClick={this.selectRow} >
                        <Column field="grupoccconta" header="Grupo / CC / Conta" expander style={{backgroundColor:"#e6e6e6"}}   ></Column>
                        <Column field="item" header="Item" ></Column>
                        <Column field="jan" header="Jan" ></Column>
                        <Column field="janalt" header="Jan Aterado" editor={this.valueEditor} style={{backgroundColor:this.state.corFundo}} ></Column>
                        <Column field="fev" header="Fev" ></Column>
                        <Column field="fevalt" header="Fev Aterado" editor={this.valueEditor} ></Column>
                    </TreeTable>
                </div>
            </div>
        )
    }
}
//style={{backgroundColor: 'red' }}
export default DataGrid;