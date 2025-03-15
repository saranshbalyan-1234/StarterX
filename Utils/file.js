import glob from 'glob';

export const getDirectories = function getDirectories (src = '.', filetype) {
  try {
    const files = glob(`${src}/**/*.${filetype}.js`, { sync: true });
    return files || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
