/**
 * Configuration settings for next-auth.
 *
 * See next-auth documentation for more information on these settings.
 */

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET,
        //     authorization: {
        //         params: {
        //             scope: "read:user read:org user:email"
        //         }
        //     },
        //     checks: "both"
        // }),
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            issuer: process.env.AUTH0_ISSUER,
        })
        // ...add more providers here
    ],

    callbacks: {
        // async jwt({ token, user, account, profile, isNewUser }) {
        //     if (user) {
        //         token.id = user.id;
        //     }
        //     if (account) {
        //         token.accessToken = account.access_token;
        //     }
        //     return token;
        // },

        async signIn({ user, account, profile, email, credentials }) {
            // console.debug("user", user)
            // console.debug("account", account)
            // const access_token = account.access_token
            // console.debug("token", access_token)
            //
            // var options = {
            //     apiVersion: 'v1', // default
            //     endpoint: 'https://leaf-team-vault.cognizant-ai.net',
            //     token: access_token, // optional client token; can be fetched after valid initialization of the server
            //     method: "github"
            // }
            //
            // let vault = nv(options);
            // console.debug("github login")
            // const res = await vault.githubLogin({token: access_token})
            // console.debug("login response", res)
            // // console.debug("vault init")
            // // vault.init({ secret_shares: 1, secret_threshold: 1, recovery_shares: 1, recovery_threshold: 1})
            // //     .then( (result) => {
            // //         let keys = result.keys;
            // //         // set token for all following requests
            // //         vault.token = result.root_token;
            // //         // unseal vault server
            // //         return vault.unseal({ secret_shares: 1, key: keys[0], secret_threshold: 1, recovery_shares: 1, recovery_threshold: 1});
            // //     })
            // //     .catch(console.error);
            //
            // console.debug("vault read secret")
            // const secret = await vault.read("unileaf-user/access/admit", )
            // console.debug("secret", secret)

            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        }
    },

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        strategy: 'jwt'
    },

    theme: {
        colorScheme: "auto", // "auto" | "dark" | "light"
        brandColor: "0033a0", // Hex color value
        logo: "http://unileaf.evolution.ml/leaffavicon.png" // Absolute URL to logo image
    },

    // Set this to "true" for verbose debugging messages from next-auth
    debug: true
})