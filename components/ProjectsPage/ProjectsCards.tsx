import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CircularProgress from "@mui/material/CircularProgress"
import Grid from "@mui/material/Grid2"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import {NextRouter} from "next/router"
import {ReactElement} from "react"
import {FaUser} from "react-icons/fa"

import {Project} from "../../controller/projects/types"

interface ProjectsCardsProps {
    readonly id: string
    readonly projectList: Project[]
    readonly router: NextRouter
    readonly getAllowedActions: (project: Project) => {allowSharing: boolean; allowDelete: boolean}
    readonly isAuthLoading: boolean
    readonly enableAuthorizeAPI: boolean
    readonly getSharingIcon: (project: Project) => ReactElement
    readonly getDeleteIcon: (project: Project, idx: number) => ReactElement
}

/**
 * Build the list of project cards for the "Cards" view
 *
 * @returns Array of project cards as React elements
 */
// Has to be export default for NextJS so tell ts-prune to ignore
// ts-prune-ignore-next
export default function ProjectsCards(props: ProjectsCardsProps): ReactElement {
    const {
        id,
        projectList,
        router,
        getAllowedActions,
        isAuthLoading,
        enableAuthorizeAPI,
        getSharingIcon,
        getDeleteIcon,
    } = props

    /**
     * Get a single project card for the "Cards" view
     *
     * @param project - the project to display
     * @param idx - the index of the project in the project list
     * @returns React element representing the project card
     */
    function getProjectCard(project: Project, idx: number): ReactElement {
        const projectId = project.id
        return (
            <Grid
                id={`project-${projectId}`}
                key={project.id}
                size={4}
            >
                <Card
                    id={`project-${projectId}-card`}
                    variant="outlined"
                    onClick={() => {
                        void router.push({
                            pathname: "/projects/[projectID]",
                            query: {...router.query, projectID: projectId},
                        })
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: 200,
                        padding: 2,
                        margin: 2,
                        boxShadow: "0 5px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.24)",
                        transition: "box-shadow 0.3s ease-in-out",
                        "&:hover": {
                            backgroundColor: "ghostwhite",
                            boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
                        },
                        cursor: "pointer",
                    }}
                >
                    <Grid
                        id={`project-${projectId}-card-div`}
                        sx={{display: "flex", justifyContent: "space-between"}}
                    >
                        <h5
                            id={`project-${projectId}-header`}
                            style={{width: "75%"}}
                        >
                            <Tooltip // eslint-disable-line enforce-ids-in-jsx/missing-ids
                                enterDelay={500}
                                title={project.name} // show full project name in tooltip in case we truncated
                                style={{maxWidth: 1000}}
                                placement="top"
                            >
                                <a
                                    id={`project-${projectId}-link-anchor`}
                                    style={{
                                        color: "var(--bs-primary)",
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {project.name}
                                </a>
                            </Tooltip>
                        </h5>
                        <Grid
                            id={`actions-${projectId}-div`}
                            sx={{display: "flex", gap: "10px"}}
                        >
                            {getAllowedActions(project).allowSharing ? getSharingIcon(project) : null}

                            {/* 2/6/23 DEF - Tooltip does not have an id property when compiling */}
                            <Tooltip // eslint-disable-line enforce-ids-in-jsx/missing-ids
                                enterDelay={1}
                                title={`Owner: ${project.owner || "n/a"}, last edited by: ${
                                    project.lastEditedBy || "n/a"
                                }`}
                            >
                                <span
                                    id={`project-${projectId}-tooltip-span`}
                                    style={{cursor: "help"}}
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <FaUser id={`project-${projectId}-tooltip-user`} />
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <p
                        id={`project-${projectId}-description`}
                        style={{
                            color: "var(--bs-primary)",
                            maxWidth: "40ch",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {project.description}
                    </p>
                    <Typography
                        id={`project-${projectId}-last-modified`}
                        sx={{color: "var(--bs-primary)"}}
                    >{`Last Modified: ${project.updated_at}`}</Typography>
                    {isAuthLoading && enableAuthorizeAPI ? (
                        <Grid
                            id="auth-fetch-loader__wrapper"
                            sx={{ml: "auto"}}
                        >
                            <CircularProgress
                                id="auth-fetch-loader"
                                key="auth-fetch-loader"
                                size="15px"
                                sx={{padding: 0, position: "relative", bottom: "1rem", color: "var(--bs-primary)"}}
                            />
                        </Grid>
                    ) : getAllowedActions(project).allowDelete ? (
                        <Grid
                            id={`project-${projectId}-delete-icon`}
                            sx={{ml: "auto"}}
                        >
                            {getDeleteIcon(project, idx)}
                        </Grid>
                    ) : null}
                </Card>
            </Grid>
        )
    }

    // Build the project card display
    return <Box id={id}>{projectList.map((project, idx) => getProjectCard(project, idx))}</Box>
}
