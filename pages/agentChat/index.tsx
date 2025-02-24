import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import {useState} from "react"

import {AgentChatCommon} from "../../components/AgentChat/AgentChatCommon"
import {sendStreamingChatRequest} from "../../components/AgentChat/AgentChatHandling"
import {cleanUpAgentName} from "../../components/AgentChat/common"
import {InfoTip} from "../../components/infotip"
import NewBar from "../../components/newbar"
import {AgentType} from "../../generated/metadata"
import {useAuthentication} from "../../utils/authentication"

// Has to be export default for NextJS so tell ts-prune to ignore
// ts-prune-ignore-next
export default function AgentChatPage() {
    // For access to logged in session and current user name
    const {
        user: {image: userImage, name: currentUser},
    } = useAuthentication().data

    // Selected option for agent to interact with
    const [targetAgent, setTargetAgent] = useState<AgentType>(AgentType.TELCO_NETWORK_SUPPORT)

    // Stores whether are currently awaiting LLM response (for knowing when to show spinners)
    const [isAwaitingLlm, setIsAwaitingLlm] = useState<boolean>(false)

    return (
        <>
            <NewBar
                id="projects-bar"
                InstanceId="agent_chat"
                Title="Neuro-san Agent Chat"
                DisplayNewLink={false}
                InfoTip={
                    <InfoTip
                        id="projects"
                        info={AgentChatPage.pageContext}
                        size={25}
                    />
                }
            />
            <FormControl
                id="agent-select-control"
                sx={{marginTop: "1rem"}}
            >
                <InputLabel
                    id="agent-label"
                    shrink={true}
                >
                    Agent
                </InputLabel>
                <Select
                    id="agent-select"
                    label="Agent"
                    value={targetAgent}
                    sx={{width: "15rem"}}
                    onChange={(event) => setTargetAgent(event.target.value as AgentType)}
                >
                    {Object.keys(AgentType)
                        .sort()
                        .map((agentType) => (
                            <MenuItem
                                key={agentType}
                                id={agentType}
                                value={agentType}
                            >
                                {cleanUpAgentName(agentType)}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <AgentChatCommon
                id="agent-chat-demo"
                currentUser={currentUser}
                userImage={userImage}
                setIsAwaitingLlm={setIsAwaitingLlm}
                isAwaitingLlm={isAwaitingLlm}
                sendFunction={sendStreamingChatRequest}
                targetAgent={targetAgent}
            />
        </>
    )
}

AgentChatPage.authRequired = true
AgentChatPage.pageContext = "Chat with any Neuro-san agent."
