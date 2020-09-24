export const server = {
    "wpsUrl": "http://riesgos.dlr.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const shakeMapFile = {
    "description": {
        "id": "shakeMapFile",
        "title": "shakeMapFile",
        "type": "complex",
        "format": "application/dbase"
    },
    "value": null
};

export const physicalImpact = {
    "description": {
        "id": "physicalImpact",
        "title": "physicalImpact",
        "reference": true,
        "type": "complex",
        "format": "application/WFS"
    },
    "value": null
};

export const orgn52dlrriesgosalgorithmPhysicalImpactAssessmentProcess = {
    "id": "org.n52.dlr.riesgos.algorithm.PhysicalImpactAssessment",
    "processVersion": "1.0.0",
    "description": "Physical impact assessment",
    "title": "PhysicalImpactAssessment",
    "inputs": [
        "shakeMapFile"
    ],
    "outputs": [
        "physicalImpact"
    ]
};

