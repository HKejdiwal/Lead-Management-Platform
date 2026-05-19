import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectDatabase } from './config/db';

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Smart Leads API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
