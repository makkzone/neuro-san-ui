// TODO: fix all enum types when enums available
import {AgentErrorProps} from "../../../components/AgentChat/Types"
import {chatMessageFromChunk, checkError, tryParseJson} from "../../../components/AgentChat/Utils"

describe("AgentChat/Utils/chatMessageFromChunk", () => {
    it("Should reject unknown message types", () => {
        const chunk = {
            result: {
                response: {
                    type: 0,
                },
            },
        }

        const chatMessage = chatMessageFromChunk(JSON.stringify(chunk))
        expect(chatMessage).toBeNull()
    })

    it("Should correctly handle known message types", () => {
        const chunk = {
            result: {
                response: {
                    type: 4,
                    text: "This is a test message",
                },
            },
        }

        const chatMessage = chatMessageFromChunk(JSON.stringify(chunk))
        expect(chatMessage).not.toBeNull()

        expect(chatMessage.type).toEqual(4)
        expect(chatMessage.text).toEqual("This is a test message")
    })
})

describe("AgentChat/Utils/tryParseJson", () => {
    it("Should return an object for valid JSON", () => {
        const chunk = {
            result: {
                response: {
                    type: 100,
                    text: JSON.stringify({foo: 42}),
                },
            },
        }

        const chatMessage = tryParseJson(JSON.stringify(chunk))
        expect(chatMessage).not.toBeNull()

        // make sure it's an object
        expect(typeof chatMessage).toBe("object")

        expect(chatMessage).toEqual({foo: 42})
    })

    it("Should return text cleaned up for non-JSON", () => {
        const chunk = {
            result: {
                response: {
                    type: 100,
                    text: 'This is a test string with embedded newline \\n and escaped double quote \\"',
                },
            },
        }

        const chatMessage = tryParseJson(JSON.stringify(chunk))
        expect(chatMessage).not.toBeNull()
        expect(typeof chatMessage).toBe("string")
        expect(chatMessage).toEqual("This is a test string with embedded newline \n and escaped double quote '")
    })
})

describe("AgentChat/Utils/checkError", () => {
    it("Should return detect an error block", () => {
        const errorText = "This is a test error"
        const traceText = "This is a test trace"
        const toolText = "This is a test tool"
        const result = checkError({
            error: errorText,
            traceback: traceText,
            tool: toolText,
        } as AgentErrorProps)

        expect(typeof result).toBe("string")
        expect(result).toContain("Error occurred")
        expect(result).toContain(errorText)
        expect(result).toContain(traceText)
        expect(result).toContain(toolText)
    })

    it("Should return null for non-errors", () => {
        const result = checkError({
            text: "no errors here",
        })

        expect(result).toBeNull()
    })
})
