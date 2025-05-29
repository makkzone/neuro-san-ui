import {Typography} from "@mui/material"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Grid from "@mui/material/Grid2"
import {startCase} from "lodash"
import NextImage from "next/image"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {FaChevronRight} from "react-icons/fa6"

const NeuroAIBreadcrumbs = () => {
    const pathname: string = usePathname()
    const urlPaths: string[] = pathname?.split("/").filter((path) => path !== "")

    return (
        <Grid
            id="nav-bar-breadcrumbs-row"
            container={true}
            sx={{
                backgroundColor: "var(--bs-white)",
                justifyContent: "flex-start",
                width: "100%",
            }}
        >
            <Breadcrumbs
                style={{
                    marginTop: "1rem",
                }}
                id="breadcrumb-nav"
                aria-label="breadcrumb"
                separator={
                    <FaChevronRight
                        id="breadcrumb-separator"
                        fontSize="small"
                    />
                }
            >
                <Link
                    id="breadcrumb-link-home"
                    href="/"
                    style={{
                        color: "var(--bs-black)",
                    }}
                >
                    Home
                </Link>
                {urlPaths?.slice(0, -1).map((urlPath, idx) => {
                    const redirectPath = urlPaths.slice(0, idx + 1).join("/")
                    return (
                        <Link
                            key={urlPath}
                            id={`breadcrumb-link__${urlPath}`}
                            style={{
                                color: "var(--bs-black)",
                                textDecoration: "underlined",
                            }}
                            href={`/${redirectPath}`}
                        >
                            {startCase(urlPath)}
                        </Link>
                    )
                })}
                <Typography
                    id="breadcrumb-link__current"
                    sx={{color: "var(--bs-gray-dark"}}
                >
                    {startCase(urlPaths?.at(-1))}
                </Typography>
            </Breadcrumbs>
            <NextImage
                id="user-query-image"
                src="https://www.cognizant.com/us/media_1808da395be9f77c0124de824530b0338915414a8.svg?width=150&format=webply&optimize=medium"
                width={150}
                height={40}
                title="Cognizant Logo"
                alt="Cognizant Logo"
                unoptimized={true}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "0.7rem",
                    marginLeft: "auto",
                }}
            />
        </Grid>
    )
}

export default NeuroAIBreadcrumbs
