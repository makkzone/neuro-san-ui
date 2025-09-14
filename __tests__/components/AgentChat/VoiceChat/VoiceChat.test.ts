import {
    checkSpeechSupport,
    cleanup,
    stopSpeechSynthesis,
    toggleListening,
    VoiceChatEventHandlers,
    VoiceChatState,
} from "../../../../components/AgentChat/VoiceChat/VoiceChat"
import {USER_AGENTS} from "../../../common/UserAgentTestUtils"

const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, "userAgent", {
        value: userAgent,
        configurable: true,
    })
}

const mockChromeBrowser = () => {
    mockUserAgent(USER_AGENTS.CHROME_MAC)
}

// Suppress React 18 render warning during hook tests
let errorSpy: jest.SpyInstance
let originalSpeechRecognition: unknown
let originalSpeechSynthesis: unknown
let originalGetUserMedia: unknown
let originalMediaDevices: unknown

beforeAll(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn())
    originalSpeechRecognition = ((window as Window) && {SpeechRecognition: {}}).SpeechRecognition
    originalSpeechSynthesis = window.speechSynthesis
    originalMediaDevices = navigator.mediaDevices
    originalGetUserMedia = navigator.mediaDevices?.getUserMedia
})

afterAll(() => {
    errorSpy.mockRestore()
    ;((window as Window) && {SpeechRecognition: {}}).SpeechRecognition = originalSpeechRecognition
    if (originalSpeechSynthesis) {
        Object.defineProperty(window, "speechSynthesis", {
            value: originalSpeechSynthesis,
            configurable: true,
            writable: true,
        })
    }
    if (originalMediaDevices) {
        Object.defineProperty(navigator, "mediaDevices", {
            value: originalMediaDevices,
            configurable: true,
            writable: true,
        })
        if (navigator.mediaDevices && originalGetUserMedia) {
            Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
                value: originalGetUserMedia,
                configurable: true,
                writable: true,
            })
        }
    }
})

describe("VoiceChat utils", () => {
    describe("Browser Support", () => {
        beforeEach(() => {
            // Reset SpeechRecognition and webkitSpeechRecognition before each test
            Object.defineProperty(window, "SpeechRecognition", {
                value: jest.fn(),
                configurable: true,
                writable: true,
            })
            Object.defineProperty(window, "webkitSpeechRecognition", {
                value: jest.fn(),
                configurable: true,
                writable: true,
            })
            mockUserAgent(USER_AGENTS.CHROME_MAC)
        })

        it("checkSpeechSupport returns a boolean", () => {
            expect(typeof checkSpeechSupport()).toBe("boolean")
        })

        it("detects Chrome and non-Chrome browsers", () => {
            mockUserAgent(USER_AGENTS.CHROME_MAC)
            expect(checkSpeechSupport()).toBe(true)
            mockUserAgent(USER_AGENTS.FIREFOX_MAC)
            expect(checkSpeechSupport()).toBe(false)
            mockUserAgent(USER_AGENTS.EDGE_WINDOWS)
            expect(checkSpeechSupport()).toBe(false)
            mockUserAgent(USER_AGENTS.EDGE_MAC)
            expect(checkSpeechSupport()).toBe(false)
        })

        it("returns false if SpeechRecognition is missing", () => {
            mockUserAgent(USER_AGENTS.CHROME_MAC)
            delete (window as unknown as Record<string, unknown>)["SpeechRecognition"]
            delete (window as unknown as Record<string, unknown>)["webkitSpeechRecognition"]
            expect("SpeechRecognition" in window).toBe(false)
            expect("webkitSpeechRecognition" in window).toBe(false)
            expect(checkSpeechSupport()).toBe(false)
        })

        it("should handle webkit speech recognition when SpeechRecognition is not available", () => {
            // Mock Chrome browser
            mockChromeBrowser()

            // Mock only webkitSpeechRecognition
            Object.defineProperty(window, "SpeechRecognition", {
                value: undefined,
                configurable: true,
            })
            Object.defineProperty(window, "webkitSpeechRecognition", {
                value: jest.fn(),
                configurable: true,
            })

            expect(checkSpeechSupport()).toBe(true)
        })

        it("should return false when both SpeechRecognition APIs are missing", () => {
            // Mock Chrome browser
            mockChromeBrowser()

            // Remove both APIs
            Object.defineProperty(window, "SpeechRecognition", {
                value: undefined,
                configurable: true,
            })
            Object.defineProperty(window, "webkitSpeechRecognition", {
                value: undefined,
                configurable: true,
            })

            expect(checkSpeechSupport()).toBe(false)
        })
    })

    describe("Permission and State Handling", () => {
        it("toggleListening handles permission denied", async () => {
            const state: VoiceChatState = {
                isListening: false,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "",
            }

            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn().mockRejectedValue({name: "NotAllowedError"}),
                },
                configurable: true,
                writable: true,
            })

            const mockRecognition = {start: jest.fn(), stop: jest.fn()}
            await toggleListening(mockRecognition as unknown as SpeechRecognition, state, false)
            expect(mockRecognition.start).not.toHaveBeenCalled()
        })

        it("cleanup calls event handlers and stops recognition", () => {
            const mockEventHandlers: VoiceChatEventHandlers = {
                onStart: jest.fn(),
                onEnd: jest.fn(),
                onResult: jest.fn(),
                onError: jest.fn(),
            }

            const mockRecognition = {
                stop: jest.fn(),
                removeEventListener: jest.fn(),
            }

            cleanup(mockRecognition as unknown as SpeechRecognition, mockEventHandlers)
            expect(mockRecognition.removeEventListener).toHaveBeenCalledTimes(4)
            expect(mockRecognition.stop).toHaveBeenCalled()
        })

        it("toggleListening starts and stops recognition", async () => {
            // Mock Chrome browser for this test
            mockChromeBrowser()

            const listeningState: VoiceChatState = {
                isListening: true,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "hi",
            }

            const recognition = {stop: jest.fn(), start: jest.fn()}
            await toggleListening(recognition as unknown as SpeechRecognition, listeningState, true)
            expect(recognition.stop).toHaveBeenCalled()

            // Now test start
            const notListeningState: VoiceChatState = {...listeningState, isListening: false}

            // Mock successful permission
            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn().mockResolvedValue({
                        getTracks: () => [{stop: jest.fn()}],
                    }),
                },
                configurable: true,
                writable: true,
            })

            await toggleListening(recognition as unknown as SpeechRecognition, notListeningState, true)
            expect(recognition.start).toHaveBeenCalled()
        })
    })

    describe("Microphone Permission Handling", () => {
        it("should handle microphone permission requests in Chrome", async () => {
            const state: VoiceChatState = {
                isListening: false,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "",
            }

            // Mock Chrome browser
            mockChromeBrowser()

            // Mock successful permission request
            const mockStream = {
                getTracks: () => [{stop: jest.fn()}],
            }
            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn().mockResolvedValue(mockStream),
                },
                configurable: true,
                writable: true,
            })

            const recognition = {start: jest.fn(), stop: jest.fn()}
            await toggleListening(recognition as unknown as SpeechRecognition, state, true)

            expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            })
            expect(recognition.start).toHaveBeenCalled()
        })

        it("should handle microphone permission errors", async () => {
            const state: VoiceChatState = {
                isListening: false,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "",
            }

            // Mock Chrome browser
            mockChromeBrowser()

            // Mock permission denied error
            const permissionError = new Error("Permission denied")
            permissionError.name = "NotAllowedError"
            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn().mockRejectedValue(permissionError),
                },
                configurable: true,
                writable: true,
            })

            const recognition = {start: jest.fn(), stop: jest.fn()}
            await toggleListening(recognition as unknown as SpeechRecognition, state, true)

            expect(recognition.start).not.toHaveBeenCalled()
        })

        it("should handle PermissionDeniedError", async () => {
            const state: VoiceChatState = {
                isListening: false,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "",
            }

            // Mock Chrome browser
            mockChromeBrowser()

            // Mock permission denied error with different name
            const permissionError = new Error("Permission denied")
            permissionError.name = "PermissionDeniedError"
            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn().mockRejectedValue(permissionError),
                },
                configurable: true,
                writable: true,
            })

            const recognition = {start: jest.fn(), stop: jest.fn()}
            await toggleListening(recognition as unknown as SpeechRecognition, state, true)

            expect(recognition.start).not.toHaveBeenCalled()
        })

        it("should handle other getUserMedia errors gracefully", async () => {
            const state: VoiceChatState = {
                isListening: false,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "",
            }

            // Mock Chrome browser
            mockChromeBrowser()

            // Mock other types of errors (should not prevent recognition if Chrome supports it)
            const otherError = new Error("Some other error")
            otherError.name = "SomeOtherError"
            Object.defineProperty(navigator, "mediaDevices", {
                value: {
                    getUserMedia: jest.fn().mockRejectedValue(otherError),
                },
                configurable: true,
                writable: true,
            })

            const recognition = {start: jest.fn(), stop: jest.fn()}
            await toggleListening(recognition as unknown as SpeechRecognition, state, true)

            // Should still try to start recognition since it's Chrome and error is not permission-related
            expect(recognition.start).toHaveBeenCalled()
        })
    })

    describe("Speech Synthesis", () => {
        it("stopSpeechSynthesis calls cancel when speechSynthesis is available", () => {
            const mockCancel = jest.fn()
            Object.defineProperty(window, "speechSynthesis", {
                value: {cancel: mockCancel},
                configurable: true,
            })

            stopSpeechSynthesis()
            expect(mockCancel).toHaveBeenCalled()
        })

        it("stopSpeechSynthesis handles missing speechSynthesis gracefully", () => {
            Object.defineProperty(window, "speechSynthesis", {
                value: undefined,
                configurable: true,
            })

            // Should not throw error
            expect(() => stopSpeechSynthesis()).not.toThrow()
        })
    })

    describe("Error Handling", () => {
        it("toggleListening should handle unsupported speech or missing recognition", async () => {
            const state: VoiceChatState = {
                isListening: false,
                currentTranscript: "",
                isSpeaking: false,
                finalTranscript: "",
            }

            await toggleListening(null, state, true)
            // Should not throw error when recognition is null
            expect(true).toBe(true) // Test passes if no error is thrown
        })

        it("cleanup should handle missing recognition object gracefully", () => {
            const mockEventHandlers: VoiceChatEventHandlers = {
                onStart: jest.fn(),
                onEnd: jest.fn(),
                onResult: jest.fn(),
                onError: jest.fn(),
            }

            cleanup(null, mockEventHandlers)
            // Should not throw error when recognition is null
            expect(true).toBe(true) // Test passes if no error is thrown
        })
    })
})
