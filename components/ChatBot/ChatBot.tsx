import ContactSupportIcon from "@mui/icons-material/ContactSupport"
import Box from "@mui/material/Box"
import {useState} from "react"
import {FC} from "react"
import {ChatCommon} from "../AgentChat/ChatCommon"
import {LegacyAgentType} from "../AgentChat/Types"
import {AgentType} from "../../generated/metadata"

interface ChatBotProps {
    readonly id: string
    readonly userAvatar: string
    readonly pageContext: string
}

export const ChatBot: FC<ChatBotProps> = ({id, userAvatar, pageContext}) => {
    const [chatOpen, setChatOpen] = useState<boolean>(false)
    const [isAwaitingLlm, setIsAwaitingLlm] = useState<boolean>(false)

    return chatOpen ? (
        <Box
            sx={{
                position: "fixed",
                bottom: 600,
                right: 0,
                display: "flex",
                backgroundColor: "white",
                opacity: 1,
                // alignItems: "center",
                // justifyContent: "center",
                // width: 100,
                height: 200,
                width: 400,
                zIndex: 99999,
            }}
        >
            <ChatCommon
                id="chatbot-window"
                currentUser="test"
                userImage=""
                setIsAwaitingLlm={setIsAwaitingLlm}
                isAwaitingLlm={isAwaitingLlm}
                targetAgent={AgentType.HELLO_WORLD}
                setChatHistory={() => {}}
                getChatHistory={() => []}
            />
        </Box>
    ) : (
        <Box
            sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: 3,
                cursor: "pointer",
            }}
        >
            <ContactSupportIcon
                sx={{fontSize: 48}}
                onClick={() => setChatOpen(!chatOpen)}
            />
        </Box>
    )
}
