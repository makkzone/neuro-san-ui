/* Unit tests for the DMS Chat NodeJS module */

import httpStatus from "http-status"
import {NextApiRequest, NextApiResponse} from "next"
import {createMocks, RequestOptions} from "node-mocks-http"

import handler from "../../pages/api/gpt/dmschat"

// Mock the OpenAI module which we import transitively via langchain to avoid issues with "fetch" not being defined.
// See: https://github.com/openai/openai-node/issues/666
jest.mock("@langchain/openai", () => ({}))

describe("handler", () => {
    let request: RequestOptions

    beforeEach(() => {
        request = {
            method: "POST",
            headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
            },
            body: {
                userQuery: "This is a user query",
            },
        }
    })

    it("Should reject for missing user query", () => {
        delete request.body.userQuery
        const {req, res} = createMocks<NextApiRequest, NextApiResponse>(request)
        handler(req, res)
        expect(res.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(res._getJSONData().error).toBe("Bad request")
    })

    it("Should reject for wrong method", () => {
        request.method = "GET" // intentionally wrong, should be POST
        const {req, res} = createMocks<NextApiRequest, NextApiResponse>(request)
        handler(req, res)
        expect(res.statusCode).toBe(httpStatus.METHOD_NOT_ALLOWED)
        expect(res._getJSONData().error).toBe("Method not allowed")
    })

    it("Should reject for missing OpenAI API key", () => {
        const {req, res} = createMocks<NextApiRequest, NextApiResponse>(request)
        handler(req, res)
        expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR)
        expect(res._getJSONData().error).toBe("Could not find API Key")
    })

    it("Should reject for missing server API URL", () => {
        process.env.OPENAI_API_KEY = "test"
        const {req, res} = createMocks<NextApiRequest, NextApiResponse>(request)
        handler(req, res)
        expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR)
        expect(res._getJSONData().error).toBe("Could not find MD_SERVER_URL or INTERNAL_GATEWAY_URL")
    })
})
