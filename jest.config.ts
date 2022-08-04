import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};

// Voodoo to speed up Jest, from here: https://stackoverflow.com/a/60905543
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
}

export default config;