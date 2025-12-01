import config from './config.js';
import app from './app.js';

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Parampara Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
