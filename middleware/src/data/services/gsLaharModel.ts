export const server = {
    "wpsUrl": "http://91.250.85.221/geoserver/riesgos/wps",
    "wpsVersion": "1.0.0"
};
export const direction = {
    "description": {
        "id": "direction",
        "title": "direction",
        "reference": false,
        "type": "literal",
        "description": "Direction of Lahar: North | South",
        "options": [
            "North",
            "South"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const intensity = {
    "description": {
        "id": "intensity",
        "title": "intensity",
        "reference": false,
        "type": "literal",
        "description": "Vulcan Eruption Index (VEI): 1-2 | 2-3 | 3-4 | 4+",
        "options": [
            "VEI1",
            "VEI2",
            "VEI3",
            "VEI4"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const parameter = {
    "description": {
        "id": "parameter",
        "title": "parameter",
        "reference": false,
        "type": "literal",
        "description": "Requested parameter: MaxHeight | MaxVelocity | MaxPressure | MaxErosion | Deposition",
        "options": [
            "MaxHeight",
            "MaxVelocity",
            "MaxPressure",
            "MaxErosion",
            "Deposition"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const wms = {
    "description": {
        "id": "wms",
        "title": "wms",
        "reference": false,
        "type": "literal"
    },
    "value": null
};

export const shakemap = {
    "description": {
        "id": "shakemap",
        "title": "shakemap",
        "reference": true,
        "type": "complex",
        "format": "application/octet-stream"
    },
    "value": null
};

export const gsLaharModelProcess = {
    "id": "gs:LaharModel",
    "processVersion": "1.0.0",
    "description": "Lahar Model for Cotopaxi depending on direction (North|South), intensity (VEI1|VEI2|VEI3|VEI4) and parameter (MaxHeight|MaxVelocity|MaxPressure|MaxErosion|Deposition)",
    "title": "Lahar Model for Cotopaxi",
    "inputs": [
        "direction",
        "intensity",
        "parameter"
    ],
    "outputs": [
        "wms",
        "shakemap"
    ]
};

