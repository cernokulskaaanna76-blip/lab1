const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const shiftRoutes = require('./routes/shift.routes');
const userRoutes = require('./routes/user.routes');
const swapRoutes = require('./routes/swap.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Підключаємо маршрути до префіксів
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/swaps', swapRoutes);

module.exports = app;