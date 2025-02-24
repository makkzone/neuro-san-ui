import {styled} from "@mui/material"
import {capitalize, startCase} from "lodash"
import NextImage from "next/image"
import {ReactElement} from "react"

import {DEFAULT_USER_IMAGE} from "../../const"
import {AgentType as NeuroSanAgentType} from "../../generated/metadata"

// Delimiter for separating logs from agents
export const LOGS_DELIMITER = ">>>"

// #region: Styled Components

const UserQueryContainer = styled("div")({
    backgroundColor: "#FFF",
    borderRadius: "8px",
    boxShadow: "0 0px 2px 0 rgba(0, 0, 0, 0.15)",
    display: "inline-flex",
    padding: "10px",
})

// #endregion: Styled Components

export type LegacyAgentType = "OpportunityFinder" | "ScopingAgent" | "DataGenerator" | "OrchestrationAgent"

export type CombinedAgentType = LegacyAgentType | NeuroSanAgentType

/**
 * Models the error we receive from neuro-san agents.
 */
export interface AgentErrorProps {
    error: string
    traceback?: string
    tool?: string
}

/**
 * Errors thrown by callback when the agent fails.
 */
export class AgentError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "AgentError"
    }
}

/**
 * Convert FOO_BAR to more human "Foo Bar"
 * @param agentName Agent name in SNAKE_CASE format.
 * @returns User-friendly agent name.
 */
export function cleanUpAgentName(agentName: string): string {
    return startCase(capitalize(agentName))
}

export const getUserImageAndUserQuery = (userQuery: string, title: string, userImage: string): ReactElement => (
    // eslint-disable-next-line enforce-ids-in-jsx/missing-ids
    <div style={{marginBottom: "1rem"}}>
        {/* eslint-disable-next-line enforce-ids-in-jsx/missing-ids */}
        <UserQueryContainer>
            <NextImage
                id="user-query-image"
                src={userImage || DEFAULT_USER_IMAGE}
                width={30}
                height={30}
                title={title}
                alt=""
                unoptimized={true}
            />
            <span
                id="user-query"
                style={{marginLeft: "0.625rem", marginTop: "0.125rem"}}
            >
                {userQuery}
            </span>
        </UserQueryContainer>
    </div>
)
