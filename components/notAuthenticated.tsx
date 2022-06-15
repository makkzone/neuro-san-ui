/**
 * Handling for unauthenticated users
 */

import {signIn} from "next-auth/react"

/**
 * Functional component to display when a user is not authenticated, reminding the user to sign in.
 */
export default function NotAuthenticated() {
    return (
        <>
            <h1>Sign In</h1>
            <p>
                <a href="/api/auth/signin"
                   onClick={(e) => {
                       e.preventDefault()
                       signIn()
                   }}>Click here to sign in with Github</a>
            </p>
        </>
    )
}
