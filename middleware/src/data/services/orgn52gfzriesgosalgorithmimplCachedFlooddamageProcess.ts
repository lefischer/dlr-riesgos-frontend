export const server = {
    "wpsUrl": "http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService",
    "wpsVersion": "1.0.0"
};
export const CacheKey = {
    "description": {
        "id": "Cache-Key",
        "title": "Cache-Key",
        "reference": false,
        "type": "literal",
        "description": "This is the key for the cache to lookup the existing results for the process",
        "format": "text/plain"
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

export const orgn52gfzriesgosalgorithmimplCachedFlooddamageProcessProcess = {
    "id": "org.n52.gfz.riesgos.algorithm.impl.CachedFlooddamageProcess",
    "processVersion": "1.0.0",
    "description": "Process to read from the cache for the process FlooddamageProcess",
    "title": "CachedFlooddamageProcess",
    "inputs": [
        "Cache-Key"
    ],
    "outputs": [
        "damage_manzanas",
        "damage_buildings"
    ]
};

