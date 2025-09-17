import {Dispatch, MutableRefObject, SetStateAction, useMemo, useRef} from "react"

// #region: Types

export interface SpeechRecognitionState {
    /**
     * currentTranscript holds the interim (live) speech recognition results as the user is speaking.
     * This provides real-time feedback in the UI, showing what the system is currently hearing.
     */
    currentTranscript: string
    /**
     * finalTranscript contains the finalized speech recognition result for a segment.
     * This is stable and ready to be used as chat input after the system is confident about what was said.
     */

    finalTranscript: string
    /**
     * isListening indicates whether the system is actively listening for speech input.
     * Used to control UI state and microphone activity.
     */
    isListening: boolean
    /**
     * isProcessingSpeech indicates whether the system is currently processing interim speech results.
     * Used to show loading indicators or disable UI actions during processing.
     */
    isProcessingSpeech: boolean
}

export interface SpeechRecognitionEventHandlers {
    onEnd: () => void
    onError: (event: SpeechRecognitionErrorEvent) => void
    onResult: (event: SpeechRecognitionEvent) => void
    onStart: () => void
}

interface UseSpeechRecognitionProps {
    setChatInput: Dispatch<SetStateAction<string>>
    setVoiceInputState: Dispatch<SetStateAction<SpeechRecognitionState>>
}

// #endregion: Types

// Check if browser is Chrome (excluding Edge)
const isChromeDetection = (): boolean => {
    // TODO: For tests, may update
    if (typeof navigator === "undefined" || !navigator.userAgent) return false

    return (
        /Chrome/u.test(navigator.userAgent) && !/Edge/u.test(navigator.userAgent) && !/Edg\//u.test(navigator.userAgent)
    )
}

// Check browser/platform support
export const checkSpeechSupport = (): boolean => {
    if (typeof window === "undefined") return false

    // Check if browser supports SpeechRecognition
    const hasSpeechRecognition = "SpeechRecognition" in window

    // Only Chrome provides reliable speech recognition support
    return hasSpeechRecognition && isChromeDetection()
}

// Handle speech recognition start
const handleRecognitionStart =
    (
        setVoiceInputState: Dispatch<SetStateAction<SpeechRecognitionState>>
    ) =>
    (): void => {
        setVoiceInputState((prev) => ({
            ...prev,
            isListening: true,
            currentTranscript: "",
            isProcessingSpeech: true,
        }))
    }

// Handle speech recognition end
const handleRecognitionEnd =
    (
        setVoiceInputState: Dispatch<SetStateAction<SpeechRecognitionState>>
    ) =>
    (): void => {
        setVoiceInputState((prev) => ({
            ...prev,
            isListening: false,
            isProcessingSpeech: false,
        }))
    }

// Handle speech recognition results
const handleRecognitionResult =
    (
        setVoiceInputState: Dispatch<SetStateAction<SpeechRecognitionState>>,
        setChatInput: Dispatch<SetStateAction<string>>
    ) =>
    (event: SpeechRecognitionEvent): void => {
        // interimTranscript: accumulates live (non-final) results for real-time feedback (currentTranscript).
        let interimTranscript = ""
        // finalTranscript: accumulates finalized results for input (finalTranscript).
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
                // Finalized segment, ready for input
                finalTranscript += transcript
            } else {
                // Live segment, for real-time feedback
                interimTranscript += transcript
            }
        }

        setVoiceInputState((prev) => ({
            ...prev,
            currentTranscript: interimTranscript,
            finalTranscript,
            // Always show loading indicator while listening, until final transcript or recognition end
            isProcessingSpeech: true,
        }))

        // Process final transcript
        if (finalTranscript) {
            setVoiceInputState((prev) => ({
                ...prev,
                isProcessingSpeech: false,
            }))
            setChatInput((prev: string) => {
                const needsSpace = prev && !prev.endsWith(" ")
                return prev + (needsSpace ? " " : "") + finalTranscript
            })
        }
    }

// Handle speech recognition errors
const handleRecognitionError =
    (
        setVoiceInputState: Dispatch<SetStateAction<SpeechRecognitionState>>
    ) =>
    (event: SpeechRecognitionErrorEvent): void => {
        console.error("Speech recognition error:", event.error)
        setVoiceInputState((prev) => ({
            ...prev,
            isListening: false,
            isProcessingSpeech: false,
        }))
    }

// Remove speech recognition event handlers and stop speech recognition
export const cleanupAndStopSpeechRecognition = (
    speechRecognition: SpeechRecognition | null,
    eventHandlers: SpeechRecognitionEventHandlers
): void => {
    if (!speechRecognition) return

    // TODO: For tests, may update
    if (typeof speechRecognition.removeEventListener === "function") {
        speechRecognition.removeEventListener("start", eventHandlers.onStart)
        speechRecognition.removeEventListener("end", eventHandlers.onEnd)
        speechRecognition.removeEventListener("result", eventHandlers.onResult)
        speechRecognition.removeEventListener("error", eventHandlers.onError)
    }

    try {
        speechRecognition.stop()
    } catch (error) {
        console.warn("Error stopping speechRecognition:", error)
    }
}

export const setupSpeechRecognition = ({setChatInput, setVoiceInputState}: UseSpeechRecognitionProps): {
    speechRecognitionRef: MutableRefObject<SpeechRecognition | null>
    speechSupported: boolean
} => {
    const speechRecognitionRef = useRef<SpeechRecognition | null>(null)
    const speechSupported = checkSpeechSupport()

    // Create stable event handlers using useMemo
    const eventHandlers = useMemo(
        (): SpeechRecognitionEventHandlers => ({
            onStart: handleRecognitionStart(setVoiceInputState),
            onEnd: handleRecognitionEnd(setVoiceInputState),
            onResult: handleRecognitionResult(setVoiceInputState, setChatInput),
            onError: handleRecognitionError(setVoiceInputState),
        }),
        [setChatInput, setVoiceInputState]
    )

    if (speechSupported) {
        const speechRecognition = new SpeechRecognition()

        speechRecognition.continuous = true
        speechRecognition.interimResults = true
        speechRecognition.lang = navigator.language || "en-US"

        speechRecognition.addEventListener("start", eventHandlers.onStart)
        speechRecognition.addEventListener("end", eventHandlers.onEnd)
        speechRecognition.addEventListener("result", eventHandlers.onResult)
        speechRecognition.addEventListener("error", eventHandlers.onError)

        speechRecognitionRef.current = speechRecognition
        
    } else {
        speechRecognitionRef.current = null
    }

    return {
        speechRecognitionRef,
        speechSupported,
    }
}

// Request microphone permission
const requestMicrophonePermission = async (): Promise<boolean> => {
    if (!isChromeDetection()) return false

    if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            })
            stream.getTracks().forEach((track) => track.stop())
            return true
        } catch (error: unknown) {
            if (
                error instanceof Error &&
                (error.name === "NotAllowedError" || error.name === "PermissionDeniedError")
            ) {
                return false
            }
            // For other errors, still allow recognition to proceed (Chrome supports it)
            return true
        }
    }
    return false
}

// Toggle listening function
export const toggleListening = async (
    recognition: SpeechRecognition | null,
    voiceInputState: SpeechRecognitionState,
): Promise<void> => {
    if (!recognition) return

    if (voiceInputState.isListening) {
        recognition.stop()
    } else {
        // Request microphone permission before starting
        const hasPermission = await requestMicrophonePermission()
        if (hasPermission) {
            recognition.start()
        }
    }
}

