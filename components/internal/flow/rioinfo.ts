/*
Configuration settings and constants for RIO node configuration popup
 */

/*
 framework_variant: FrameworkVariant = FrameworkVariant.GP_CORRECTED,
              kernel_type: KernelType = KernelType.RBF_PLUS_RBF,
 */


type RioParameterType = boolean|number|string

enum ParamType {
    BOOLEAN,
    STRING,
    NUMBER,
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
    C5 = 5,
    C10 = 10,
    C15 = 15,
    C20 = 20,
    C95 = 95
}

export interface RioParamField {
    defaultValue: RioParameterType,
    description: string,

    // Data type of the parameter
    type: ParamType,
    enumType?: {[key:string]: string | number}

    // Value is an optional field that can be used within a form
    // etc to denote user input
    value?: RioParameterType
}


export const RIO_PARAMS = {
    "confidence_interval": {
        defaultValue: ConfidenceInterval.C95,
        description: "Confidence interval for RIO corrections",
        type: ParamType.ENUM,
        enumType: typeof(ConfidenceInterval)
    },

    "use_ard": {
        defaultValue: true,
        description: "Enable Automatic Relevance Determination (ARD)",
        type: ParamType.BOOLEAN
    },

    "max_iterations_optimizer": {
        defaultValue: 1000,
        description: " number of maximum iterations for optimizer",
        type: ParamType.NUMBER
    },

    "num_svgp_inducing_points": {
        defaultValue: 50,
        description: "number of inducing points for the SVGP model",
        type: ParamType.NUMBER
    },

    "framework_variant": {
        defaultValue: FrameworkVariant.GP_CORRECTED,
        description: "framework variant to use",
        type: ParamType.ENUM,
        enumType: typeof(FrameworkVariant)
    }

}
