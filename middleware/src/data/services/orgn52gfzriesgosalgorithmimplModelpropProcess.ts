export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const schema = {
    "description": {
        "id": "schema",
        "title": "schema",
        "reference": false,
        "type": "literal",
        "defaultValue": "SARA_v1.0",
        "options": [
            "SARA_v1.0",
            "HAZUS_v1.0",
            "SUPPASRI2013_v2.0",
            "Mavrouli_et_al_2014",
            "Torres_Corredor_et_al_2017"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const assetcategory = {
    "description": {
        "id": "assetcategory",
        "title": "assetcategory",
        "reference": false,
        "type": "literal",
        "defaultValue": "buildings",
        "options": [
            "buildings"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const losscategory = {
    "description": {
        "id": "losscategory",
        "title": "losscategory",
        "reference": false,
        "type": "literal",
        "defaultValue": "structural",
        "options": [
            "structural"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const taxonomies = {
    "description": {
        "id": "taxonomies",
        "title": "taxonomies",
        "reference": false,
        "type": "literal",
        "defaultValue": "",
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
        "format": "application/json"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplModelpropProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess",
    "processVersion": "1.0.0",
    "title": "ModelpropProcess",
    "inputs": [
        "schema",
        "assetcategory",
        "losscategory",
        "taxonomies"
    ],
    "outputs": [
        "selectedRows"
    ]
};

