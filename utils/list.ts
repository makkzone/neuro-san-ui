import {fetchResourceList} from "../controller/list/fetch"
import {AuthQuery, ResourceType, RoleType} from "../generated/auth"

/**
 * returns a list of unique ids of resources by user role
 *
 * @param requestUser - User to get info for
 * @param resourceTYpe - Resource to get id for
 * @param role - Role that determines what resources are returned
 *
 * @returns {Set<number>}
 *
 */
export const getResourceListIds = async (
    requestUser: string,
    resourceType: ResourceType,
    role: RoleType
): Promise<Set<number>> => {
    const resourceList: AuthQuery[] = await fetchResourceList(requestUser, resourceType, role)

    const uniqueIds: Set<number> = new Set<number>()
    resourceList.forEach((resource) => {
        const id = resource?.target?.id
        if (id) {
            uniqueIds.add(Number(id))
        }
    })

    return uniqueIds
}
