import express from 'express';
import cors from 'cors';
import {dirname,join} from 'path';
import dotenv from 'dotenv';
import routes from './routes.js';
import { fileURLToPath } from 'url';




dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/files', express.static(join(__dirname, '..', 'files')));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app