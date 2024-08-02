import debugModule from "debug"
import {NextRequest, NextResponse} from "next/server"
const debug = debugModule("middleware")

export function middleware(req: NextRequest) {
    const {method, url} = req
    const host = req.headers.get("host") || "unknown host"
    const res = NextResponse.next()
    const realHost = url.replace(/https?:\/\/0.0.0.0/u, host)
    debug(`${method} ${realHost} ${res.status}`)

    return res
}

export const config = {
    matcher: "/:path*",
}
