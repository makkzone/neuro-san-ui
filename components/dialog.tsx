import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { SxProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// #region: Types
interface DialogProps {
    children: React.ReactNode
    onClose: () => void
    open: boolean
    sx?: SxProps,
    title?: string
}
// #endregion: Types

export const MUIDialog: React.FC<DialogProps> = ({
    children,
    onClose,
    open,
    sx,
    title,
}) => (
    <Dialog
        onClose={onClose}
        open={open}
        sx={sx}
    >
        <DialogTitle>{title}</DialogTitle>
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            })}
            >
            <CloseIcon />
        </IconButton>
        <DialogContent>
            {children}
        </DialogContent>
    </Dialog>
)
