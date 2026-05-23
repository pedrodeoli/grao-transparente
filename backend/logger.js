const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Formato principal estruturado em JSON para persistência
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }), // Captura stack traces de erros
  format.splat(),
  format.json()
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'grao-transparente-api' },
  transports: [
    // Gravar logs de nível 'error' com rotação diária
    new transports.DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d', // Manter por 14 dias
      maxSize: '20m',  // Rotacionar ao atingir 20MB
    }),
    // Gravar todos os logs combinados
    new transports.DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
    }),
  ],
});

// Em desenvolvimento local, exibir no console de forma amigável e colorida
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, timestamp, stack }) => {
        return `[${timestamp}] ${level}: ${stack || message}`;
      })
    ),
  }));
}

module.exports = logger;
