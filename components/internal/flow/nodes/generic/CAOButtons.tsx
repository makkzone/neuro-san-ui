import {Text as EvergreenText, Popover, Position} from "evergreen-ui"
import {Card} from "react-bootstrap"

// Renders the C A O call to action buttons on the flow node.
const CAOButtons = (props) => {
    const {ParentNodeState, SetParentNodeState, flowPrefix, idExtension} = props

    const onUpdateCAOState = (event, espType: string) => {
        // eslint-disable-next-line no-shadow
        const {name, checked} = event.target
        const caoStateCopy = {...ParentNodeState.caoState}

        caoStateCopy[espType][name] = checked

        SetParentNodeState({
            ...ParentNodeState,
            caoState: caoStateCopy,
        })
    }

    return (
        <>
            <Popover // eslint-disable-line enforce-ids-in-jsx/missing-ids
                // 2/6/23 DEF - Tooltip does not have an id property when compiling
                position={Position.LEFT}
                content={
                    <Card.Body
                        id={`${flowPrefix}-context-card${idExtension}`}
                        className="overflow-y-auto h-40 text-xs"
                    >
                        <EvergreenText
                            id={`${flowPrefix}-context-text${idExtension}`}
                            className="mb-2"
                        >
                            Context
                        </EvergreenText>
                        {Object.keys(ParentNodeState?.caoState?.context).map((element) => (
                            <div
                                id={`${flowPrefix}-context-div${idExtension}`}
                                key={element}
                                className="grid grid-cols-2 gap-4 mb-2"
                            >
                                <label
                                    id={`${flowPrefix}-context-label-${element}${idExtension}`}
                                    className="capitalize"
                                >
                                    {" "}
                                    {element}{" "}
                                </label>
                                <input
                                    name={element}
                                    id={`${flowPrefix}-context-input-${element}${idExtension}`}
                                    type="checkbox"
                                    defaultChecked={true}
                                    checked={ParentNodeState?.caoState?.context[element]}
                                    onChange={(event) => onUpdateCAOState(event, "context")}
                                />
                            </div>
                        ))}
                    </Card.Body>
                }
            >
                <button
                    type="button"
                    id={`${flowPrefix}-context-button${idExtension}`}
                    className="absolute top-2 -left-4"
                    style={{height: 0}}
                >
                    C
                </button>
            </Popover>
            <Popover // eslint-disable-line enforce-ids-in-jsx/missing-ids
                // 2/6/23 DEF - Tooltip does not have an id property when compiling
                position={Position.LEFT}
                content={
                    <Card.Body
                        id={`${flowPrefix}-actions-card${idExtension}`}
                        className="overflow-y-auto h-40 text-xs"
                        style={{zIndex: 1000}}
                    >
                        <EvergreenText
                            id={`${flowPrefix}-actions-text${idExtension}`}
                            className="mb-2"
                        >
                            Actions
                        </EvergreenText>
                        {Object.keys(ParentNodeState.caoState.action).map((element) => (
                            <div
                                id={`${flowPrefix}-actions-div-${element}${idExtension}`}
                                key={element}
                                className="grid grid-cols-2 gap-4 mb-2"
                            >
                                <label
                                    id={`${flowPrefix}-actions-label-${element}${idExtension}`}
                                    className="capitalize"
                                >
                                    {" "}
                                    {element}{" "}
                                </label>
                                <input
                                    id={`${flowPrefix}-actions-input-${element}${idExtension}`}
                                    name={element}
                                    type="checkbox"
                                    defaultChecked={true}
                                    checked={ParentNodeState.caoState.action[element]}
                                    onChange={(event) => onUpdateCAOState(event, "action")}
                                />
                            </div>
                        ))}
                    </Card.Body>
                }
            >
                <button
                    type="button"
                    id={`${flowPrefix}-actions-button${idExtension}`}
                    className="absolute bottom-6 -left-4"
                    style={{height: 0}}
                >
                    A
                </button>
            </Popover>
            <Popover // eslint-disable-line enforce-ids-in-jsx/missing-ids
                // 2/6/23 DEF - Tooltip does not have an id property when compiling
                position={Position.RIGHT}
                content={
                    <Card.Body
                        id={`${flowPrefix}-outcomes-card${idExtension}`}
                        className="overflow-y-auto h-40 text-xs"
                    >
                        <EvergreenText
                            id={`${flowPrefix}-outcomes-text${idExtension}`}
                            className="mb-2"
                        >
                            Outcomes
                        </EvergreenText>
                        {Object.keys(ParentNodeState.caoState.outcome).map((element) => (
                            <div
                                id={`${flowPrefix}-outcomes-div-${element}${idExtension}`}
                                key={element}
                                className="grid grid-cols-2 gap-4 mb-2"
                            >
                                <label
                                    id={`${flowPrefix}-outcomes-label-${element}${idExtension}`}
                                    className="capitalize"
                                >
                                    {" "}
                                    {element}{" "}
                                </label>
                                <input
                                    name={element}
                                    id={`${flowPrefix}-outcomes-input-${element}${idExtension}`}
                                    type="checkbox"
                                    defaultChecked={false}
                                    checked={ParentNodeState.caoState.outcome[element]}
                                    onChange={(event) => onUpdateCAOState(event, "outcome")}
                                />
                            </div>
                        ))}
                    </Card.Body>
                }
            >
                <button
                    id={`${flowPrefix}-outcomes-button${idExtension}`}
                    type="button"
                    className="absolute top-5 -right-4"
                    style={{height: 0}}
                >
                    O
                </button>
            </Popover>
        </>
    )
}

export default CAOButtons
