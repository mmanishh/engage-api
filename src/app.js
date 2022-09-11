const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const { swaggerSpec } = require('./docs/docsSwagger');

const indexRoutes = require('./routes/v1/index');

const { errorHandler } = require('./middleware/errorHandler');

const { TOO_MANY_REQUESTS } = require('./helpers/messages');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        error: TOO_MANY_REQUESTS,
    },
});

const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(logger('common'));

// redirecting to root
app.get('/', (req, res) => {
    res.status(200).json({
        info: 'Engage REST API',
        docs: `http://localhost:${process.env.APP_PORT}/api/v1/docs`,
    });
});

app.get('/health', (req, res) => {
    const startUsage = process.cpuUsage();

    const status = {
        uptime: process.uptime(),
        message: 'Ok',
        timezone: 'IE',
        date: new Date(),
        node: process.version,
        memory: process.memoryUsage,
        platform: process.platform,
        cpuUsage: process.cpuUsage(startUsage),
    };

    res.status(200).json({ status });
});

app.use('/api/v1', apiLimiter, indexRoutes);
// swagger docs at ./docs/schemas
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
