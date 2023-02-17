// Import Custom Components
import { NodeTypes as RFNodeTypes } from 'react-flow-renderer'
import DataSourceNodeComponent, { DataSourceNode } from './datasourcenode'
import PredictorNodeComponent, { PredictorNode } from './predictornode'
import PrescriptorNodeComponent, { PrescriptorNode } from './prescriptornode'
import UncertaintyModelNodeComponent, { UncertaintyModelNode } from './uncertaintyModelNode'

// Based on the declared nodes above we declare a constant holder
// to reference the Node objects. These references are later passed
// to the Flow component to render the graph
const NodeTypes: RFNodeTypes = {
    datanode: DataSourceNodeComponent,
    predictornode: PredictorNodeComponent,
    prescriptornode: PrescriptorNodeComponent,
    uncertaintymodelnode: UncertaintyModelNodeComponent
}

export type Nodes = DataSourceNode | PredictorNode | PrescriptorNode | UncertaintyModelNode;

export default NodeTypes;
