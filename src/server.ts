import {app} from "./app.js";
import {prisma} from "./config/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    /**
     * Database Connection
     */
    await prisma.$connect();
    logger.info("PostgreSQL connected successfully");
    /**
     * Start Express Server
     */
    app.listen(PORT, () => {
      logger.info(
        `Server running on http://localhost:${PORT}`
      );
      logger.info(
        `Swagger Docs available at http://localhost:${PORT}/api/docs`
      );
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();