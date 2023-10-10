/**
 * This is the module for the "AI decision assistant".
 */
import {Button, Form, InputGroup} from "react-bootstrap"
import {Drawer} from "antd"
import {MaximumBlue} from "../../../const"
import {sendDmsChatQuery} from "../../../controller/dmschat/dmschat"
import {StringToStringOrNumber} from "../../../controller/base_types"
import {useState} from "react"

/**
 * AI asssistant, intitially for DMS page but in theory could be used elsewhere.
 */
export function AIAssistant(props: {
    predictorUrls: string[]
    prescriptorUrl: string
    contextInputs: StringToStringOrNumber
    onClose: () => void
    open: boolean
    resetUndeployModelsTimer: () => void,
}) {

    // User LLM chat input
    const [userLlmChatInput, setUserLlmChatInput] = useState<string>("")

    // User LLM chat output
    const [userLlmChatOutput, setUserLlmChatOutput] = useState<string>("")

    // Stores whether are currently awaiting LLM response (for knowing when to show spinners)
    const [isAwaitingLlm, setIsAwaitingLlm] = useState(false)

    /**
     * Handler for user query.
     *
     * @param event The event containing the user query
     */
    async function handleUserQuery(event) {
        // Prevent submitting form
        event.preventDefault()

        // Extract user query from event
        const userQuery = event.target[1].value

        try {
            // User interacted so reset timer
            props.resetUndeployModelsTimer()

            setIsAwaitingLlm(true)

            // Always start output by echoing user query
            setUserLlmChatOutput(`Query: ${userQuery}\n\n`)

            // Send the query to the server. Response will be streamed to our callback which updates the output
            // display as tokens are received.
            await sendDmsChatQuery(userQuery, props.contextInputs, props.prescriptorUrl,
                props.predictorUrls, token => setUserLlmChatOutput((currentOutput) => currentOutput + token))
        } catch (e) {
            setUserLlmChatOutput(`Internal error: \n\n${e}\n 
More information may be available in the browser console.`)
            console.error(e.stack)
        } finally {
            // Reset state, whatever happened during request
            setIsAwaitingLlm(false)
            setUserLlmChatInput("")
        }
    }

    const handleUserLlmChatInputChange = (event) => {
        const inputText = event.target.value
        setUserLlmChatInput(inputText)
    };

    // Regex to check if user has typed anything besides whitespace
    const userInputEmpty = !(/\S/u).test(userLlmChatInput)

    // Disable Send when request is in progress
    const shouldDisableSendButton = userInputEmpty || isAwaitingLlm

    return <Drawer // eslint-disable-line enforce-ids-in-jsx/missing-ids
        title="AI Decision Assistant"
        placement="right"
        closable={true}
        onClose={props.onClose}
        open={props.open}
        width={"35%"}
        destroyOnClose={true}
    >
        <Form id="user-query-form" onSubmit={handleUserQuery}>
            <Form.Group id="llm-chat-group">
                <div id="llm-response-div" style={{width: "97%", height: "80vh", margin: "10px"}}>
                    <Form.Control
                        id="llm-responses"
                        readOnly={true}
                        as="textarea"
                        style={{
                            whiteSpace: "pre-wrap",
                            height: "100%",
                            background: "ghostwhite",
                            borderColor: MaximumBlue,
                            resize: "none",
                            fontFamily: "monospace",
                            fontSize: "smaller"
                        }}
                        value={userLlmChatOutput}
                    />
                </div>
                <div id="user-input-div" style={{display: "flex"}}>
                    <InputGroup id="user-input-group">
                        <Form.Control id="user-input"
                                      placeholder="What are the current prescribed actions?"
                                      value={userLlmChatInput}
                                      style={{
                                          marginLeft: "5px",
                                          fontSize: "90%"
                                      }}
                                      onChange={handleUserLlmChatInputChange}
                        />
                        <Button id="clear-input-button"
                                onClick={() => setUserLlmChatInput("")}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    fontWeight: 550,
                                    left: "calc(100% - 30px)",
                                    lineHeight: "35px",
                                    position: "absolute",
                                    width: "10px",
                                    zIndex: 99999
                                }}
                        >
                            X
                        </Button>
                    </InputGroup>
                    <Button id="submit-query-button"
                            variant="primary"
                            type="submit"
                            disabled={shouldDisableSendButton}
                            style={{
                                background: MaximumBlue,
                                borderColor: MaximumBlue,
                                color: "white",
                                opacity: shouldDisableSendButton ? "50%" : "100%",
                                marginLeft: "10px",
                                marginRight: "10px"
                            }}
                    >
                        Send
                    </Button>
                </div>
            </Form.Group>
        </Form>
    </Drawer>;
}