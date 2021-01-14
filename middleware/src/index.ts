import express from 'express';
import { Request, Response } from 'express';
import { RiesgosService } from './riesgos/scenario_service/riesgos.service';


const app = express();
const port = 3000;

const riesgosService = new RiesgosService();


app.get('/getScenarioMetaData/:id', (req: Request, res: Response) => {
    riesgosService.getScenarioMetadata(req.params.id).subscribe((result) => {
        res.send(result);
    });
});

app.get('/getScenarioData/:id', (req: Request, res: Response) => {
    riesgosService.getScenarioData(req.params.id).subscribe((result) => {
        res.send(result);
    });
});

app.post('/execService', (req: Request, res: Response) => {
    // @TODO: via socket
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});