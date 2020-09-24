export const server = {
    "wpsUrl": "http://91.250.85.221/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const height = {
    "description": {
        "id": "height",
        "title": "height",
        "type": "complex",
        "description": "File with the height values",
        "format": "text/xml"
    },
    "value": null
};

export const velocity = {
    "description": {
        "id": "velocity",
        "title": "velocity",
        "type": "complex",
        "description": "File with the velocity values",
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
            "ecuador"
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

export const orgn52gfzriesgosalgorithmimplSystemReliabilityMultiProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityMultiProcess",
    "processVersion": "1.0.0",
    "description": "Process for performing the reliability of infrastructure networks",
    "title": "SystemReliabilityMultiProcess",
    "inputs": [
        "height",
        "velocity",
        "country",
        "hazard"
    ],
    "outputs": [
        "damage_consumer_areas"
    ]
};

