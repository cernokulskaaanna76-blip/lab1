const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/user.routes');
const shiftRoutes = require('./routes/shift.routes');  
const swapRoutes = require('./routes/swap.routes');     

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);   
app.use('/api/swaps', swapRoutes);     


app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
});


app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        error: {
            code: err.code || "INTERNAL_ERROR",
            message: err.message || "Something went wrong",
            details: err.details || null,
            timestamp: new Date().toISOString() 
        }
    });
});

module.exports = app;