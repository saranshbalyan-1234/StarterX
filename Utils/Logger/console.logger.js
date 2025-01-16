import chalk from 'chalk';

const overrideInfo = () => {
  if (process.env.PRINT_CONSOLE_INFO === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }

  const log = console.info;
  console.log = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [`[${new Date().toLocaleString()}]${Array(30).fill('\xa0').join('')}`.substring(0, 25), chalk.blue('INFO:    '), fileName, ...e]);
    }
  };
};

const overrideWarn = () => {
  if (process.env.PRINT_CONSOLE_WARN === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }
  const log = console.info;
  try {
    throw new Error();
  } catch (error) {
    console.warn = (...e) => {
      const fileName = getFileNameFromError(error);
      log.apply(console, [`[${new Date().toLocaleString()}]${Array(30).fill('\xa0').join('')}`.substring(0, 25), chalk.yellow('WARN:    '), fileName, ...e]);
    };
  }
};

const overrideError = () => {
  if (process.env.PRINT_CONSOLE_ERROR === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }
  const log = console.info;
  console.error = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [`[${new Date().toLocaleString()}]${Array(30).fill('\xa0').join('')}`.substring(0, 25), chalk.red('ERROR:   '), fileName, ...e]);
    }
  };
};

const overrideDebug = () => {
  if (process.env.PRINT_CONSOLE_DEBUG === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }

  const log = console.info;
  console.debug = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [`[${new Date().toLocaleString()}]${Array(30).fill('\xa0').join('')}`.substring(0, 25), chalk.magenta('DEBUG:   '), fileName, ...e]);
    }
  };
};

const overrideSuccess = () => {
  if (process.env.PRINT_CONSOLE_SUCCESS === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }

  const log = console.info;

  console.success = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [`[${new Date().toLocaleString()}]${Array(30).fill('\xa0').join('')}`.substring(0, 25), chalk.green('SUCCESS: '), fileName, ...e]);
    }
  };
};

const overrideConsole = () => {
  overrideInfo();
  overrideWarn();
  overrideError();
  overrideSuccess();
  overrideDebug();
};

export default overrideConsole;

const getFileNameFromError = (error) => {
  let file = error.stack.split('\n')[2].split('/').at(-1).replace(/\)/, '');
  if (file.includes('error.js')) file = error.stack.split('\n')[3].split('/').at(-1).replace(/\)/, '');
  const str = `[${file}]${
    Array(30).fill('\xa0').join('')}`;
  return str.substring(0, 30);
};
