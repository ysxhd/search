import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import { CrewRouter, MoviesRouter } from './routes';

class App {
  private _app: express.Express;
  private _port: number;
  private _server: http.Server;

  constructor(port?: number) {
    this._app = express();
    this._port = port || 9999;
    this._server = null;

    this.configure();

    this.mountRoutes();

    this.listen();
  }

  get app(): express.Express {
    return this._app;
  }

  get port(): number {
    return this._port;
  }

  get server(): http.Server {
    return this._server;
  }

  private configure(): void {
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // middleware for json body parsing
    this.app.use(bodyParser.json({ limit: '5mb' }));

    this.app.use(cors());
  }

  private mountRoutes(): void {
    this.app.use('/crew', CrewRouter);
    this.app.use('/movies', MoviesRouter);
  }

  private listen(): void {
    this._server = this.app.listen(this.port, (err: Error) => {
      if (err) {
        return console.log(err);
      }

      if (process.env.CI !== 'true') {
        console.log(`Started server on: ${this.port}`);
      }
    });
  }

  close(): void {
    this.server.close();
  }
}

export default App;
