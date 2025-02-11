import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();
console.log('hello from the other side');
app.use(express.json());
app.use(cors());

app.use('/api/v1', router)

const test = async (req: Request, res: Response) => {
 
  
  const hello = 'Hello world!';
  res.send(hello);
}

app.get('/', test);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, req, res, next)
});

app.use((req: Request, res: Response, next: NextFunction) => {
  notFound(req, res, next)
})

export default app;
