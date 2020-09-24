import { HttpClient } from "../../http_client/http_client";
import { registerWpsProcess } from "../riesgos.special_processes";
import { orgn52gfzriesgosalgorithmimplQuakeledgerProcessProcess, server as qlServer } from "../services/orgn52gfzriesgosalgorithmimplQuakeledgerProcess";


const httpClient = new HttpClient();

const quakeledger = registerWpsProcess('quakeledger', [], [], false, httpClient, orgn52gfzriesgosalgorithmimplQuakeledgerProcessProcess, qlServer);