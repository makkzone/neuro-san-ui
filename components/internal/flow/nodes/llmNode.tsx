// React components
import {Dispatch, SetStateAction, useState} from 'react'

// 3rd party components
import {Card, Col, Collapse, Container, Row} from "react-bootstrap"
import {Card as BlueprintCard, Elevation} from "@blueprintjs/core"
import {InfoSignIcon, Popover, Text, Tooltip,} from "evergreen-ui"
import {Handle, Position as HandlePosition, NodeProps, Node} from 'reactflow'
import {AiFillDelete} from "react-icons/ai";
import {GrSettingsOption} from "react-icons/gr"

// Custom components
import ConfigNumeric from "../confignumeric"
import {LlmModelParams, ParamType} from "../llmInfo"
import {NotificationType, sendNotification} from "../../../../controller/notification"

// Define an interface for the structure
// of the node
export interface LlmNodeData {
    // The ID of the nodes. This will be important for applying IDs to form elements.
    // The form elements thus will have IDs like nodeID-formElementType
    readonly NodeID: string,
    readonly ParentNodeState: LlmModelParams,
    readonly SetParentNodeState: Dispatch<SetStateAction<LlmModelParams>>,

    // Mutator method to delete this node from the parent flow
    readonly DeleteNode: (nodeID: string) => void

    // Gets a simpler index for testing ids (at least)
    readonly GetElementIndex: (nodeID: string) => number

    readonly ParameterSet: LlmModelParams

    readonly NodeTitle: string
}

export type LLmNode = Node<LlmNodeData>

const LlmNodeComponent: React.FC<NodeProps<LlmNodeData>> = (props) => {
    /*
    This function renders the LLM node
    */

    // Unpack props
    const data = props.data

    // Unpack the data
    const {
        NodeID,
        ParentNodeState,
        SetParentNodeState,
        DeleteNode,
        GetElementIndex,
        ParameterSet,
        NodeTitle
    } = data

    const onParamChange = (event, paramName: string) => {
        /*
        This function is used to update the state of the predictor
        parameters.
        */
        const { value } = event.target
        const paramsCopy = {...ParentNodeState}
        paramsCopy[paramName].value = value
        SetParentNodeState(paramsCopy)
    }

    const onCheckboxChange = (event, paramName) => {
        /*
        This function is used to update the state of any checkbox parameters
        */
        const { checked } = event.target
        const paramsCopy = {...ParentNodeState}
        paramsCopy[paramName].value = checked
        SetParentNodeState(paramsCopy)
    }

    const flowIndex = GetElementIndex(NodeID) + 1
    const flowPrefix = `llmnode-${flowIndex}`
    const defaultParams = ParameterSet

    // For showing advanced configuration settings
    const [showAdvanced, setShowAdvanced] = useState(false)

    function getInputComponent(param) {
        const item = ParameterSet[param]
        const paramPrefix = `${flowPrefix}-${param}`
        const parentNodeStateElement = ParentNodeState?.param

        return <Container id={`${paramPrefix}-container`}>
            <Row id={`${paramPrefix}-row`} className="mx-2 my-4">
                <Col id={`${paramPrefix}-param-col`} md={2}>
                    <label id={`${paramPrefix}-label`} className="capitalize">{param}: </label>
                </Col>
                <Col id={`${paramPrefix}-param-val-col`}>
                    {
                        (item.type === ParamType.INT ||
                            item.type === ParamType.FLOAT) &&
                        <ConfigNumeric
                            id={`${paramPrefix}-value`}
                            paramName={param}
                            defaultParam={defaultParams[param]}
                            value={
                                (parentNodeStateElement?.value ?? defaultParams[param]?.default_value) as number
                            }
                            onParamChange={event => onParamChange(event, param)}
                            style={{width: "100%"}}
                        />
                    }
                    {
                        item.type === ParamType.BOOLEAN &&
                        <input
                            id={`${paramPrefix}-value`}
                            type="checkbox"
                            checked={
                                Boolean(parentNodeStateElement?.value ?? defaultParams[param]?.default_value)
                            }
                            onChange={event => onCheckboxChange(event, param)}
                        />
                    }
                    {
                        item.type === ParamType.ENUM && item.enum &&
                        <select
                            id={`${paramPrefix}-value`}
                            value={
                                (parentNodeStateElement?.value ?? defaultParams[param]?.default_value)?.toString()
                            }
                            onChange={event => onParamChange(event, param)}
                            style={{width: "100%"}}
                        >
                            {
                                Object.entries(item.enum).map(
                                    encoder =>
                                        <option
                                            id={`${paramPrefix}-${encoder[0]}`}
                                            key={encoder[0]} value={encoder[1].toString()}>
                                            {encoder[0]}
                                        </option>
                                )
                            }
                        </select>
                    }
                    {
                        item.type === ParamType.STRING &&
                        <textarea
                            style={{width: "100%", fontFamily: "monospace"}}
                            rows={item.rows || 10}
                            id={`${paramPrefix}-value`}
                            onChange={event => onParamChange(event, param)}
                        >
                       {
                           (parentNodeStateElement?.value ?? defaultParams[param]?.default_value)?.toString()
                       }
                    </textarea>
                    }
                </Col>
                <Col id={`${paramPrefix}-tooltip`} md={1}>
                    <Tooltip        // eslint-disable-line enforce-ids-in-jsx/missing-ids
                        // 2/6/23 DEF - Tooltip does not have an id property when compiling
                        content={item.description}>
                        <InfoSignIcon id={`${paramPrefix}-tooltip-info-sign-icon`}/>
                    </Tooltip>
                </Col>
            </Row>
        </Container>
    }

    // Create the outer Card
    return <BlueprintCard id={ `${flowPrefix}` }
        interactive={ true } 
        elevation={ Elevation.TWO } 
        style={ { padding: 0, width: "10rem", height: "4rem" } }
    >
        <Card id={ `${flowPrefix}-llm-card-1` } 
            border="warning" style={{height: "100%"}}>
            <Card.Body id={ `${flowPrefix}-llm-card-2` }
                className="flex justify-center content-center">
                <Text id={ `${flowPrefix}-llm-text` }
                    className="mr-2">
                    {NodeTitle}
                </Text>
                <div id={ `${flowPrefix}-popover-div` }
                    onMouseDown={(event) => {event.stopPropagation()}}>
                    <Popover    // eslint-disable-line enforce-ids-in-jsx/missing-ids
                                // 2/6/23 DEF - Popover does not have an id property when compiling
                        content={
                        <>
                            <Card.Body id={ `${flowPrefix}-llm-config` }
                                className="h-40 text-xs">
                                <div id={ `${flowPrefix}-basic-settings-div` }
                                    className="mt-3">
                                    {
                                        Object.keys(ParameterSet)
                                            .filter(key => !ParameterSet[key].isAdvanced)
                                            .map(param => getInputComponent(param))
                                    }
                                </div>
                                <div id={ `${flowPrefix}-advanced-settings-label-div` } className="mt-4 mb-2">
                                    <Text id={ `${flowPrefix}-advanced-settings-text` }>
                                        <b id={ `${flowPrefix}-advanced-settings-label` }>
                                            Advanced settings
                                        </b> (most users should not change these)
                                    </Text>
                                </div>
                                <button id={ `${flowPrefix}-show-advanced-settings-llm-button` }
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                >
                                    {showAdvanced
                                        ? <u id={ `${flowPrefix}-show-advanced-settings` }>Hide</u>
                                        : <u id={ `${flowPrefix}-hide-advanced-settings` }>Show</u>
                                    }
                                </button>
                                <Collapse   // eslint-disable-line enforce-ids-in-jsx/missing-ids
                                            // 2/6/23 DEF - Collapse does not have an id property when compiling
                                    in={showAdvanced} timeout={5}>
                                    <div id={ `${flowPrefix}-basic-settings-div` }
                                         className="mt-3">
                                        {
                                            Object.keys(ParameterSet)
                                                .filter(key => ParameterSet[key].isAdvanced)
                                                .map(param => getInputComponent(param))
                                        }
                                    </div>
                                </Collapse>

                            </Card.Body>
                        </>
                    }
                         statelessProps={{
                             height: "800px",
                             width: "1200px",
                             backgroundColor: "ghostwhite"
                         }}
                    >
                    <div id={ `${flowPrefix}-show-llm-config` } className="flex">
                        <button id={ `${flowPrefix}-show-llm-config-button` }
                                type="button"
                                className="mt-1"
                                style={{height: 0}}>
                            <GrSettingsOption
                                id={ `${flowPrefix}-show-llm-config-button-settings-option` }/>
                        </button>
                    </div>
                    </Popover>
                </div>
            </Card.Body>
            <div id={ `${flowPrefix}-delete-button-div` } 
                className="px-1 my-1" style={{position: "absolute", bottom: "0px", right: "1px"}}>
                <button id={ `${flowPrefix}-delete-button` }
                        type="button"
                        className="hover:text-red-700 text-xs"
                        disabled={true}
                        onClick={() => {
                            DeleteNode(NodeID)
                            sendNotification(NotificationType.success, "LLM node deleted")
                        }}
                >
                    <AiFillDelete id={ `${flowPrefix}-delete-button-fill` } size="10"/>
                </button>
            </div>
        </Card>
        <Handle id={ `${flowPrefix}-source-handle` } type="source" position={HandlePosition.Right} />
        <Handle id={ `${flowPrefix}-target-handle` } type="target" position={HandlePosition.Left} />
    </BlueprintCard>
}

export default LlmNodeComponent;