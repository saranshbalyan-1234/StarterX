import errorContstants from '#constants/error.constant.js';
import successConstants from '#constants/success.contant.js';
import getError from '#utils/error.js';

export const uploadFile = (req, res) => {
  if (!req.files || req.files.length === 0) { throw new Error(errorContstants.NO_FILES_UPLOADED); }

  try {
    return res.status(200).json({
      files: req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      })),
      message: successConstants.FILE_UPLOADED
    });
  } catch (error) {
    getError(error, res);
  }
};
