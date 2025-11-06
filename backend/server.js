import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouts from './routes/userRouts.js';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());

//connect DB
connectDB();
//middlewares
app.use(express.json()); 
app.use('/api/auth', userRouts);

app.use('/api/resume', resumeRoutes);
app.use('/uploads', 
         express.static(path.join(_dirname, 'uploads'),{
          setHeaders: (res, path) => {
            res.set('Access-Control-Allow-Origin', 'http://localhost:4000');
          }
         })
        );
        


//routes
app.get('/', (req, res) => {
  res.send('Welcome to the Resume Builder API');
});

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});

