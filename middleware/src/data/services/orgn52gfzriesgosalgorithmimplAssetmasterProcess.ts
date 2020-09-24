export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const lonmin = {
    "description": {
        "id": "lonmin",
        "title": "lonmin",
        "reference": false,
        "type": "literal",
        "defaultValue": "-71.8",
        "format": "text/plain"
    },
    "value": null
};

export const lonmax = {
    "description": {
        "id": "lonmax",
        "title": "lonmax",
        "reference": false,
        "type": "literal",
        "defaultValue": "-71.4",
        "format": "text/plain"
    },
    "value": null
};

export const latmin = {
    "description": {
        "id": "latmin",
        "title": "latmin",
        "reference": false,
        "type": "literal",
        "defaultValue": "-33.2",
        "format": "text/plain"
    },
    "value": null
};

export const latmax = {
    "description": {
        "id": "latmax",
        "title": "latmax",
        "reference": false,
        "type": "literal",
        "defaultValue": "-33.0",
        "format": "text/plain"
    },
    "value": null
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
            "Mavrouli_et_al_2014",
            "Torres_Corredor_et_al_2017"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const assettype = {
    "description": {
        "id": "assettype",
        "title": "assettype",
        "reference": false,
        "type": "literal",
        "defaultValue": "res",
        "options": [
            "res"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const querymode = {
    "description": {
        "id": "querymode",
        "title": "querymode",
        "reference": false,
        "type": "literal",
        "defaultValue": "intersects",
        "options": [
            "intersects",
            "within"
        ],
        "format": "text/plain"
    },
    "value": null
};

export const selectedRowsGeoJson = {
    "description": {
        "id": "selectedRowsGeoJson",
        "title": "selectedRowsGeoJson",
        "reference": true,
        "type": "complex",
        "format": "application/json"
    },
    "value": null
};

export const orgn52gfzriesgosalgorithmimplAssetmasterProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess",
    "processVersion": "1.0.0",
    "title": "AssetmasterProcess",
    "inputs": [
        "lonmin",
        "lonmax",
        "latmin",
        "latmax",
        "schema",
        "assettype",
        "querymode"
    ],
    "outputs": [
        "selectedRowsGeoJson"
    ]
};

