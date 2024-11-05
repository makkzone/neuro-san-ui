import {useRef, useState} from "react"
import {sendDalleQuery} from "../../../controller/dall-e/dall-e"
import NewBar from "../../newbar"
import {Button, Container} from "react-bootstrap"
import {MaximumBlue} from "../../../const"

// #region: Types
interface UIMockupGeneratorProps {
    userQuery: string
}
// #endregion: Types

export const UIMockupGenerator: React.FC<UIMockupGeneratorProps> = ({userQuery}) => {
    const [mockupURL, setMockupURL] = useState<string>("")
    const [showUIMockup, setShowUIMockup] = useState<boolean>(false)

    // Controller for cancelling fetch request
    const controller = useRef<AbortController>(null)

    // Sends query to backend to send to Dall-e via Langchain.
    async function sendUserQueryToDalle() {
        try {
            const abortController = new AbortController()
            controller.current = abortController

            const response = await sendDalleQuery(userQuery)
            setMockupURL(response.imageURL)
            setShowUIMockup(true) // TODO: Switch to magic wand instead of big section
        } catch (error) {
            // log error to console
            // TODO: Check that error handling is working
            console.error(error)
        }
    }

    return (
        <>
            <div>
                <NewBar
                    id="dms-mockup-bar"
                    InstanceId="dms-mockup"
                    Title="User Interface"
                    DisplayNewLink={false}
                />
                <Button
                    className="mt-4 mb-4"
                    id="dms-mockup"
                    onClick={sendUserQueryToDalle}
                    size="lg"
                    style={{background: MaximumBlue, borderColor: MaximumBlue, width: "100%"}}
                >
                    Generate User Interface
                </Button>
            </div>
            <Container
                key="mockup-container"
                id="mockup-container"
                style={{justifyContent: "left"}}
            >
                <img
                    alt="ui-mockup"
                    className={!showUIMockup ? "hidden" : null}
                    height={500}
                    id="ui-mockup"
                    src={mockupURL}
                    width={1000}
                />
            </Container>
        </>
    )
}
