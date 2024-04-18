/*
Demo unit test for protobuf to TS machinery
 */

import {ChatMessage} from "../../generated/chat"
import {ChatMessage_ChatMessageType} from "../../generated/chat"

describe("Make sure protobuf files generated", () => {
    it("should have generated protobuf types for chat.proto", () => {
        const imageData = {mimeType: "image/png", imageBytes: new Uint8Array([1, 2, 3])}
        const message: ChatMessage = {
            type: ChatMessage_ChatMessageType.HUMAN,
            text: "Hello, World!",
            imageData: imageData,
        }

        expect(message).toBeDefined()
        expect(message.type).toBe(ChatMessage_ChatMessageType.HUMAN)
        expect(message.text).toBe("Hello, World!")
        expect(message.imageData).toBe(imageData)
    })
})
