import App from './App';
import { loadDBs } from './db/DB';

(async (): Promise<void> => {
  const port: number = process.env.PORT ? parseFloat(process.env.PORT) : 3050;

  await loadDBs();

  new App(port);
})();
