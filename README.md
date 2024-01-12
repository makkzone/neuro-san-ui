# UI Developer Start Guide

This README is intended to help a new UI developer get up to speed toward making changes to the NeuroAI®️ UI.

Note: Previously the project was known as UniLEAF and that name is still used in some places.

## Set Up Prerequisites

-   Install `nodejs` on your development host.
    -   Example using current version on mac: `brew install node@18`
-   For Ubuntu, see this link: https://joshtronic.com/2022/04/24/how-to-install-nodejs-18-on-ubuntu-2004-lts/
-   Install `yarn` on your development host. Instructions for all platforms are [here](https://classic.yarnpkg.com/lang/en/docs)
    -   Example using current version on mac: `brew install yarn@1.22.19`
    -   For Ubuntu, see this link: https://classic.yarnpkg.com/lang/en/docs/cli/self-update/
-   Install app dependencies.
    -   Assuming you've cloned the unileaf repo: `cd unileaf/nextfront && yarn install`
-   Set env variable to specify the gateway.
    -   Most likely you'll want the dev namespace: `export MD_SERVER_URL=https://neuro-ai-dev.evolution.ml`
-   In your `nextfront` directory, create a file named `.env` which contains the following keys.  
    Ask a current UI developer for the redacted values or get them self-serve from the leaf-team-vault server (see below).

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<redacted>
GITHUB_ID=<redacted>
GITHUB_SECRET=<redacted>
AUTH0_CLIENT_ID=<redacted>
AUTH0_CLIENT_SECRET=<redacted>
AUTH0_ISSUER=https://cognizant-ai.auth0.com/authorize
AUTH0_DOMAIN=cognizant-ai.auth0.com
```

-   Values for the redacted can be obtained from the leaf-team vault server with these commands:  
    -- `vault kv get /secret/auth0/unileaf-dev`
    -- `vault kv get /secret/github-app/authorize-unileaf-dev`  
    -- `vault kv get /secret/nextauth/unileaf-dev`
-   Be sure to chmod 600 this .env file to keep secret values secret

## Run the development server:

```bash
npm run dev
# or
yarn dev
# or, by setting the UNILEAF_VERSION value, the ui will display your current branch
export UNILEAF_VERSION=$(git branch --show-current) && yarn run dev
```

To run with verbose debugging:

```bash
DEBUG='*,-send,-compression,-babel' npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Try making a simple change to the UI

If you've made this far, try a simple change within the UI. Here's an example:

1.  Open `nextfront/pages/projects/[projectID]/index.tsx`
1.  Add a message at the appropriate place in the tsx file (somewhere within the `return` statement, inside the `<>`
    fragment).

            {`Hello world! The current project ID is ${projectId}`}

1.  You should notice that the code is compiled automatically and your change appears in the UI when loading a project.

Congratulations, you are now a UI developer!
