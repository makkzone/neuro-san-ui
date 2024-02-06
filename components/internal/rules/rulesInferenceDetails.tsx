// Main function.
import ClipLoader from "react-spinners/ClipLoader"
// Has to be export default for NextJS so tell ts-prune to ignore
import SyntaxHighlighter from "react-syntax-highlighter"
import {docco} from "react-syntax-highlighter/dist/cjs/styles/hljs"

import {MaximumBlue} from "../../../const"
import {InfoTip} from "../../infotip"

export function RulesInferenceDetails(props: {
    inferenceRulesStats
    trainingRulesStats
    inferenceRulesString
    llmIntepretation
    isAccessingLlm: boolean
}) {
    return (
        <>
            <div style={{display: "flex"}}>
                <h5>From this inference request:</h5>
                <InfoTip
                    id="id-1"
                    info="This is the set of rules that were used to make the inference when you clicked Prescribe."
                />
            </div>
            <p />
            <div
                id="show_rules_inference"
                className="my-2 py-2"
                key="rules-div"
                style={{
                    whiteSpace: "pre",
                    backgroundColor: "whitesmoke",
                    overflowY: "scroll",
                    display: "block",
                    borderColor: "red",
                }}
            >
                <p>
                    <span style={{backgroundColor: "yellow"}}>Highlight</span> indicates that the rule fired during
                    inference on the model.
                </p>
                <SyntaxHighlighter
                    id="syntax-highlighter"
                    language="scala"
                    style={docco}
                    showLineNumbers={true}
                    wrapLines={true}
                    lineProps={(lineNumber) => {
                        return {
                            style: {
                                backgroundColor:
                                    (props.inferenceRulesStats[lineNumber - 1][1] as number) > 0 ? "yellow" : null,
                            },
                        }
                    }}
                >
                    {props.inferenceRulesString}
                </SyntaxHighlighter>
            </div>
            <p />
            <div style={{display: "flex"}}>
                <h5>From training:</h5>
                <InfoTip
                    id="id-1"
                    info={
                        "Shows how often each rule fired during the model training process. This is the same " +
                        "info that is shown on the Run results page."
                    }
                />
            </div>
            <div
                id="show_rules_training"
                className="my-2 py-2"
                key="rules-training-div"
                style={{
                    whiteSpace: "pre",
                    backgroundColor: "whitesmoke",
                    overflowY: "scroll",
                    display: "block",
                    borderColor: "red",
                }}
            >
                <SyntaxHighlighter
                    id="syntax-highlighter"
                    language="scala"
                    style={docco}
                    showLineNumbers={true}
                    minLines={1}
                >
                    {props.trainingRulesStats}
                </SyntaxHighlighter>
            </div>
            <p />
            <div style={{display: "flex"}}>
                <h5>LLM insights:</h5>
                <InfoTip
                    id="id-1"
                    info={
                        "The results of analysis by an LLM of the rules, both those used during inference for the " +
                        "current request and the aggregate results from training."
                    }
                />
            </div>
            <div>
                {props.isAccessingLlm ? (
                    <div>
                    Accessing LLM...
                    <ClipLoader // eslint-disable-line enforce-ids-in-jsx/missing-ids
                        color={MaximumBlue}
                        loading={true}
                        size={18}
                     />
                    </div>
                ) : (
                    <pre>{props.llmIntepretation}</pre>
                )}
            </div>
        </>
    )
}
