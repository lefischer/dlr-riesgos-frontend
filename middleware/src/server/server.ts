import express from 'express';
import { Request, Response } from 'express';
import { LowdbClient } from '../database/lowdb/lowdbClient';
import { HttpClient } from '../http_client/http_client';
import { RiesgosService } from '../model/riesgos.service';
import { Product } from '../model/datatypes/riesgos.datatypes';
import { FakeCache } from '../wps/lib/cache';
import { Server as WsServer } from 'ws';
const url = require('url');


export function setUpServer(port = 3000) {
    const app = express();
    
    const http = new HttpClient();
    const db = new LowdbClient();
    const cache = new FakeCache();
    const riesgosService = new RiesgosService(db, http, cache);
    
    
    app.get('/getScenarioMetaData', (req: Request, res: Response) => {
        riesgosService.getScenarios().subscribe((result) => {
            res.send(result);
        });
    });
    
    app.get('/getScenarioData/:id', (req: Request, res: Response) => {
        riesgosService.getScenarioData(req.params.id).subscribe((result) => {
            res.send(result);
        });
    });
    
    const expressServer = app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`);
    });
    
    const wsServer = new WsServer({ noServer: true });
    wsServer.on('connection', (socket) => {
        socket.on('message', (message) => {
            
            const parsed = JSON.parse(message.toString());
    
            riesgosService.executeService(parsed.process, parsed.inputs, parsed.outputs).subscribe((results: Product[]) => {
                console.log('Server: execution results', results);
                socket.send(JSON.stringify(results));
                socket.close();
            }, (error: any) => {
                console.log('An error occurred: ', error);
                socket.send(JSON.stringify(error.message));
                socket.close();
            });
        });
    });
    
    expressServer.on('upgrade', (request, socket, head) => {
        const pathname = url.parse(request.url).pathname;
    
        if (pathname === '/executeProcess') {
            wsServer.handleUpgrade(request, socket, head, function done(ws) {
                wsServer.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    return expressServer;
}

