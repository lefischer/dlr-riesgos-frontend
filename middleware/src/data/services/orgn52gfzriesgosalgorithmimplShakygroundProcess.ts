export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const quakeMLFile = {
    "description": {
        "id": "quakeMLFile",
        "title": "quakeMLFile",
        "type": "complex",
        "description": "quakeML to use for computing the shakemap",
        "format": "text/xml"
    },
    "value": null
};

export const shakeMapFile = {
    "description": {
        "id": "shakeMapFile",
        "title": "shakeMapFile",
        "reference": true,
        "type": "complex",
        "format": "text/xml"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplShakygroundProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess",
    "processVersion": "1.0.0",
    "description": "This is the description of the shakyground process",
    "title": "ShakygroundProcess",
    "inputs": [
        "quakeMLFile"
    ],
    "outputs": [
        "shakeMapFile"
    ]
};

