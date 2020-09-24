export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const inputboundingbox = {
    "description": {
        "id": "input-boundingbox",
        "title": "input-boundingbox",
        "reference": false,
        "type": "bbox",
        "description": "bounding box for spatial search",
        "format": "text/plain"
    },
    "value": null
};

export const mmin = {
    "description": {
        "id": "mmin",
        "title": "mmin",
        "reference": false,
        "type": "literal",
        "description": "minimum magnitude",
        "defaultValue": "6.6",
        "format": "text/plain"
    },
    "value": null
};

export const mmax = {
    "description": {
        "id": "mmax",
        "title": "mmax",
        "reference": false,
        "type": "literal",
        "description": "maximum magnitude",
        "defaultValue": "8.5",
        "format": "text/plain"
    },
    "value": null
};

export const zmin = {
    "description": {
        "id": "zmin",
        "title": "zmin",
        "reference": false,
        "type": "literal",
        "description": "minimum depth",
        "defaultValue": "5",
        "format": "text/plain"
    },
    "value": null
};

export const zmax = {
    "description": {
        "id": "zmax",
        "title": "zmax",
        "reference": false,
        "type": "literal",
        "description": "maximum depth",
        "defaultValue": "140",
        "format": "text/plain"
    },
    "value": null
};

export const p = {
    "description": {
        "id": "p",
        "title": "p",
        "reference": false,
        "type": "literal",
        "description": "probability for stochastic etype",
        "defaultValue": "0.1",
        "format": "text/plain"
    },
    "value": null
};

export const etype = {
    "description": {
        "id": "etype",
        "title": "etype",
        "reference": false,
        "type": "literal",
        "description": "type of the event from the catalogue",
        "defaultValue": "deaggregation",
        "options": [
            "observed",
            "deaggregation",
            "stochastic",
            "expert"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const tlon = {
    "description": {
        "id": "tlon",
        "title": "tlon",
        "reference": false,
        "type": "literal",
        "description": "longitude position of the site for deaggregation",
        "defaultValue": "-71.5730623712764",
        "format": "text/plain"
    },
    "value": null
};

export const tlat = {
    "description": {
        "id": "tlat",
        "title": "tlat",
        "reference": false,
        "type": "literal",
        "description": "latitude position of the site for deaggregation",
        "defaultValue": "-33.1299174879672",
        "format": "text/plain"
    },
    "value": null
};

export const selectedRows = {
    "description": {
        "id": "selectedRows",
        "title": "selectedRows",
        "reference": true,
        "type": "complex",
        "format": "text/xml"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplQuakeledgerProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess",
    "processVersion": "1.0.0",
    "description": "This is the description of the quakeledger process.",
    "title": "QuakeledgerProcess",
    "inputs": [
        "input-boundingbox",
        "mmin",
        "mmax",
        "zmin",
        "zmax",
        "p",
        "etype",
        "tlon",
        "tlat"
    ],
    "outputs": [
        "selectedRows"
    ]
};

