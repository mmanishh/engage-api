require('dotenv').config();

const http = require('http');
const chalk = require('chalk');

const conn = require('./config/sequelize-connect');

conn.dbConnect();

const app = require('./app');

const server = http.createServer(app);

process.on('message', (message, connection) => {
    if (message !== 'sticky-session:connection') return;
    server.emit('connection', connection);
    connection.resume();
});

process.on('uncaughtException', (uncaughtExc) => {
    console.error(chalk.bgRed('UNCAUGHT EXCEPTION! 💥 Shutting down...'));
    console.error('uncaughtException Err::', uncaughtExc);
    console.error('uncaughtException Stack::', JSON.stringify(uncaughtExc.stack));
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error(chalk.bgRed('UNHANDLED PROMISE REJECTION! 💥 Shutting down...'));
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.info('💥 Process terminated!');
    });
});

if (process.env.NODE_ENV !== 'test') {
    server.listen(process.env.APP_PORT || 4000, () => {
        console.info(chalk.blue(`Server listening on port ${process.env.APP_PORT}!`));
    });
}
