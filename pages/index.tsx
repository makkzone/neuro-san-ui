// simply redirect user to /public
import {useRouter} from "next/router"
import {ReactElement, useEffect} from "react"

// ts-prune-ignore-next
export default function IndexPage(): ReactElement {
    const router = useRouter()

    useEffect(() => {
        router.push("/public")
    }, [])

    return null
}
