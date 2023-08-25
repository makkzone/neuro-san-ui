/**
 * Common types for flow nodes
 */

/**
 * Type that encapsulates string and numeric enums
 */
type Enum = Record<string, string | number>

type ParameterType = boolean|number|string|Enum

export enum BaseParameterType {
    BOOLEAN,
    STRING,
    INT,
    FLOAT,
    ENUM
}

export interface ConfigurableNodeParameter {
    description: string,

    // Data type of the parameter
    type: BaseParameterType,

    // Associated enum, if this is an enum type parameter
    enum?: Enum

    // Default value for the field
    default_value: ParameterType

    // Value is an optional field that can be used within a form
    // etc to denote user input
    value?: ParameterType

    min?: number,
    max?: number,
    step?: number,

    isAdvanced: boolean,

    rows?: number
}

export interface NodeParams {
    [key: string]: ConfigurableNodeParameter
}
