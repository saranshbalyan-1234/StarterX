import successConstants from '#constants/success.contant.js';
import getError from '#utils/error.js';

export const uploadFile = (req, res) => {
  try {
    return res.status(200).json({
      files: req.files,
      message: successConstants.FILE_UPLOADED
    });
  } catch (error) {
    getError(error, res);
  }
};
