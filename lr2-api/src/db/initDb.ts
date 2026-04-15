import { runMigrations } from "./runMigrations";
import { logger } from "../utils/logger";

export async function initDb(): Promise<void> {
  await runMigrations();
  logger.info("DB schema initialized");// лог після ініціалізації бази даних
}