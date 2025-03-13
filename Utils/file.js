import glob from 'fast-glob';
// needs to be removed and back to glob
export const getDirectories = async (src = '.', filetype) => {
  try {
    const files = await glob(`${src}/**/*.${filetype}.js`);
    return files || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
