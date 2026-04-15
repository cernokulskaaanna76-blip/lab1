import app from "./app";
import { initDb } from "./db/initDb"; //викликається initDb, який відповідає за підготовку бази даних

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
    await initDb();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error("Startup error:", err);
    process.exit(1);
});