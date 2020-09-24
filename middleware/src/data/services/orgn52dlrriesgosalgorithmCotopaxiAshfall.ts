export const server = {
    "wpsUrl": "http://riesgos.dlr.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const probability = {
    "description": {
        "id": "probability",
        "title": "probability",
        "reference": false,
        "type": "literal",
        "options": [
            "1",
            "25",
            "50",
            "75",
            "99"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const vei = {
    "description": {
        "id": "vei",
        "title": "vei",
        "reference": false,
        "type": "literal",
        "description": "volcanic explosivity index",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const ashfall = {
    "description": {
        "id": "ashfall",
        "title": "ashfall",
        "reference": true,
        "type": "complex",
        "format": "application/WFS"
    },
    "value": null
};

export const orgn52dlrriesgosalgorithmCotopaxiAshfallProcess = {
    "id": "org.n52.dlr.riesgos.algorithm.CotopaxiAshfall",
    "processVersion": "1.0.0",
    "description": "Ashfall for the cotopaxi volcano",
    "title": "CotopaxiAshfall",
    "inputs": [
        "probability",
        "vei"
    ],
    "outputs": [
        "ashfall"
    ]
};

