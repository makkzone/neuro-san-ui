const shouldDisableOutcome = (outcome, predictorType, fields) => {
    if (fields) {
        const outcomeType = fields[outcome].valued
        if (
            (outcomeType === "CONTINUOUS" && predictorType === "classifier") ||
            (outcomeType === "CATEGORICAL" && predictorType === "regressor")
        ) {
            return true
        }
    }

    return false
}

// Include disabled property in outcomes object to be grayed out depending on predictor types
export const formatOutcomes = (parentNodeState, fields) => {
    const result = {}
    for (const outcome in parentNodeState.caoState.outcome) {
        if (Object.hasOwn(parentNodeState.caoState.outcome, outcome)) {
            const shouldDisable = shouldDisableOutcome(outcome, parentNodeState.selectedPredictorType, fields)
            result[outcome] = {
                outcome: shouldDisable ? false : parentNodeState.caoState.outcome[outcome],
                disabled: shouldDisable,
            }
        }
    }

    return result
}
