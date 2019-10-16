import React, { Component } from 'react';
//import ContentWrapper from '../Layout/ContentWrapper';
//import { Container} from 'reactstrap';
//import ReactDataGrid from 'react-data-grid';
import { NodeService } from '../../service/NodeService';
import { InputText } from 'primereact/inputtext';
import { TreeTable } from 'primereact/treetable';
import { Column } from "primereact/column";
import { Button, ButtonGroup, Dropdown, DropdownToggle,  DropdownMenu, DropdownItem } from 'reactstrap';
import { translate, Trans } from 'react-i18next';

class DataGrid extends Component {
    constructor(props, context) {
        super(props, context);


        this.state = {
            count: 0,
            nodes: [],
            expandedKeys: {},
            dropdownOpen: false
        };
        this.nodeservice = new NodeService();

        this.valueEditor = this.valueEditor.bind(this);
        this.requiredValidator = this.requiredValidator.bind(this);
        this.rowClassName = this.rowClassName.bind(this);
        this.onRefreshStatus = this.onRefreshStatus.bind(this);
    }

    componentDidMount() {
        this.nodeservice.getTreeTableNodes().then(data => this.setState({ nodes: data }));
        let expandedKeys = { ...this.state.expandedKeys };
        //expande as colunas
        expandedKeys['0'] = true
        expandedKeys['1'] = true
        expandedKeys['0-0'] = true
        expandedKeys['1-0'] = true
        expandedKeys['0-0-0'] = true
        expandedKeys['1-0-0'] = true
        this.setState({ expandedKeys: expandedKeys });
    }

    onEditorValueChange(props, value) {

        console.log('change props node data', props.node.data, 'new value', value)
        let valueAnt = props.node.data[props.field];
        //busca o no pai e altera o total
        let noPai = this.findNodeByKey(this.state.nodes, props.node.key.split('-')[0])
        console.log('props field', props.field, 'no pai', noPai, 'total', props.node.data[props.field], 'valant', valueAnt, 'valatual', value)
        noPai.data[props.field] = noPai.data[props.field] - parseInt(valueAnt, 10) + parseInt(value, 10)
        //console.log('calculo',parseInt(noPai.data.total)-parseInt(valueAnt)+parseInt(value))


        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        //console.log('newnodes ', newNodes)
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = value;
        editedNode.data.status = 'alterado'
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

    //se não for nó do item não deixa aparecer o input para editar
    valueEditor(props) {
        //console.log('value editor', props.node.data.corFundo)
        let separado = props.node.key.split('-')
        if (separado.length >= 4) {
            return this.inputTextEditor(props, props.field);
        }
    }

    requiredValidator(props) {
        let value = props.node.data[props.field];

        return value && value.length > 0;
    }

    rowClassName(node) {
        let keys = node.key.split('-')
        console.log('status', node.data.status)
        return {
            'bg-info-dark': (keys.length === 1), 'bg-info': (keys.length === 2), 'bg-info-light': (keys.length === 3),
            'bg-yellow': node.data.status === 'alterado', 'bg-success':node.data.status==='confirmed', 'bg-danger':node.data.status==='rejected'
        }
    }

    onRefreshStatus(props, value) {
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data.status = value
        this.setState({
            nodes: newNodes
        });
        this.rowClassName(props)
    }

    // sizeTemplate(node) {
    //     console.log('size template*****************', node)
    //     return { backgroundColor: '#e6e6e6' };
    // }
    //<div style={this.sizeTemplate}></div>

    actionTemplate(node, column) {
        let keys = node.key.split('-')
        return <div hidden={keys.length<4}  >
            <ButtonGroup>
                <Button color="success" className="btn-labeled" > 
                {/* onClick={(e) => this.onRefreshStatus(node, 'confirmed')} */}
                    <span className="btn-md"><i className="fa fa-check"></i></span></Button>
                <Button color="danger" className="btn-labeled" >
                    <span className="btn-md"><i className="fa fa-times"></i></span></Button>
            </ButtonGroup>
        </div>;
    }

    changeLanguage = lng => {
        this.props.i18n.changeLanguage(lng);
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

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
                <div className="table table-bordered content-section implementation">
                    <TreeTable value={this.state.nodes} expandedKeys={this.state.expandedKeys} tableClassName="table"
                        rowClassName={this.rowClassName} scrollable onToggle={e => this.setState({ expandedKeys: e.value })}
                        responsive>
                        <Column field="grupoccconta" header="Grupo / CC / Conta" expander style={{ width: '200px' }} />
                        <Column field="item" header="Item" style={{ width: '70px' }} />
                        <Column field="jan" header="Jan" style={{ width: '70px' }} />
                        <Column field="janalt" header="Jan Aterado" editor={e => this.valueEditor(e)} style={{ width: '70px' }} />
                        <Column field="fev" header="Fev" style={{ width: '70px' }} />
                        <Column field="fevalt" header="Fev Aterado" editor={this.valueEditor} style={{ width: '70px' }} />
                        <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                    </TreeTable>
                    <div className="content-heading">
                    {/* <div>Dashboard
                        <small><Trans i18nKey='dashboard.WELCOME'></Trans></small>
                    </div> */}
                    { /* START Language list */ }
                    {/* <div className="ml-auto">
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle>
                                English
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-right-forced animated fadeInUpShort">
                                <DropdownItem onClick={() => this.changeLanguage('en')}>English</DropdownItem>
                                <DropdownItem onClick={() => this.changeLanguage('es')}>Spanish</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div> */}
                    { /* END Language list */ }
                    </div>
                </div>
            </div>
        )
    }
}

export default DataGrid;