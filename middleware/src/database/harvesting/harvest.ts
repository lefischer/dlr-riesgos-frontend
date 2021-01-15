import { HttpClient } from "../../http_client/http_client";
import { WpsServerDescription } from "../../wps/public-api";
import { createMongoDbInterface, MongoDbRiesgosDatabase } from "../mongo/mongoClient";
import { TextFileRiesgosDatabase } from "../textFile/textFileClient";
import { WpsHarvester } from "./harvester";



const servicesToHarvest: WpsServerDescription[] = [{
    serverUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    serverVersion: '1.0.0'
}, {
    serverUrl: 'http://riesgos.dlr.de/wps/WebProcessingService',
    serverVersion: '1.0.0'
}, {
    serverUrl: 'http://91.250.85.221/wps/WebProcessingService',
    serverVersion: '1.0.0'
}, {
    serverUrl: 'http://tsunami-wps.awi.de/wps',
    serverVersion: '1.0.0'
}, {
    serverUrl: 'http://91.250.85.221/geoserver/riesgos/wps',
    serverVersion: '1.0.0'
}];





const db = new TextFileRiesgosDatabase('textFileData');
const harvester = new WpsHarvester(new HttpClient(), db);
for (const service of servicesToHarvest) {
    harvester.harvestAllData(service);
}

// createMongoDbInterface(1410, 'riesgos').subscribe((db: MongoDbRiesgosDatabase) => {
//     const harvester = new WpsHarvester(new HttpClient(), db);
//     for (const service of servicesToHarvest) {
//         harvester.harvestAllData(service);
//     }
// });
