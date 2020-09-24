import { HttpClient } from "../../http_client/http_client";
import { WpsClient } from "../../wps/wpsclient";
import { WpsProcessDescription } from "../../wps/wps_datatypes";
import { Harvester } from "./riesgos.scenario.harvester";

describe('harvester test-suite', () => {

    it('wps-describe works', (done) => {
        const wpsClient = new WpsClient('1.0.0', new HttpClient());
        wpsClient.describeProcess(
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess').subscribe((result: WpsProcessDescription) => {
                expect(result).toBeTruthy();
                done();
        });
    });

    it('harvesting should work', (done) => {
        done();
    });
});