import {ClickAwayListener} from "@mui/base/ClickAwayListener"
import {Button, Popper, PopperPlacementType} from "@mui/material"
import {CSSProperties, ReactNode, useState} from "react"

import {ZIndexLayers} from "../utils/zIndexLayers"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    btnContent: string | ReactNode
    id: string
}

interface NodePopperProps {
    id: string
    className?: string
    placement?: PopperPlacementType
    style?: CSSProperties
}

const NodePopper = ({
    popperProps,
    buttonProps,
    children,
}: {
    popperProps: NodePopperProps
    buttonProps?: ButtonProps
    children: ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const {btnContent, onClick: btnClick, id: btnId} = buttonProps
    const {id: popperId, ...restPopperProps} = popperProps

    const handleClick = (event) => {
        setIsOpen((prev) => !prev)
        setAnchorEl(anchorEl ? null : event.currentTarget)
        if (btnClick) {
            btnClick(event)
        }
    }

    const handleClickAway = () => {
        setIsOpen(false)
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                id={btnId}
                onClick={handleClick}
            >
                {btnContent}
            </Button>
            <ClickAwayListener // eslint-disable-line enforce-ids-in-jsx/missing-ids
                mouseEvent="onPointerUp"
                touchEvent="onTouchStart"
                onClickAway={handleClickAway}
            >
                <Popper
                    {...restPopperProps}
                    id={popperId}
                    open={isOpen}
                    anchorEl={anchorEl}
                    sx={{zIndex: ZIndexLayers.LAYER_2}}
                >
                    {children}
                </Popper>
            </ClickAwayListener>
        </>
    )
}

export default NodePopper
