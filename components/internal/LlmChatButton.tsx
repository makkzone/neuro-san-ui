import {styled} from "@mui/material"
import Button from "@mui/material/Button"

// #region: Types

type LLMChatGroupConfigBtnProps = {
    disabled?: boolean
    posRight?: number
    posBottom?: number
}

// #endregion: Types

export const LlmChatButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "posRight" && prop !== "posBottom",
})<LLMChatGroupConfigBtnProps>(({disabled, posRight, posBottom}) => ({
    background: "var(--bs-primary) !important",
    borderRadius: "var(--bs-border-radius)",
    bottom: posBottom !== undefined ? posBottom : "10px",
    right: posRight !== undefined ? posRight : "10px",
    position: "absolute",
    zIndex: 99999,
    opacity: disabled ? "50%" : "70%",
    cursor: disabled ? "default" : "pointer",
}))
