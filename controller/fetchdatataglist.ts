import {DataSources} from "./datasources/types";
import {BrowserFetchDataSources} from "./datasources/fetch";
import {TaggedDataInfo, TaggedDataInfoList} from "../pages/projects/[projectID]/experiments/new";
import {DataTag, DataTags} from "./datatag/types";
import {BrowserFetchDataTags} from "./datatag/fetch";

export default async function loadTaggedDataList(projectId): Promise<TaggedDataInfoList> {
    if (projectId) {
        const dataSources: DataSources = await BrowserFetchDataSources(projectId)
        if (dataSources.length > 0) {
            let taggedDataList: TaggedDataInfoList = []
            for (let iter = 0; iter < dataSources.length; iter++) {
                const dataSource = dataSources[iter]
                const dataTags: DataTags = await BrowserFetchDataTags(dataSource.id)
                if (dataTags.length > 0) {
                    const taggedData: TaggedDataInfo = {
                        DataSource: dataSource,
                        LatestDataTag: dataTags[0]
                    }
                    taggedDataList.push(taggedData)
                }
            }
            return taggedDataList
        }
    }
}

export async function loadDataTag(dataSourceId: number): Promise<DataTag> {
    const dataTags: DataTags = await BrowserFetchDataTags(dataSourceId)
    if (dataTags.length > 0) {
        return dataTags[0]
    }
}