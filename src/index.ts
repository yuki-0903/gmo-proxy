import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;