import { LowdbClient } from "../database/lowdb/lowdbClient";




const db = new LowdbClient();
db.addScenario({
    id: 'Chile',
    title: 'Chile',
    description: 'Earthquake and tsunami',
    preview: '',
    processes: [
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess'
    ],
    products: [
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_input-boundingbox',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_mmin',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_mmax',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_zmin',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_zmax',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_p',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_etype',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_tlon',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_tlat',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_selectedRows',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService_org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess_quakeMLFile'
    ]
});