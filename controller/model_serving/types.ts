// Types for model serving controller

// Model ID, Model URL, Node ID
type RunModel = [string, string, string]

export type RunModels = {
    runId: number
    predictors: RunModel[]
    prescriptors: RunModel[]
    rio: RunModel[]
}
