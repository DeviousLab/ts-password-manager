import createServer from "./utils/createServer";
import { gracefulShutdown } from "./utils/db";
import logger from "./utils/logger";

async function main() {
  const app = createServer(); 

  try {
    const url = await app.listen(4000, '0.0.0.0');
    logger.info(`Server listening on ${url}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
  const signals = ["SIGTERM", "SIGINT"];
  for(let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i], app);
  }
}

main();