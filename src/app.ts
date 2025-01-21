import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();
console.log('hello from the other side');
app.use(express.json());
app.use(cors());
app.get('/', (req: Request, res: Response) => {
  const hello = 'Hello world!';

  res.send(hello);
});

export default app;
