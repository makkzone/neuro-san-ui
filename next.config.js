// Config file for NextJS

module.exports = {
    typescript: {
        // Temp hack: ignore build errors until deps are fixed
        ignoreBuildErrors: true,
    },
    eslint: {
	// We run eslint in CI/CD via a script that allows us
	// to pass without being lint-free. Until such time as
	// we are eslint-free, we need to ignore eslint during 
	// the build process.
        ignoreDuringBuilds: false,
        dirs: ['components', 'controller', 'pages', 'public', 'styles', 'tests', 'utils', '.']
    },

    publicRuntimeConfig: {
        // if the md_server_url is not set it defaults to invalid url
        // this way we don't accidentally point prod->staging or vice versa
        md_server_url: process.env.MD_SERVER_URL ?? "MD_SERVER_URL_must_be_set",
        enableAuthentication: process.env.ENABLE_AUTHENTICATION ?? true,
        unileafVersion: process.env.UNILEAF_VERSION
    },

    output: 'standalone',

    images: {
        domains: ['avatars.githubusercontent.com'],
    },

    poweredByHeader: false
};
