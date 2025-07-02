import {sendChatQuery, testConnection, TestConnectionResult} from "../../../controller/agent/Agent"
import {sendLlmRequest} from "../../../controller/llm/LlmChat"
// eslint-disable-next-line camelcase
import {ChatFilterChat_filter_type, ChatMessageType} from "../../../generated/neuro-san/NeuroSanClient"
import {ChatRequest} from "../../../generated/neuro-san/OpenAPITypes"
import {withStrictMocks} from "../../common/strictMocks"
import {mockFetch} from "../../testUtils"

jest.mock("../../../controller/llm/LlmChat")

const NEURO_SAN_EXAMPLE_URL = "https://neuro-san.example.com"
const TEST_AGENT_MATH_GUY = "math_guy"

let oldFetch: typeof global.fetch

describe("Controller/Agent/sendChatQuery", () => {
    withStrictMocks()

    beforeEach(() => {
        oldFetch = global.fetch
    })

    afterEach(() => {
        global.fetch = oldFetch
    })

    it("Should correctly construct and send a request", async () => {
        ;(sendLlmRequest as jest.Mock).mockImplementation((callback) => {
            callback("line 1 of mocked chunk data\nline 2 of mocked chunk data\n")
        })

        const abortSignal = new AbortController().signal

        const callbackMock = jest.fn()
        const testQuery = "test query with special characters: !@#$%^&*()_+"
        const testUser = "test user"
        await sendChatQuery(
            NEURO_SAN_EXAMPLE_URL,
            abortSignal,
            testQuery,
            TEST_AGENT_MATH_GUY,
            callbackMock,
            {
                chat_histories: [],
            },
            // TODO: ugly cast due to how openapi-typescript generates `object` types. What to do here?
            {login: testUser} as unknown as Record<string, never>
        )
        expect(sendLlmRequest).toHaveBeenCalledTimes(1)

        const expectedRequestParams: ChatRequest = {
            chat_context: {chat_histories: []},
            // eslint-disable-next-line camelcase
            chat_filter: {chat_filter_type: ChatFilterChat_filter_type.MAXIMAL},
            user_message: {
                type: ChatMessageType.HUMAN,
                text: testQuery,
            },
            sly_data: {login: testUser} as unknown as Record<string, never>,
        }

        expect(sendLlmRequest).toHaveBeenCalledWith(
            expect.any(Function),
            abortSignal,
            expect.stringMatching(new RegExp(`${TEST_AGENT_MATH_GUY}.*streaming_chat`, "u")),
            expectedRequestParams,
            null
        )

        // Make sure we handle newline-delimited data. The use case is for json-lines: https://jsonlines.org/
        expect(callbackMock).toHaveBeenCalledTimes(2)
        expect(callbackMock).toHaveBeenCalledWith("line 1 of mocked chunk data")
        expect(callbackMock).toHaveBeenCalledWith("line 2 of mocked chunk data")
    })

    it("Should handle a successful testConnection result", async () => {
        global.fetch = mockFetch({status: "healthy", versions: {"neuro-san": "1.2.3"}})
        const result: TestConnectionResult = await testConnection("www.example.com")
        expect(result.success).toBe(true)
        expect(result.version).toBe("1.2.3")
    })

    it("Should handle an unsuccessful testConnection result", async () => {
        global.fetch = mockFetch({status: "unhealthy"})
        const result: TestConnectionResult = await testConnection("www.example.com")
        expect(result.success).toBe(false)

        // If "fetch" throws, that should be considered unsuccessful too
        global.fetch = jest.fn(() => {
            throw new Error("Fetch failed")
        })

        const result2: TestConnectionResult = await testConnection("www.example.com")
        expect(result2.success).toBe(false)
    })
})
