import React, { Component } from 'react';
//import ContentWrapper from '../Layout/ContentWrapper';
//import { Container} from 'reactstrap';
//import ReactDataGrid from 'react-data-grid';
import { NodeService } from '../../service/NodeService';
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

        console.log('change props node data', props.node.data, 'new value', value)
         let valueAnt=props.node.data[props.field];

        let noPai = this.findNodeByKey(this.state.nodes, props.node.key.split('-')[0])
        console.log('props field',props.field,'no pai', noPai, 'total',props.node.data[props.field], 'valant', valueAnt, 'valatual',value)
        noPai.data[props.field] = noPai.data[props.field]-parseInt(valueAnt,10)+parseInt(value,10)
        //console.log('calculo',parseInt(noPai.data.total)-parseInt(valueAnt)+parseInt(value))


        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        //console.log('newnodes ', newNodes)
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = value;
        editedNode.data.alterado = true
//console.log('node by key ',this.findNodeByKey(newNodes, separado[0]+'-'+separado[1]+'-'+separado[2]))
        //console.log('children ',newNodes[separado[0]].children[separado[1]])

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
        this.rowClassName(props.node)
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
        console.log('value editor',props.node.data.corFundo)
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
        //console.log('node',node)    
        //return {'p-highlight' : (node.children )};
        let keys = node.key.split('-')
        console.log('keys ', keys,node.key)
        return { 'bg-info': (keys.length === 1), 'bg-primary': (keys.length === 2), 'p-highlight': (keys.length === 3) , 'bg-yellow':node.data.alterado }
    }
    
    selectRow(node) {    
        console.log('node select row',node)    
        console.log('props',this.state.props)
        
       // let keys = node.key.split('-')
        return { 'bg-yellow':true }

        // this.setState({
        //     corFundo:'#e6e6e6'
        // });
        // console.log('state cor',this.state.corFundo)
    }

    sizeTemplate(node) {
        console.log('size template*****************',node)
        return {backgroundColor:'#e6e6e6'};
    }
    //<div style={this.sizeTemplate}></div>

    render() {
       // let style={backgroundColor:'#ffffb3'}
        return (
            <div className="App">

                <div className="content-section introduction treetableeditdemo">
                    <div className="feature-intro">
                        <h1>TreeTable - Edit</h1>
                        <p>Incell editing provides a quick and user friendly way to manipulate data.</p>
                    </div>
                </div>
                <div className="content-section implementation card-default">
                    <TreeTable value={this.state.nodes} expandedKeys={this.state.expandedKeys} tableClassName="table table-bordered"
                    rowClassName={this.rowClassName} scrollable onToggle={e => this.setState({expandedKeys: e.value})} 
                    onRowClick={this.selectRow} responsive={true}>
                        <Column field="grupoccconta" header="Grupo / CC / Conta" expander style={{width:'200px'}} />
                        <Column field="item" header="Item" style={{width:'70px'}}/>
                        <Column field="jan" header="Jan" style={{width:'70px'}}/>
                        <Column field="janalt" header="Jan Aterado" editor={e => this.valueEditor(e)} style={{width:'70px'}} />
                        <Column field="fev" header="Fev" style={{width:'70px'}}/>
                        <Column field="fevalt" header="Fev Aterado" editor={this.valueEditor} style={{width:'70px'}}/>
                    </TreeTable>
                </div>
            </div>
        )
    }
}
//style={{backgroundColor: 'red' }}
//style={{backgroundColor: e => e.node.data.corFundo}}
export default DataGrid;