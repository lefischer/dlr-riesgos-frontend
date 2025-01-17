declare const Plotly: any;
// expects plotly to have been loaded per CDN
// (required because currently plotly cannot be compiled to es2015)


export function createGroupedBarchart(
    anchorSelector: any, data: {[groupName: string]: BarData[]}, width: number, height: number, xLabel: string, yLabel: string
) {

    // completing data: all groups must contain the same datasets
    const labels = [];
    for (const key in data) {
        if (data[key]) {
            for (const el of data[key]) {
                if (!labels.includes(el.label)) {
                    labels.push(el.label);
                }
            }
        }
    }

    for (const key in data) {
        if (data[key]) {
            for (const label of labels) {
                if (!data[key].find(el => el.label === label)) {
                    data[key].push({
                        label: label,
                        value: 0
                    });
                }
            }
        }
    }

    // sorting data alphabetically
    for (const key in data) {
        if (data[key]) {
            data[key].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
        }
    }

    // rendering
    const newData = [];
    for (const groupName in data) {
        if (data[groupName]) {
            const groupData = data[groupName];
            const transformedGroupData = {
                type: 'bar',
                name: groupName.substr(0, 13),
                x: groupData.map(dp => dp.label),
                y: groupData.map(dp => dp.value)
            };
            newData.push(transformedGroupData);
        }
    }

    const yMax = newData.map(dp => dp.y).flat().reduce((last, curr) => curr > last ? curr : last, 0);

    const layout = {
        showlegend: true, // newData.length > 8 ? false : true,
        legend: {
            orientation: 'h'
        },
        xaxis: {
            title: {
                text: xLabel
            }
        },
        yaxis: {
            title: {
                text: yLabel
            },
            range: [0, yMax + 1]
        },
        width: width,
        height: height,
        margin: {
            l: 50,
            r: 30,
            b: 50,
            t: 15,
            pad: 5
        },
    };

    Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}

export interface BarData {
    label: string;
    value: number;
}



export function createBarchart(
    anchorSelector: any, data: BarData[], width: number, height: number, xLabel: string, yLabel: string,
    xAxisAngle = 0, yAxisAngle = 0) {

        const newData = [{
            type: 'bar',
            x: data.map(dp => dp.label),
            y: data.map(dp => dp.value)
        }];

        const yMax = newData[0].y.reduce((last, curr) => curr > last ? curr : last, 0);

        const layout = {
            xaxis: {
                title: {
                    text: xLabel
                }
            },
            yaxis: {
                title: {
                    text: yLabel
                },
                range: [0, yMax + 1]
            },
            width: width,
            height: height,
            margin: {
                l: 50,
                r: 30,
                b: 50,
                t: 15,
                pad: 5
            },
        };

        Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}

export function createBigBarchart(
    anchorSelector: any, data: BarData[], width: number, height: number, xLabel: string, yLabel: string) {

        const newData = [{
            type: 'bar',
            x: data.map(dp => dp.label),
            y: data.map(dp => dp.value)
        }];

        const yMax = newData[0].y.reduce((last, curr) => curr > last ? curr : last, 0);

        const layout = {
            xaxis: {
                title: {
                    text: xLabel
                }
            },
            yaxis: {
                title: {
                    text: yLabel
                },
                range: [0, yMax + 1]
            },
            autosize: false,
            width: width,
            height: height,
            margin: {
                l: 50,
                r: 30,
                b: 130,
                t: 15,
                pad: 5
            },
        };

        Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}

export function createConfusionMatrix(
    anchorSelector: any, data: number[][], width: number, height: number, xLabel: string, yLabel: string) {

    const newData = [{
        type: 'heatmap',
        z: data
    }];

    const layout = {
        xaxis: {
            title: {
                text: xLabel
            }
        },
        yaxis: {
            title: {
                text: yLabel
            }
        },
        width: width,
        height: height,
    };

    Plotly.newPlot(anchorSelector, newData, layout, {staticPlot: true});
}
