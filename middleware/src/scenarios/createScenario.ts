import { LowdbClient } from "../database/lowdb/lowdbClient";




const db = new LowdbClient();
// db.addScenario({
//     id: 'Ecuador',
//     title: 'Ecuador',
//     description: 'Sample scenario Ecuador',
//     preview: '',
//     processes: [
//         "http://91.250.85.221/geoserver/riesgos/wps_gs:LaharModel",
//         "http://riesgos.dlr.de/wps/WebProcessingService_org.n52.dlr.riesgos.algorithm.CotopaxiAshfall"
//     ],
//     connections: [{
//         from: "global_vei",
//         to: "http://riesgos.dlr.de/wps/WebProcessingService_org.n52.dlr.riesgos.algorithm.CotopaxiAshfall_vei",
//     }, {
//         from: "global_vei",
//         to: "http://91.250.85.221/geoserver/riesgos/wps_gs:LaharModel_intensity"
//     }]
// });