import {styled} from "@mui/material"
import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import NextImage from "next/legacy/image"
import Link from "next/link"
import {useRouter} from "next/router"
import {ReactElement, MouseEvent as ReactMouseEvent, useEffect, useState} from "react"

import {ConfirmationModal} from "../components/confirmationModal"
import {CONTACT_US_CONFIRMATION_DIALOG_TEXT, CONTACT_US_CONFIRMATION_DIALOG_TITLE, GENERIC_LOGO, LOGO} from "../const"
import useEnvironmentStore from "../state/environment"
import useFeaturesStore from "../state/features"
import {getTitleBase} from "../utils/title"

// #region: Styled Components
const OuterContainer = styled("div")({
    width: "100%",
    minHeight: "75vh",
    overflow: "auto",
})

const Marginer = styled("div")({
    margin: "3% 9.375% 6% 9.375%",
})

const Navbar = styled("div")({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "5%",
    alignItems: "center",
})

const NavbarLogo = styled("h1")({
    color: "var(--bs-white)",
    fontSize: "1.25rem",
    width: "250px",
})

const NavbarMiddleSection = styled("div")({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridGap: "27.32%",
    width: "28.59%",
})

const HeaderLineOne = styled("h1")({
    margin: "0",
    marginTop: "6rem",
    color: "var(--bs-white)",
})

const LaunchButton = styled("div")({
    display: "inline-block",
    marginTop: "3rem",
    fontWeight: "bold",
    fontSize: "1.25rem",
    borderRadius: "1000px",
    padding: "1rem 2rem",
    background: "#26efe9",
    textAlign: "center",
    width: "350px",
})

const HeaderLineFive = styled("h5")({
    color: "var(--bs-white)",
    fontWeight: "bold",
})

const NeuroAIDescriptionBox = styled(Box)({
    color: "var(--bs-white)",
    fontSize: "1.5rem",
    fontWeight: "bold",
})
// #endregion: Styled Components

// Main function.
// Has to be export default for NextJS so tell ts-prune to ignore
// ts-prune-ignore-next
export default function Index(): ReactElement {
    // Get "generic branding" flag from store
    const {isGeneric} = useFeaturesStore()

    const router = useRouter()

    // Access environment info
    const {supportEmailAddress} = useEnvironmentStore()

    // Keeps track of which button the user is hovering over. Either a button id or null
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    // For email dialog
    const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false)

    const handleMouseEnter = (event: ReactMouseEvent) => {
        setHoveredId((event.target as HTMLElement).id)
    }

    const handleMouseLeave = () => {
        setHoveredId(null)
    }

    function getButtonStyle(ids: string[]) {
        return {
            color: ids.includes(hoveredId) ? "var(--bs-white)" : "#000000", // Change text color on hover
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s", // Smooth transition effect
            boxShadow: ids.includes(hoveredId) ? "0 0 30px 0 #26efe9" : "none", // Add shadow on hover
        }
    }

    // Dynamically set the title to the current host
    useEffect(() => {
        document.title = getTitleBase()
    }, [])

    // Function to build the query string from the current route
    const buildQueryString = () => {
        const {query} = router
        return Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join("&")
    }

    return (
        <div id="splash-page__container">
            {emailDialogOpen && (
                <ConfirmationModal
                    content={CONTACT_US_CONFIRMATION_DIALOG_TEXT}
                    handleCancel={() => {
                        setEmailDialogOpen(false)
                    }}
                    handleOk={() => {
                        window.location.href = `mailto:${supportEmailAddress}`
                        setEmailDialogOpen(false)
                    }}
                    id="email-dialog"
                    title={CONTACT_US_CONFIRMATION_DIALOG_TITLE}
                />
            )}
            <OuterContainer id="outer-container">
                <Marginer id="marginer">
                    <Navbar id="nav-bar">
                        {!isGeneric && (
                            <>
                                <NavbarLogo id="logo">
                                    <Link
                                        id="splash-logo-link"
                                        href="https://www.cognizant.com/us/en"
                                        target="_blank"
                                    >
                                        <NextImage
                                            id="logo-img"
                                            width="200"
                                            height="45"
                                            src="/cognizant-logo-white.svg"
                                            alt=""
                                        />
                                    </Link>
                                </NavbarLogo>
                                <NavbarMiddleSection id="nav-bar-middle" />
                            </>
                        )}
                    </Navbar>
                    <div id="main-div">
                        <HeaderLineOne id="header-line">
                            <div
                                id="headline-eyebrow"
                                className="d-block text-white mb-8"
                            >
                                {isGeneric ? GENERIC_LOGO : LOGO}
                            </div>
                        </HeaderLineOne>
                        <NeuroAIDescriptionBox id="neuro-ai-description-box">
                            The AI platform for smarter business decisions.
                        </NeuroAIDescriptionBox>
                        <div id="neuro-ai-tools-container">
                            <Link
                                id="of-link"
                                href={`/opportunityFinder?${buildQueryString()}`}
                                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                                legacyBehavior={true} // Need this so we can "open in new tab"
                                passHref
                            >
                                <a
                                    id="of-link-anchor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`/of?${buildQueryString()}`}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <LaunchButton
                                        id="opportunity-finder-button"
                                        style={{
                                            position: "relative",
                                            ...getButtonStyle([
                                                "opportunity-finder-button",
                                                "star-new-span",
                                                "of-link-anchor",
                                            ]),
                                        }}
                                    >
                                        Opportunity Finder
                                    </LaunchButton>
                                </a>
                            </Link>
                            <Link
                                id="orchestrator-link"
                                // Use the URL object form of `href` to pass along the query string
                                href={`/projects?${buildQueryString()}`}
                                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                                legacyBehavior={true}
                                passHref
                            >
                                <a
                                    id="of-link-anchor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`/projects?${buildQueryString()}`}
                                    style={{marginLeft: "50px"}}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <LaunchButton
                                        id="model-orchestrator-button"
                                        style={{position: "relative", ...getButtonStyle(["model-orchestrator-button"])}}
                                    >
                                        Model Orchestrator
                                    </LaunchButton>
                                </a>
                            </Link>
                            <Link
                                id="agent-network-link"
                                // Use the URL object form of `href` to pass along the query string
                                href={`/agentNetwork?${buildQueryString()}`}
                                /* eslint-disable-next-line @typescript-eslint/no-deprecated */
                                legacyBehavior={true}
                                passHref
                            >
                                <a
                                    id="of-link-anchor"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`/projects?${buildQueryString()}`}
                                    style={{marginLeft: "50px"}}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <LaunchButton
                                        id="neuro-san-button"
                                        style={{position: "relative", ...getButtonStyle(["neuro-san-button"])}}
                                    >
                                        <Badge
                                            badgeContent="New"
                                            color="primary"
                                            id="multi-agent-accelerator-new-badge"
                                        >
                                            Multi-Agent Accelerator
                                        </Badge>
                                    </LaunchButton>
                                </a>
                            </Link>
                        </div>
                    </div>
                </Marginer>
            </OuterContainer>
            <footer id="footer">
                <div id="footer_divider" />

                <div id="additional-links-container">
                    <div
                        id="team-links"
                        className="more-links"
                    >
                        <HeaderLineFive id="additional-links-header">Team</HeaderLineFive>
                        <div
                            id="additional-links-divider"
                            className="link-divider"
                        />
                        <a
                            id="learn-more-link"
                            className="splash-link"
                            href="https://www.cognizant.com/us/en/services/ai/ai-lab"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            About
                        </a>
                        <a
                            id="contact-us-footer-link"
                            className="splash-link"
                            href={null}
                            onClick={() => setEmailDialogOpen(true)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact Us
                        </a>
                    </div>
                    <div
                        id="services-links"
                        className="more-links"
                    >
                        <HeaderLineFive id="additional-links-header">Services</HeaderLineFive>
                        <div
                            id="additional-links-divider"
                            className="link-divider"
                        />
                        <a
                            id="ai-innovation-studios-link"
                            className="splash-link"
                            href="https://portal-innovationstudio-apps-prod-we-001.azurewebsites.net/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            AI Innovation Studios
                        </a>
                        <a
                            id="neuro-it-ops-link"
                            className="splash-link"
                            href="https://www.cognizant.com/us/en/services/neuro-intelligent-automation/neuro-ai-it-operations"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Neuro IT Ops
                        </a>
                        <a
                            id="flowsource-link"
                            className="splash-link"
                            href="https://www.cognizant.com/us/en/services/software-engineering-services/flowsource"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Flowsource
                        </a>
                        <a
                            id="skygrade-link"
                            className="splash-link"
                            href="https://www.cognizant.com/us/en/services/cloud-solutions/cognizant-skygrade"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Skygrade
                        </a>
                        <a
                            id="cdit-link"
                            className="splash-link"
                            href="https://cditoolkit.cognizant.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Cognizant Data And Intelligence Toolkit
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Explicitly want to leave this splash page open
Index.authRequired = false
