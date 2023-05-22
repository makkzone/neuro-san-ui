/*
Configuration settings and constants for LLM model node configuration popup
 */

type LlmParameterType = boolean|number|string|[]

export enum ParamType {
    BOOLEAN,
    STRING,
    INT,
    FLOAT,
    ENUM
}

enum LlmModel {
    "GPT 3.5" = "GPT_3_5",
    "GPT 4" = "GPT_4",
    "Vecunda" = "Vecunda",
    "BYOM" = "Bring your own model",
    "Custom" = "Custom"
}

enum PromptTemplate {
    "Repair data" = "Repair Data",
    "Augment data" = "Augment Data"
}

interface LlmParamField {
    description: string,

    // Data type of the parameter
    type: ParamType,

    // List of all available values. Only used for Enum types.
    allValues?: string[]

    // Default value for the field
    default_value: LlmParameterType

    // Value is an optional field that can be used within a form
    // etc to denote user input
    value?: LlmParameterType

    min?: number,
    max?: number,
    step?: number,

    isAdvanced: boolean
}

export interface LlmModelParams {
    [key: string]: LlmParamField
}

export const LLM_MODEL_PARAMS: LlmModelParams = {
    "model": {
        default_value: LlmModel["GPT 3.5"].valueOf(),
        description: "Large Language Model (LLM) to be used",
        type: ParamType.ENUM,
        allValues: Object.values(LlmModel).filter((v) => isNaN(Number(v))).map(v => String(v)),
        isAdvanced: false
    },

    "prompt_template": {
        default_value: PromptTemplate["Repair data"].valueOf(),
        description: "Choose a pre-created template or write your own prompt",
        type: ParamType.ENUM,
        allValues: Object.values(PromptTemplate).filter((v) => isNaN(Number(v))).map(v => String(v)),
        isAdvanced: false
    },

    "system_prompt": {
        default_value:
`The data below is incomplete and includes NA values.
Also, the <field2> field is unstructured.

Fill in any NA field with an appropriate value and classify the <field2> field into a new column titled <field3>,
with one of the following values: low, moderate, high: <field1>`,
        description: "System prompt for the LLM",
        type: ParamType.STRING,
        isAdvanced: false
    }
}
