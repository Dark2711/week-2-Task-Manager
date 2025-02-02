import express from 'express';
import mainRouter from './routes/main.route';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './db/db';
const app = express();

app.use(express.json());
app.use(cors());

//connect to db
connectDB();
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api/v1', mainRouter);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server is running on PORT: ${process.env.PORT}`),
);
