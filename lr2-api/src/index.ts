import app from "./app";
import { initDb } from "./db/initDb";

const PORT = 3000;

async function start() {
    try {
        await initDb();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
}

start();