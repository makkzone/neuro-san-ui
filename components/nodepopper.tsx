import { CSSProperties, ReactNode, useState } from 'react';
import { Popper, PopperPlacementType } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    btnContent: string | ReactNode
}

interface NodePopperProps  {
    id: string,
    className?: string,
    placement?: PopperPlacementType
    style?: CSSProperties
}

const NodePopper = ({ popperProps, buttonProps, children }: {
    popperProps: NodePopperProps,
    buttonProps?: ButtonProps
    children: ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { btnContent, onClick: btnClick, ...restBtnProps } = buttonProps;

    const handleClick = (event) => {
        console.log('called')
        setIsOpen((prev) => !prev);
        setAnchorEl(anchorEl ? null : event.currentTarget);
        if (btnClick) {
            btnClick(event);
        }
    };

    const handleClickAway = () => {
        setIsOpen(false);
        setAnchorEl(null);
    };

    return (
        <div>
            <button {...restBtnProps} type="button" onClick={handleClick}>
                {btnContent}
            </button>
            <ClickAwayListener
                mouseEvent="onPointerUp"
                touchEvent="onTouchStart"
                onClickAway={handleClickAway}
            >
                <Popper {...popperProps} open={isOpen} anchorEl={anchorEl}>
                    {children}
                </Popper>
            </ClickAwayListener>
        </div>
    );
}

export default NodePopper