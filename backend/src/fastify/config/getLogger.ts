export const getLogger = () => {
  if (process.env.MODE === 'development') {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname,reqId,req.remoteAddress,req.remotePort,req.host',
        },
      },
    };
  }

  return true;
};
