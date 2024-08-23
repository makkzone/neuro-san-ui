import {RelationType, ResourceType, Status} from "../../generated/auth"
import {ListSharesRequest, ListSharesResponse, ShareRequest, ShareResponse} from "../../generated/sharing"
import useEnvironmentStore from "../../state/environment"

const SHARE_API_PATH = "api/v1/share/grant"
const LIST_SHARES_API_PATH = "api/v1/share/list"

export async function share(
    projectId: number,
    requester: string,
    targetUser: string,
    isGranted: boolean = true
): Promise<void> {
    const baseUrl = useEnvironmentStore.getState().backendApiUrl

    // Construct the URL
    const shareUrl = `${baseUrl}/${SHARE_API_PATH}`

    const shareRequest: ShareRequest = {
        user: {
            login: requester,
        },
        isGranted: isGranted,
        shareInfo: {
            beneficiary: {
                user: {
                    login: targetUser,
                },
            },
            relation: RelationType.TOURIST,
            shareTarget: {
                id: projectId,
                resourceType: ResourceType.PROJECT,
            },
        },
    }

    const shareRequestAsJson = ShareRequest.toJSON(shareRequest)

    const res = await fetch(shareUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(shareRequestAsJson),
    })

    // Check if the request was successful
    if (!res.ok) {
        throw new Error(`Failed to share: ${res.statusText} error code ${res.status}`)
    }

    const response = ShareResponse.fromJSON(await res.json())
    if (!response || response.status !== Status.SUCCESS) {
        console.debug("response", response)
        throw new Error(`Failed to share: ${response.status}`)
    }
}

export async function getShares(projectId: number, requester: string): Promise<[string, RelationType][]> {
    // for testing
    // return [
    //     ["babak", RelationType.TOURIST],
    //     ["darren", RelationType.OWNER],
    // ]

    const baseUrl = useEnvironmentStore.getState().backendApiUrl

    // Construct the URL
    const shareUrl = `${baseUrl}/${LIST_SHARES_API_PATH}`

    const listSharesRequest: ListSharesRequest = ListSharesRequest.fromPartial({
        user: {
            login: requester,
        },
        shareInfoTemplate: {
            shareTarget: {
                id: projectId,
                resourceType: ResourceType.PROJECT,
            },
        },
    })

    const listSharesRequestAsObject = ListSharesRequest.toJSON(listSharesRequest)

    const res = await fetch(shareUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(listSharesRequestAsObject),
    })

    // Check if the request was successful
    if (!res.ok) {
        throw new Error(`Failed to get shares: ${res.statusText} error code ${res.status}`)
    }

    const response = ListSharesResponse.fromJSON(await res.json())
    if (!response || response.status !== Status.SUCCESS) {
        console.debug("response", response)
        throw new Error(`Failed to get shares: ${response.status}`)
    }

    return response.shareInfo.reduce((acc, shareItem) => {
        acc.push([shareItem.beneficiary.user.login, shareItem.relation])
        return acc
    }, [])
}
