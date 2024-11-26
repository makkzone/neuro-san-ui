import CloseIcon from "@mui/icons-material/Close"
import {SxProps} from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import {FC, ReactNode} from "react"

// #region: Types
interface DialogProps {
    children: ReactNode
    className?: string
    id: string
    isOpen: boolean
    onClose: () => void
    sx?: SxProps
    paperProps?: SxProps
    title?: string
}
// #endregion: Types

export const MUIDialog: FC<DialogProps> = ({children, className, id, onClose, isOpen, sx, paperProps, title}) => (
    <Dialog
        id={id}
        onClose={onClose}
        open={isOpen}
        className={className}
        PaperProps={paperProps}
    >
        <DialogTitle id={`${id}-title`}>{title}</DialogTitle>
        <IconButton
            aria-label="close"
            id={`${id}-close-icon-btn`}
            onClick={onClose}
            sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
            })}
        >
            <CloseIcon id={`${id}-close-icon`} />
        </IconButton>
        <DialogContent
            id={`${id}-content`}
            sx={sx}
        >
            {children}
        </DialogContent>
    </Dialog>
)
