/*
Utilities for validating data tags etc.
 */

import {DataTagField, DataTagFieldCAOType} from "../../../generated/metadata"
import {NotificationType, sendNotification} from "../../notification"

// Sanity check on data tags before proceeding to creation or update
export function checkValidity(dataTagFields: Record<string, DataTagField>): boolean {
    // Must have one or more designated Contexts
    const hasContexts = Object.values(dataTagFields).some(
        (f) => f.espType === DataTagFieldCAOType[DataTagFieldCAOType.CONTEXT]
    )
    if (!hasContexts) {
        sendNotification(
            NotificationType.warning,
            'One or more fields must be designated as ESP type "CONTEXT" to proceed'
        )
        return false
    }

    // Must have one or more designated Actions
    const hasActions = Object.values(dataTagFields).some(
        (f) => f.espType === DataTagFieldCAOType[DataTagFieldCAOType.ACTION]
    )
    if (!hasActions) {
        sendNotification(
            NotificationType.warning,
            'One or more fields must be designated as ESP type "ACTION" to proceed'
        )
        return false
    }

    // Must have one or more designated Outcomes
    const hasOutcomes = Object.values(dataTagFields).some(
        (f) => f.espType === DataTagFieldCAOType[DataTagFieldCAOType.OUTCOME]
    )
    if (!hasOutcomes) {
        sendNotification(
            NotificationType.warning,
            'One or more fields must be designated as ESP type "OUTCOME" to proceed'
        )
        return false
    }

    return true
}
