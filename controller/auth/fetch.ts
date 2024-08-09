import {NotificationType, sendNotification} from "../../components/notification"
import useEnvironmentStore from "../../state/environment"
import { AuthorizeRequest, AuthorizeResponse, PermissionType, ResourceType, } from "../../generated/sharing"
import { User } from "../../generated/user"

export default async function checkAuthorization(requestUser: User, resourceType: ResourceType, resourceId: number, permissionType: PermissionType) {
    const baseUrl = useEnvironmentStore.getState().backendApiUrl
    const projectURL = `${baseUrl}/api/v1/auth/authorize`
    
    const authRequest: AuthorizeRequest = AuthorizeRequest.fromPartial({
        user: requestUser,
        authInfo: [
            {
                permission: permissionType,
                target: {resourceType, id: resourceId}
            }
        ]
    })
    
    const rawResponse = await fetch(projectURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(AuthorizeRequest.toJSON(authRequest)),
    })
    const response: AuthorizeResponse = await rawResponse.json()

    if (!rawResponse.ok) {
        sendNotification(
            NotificationType.error, "error handle here"
        )
        return null
    }

    return AuthorizeResponse.fromJSON(response).authInfo[0].isAuthorized
}
