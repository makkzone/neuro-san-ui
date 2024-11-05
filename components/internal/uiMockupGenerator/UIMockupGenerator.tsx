import NextImage from "next/image"
import {StringToStringOrNumber} from "../../../controller/base_types"
import {Run} from "../../../controller/run/types"
import {useRef, useState} from "react"
import {sendDalleQuery} from "../../../controller/dall-e/dall-e"
import {HumanMessage} from "@langchain/core/messages"
import NewBar from "../../newbar"
import {Button, Container} from "react-bootstrap"
import {MaximumBlue} from "../../../const"

// #region: Types
interface UIMockupGeneratorProps {
    userQuery: string
}
// #endregion: Types

export const UIMockupGenerator: React.FC<UIMockupGeneratorProps> = ({userQuery}) => {
    const [mockupURL, setMockupURL] = useState<string>("") // not sure which type yet, maybe a blob?
    const [showUIMockup, setShowUIMockup] = useState<boolean>(false)

    // Controller for cancelling fetch request
    const controller = useRef<AbortController>(null)

    const generateMockup = () => {
        // eslint-disable-next-line max-len
        setMockupURL(
            "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirznXLjClkxMHiW19yZlpe-1qL27ilMi5e57nsML60zLGVql2ZVIv0qDDEN32mWcTJSZcOBsP_ga5k1vt3o7gPrQD1DTh2pUUWmCeYyxs2JuFR0F3_ne7YpseQRWfy6coMNoggJa_zNQY/w1200-h630-p-k-no-nu/Dilbert%2520Software%2520Demo%5B1%5D.jpg"
        )
        setShowUIMockup(true)
        sendQueryToDalle()
    }

    // Sends query to backend to send to Dall-e via Langchain.
    async function sendQueryToDalle() {
        try {
            const abortController = new AbortController()
            controller.current = abortController

            // Send the query to the server. Response will be streamed to our callback which updates the output
            // display as tokens are received.
            /*await sendDalleQuery(
                userQuery,
                contextInputs,
                prescriptorUrl,
                predictorUrls,
                renderMockup,
                abortController.signal,
                run,
                [new HumanMessage(userQuery)],
                projectName,
                projectDescription
            )*/
        } catch (error) {
            // log error to console
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
                    onClick={generateMockup}
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
