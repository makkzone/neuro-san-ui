import {FC, useRef, useState} from "react"
import {sendDalleQuery} from "../../../controller/dall-e/dall-e"
import {Button} from "react-bootstrap"
import {MaximumBlue} from "../../../const"
import CircularProgress from '@mui/material/CircularProgress';
import { MUIDialog } from '../../dialog'

// #region: Types
interface UIMockupGeneratorProps {
    onClose: () => void
    open: boolean
    userQuery: string
}
// #endregion: Types

export const UIMockupGenerator: FC<UIMockupGeneratorProps> = ({
    onClose,
    open,
    userQuery,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [mockupURL, setMockupURL] = useState<string>("")

    // Controller for cancelling fetch request
    const controller = useRef<AbortController>(null)

    // Sends query to backend to send to Dall-e via Langchain.
    async function sendUserQueryToDalle() {
        setIsLoading(true)

        try {
            const abortController = new AbortController()
            controller.current = abortController

            const {response: {imageURL}} = await sendDalleQuery(userQuery)
            setIsLoading(false)
            setMockupURL(imageURL)
        } catch (error) {
            // log error to console
            // TODO: Check that error handling is working
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <>
            <MUIDialog
                onClose={onClose}
                open={open}
                title="User Interface"
            >
                { isLoading
                    ? <CircularProgress sx={{ display: "flex", margin: "0 auto" }}/>
                    : (
                        <img
                            alt="ui-mockup"
                            className={!mockupURL ? "hidden" : null}
                            height={500}
                            id="ui-mockup"
                            src={mockupURL}
                            width={1000}
                        />
                    )
                }
                <Button
                    className="mt-4 mb-4"
                    id="dms-mockup"
                    onClick={sendUserQueryToDalle}
                    size="lg"
                    style={{background: MaximumBlue, borderColor: MaximumBlue, width: "100%"}}
                >
                    Generate User Interface
                </Button>
            </MUIDialog>
        </>
    )
}
