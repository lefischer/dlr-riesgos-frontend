export const server = {
    "wpsUrl": "http://tsunami-wps.awi.de/wps",
    "wpsVersion": "1.0.0"
};
export const lat = {
    "description": {
        "id": "lat",
        "title": "Latitude",
        "reference": false,
        "type": "literal",
        "description": "",
        "options": [
            "<property object at 0x7f538e52af98>"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const lon = {
    "description": {
        "id": "lon",
        "title": "Longitude",
        "reference": false,
        "type": "literal",
        "description": "",
        "options": [
            "<property object at 0x7f538e52af98>"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const mag = {
    "description": {
        "id": "mag",
        "title": "Magnitude",
        "reference": false,
        "type": "literal",
        "description": "",
        "defaultValue": "8.5",
        "options": [
            "<property object at 0x7f538e52af98>"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const epiCenter = {
    "description": {
        "id": "epiCenter",
        "title": "application/WMS",
        "reference": false,
        "type": "literal"
    },
    "value": null
};

export const getscenarioProcess = {
    "id": "get_scenario",
    "processVersion": "1",
    "description": "Input is earthquack epicenter with magnitude,\n            output is the nearest Tsunami epicenter",
    "title": "tsunami scenario",
    "inputs": [
        "lat",
        "lon",
        "mag"
    ],
    "outputs": [
        "epiCenter"
    ]
};

