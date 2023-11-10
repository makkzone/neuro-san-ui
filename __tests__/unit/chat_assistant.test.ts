import {createMocks} from "node-mocks-http"
import handler from "../../pages/api/gpt/dmschat"
// eslint-disable-next-line no-shadow
import status from "http-status"

// We need to mock the next/config module because it's not available in the Jest environment. We also have to do
// it before we import the handler because the handler depends on modules that try to access next/config.
jest.mock('next/config', () => () => ({
    publicRuntimeConfig: {
        enableAuthentication: false
    }
}))

import {DmsChatRequest} from "../../pages/api/gpt/dmschat/types"

const TIMEOUT_MS = 30000

describe("/api/gpt/dmschat", () => {
    it("gets to a Final Answer when context is requested", async () => {
        const query: DmsChatRequest = {
            "chatHistory": [],
            "context": {
                "age": 40,
                "sex": 0,
                "anaemia": 0,
                "smoking": 0,
                "diabetes": 0,
                "platelets": 25100,
                "serum_sodium": 113,
                "high_blood_pressure": 0,
                "creatinine_phosphokinase": 23
            },
            "predictorUrls": ["http://example.com"],
            "prescriptorUrl": "http://example.com",
            "userQuery": "What is the current context?",
            "projectName": "Heart Failure",
            "projectDescription": "Generic project description"
        }

        const {req, res} = createMocks({
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: query
        })

        await handler(req, res)
        expect(res._getStatusCode()).toBe(status.OK)
        expect(res._getData()).toContain("Final Answer")
    }, TIMEOUT_MS)
})
