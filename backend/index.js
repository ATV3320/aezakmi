import express from 'express';
import bodyParser from 'body-parser';
import AdminRouter from './routes/admin.js';



const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/v1',AdminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
