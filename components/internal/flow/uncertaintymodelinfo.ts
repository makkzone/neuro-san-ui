/*
Configuration settings and constants for uncertainty model node configuration popup
 */

type UncertaintyModelParameterType = boolean|number|string|[]

export enum ParamType {
    BOOLEAN,
    STRING,
    INT,
    ENUM
}

enum KernelType {
    RBF = 0,
    RBFY = 1,
    RBF_PLUS_RBF = 2
}

enum FrameworkVariant {
    GP_CORRECTED = 0,
    GP_CORRECTED_INPUT_ONLY = 1,
    GP_CORRECTED_OUTPUT_ONLY = 2,
    GP = 3,
    GP_INPUT_ONLY = 4,
    GP_OUTPUT_ONLY = 5
}

enum ConfidenceInterval {
    C50 = 50,
    C75 = 75,
    C90 = 90,
    C95 = 95,
    C99 = 99
}

export interface UncertaintyModelParamField {
    defaultValue: UncertaintyModelParameterType,
    description: string,

    // Data type of the parameter
    type: ParamType,

    // List of all available values. Only used for Enum types.
    allValues?: string[]

    // Value is an optional field that can be used within a form
    // etc to denote user input
    value?: UncertaintyModelParameterType
}

export interface UncertaintyModelParamMapping {
    [key: string]: UncertaintyModelParamField
}


export const UNCERTAINTY_MODEL_PARAMS: UncertaintyModelParamMapping = {
    "confidence_interval": {
        defaultValue: ConfidenceInterval.C95,
        description: "Confidence interval for uncertainty model corrections",
        type: ParamType.ENUM,
        allValues: Object.keys(ConfidenceInterval)

    },

    "use_ard": {
        defaultValue: true,
        description: "Enable Automatic Relevance Determination (ARD)",
        type: ParamType.BOOLEAN
    },

    "max_iterations_optimizer": {
        defaultValue: 1000,
        description: "Maximum iterations for optimizer",
        type: ParamType.INT
    },

    "num_svgp_inducing_points": {
        defaultValue: 50,
        description: "Number of inducing points for the SVGP model",
        type: ParamType.INT
    },

    "framework_variant": {
        defaultValue: FrameworkVariant.GP_CORRECTED,
        description: "Framework variant to use",
        type: ParamType.ENUM,
        allValues: Object.keys(FrameworkVariant)
    },

    "kernel_type": {
        defaultValue: KernelType.RBF_PLUS_RBF,
        description: "Kernel type to use to train the model",
        type: ParamType.ENUM,
        allValues: Object.keys(KernelType)
    }

}
