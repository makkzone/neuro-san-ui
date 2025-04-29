import {sendChatQuery} from "../../../controller/agent/agent"
import {sendLlmRequest} from "../../../controller/llm/llm_chat"

jest.mock("../../../controller/llm/llm_chat")

const TEST_AGENT_MATH_GUY = "Math Guy"

describe("Controller/Agent/sendChatQuery", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("Should correctly construct and send a request", async () => {
        const abortSignal = new AbortController().signal

        const callbackMock = jest.fn()
        const testQuery = "test query with special characters: !@#$%^&*()_+"
        const testUser = "test user"
        await sendChatQuery(
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

        const expectedRequestParams = {
            chat_context: {chat_histories: []},
            // TODO: use enum types here when available
            chat_filter: {chat_filter_type: 2},
            user_message: {
                // TODO: use enum types here when available
                type: 2,
                text: testQuery,
            },
            sly_data: {login: testUser},
        }

        expect(sendLlmRequest).toHaveBeenCalledWith(
            callbackMock,
            abortSignal,
            expect.stringContaining("streaming_chat"),
            expectedRequestParams,
            null
        )
    })
})
