import { HttpClient } from "./http_client/http_client";
import { Harvester } from "./riesgos/scenario_service/riesgos.scenario.harvester";
import { WpsVersion } from "./wps/wps_datatypes";
const fs = require('fs');
const path = require('path');

const harvester = new Harvester(new HttpClient());
const targetDir = path.resolve(__dirname, './data/services/');


const services: {
    wpsUrl: string, wpsVersion: WpsVersion, processId: string
}[] = [
{
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.DeusProcess'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.OldAssetmasterProcess'
}, {
    wpsUrl: 'http://riesgos.dlr.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.dlr.riesgos.algorithm.PhysicalImpactAssessment'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess'
}, {
    wpsUrl: 'http://91.250.85.221/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess'
}, 
{
    wpsUrl: 'http://tsunami-wps.awi.de/wps',
    wpsVersion: '1.0.0',
    processId: 'get_tsunamap',
}, 
{
    wpsUrl: 'http://tsunami-wps.awi.de/wps',
    wpsVersion: '1.0.0',
    processId: 'get_scenario',
}, {
    wpsUrl: 'http://riesgos.dlr.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.dlr.riesgos.algorithm.CotopaxiAshfall'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.CachedFlooddamageProcess'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess'
}, {
    wpsUrl: 'http://91.250.85.221/geoserver/riesgos/wps',
    wpsVersion: '1.0.0',
    processId: 'gs:LaharModel'
}, {
    wpsUrl: 'http://91.250.85.221/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityMultiProcess'
}, {
    wpsUrl: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    processId: 'org.n52.gfz.riesgos.algorithm.impl.VolcanusProcess'
}];

for (const service of services) {
    harvester.downloadProcessData(service.wpsUrl, service.wpsVersion, service.processId, targetDir, 'ts');
}