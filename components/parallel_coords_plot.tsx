import NewBar from "./newbar"
import React from "react"

// Have to import Plotly this weird way
// See: https://github.com/plotly/react-plotly.js/issues/272
import dynamic from "next/dynamic";
import {dimensions} from "ui-box"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

export function ParallelCoordsPlot(props) {
    const pareto = props.Pareto
    console.debug("pareto", pareto)
    
    const objectives = pareto[Object.keys(pareto)[0]].objectives
    // const objectives = ["objective0", "objective1", "objective2"]
    
    console.debug(objectives)
    const data = pareto[Object.keys(pareto)[0]].data 
    const gen1 = data.find( item => item.id === "Gen 1")
    console.debug(gen1)

    const dimensions = objectives.map((objective, idx) => {
        const values = gen1.data.map(item => item[`objective${idx}`])
        console.debug("values", values)
        return (
            {
                label: objective,
                range: [18, 170],
                values: values
            }
        )
    })
    
    
    const plot = <Plot // eslint-disable-line enforce-ids-in-jsx/missing-ids
                       // "Plot" lacks an "id" attribute
        data={[
            {
                type: 'parcoords',
                dimensions: dimensions
            },
        ]}
        layout={{width: 1200, height: "100%"}}
    />

    return <>
        <div id={ `${props.id || "parallel-coords-plot"}` }>
            <NewBar id="pareto-prescriptors-bar"
                    InstanceId="prescriptors-objectives"
                    Title="Prescriptors vs objectives"
                    DisplayNewLink={ false } />
            {plot}
        </div>
    </>
}