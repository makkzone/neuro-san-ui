// import useEnvironmentStore from "../../state/environment"
// import {AuthQuery, AuthorizeResponse, PermissionType, ResourceType} from "../../generated/auth"
// import {User} from "../../generated/user"

// export default async function checkAuthorization(requestUser: User, authQueries: AuthQuery[]) {
//     const baseUrl = useEnvironmentStore.getState().backendApiUrl
//     const authURL = `${baseUrl}/api/v1/auth/authorize`

//     // const authBlob = await fetch(authURL, {
//     //     method: 'GET',
//     //     body: JSON.stringify({
//     //         user: requestUser,
//     //         authQueries
//     //     })
//     // })

//     // const authPermissions: AuthorizeResponse = await authBlob.json()
//     // return authPermissions.authInfos;
// }
