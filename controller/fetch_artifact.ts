// Import constants
import {MD_BASE_URL} from "../const"

// Import types
import {Artifact} from "../controller/run/types"

import HackyStream from "../controller/stream";
import Notification, {NotificationProps} from "../controller/notification";

var debug = require('debug')('runs')

let ARTIFACT_URL = MD_BASE_URL + "/api/v1/run/artifact"

export async function BrowserFetchArtifact(url: string): Promise<Artifact[]> {
    /*
    This function is the controller used to retrieve the run artifacts (trained predictor and prescriptor models) for
    a specified run.
    */

    if (!url) {
        let notificationProps: NotificationProps = {
            Type: "error",
            Message: "Internal error",
            Description: "Unable to retrieve artifact"
        }
        console.error("url not specified")
        Notification(notificationProps)
        return null
    }
    
    // Fetch the URL
    debug('Fetching: ' + ARTIFACT_URL)

    // Fetch the URL
    return HackyStream<Artifact>(ARTIFACT_URL, "Artifact", "POST", {'url': url})

}