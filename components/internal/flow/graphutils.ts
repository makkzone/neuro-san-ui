// Import Constants
import { InputDataNodeID } from "../../../const"

// Import React Flow
import {
    removeElements
} from 'react-flow-renderer'

// Import ID Gen
import uuid from "react-uuid"

// Import types
import { 
    TaggedDataInfoList 
} from '../../../pages/projects/[projectID]/experiments/new'




// Declare functions to fetch predictor and prescriptor nodes out of the 
// graph
export const getPredictorNodes = graph => graph.filter(
    element => element.type === 'predictornode')
export const getPrescriptorNodes = graph => graph.filter(
    element => element.type === 'prescriptornode')

export const getDataNodes = graph => graph.filter(
    element => element.type === 'datanode')

export const getPredictorNodeByID = (graph, id) => graph.filter(
    element => element.type === 'predictornode' && element.id === id)
export const getPrescriptorNodeByID = (graph, id) => graph.filter(
    element => element.type === 'prescriptornode' && element.id === id)

export const updateGraphWithNodeDef = (graph, nodeDef) => {
    
    // Make a copy of the graph
    const graphCopy = graph.slice()

    // Get all the nodes except the one to change
    let nonFocusNodes = graphCopy.filter(element => 
        element.id !== nodeDef.id)

    // Append the new Node
    graphCopy.push(nodeDef)

    return graphCopy
}

export const addPredictorNode = (graph, nodeDefs, setNodeDefs, DataTag) => {
    /*
    This function adds a predictor node to the Graph while supplying
    several constraints.
    1. The predictor nodes are always added as attached to the data source
    node.
    2. If a prescriptor node exists, the predictor is attached to that node.

    @param graph: Current state of the graph
    @param DataTag: CAO Map for Data Source that the user has selected
    */

    // Make a copy of the graph
    let graphCopy = graph.slice()

    // Create a unique ID
    const NodeID = uuid()

    // Add the Predictor Node
    graphCopy.push({
        id: NodeID,
        type: 'predictornode',
        data: { 
            NodeID: NodeID, 
            DataTag: DataTag, 
            NodeDefs: nodeDefs,
            UpdateNodeDefFn: setNodeDefs
        },
        position: { 
            x: 150, 
            y: 125 
        }
    })

    // Add an Edge to the data node
    graphCopy.push({ 
        id: `e1-${NodeID}`, 
        source: InputDataNodeID, 
        target: NodeID, 
        animated: true 
    })

    // Check if Prescriptor Node exists
    const prescriptorNodes = getPrescriptorNodes(graph)

    // If it already exists add edge to that
    if (prescriptorNodes.length != 0) { 
        const prescriptorNode = prescriptorNodes[0]
        graphCopy.push({ 
            id: `e${NodeID}-${prescriptorNode.id}`, 
            source: NodeID, 
            target: prescriptorNode.id, 
            animated: true 
        })
    }

    // Moreover we need to update the DataNode's data
    let dataNodes = getDataNodes(graphCopy)
    dataNodes.forEach(function(node){
        node.data = {

        }
    })

    return graphCopy
}

export const addPrescriptorNode = (graph, CAOMapping) => {
    /*
    This function adds a prescriptor node to the Graph. The only
    requirement for this is that atleast one predictor exists.


    @param graph: Current state of the graph
    @param CAOMapping: CAOMapping for the Data Source that the user has selected
    */

    // Check if Prescriptor Node exists
    const prescriptorExists = (
        getPrescriptorNodes(graph)).length != 0

    // If it already exists, return
    if (prescriptorExists) { return graph }

    // Make sure predictor nodes exist, if not alert
    const predictorNodes = getPredictorNodes(graph)
    if (predictorNodes.length == 0) {
        // TODO: Convert Alert to notification
        alert("Please add a Predictor First")
        return graph
    }
    
    // If above conditions are satisfied edit the graph
    let graphCopy = graph.slice()

    // Create an unique ID
    const NodeID = uuid()

    // Add a Prescriptor Node
    graphCopy.push({
        id: NodeID,
        type: "prescriptorNode",
        data: { NodeID: NodeID, CAOMapping: CAOMapping },
        position: { x: 100, y: 125 },
    })

    // Add an Edge to the data node
    graphCopy.push({ 
        id: `e1-${NodeID}`, 
        source: InputDataNodeID, 
        target: NodeID, 
        animated: true 
    })

    // Add edges to all the predictor nodes
    predictorNodes.forEach(element => {
        graphCopy.push({ 
            id: `e${element.id}-${NodeID}`, 
            source: element.id, 
            target: NodeID, 
            animated: true 
        })
    })

    return graphCopy
}

export const onLoad = (reactFlowInstance) => {
    /*
    Helper function to adjust the flow when its loaded.
    */
    reactFlowInstance.fitView();
}

export const deleteNode = (elementsToRemove, graph, nodeDefs, setNodeDefs) => {
    /*
    Since we supply constraints on how nodes interact, i.e in an ESP
    fashion we cannot allow deletion of any nodes. 
    1. Data Nodes cannot be deleted
    2. If only one predictor exists, deleting that will also delete
    the prescriptor node if it exists.

    Note: This edits the graph inPlace
    */
    // Make sure there are no data nodes
    const removableElements = elementsToRemove.filter(element => element.type != "datanode")

    // If this delete will remove all predictors, also delete the prescriptor
    const numPredictorNodesLeft = getPredictorNodes(graph).length - getPredictorNodes(elementsToRemove).length
    if (numPredictorNodesLeft == 0) {
        removableElements.push(...getPrescriptorNodes(graph))
    }

    // Get all the nodes
    const removableNodes = elementsToRemove.filter(element => !(element.source || element.target))
    

    // Remove Node state
    let cleanNodeDefs = {...nodeDefs}
    removableNodes.forEach(element => {
        delete cleanNodeDefs[element.id]
    })
    setNodeDefs(cleanNodeDefs)

    return removeElements(removableElements, graph)
}