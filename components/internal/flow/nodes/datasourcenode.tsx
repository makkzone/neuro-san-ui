import React, {useEffect, useState} from "react";

// Import 3rd pary components
import { Card } from "react-bootstrap"
// Import React Flow
import {
    Handle,
    Position
} from 'react-flow-renderer'

import { Card as BleuprintCard, Elevation } from "@blueprintjs/core";

// Import types
import {
    TaggedDataInfo,
    TaggedDataInfoList
} from '../../../../pages/projects/[projectID]/experiments/new'
import {DataSources} from "../../../../controller/datasources/types";
import {BrowserFetchDataSources} from "../../../../controller/datasources/fetch";
import {BrowserFetchDataTags} from "../../../../controller/datatag/fetch";
import {DataTags} from "../../../../controller/datatag/types";
import loadTaggedDataList from "../../../../controller/fetchdatataglist";

var debug = require('debug')('data_source_node')


export interface DataSourceNodeData {
    // Project ID that this new experiment belongs to.
    readonly ProjectID: number,

    // Data sources Selected Unique Id
    readonly SelectedDataSourceId: number,

    // We get passed the Node Definitions and a hook to update the definition
    readonly SelfStateUpdateHandler: any,
}


export default function DataSourceNode(props): React.ReactElement {

    const data: DataSourceNodeData = props.data
    const projectId: number = data.ProjectID
    const selectedDataSourceId: number = data.SelectedDataSourceId

    const [taggedDataList, setTaggedDataList] = useState([])

    // Fetch the Data Sources and the Data Tags
    useEffect(() => {
        (async () => setTaggedDataList(await loadTaggedDataList(projectId)))()
    }, [projectId])


    // Create the Component structure
    return <BleuprintCard
        interactive={ true }
        elevation={ Elevation.TWO }
        style={ { padding: 0, width: "8rem", height: "6rem" } }>
            <Card border="warning" style={{height: "100%"}}>
                <Card.Header>Data Source</Card.Header>
                <Card.Body>
                    <div className="flex-col flex content-center">
                        <div className="flex justify-between mb-4 content-center">
                            {
                                taggedDataList.length > 0 &&
                                <select name='dataset' className="w-24"
                                         onChange={
                                             event => {
                                                 debug("Selected: ", event.target.value)
                                                 const filteredSelectedData = taggedDataList.filter(
                                                     data => parseInt(event.target.value) === data.DataSource.id
                                                 )[0]
                                                 debug("FDS: ", filteredSelectedData)
                                                 data.SelfStateUpdateHandler(
                                                     filteredSelectedData.id
                                                 )
                                             }
                                         }
                                         defaultValue={selectedDataSourceId || taggedDataList[0].DataSource.id}
                                >
                                    {taggedDataList.map(data =>
                                        <option key={data.DataSource.id}
                                                value={data.DataSource.id}>{data.DataSource.name}</option>
                                    )}
                                </select>
                            }
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <Handle type="source" position={Position.Right} />
        </BleuprintCard>
        
}
