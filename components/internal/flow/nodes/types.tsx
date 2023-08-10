// Import Custom Components
import DataSourceNodeComponent, { DataSourceNode, DataSourceNodeData } from './datasourcenode'
import LlmNodeComponent, {LLmNode, LlmNodeData} from "./llmNode"
import PredictorNodeComponent, { PredictorNode, PredictorNodeData } from './predictornode'
import PrescriptorNodeComponent, { PrescriptorNode, PrescriptorNodeData } from './prescriptornode'
import UncertaintyModelNodeComponent, { UncertaintyModelNode, UncertaintyModelNodeData } from './uncertaintyModelNode'
import { NodeTypes as RFNodeTypes } from 'reactflow'

// Based on the declared nodes above we declare a constant holder
// to reference the Node objects. These references are later passed
// to the Flow component to render the graph
const NodeTypes: RFNodeTypes = {
    datanode: DataSourceNodeComponent,
    predictornode: PredictorNodeComponent,
    prescriptornode: PrescriptorNodeComponent,
    uncertaintymodelnode: UncertaintyModelNodeComponent,
    llmnode: LlmNodeComponent
}

export type NodeData =
    DataSourceNodeData | PredictorNodeData | PrescriptorNodeData | UncertaintyModelNodeData | LlmNodeData

export type NodeType = DataSourceNode | PredictorNode | PrescriptorNode | UncertaintyModelNode | LLmNode

export default NodeTypes;
