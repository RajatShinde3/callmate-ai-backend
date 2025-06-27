class Logger {
  static info(message, meta = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    if (Object.keys(meta).length) console.log(meta);
  }

  static warn(message, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    if (Object.keys(meta).length) console.warn(meta);
  }

  static error(message, error = null, meta = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error({
        error: error?.message || error,
        stack: error?.stack,
        ...meta
      });
    } else if (Object.keys(meta).length) {
      console.error(meta);
    }
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
      if (Object.keys(meta).length) console.debug(meta);
    }
  }
}

export default Logger;
