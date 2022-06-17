/**
 * Configuration settings for next-auth.
 *
 * See next-auth documentation for more information on these settings.
 */

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: "read:user, read:org"
        }),
        // ...add more providers here
    ],

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        strategy: 'jwt'
    },

    theme: {
        colorScheme: "auto", // "auto" | "dark" | "light"
        brandColor: "0033a0", // Hex color value
        logo: "http://unileaf.evolution.ml/leaffavicon.png" // Absolute URL to logo image
    }
})