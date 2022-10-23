// React components
import {Card as BlueprintCard, Elevation} from "@blueprintjs/core"
import {InfoSignIcon, Popover, Text, Tooltip,} from "evergreen-ui"
import {ReactElement} from 'react'

// 3rd party components
import {Card} from "react-bootstrap"
import {GrSettingsOption} from "react-icons/gr"

// React Flow
import {
    Handle,
    Position as HandlePosition
} from 'react-flow-renderer'

// Consts
import {RIO_PARAMS, RioParamField} from "../rioinfo"

// Define an interface for the structure
// of the nodes
export interface PredictorNodeData {
    // The ID of the nodes. This will
    // be important to issues name to
    // form elements. The form elements thus
    // will be named nodeID-formElementType
    readonly NodeID: string,

    readonly placeHolder: string
}

export default function RioNode(props): ReactElement {
    /*
    This function is responsible to render the Predictor Node
    */


    function getConfigFor(key, item) {
        return <div className="grid grid-cols-8 gap-4 mb-2" key={key} >
                <div className="item1 col-span-2"><label className="capitalize">{key}: </label></div>
                <div className="item2 col-span-5">
                    <input
                        type="text"
                        // step="0.1"
                        defaultValue={item.defaultValue}
                        value={item.defaultValue}
                        onChange={() => {}}
                    />
                </div>
                <div className="item3 col-span-1">
                    <Tooltip content={item.description} >
                        <InfoSignIcon />
                    </Tooltip>
                </div>
            </div>
    }

// Create the Component structure
    return <BlueprintCard
        interactive={ true } 
        elevation={ Elevation.TWO } 
        style={ { padding: 0, width: "10rem", height: "4rem" } }>

        <Card border="warning" style={{height: "100%"}}>
            <Card.Body className="flex justify-center content-center">
                <Text className="mr-2">{"RIO"}</Text>
                <Popover content={
                    <>
                        <div className="my-2 mx-2">
                        <a target="_blank" href="https://gpflow.github.io/GPflow/" rel="noreferrer">
                            For more information on these settings, click here.
                        </a>
                        </div>
                        <Card.Body>
                            {
                                Object.keys(RIO_PARAMS).map(key => {
                                    return getConfigFor(key, RIO_PARAMS[key])
                                })
                            }
                        </Card.Body>
                    </>
                }
                     statelessProps={{
                         borderStyle: "double",
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
