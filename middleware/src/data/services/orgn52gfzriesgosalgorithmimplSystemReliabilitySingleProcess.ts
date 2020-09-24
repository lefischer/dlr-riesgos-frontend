export const server = {
    "wpsUrl": "http://91.250.85.221/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const intensity = {
    "description": {
        "id": "intensity",
        "title": "intensity",
        "type": "complex",
        "description": "File with the intensities",
        "format": "text/xml"
    },
    "value": null
};

export const country = {
    "description": {
        "id": "country",
        "title": "country",
        "reference": false,
        "type": "literal",
        "options": [
            "chile",
            "ecuador",
            "peru"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const hazard = {
    "description": {
        "id": "hazard",
        "title": "hazard",
        "reference": false,
        "type": "literal",
        "options": [
            "earthquake",
            "lahar"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const damageconsumerareas = {
    "description": {
        "id": "damage_consumer_areas",
        "title": "damage_consumer_areas",
        "reference": true,
        "type": "complex",
        "format": "application/vnd.google-earth.kml+xml"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplSystemReliabilitySingleProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess",
    "processVersion": "1.0.0",
    "description": "Process for performing the reliability of infrastructure networks",
    "title": "SystemReliabilitySingleProcess",
    "inputs": [
        "intensity",
        "country",
        "hazard"
    ],
    "outputs": [
        "damage_consumer_areas"
    ]
};

