import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import userRoutes from "./routes/user.routes";
import shiftRoutes from "./routes/shift.routes";
import scheduleRoutes from "./routes/schedule.routes";
import swapRoutes from "./routes/swap.routes";
import { ApiError } from "./utils/ApiError";

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// підключення фронту
app.use(express.static(path.join(__dirname, "../../lab_1")));

// перевірка роботи сервера
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
});

// API маршрути
app.use("/api/users", userRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/swaps", swapRoutes);

// 404
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Route not found",
            details: null,
        },
    });
});

// обробка помилок
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = String((err as { message?: string })?.message || "");

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details ?? null,
            },
        });
    }

    if (message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({
            error: {
                code: "CONFLICT",
                message: "Unique constraint failed",
                details: null,
            },
        });
    }

    if (message.includes("NOT NULL") || message.includes("CHECK")) {
        return res.status(400).json({
            error: {
                code: "BAD_REQUEST",
                message: "Invalid data",
                details: null,
            },
        });
    }

    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Unexpected error",
            details: null,
        },
    });
});

export default app;