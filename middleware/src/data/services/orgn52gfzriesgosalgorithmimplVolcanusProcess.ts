export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const intensity = {
    "description": {
        "id": "intensity",
        "title": "intensity",
        "type": "complex",
        "format": "application/vnd.google-earth.kml+xml"
    },
    "value": null
};

export const intensitycolumn = {
    "description": {
        "id": "intensitycolumn",
        "title": "intensitycolumn",
        "reference": false,
        "type": "literal",
        "format": "text/plain"
    },
    "value": null
};

export const exposure = {
    "description": {
        "id": "exposure",
        "title": "exposure",
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const schema = {
    "description": {
        "id": "schema",
        "title": "schema",
        "reference": false,
        "type": "literal",
        "format": "text/plain"
    },
    "value": null
};

export const fragility = {
    "description": {
        "id": "fragility",
        "title": "fragility",
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const updatedexposure = {
    "description": {
        "id": "updated_exposure",
        "title": "updated_exposure",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const transition = {
    "description": {
        "id": "transition",
        "title": "transition",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const damage = {
    "description": {
        "id": "damage",
        "title": "damage",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const mergedoutput = {
    "description": {
        "id": "merged_output",
        "title": "merged_output",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplVolcanusProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.VolcanusProcess",
    "processVersion": "1.0.0",
    "title": "VolcanusProcess",
    "inputs": [
        "intensity",
        "intensitycolumn",
        "exposure",
        "schema",
        "fragility"
    ],
    "outputs": [
        "updated_exposure",
        "transition",
        "damage",
        "merged_output"
    ]
};

