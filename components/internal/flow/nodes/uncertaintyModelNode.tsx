// React components
import {Card as BlueprintCard, Elevation} from "@blueprintjs/core"
import {InfoSignIcon, Popover, Text, Tooltip,} from "evergreen-ui"
import {ReactElement} from 'react'

// 3rd party components
import {Card} from "react-bootstrap"

// React Flow
import {Handle, Position as HandlePosition} from 'react-flow-renderer'
import {GrSettingsOption} from "react-icons/gr"

// Custom components
import {ParamType, UNCERTAINTY_MODEL_PARAMS} from "../uncertaintymodelinfo"

// Define an interface for the structure
// of the node
export interface UncertaintyModelNodeData {
    // The ID of the nodes. This will
    // be important to issues name to
    // form elements. The form elements thus
    // will be named nodeID-formElementType
    readonly NodeID: string,
}

export default function UncertaintyModelNode(props): ReactElement {
    /*
    This function renders the uncertainty model node
    */

    function getInputComponent(key, item) {
        return <div className="grid grid-cols-8 gap-4 mb-2" key={key} >
                <div className="item1 col-span-3"><label className="capitalize">{key}: </label></div>
                <div className="item2 col-span-4">
                    {
                        item.type === ParamType.INT &&
                        <input
                            type="number"
                            step="1"
                            defaultValue={item.defaultValue.toString()}
                            value={item.defaultValue.toString()}
                            onChange={() => {}}
                        />
                    }
                    {
                        item.type === ParamType.BOOLEAN && 
                            <input
                                type="checkbox"
                                defaultChecked={item.defaultValue}
                                checked={item.defaultValue}
                                onChange={() => {}}
                            />
                    }
                    {
                        item.type === ParamType.ENUM &&
                        <select
                            value={ item.defaultValue }
                            onChange={() => {}}
                            className="w-32"
                        >
                            {
                                (item.allValues as Array<string>).map(
                                    value => <option key={value} value={ value }>{ value }</option>)
                            }
                        </select>
                    }
                </div>
                <div className="item3 col-span-1">
                    <Tooltip content={item.description} >
                        <InfoSignIcon />
                    </Tooltip>
                </div>
            </div>
    }

    // Create the outer Card
    return <BlueprintCard
        interactive={ true } 
        elevation={ Elevation.TWO } 
        style={ { padding: 0, width: "10rem", height: "4rem" } }>

        <Card border="warning" style={{height: "100%"}}>
            <Card.Body className="flex justify-center content-center">
                <Text className="mr-2">Uncertainty model</Text>
                <Popover content={
                    <>
                        <Card.Body className="h-40 text-xs" id={ "uncertainty_model_config" }>
                            <div className="mt-1 mb-2 mx-1">
                                <a target="_blank" href="https://gpflow.github.io/GPflow/" rel="noreferrer">
                                    For more information on these settings, view the GPFlow documentation here.
                                </a>
                            </div>
                            <div className="mt-3">
                                {
                                    Object.keys(UNCERTAINTY_MODEL_PARAMS)
                                        .filter(key => !UNCERTAINTY_MODEL_PARAMS[key].isAdvanced)
                                        .map(key => {
                                        return getInputComponent(key, UNCERTAINTY_MODEL_PARAMS[key])
                                    })
                                }
                            </div>
                            <div className="mt-4 mb-2">
                                <Text>
                                    Advanced settings (most users should not change these):
                                </Text>
                            </div>
                            <div className="mt-3 mb-4">
                                {
                                    Object.keys(UNCERTAINTY_MODEL_PARAMS)
                                        .filter(key => UNCERTAINTY_MODEL_PARAMS[key].isAdvanced)
                                        .map(key => {
                                            return getInputComponent(key, UNCERTAINTY_MODEL_PARAMS[key])
                                        })
                                }
                            </div>
                        </Card.Body>
                    </>
                }
                     statelessProps={{
                         height: "280px",
                         width: "700px",
                         backgroundColor: "ghostwhite"
                     }}
                >
                <div className="flex">
                    <button type="button"
                            className="mt-1"
                            style={{height: 0}}>
                        <GrSettingsOption/>
                    </button>
                </div>
                </Popover>
            </Card.Body>
        </Card>
            <Handle type="source" position={HandlePosition.Right} />
            <Handle type="target" position={HandlePosition.Left} />
        </BlueprintCard>
}
