import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
const app: Application = express();
console.log('hello from the other side');
app.use(express.json());
app.use(cors());

app.use('/api/v1/students', StudentRoutes);
app.get('/', (req: Request, res: Response) => {
  const hello = 'Hello world!';

  res.send(hello);
});

export default app;
