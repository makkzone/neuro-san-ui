import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Tooltip from "@mui/material/Tooltip"
import {NextRouter} from "next/router"
import {ReactElement, MouseEvent as ReactMouseEvent, useMemo, useState} from "react"

import {DisplayOption, FilterSpecification, ProjectPagePreferences, ShowAsOption, SortSpecification} from "./types"
import {Project} from "../../controller/projects/types"

interface ProjectsTableProps {
    readonly projectList: Project[]
    readonly router: NextRouter
    readonly allowedActions: {allowDelete: boolean; allowSharing: boolean}
    readonly isAuthLoading: boolean
    readonly enableAuthorizeAPI: boolean
    readonly getSharingIcon: (project: Project) => ReactElement
    readonly getDeleteIcon: (idx: number) => ReactElement
    readonly preferences: ProjectPagePreferences

    // setPreferences is a React state setter that takes either a value as input or a function argument
    readonly setPreferences: (
        value: (currentPreferences: ProjectPagePreferences) => {
            sorting: {columnKey: string; sortOrder: string}
            readonly itemsPerPage: number
            readonly showAsOption: ShowAsOption
            readonly displayOption: DisplayOption
            readonly filterSpecification: FilterSpecification
        }
    ) => void
}

// const CustomTableHead = styled(TableHead)(() => ({
//     "& .MuiTableCell-root": {
//         fontWeight: "bold",
//         backgroundColor: "var(--bs-secondary)",
//         borderBottom: "3px solid black",
//         color: "var(--bs-white)",
//
//         "&:first-of-type": {
//             borderTopLeftRadius: "0.5rem",
//         },
//         "&:last-of-type": {
//             borderTopRightRadius: "0.5rem",
//         },
//     },
// }))

/**
 * Get the table of projects for the "List" view
 *
 * @returns React element representing the project table
 */
export default function ProjectsTable(props: ProjectsTableProps): ReactElement<ProjectsTableProps> {
    const {
        projectList,
        preferences,
        setPreferences,
        router,
        allowedActions,
        isAuthLoading,
        enableAuthorizeAPI,
        getSharingIcon,
        getDeleteIcon,
    } = props

    // For sorting -- column and order
    const [sorting, setSorting] = useState<SortSpecification>({
        columnKey: preferences?.sorting?.columnKey || "updated_at",
        sortOrder: preferences?.sorting?.sortOrder || "desc",
    })

    // Apply the filter if there is one. We only start filtering at 2 characters+
    const lowerCaseFilterText = preferences.filterSpecification.filterText?.toLocaleLowerCase()
    const filteredSortedData =
        preferences.filterSpecification.columnKey && preferences.filterSpecification.filterText
            ? sortedData.filter(
                  (datum) =>
                      preferences.filterSpecification.filterText.length < 2 ||
                      datum[preferences.filterSpecification.columnKey].toLocaleLowerCase().includes(lowerCaseFilterText)
              )
            : sortedData

    const handleHeaderClick = (_event: ReactMouseEvent<unknown>, clickedHeaderId: string) => {
        if (clickedHeaderId !== sorting.columnKey) {
            // If a new column is clicked, clear previous sorting
            setSorting({
                columnKey: clickedHeaderId,
                sortOrder: "asc",
            })

            // Record in persisted preferences
            setPreferences((currentPreferences: ProjectPagePreferences) => ({
                ...currentPreferences,
                sorting: {
                    columnKey: clickedHeaderId,
                    sortOrder: "asc",
                },
            }))
        } else {
            // Toggle sorting order for the same column
            const newSortOrder = sorting.sortOrder === "desc" ? "asc" : "desc"

            setSorting({
                ...sorting,
                sortOrder: newSortOrder,
            })

            // Record in persisted preferences
            setPreferences((currentPreferences: ProjectPagePreferences) => ({
                ...currentPreferences,
                sorting: {
                    ...sorting,
                    sortOrder: newSortOrder,
                },
            }))
        }
    }

    // Sort the project list based on the column and order
    const sortedData = useMemo(
        () =>
            [...projectList].sort((a, b) => {
                const columnKey = sorting.columnKey
                const sortOrder = sorting.sortOrder === "desc" ? -1 : 1

                if (columnKey) {
                    const valueA = a[columnKey]
                    const valueB = b[columnKey]

                    if (typeof valueA !== typeof valueB) {
                        // Can't compare apples and oranges. Should never happen since we're comparing two rows from the
                        // same column.
                        return 0
                    }

                    // HACK: since the backend sends us dates as strings, we have to encode knowledge about fields types
                    // here. For example, "updated_at": "5/26/2023, 1:07:24 PM". The only ways to know this is a date
                    // would be to attempt to parse it as such (leading to false positives...) or use our intrinstic
                    // knowledge of which type each field name is.
                    switch (columnKey) {
                        case "name":
                        case "description":
                        case "owner":
                        case "lastEditedBy":
                            return sortOrder * valueA.localeCompare(valueB)
                        case "updated_at":
                        case "created_at":
                            return sortOrder * (new Date(valueA) > new Date(valueB) ? 1 : -1)
                        case "id":
                            return sortOrder * (parseInt(valueA) - parseInt(valueB))
                        default:
                            return 0
                    }
                }

                return 0
            }),
        [projectList, sorting]
    )

    interface HeadCell {
        dataIndex: string
        title: string
        sortable?: boolean
    }

    // Define the columns for the table
    const headCells: HeadCell[] = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Owner",
            dataIndex: "owner",
        },
        {
            title: "Created at",
            dataIndex: "created_at",
        },
        {
            title: "Last edited by",
            dataIndex: "lastEditedBy",
        },
        {
            title: "Updated at",
            dataIndex: "updated_at",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            sortable: false,
        },
    ]

    return (
        <Table
            id="projects-table"
            sx={{
                cursor: "pointer",
                boxShadow: 10,
            }}
            size="medium"
        >
            <TableHead
                sx={{
                    backgroundColor: "var(--bs-secondary) !important",
                    "&table.thead": {
                        backgroundColor: "red",
                        "& th:first-child": {
                            borderRadius: "1em 0 0 1em",
                        },
                        "& th:last-child": {
                            borderRadius: "0 1em 1em 0",
                        },
                    },
                }}
            >
                {headCells.map((headCell) => (
                    <Tooltip title={`Click to sort ${sorting.sortOrder === "asc" ? "descending" : "ascending"}`}>
                        <TableCell
                            id={`${headCell.title}-header`}
                            key={headCell.title}
                            align="center"
                            sortDirection={sorting.columnKey === headCell.dataIndex ? sorting.sortOrder : false}
                            sx={
                                {
                                    // color: "var(--bs-white)",
                                    // backgroundColor: "var(--bs-secondary)",
                                    // fontSize: "12px",
                                    // position: "relative",
                                    // paddingTop: "14px",
                                    // paddingBottom: "14px",
                                    // lineHeight: "1.0",
                                    // "&:not(:last-child)::after": {
                                    //     content: '""',
                                    //     position: "absolute",
                                    //     right: 0,
                                    //     top: "20%",
                                    //     height: "50%",
                                    //     width: "1px",
                                    //     backgroundColor: "white",
                                    // },
                                    // "&:first-of-type": {
                                    //     borderTopLeftRadius: "0.5rem",
                                    // },
                                    // "&:last-of-type": {
                                    //     borderTopRightRadius: "0.5rem",
                                    // },
                                }
                            }
                        >
                            <TableSortLabel
                                active={sorting.columnKey === headCell.dataIndex}
                                direction={sorting.columnKey === headCell.dataIndex ? sorting.sortOrder : "asc"}
                                onClick={(event) =>
                                    (!headCell.sortable || headCell.sortable) &&
                                    handleHeaderClick(event, headCell.dataIndex)
                                }
                                sx={{
                                    color: "var(--bs-white)",
                                    ontSize: "14px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    "&.Mui-active": {
                                        color: "var(--bs-white)",
                                    },
                                }}
                                IconComponent={() => (
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ArrowDropUpIcon
                                            sx={{
                                                color:
                                                    sorting.columnKey === headCell.dataIndex &&
                                                    sorting.sortOrder === "asc"
                                                        ? "white"
                                                        : "#808080",
                                                fontSize: "medium",
                                                marginBottom: "-4px",
                                            }}
                                        />
                                        <ArrowDropDownIcon
                                            sx={{
                                                color:
                                                    sorting.columnKey === headCell.dataIndex &&
                                                    sorting.sortOrder === "desc"
                                                        ? "white"
                                                        : "#808080",
                                                fontSize: "medium",
                                                marginTop: "-4px",
                                            }}
                                        />
                                    </Box>
                                )}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        flexGrow: 1,
                                        textAlign: "left",
                                    }}
                                >
                                    {headCell.title}
                                </Box>
                            </TableSortLabel>
                        </TableCell>
                    </Tooltip>
                ))}
            </TableHead>
            <TableBody>
                {filteredSortedData.map((project, idx) => {
                    const {allowDelete, allowSharing} = allowedActions
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={project.id}
                        >
                            <TableCell
                                id={`project-${project.id}-id`}
                                align="center"
                            >
                                {project.id}
                            </TableCell>
                            <TableCell
                                id={`project-${project.id}-name`}
                                align="center"
                            >
                                {project.name}
                            </TableCell>
                            <TableCell
                                id={`project-${project.id}-owner`}
                                align="center"
                            >
                                {project.owner}
                            </TableCell>
                            <TableCell
                                id={`project-${project.id}-created-at`}
                                align="center"
                            >
                                {project.created_at}
                            </TableCell>
                            <TableCell
                                id={`project-${project.id}-last-edited-by`}
                                align="center"
                            >
                                {project.lastEditedBy}
                            </TableCell>
                            <TableCell
                                id={`project-${project.id}-updated-at`}
                                align="center"
                            >
                                {project.updated_at}
                            </TableCell>
                            <TableCell
                                id={`project-${project.id}-actions`}
                                align="center"
                            >
                                <div
                                    id={`project-${project.id}-actions-div`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {allowSharing ? getSharingIcon(project) : null}
                                    {allowDelete ? getDeleteIcon(idx) : null}
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
