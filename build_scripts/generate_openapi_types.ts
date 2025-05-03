import fs from "fs"
import path from "path"
import {Project} from "ts-morph"

const project = new Project()
const sourceFile = project.addSourceFileAtPath("../generated/neuro-san/NeuroSanClient.d.ts")

const interfaceDecl = sourceFile.getInterfaceOrThrow("components")
const schemasProp = interfaceDecl.getPropertyOrThrow("schemas")
const schemasType = schemasProp.getType().getApparentProperties()

const lines = schemasType.map((prop) => {
  	const schemaType = prop.getName()
  	return `export type ${schemaType} = components["schemas"]["${schemaType}"]`
})

const fileContent = [
`import {components} from "../../generated/neuro-san/NeuroSanClient"
	
export enum LegacyAgentType {
	OpportunityFinder = "OpportunityFinder",
	ScopingAgent = "ScopingAgent",
	DataGenerator = "DataGenerator",
	DMSChat = "DMSChat",
	ChatBot = "ChatBot",
}

export const isLegacyAgentType = (agent: string) => {
	return Object.keys(LegacyAgentType).includes(agent)
}

export type CombinedAgentType = LegacyAgentType | string

/**
 * Models the error we receive from neuro-san agents.
 */
export interface AgentErrorProps {
	error: string
	traceback?: string
	tool?: string
}
`,
  ...lines,
  "",
].join("\n")

// eslint-disable-next-line unicorn/prefer-module
fs.writeFileSync(path.resolve(__dirname, "../components/AgentChat/Types.ts"), fileContent)

console.log(`✅ Generated ${lines.length} type exports from components.schemas`)
