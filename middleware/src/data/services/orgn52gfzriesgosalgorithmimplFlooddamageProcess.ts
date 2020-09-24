export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const durationh = {
    "description": {
        "id": "duration-h",
        "title": "duration-h",
        "type": "complex",
        "description": "Tiff file with the duration of the flood in hours",
        "format": "image/geotiff"
    },
    "value": null
};

export const vsmaxms = {
    "description": {
        "id": "vsmax-ms",
        "title": "vsmax-ms",
        "type": "complex",
        "description": "Tiff file with the maximum velocity of the flood in m/s",
        "format": "image/geotiff"
    },
    "value": null
};

export const wdmaxcm = {
    "description": {
        "id": "wdmax-cm",
        "title": "wdmax-cm",
        "type": "complex",
        "description": "Tiff file with the maximum water depth of the flood in cm",
        "format": "image/geotiff"
    },
    "value": null
};

export const damagemanzanas = {
    "description": {
        "id": "damage_manzanas",
        "title": "damage_manzanas",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const damagebuildings = {
    "description": {
        "id": "damage_buildings",
        "title": "damage_buildings",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplFlooddamageProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess",
    "processVersion": "1.0.0",
    "description": "Process to compute the damage of a flood in ecuador.",
    "title": "FlooddamageProcess",
    "inputs": [
        "duration-h",
        "vsmax-ms",
        "wdmax-cm"
    ],
    "outputs": [
        "damage_manzanas",
        "damage_buildings"
    ]
};

