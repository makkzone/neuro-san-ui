import '@testing-library/jest-dom'

/*
This next part is a hack to get around "ReferenceError: TextEncoder is not defined" errors when running Jest.
See: https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
 */

// eslint-disable-next-line no-shadow
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// End of hack

jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
        enableAuthentication: false
    }
}))