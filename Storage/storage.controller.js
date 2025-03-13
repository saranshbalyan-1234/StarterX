import successConstants from '#constants/success.contant.js';
import getError from '#utils/error.js';


export const uploadFile = async (req, res) => {
    try {
        return res.status(200).json({
            message: successConstants.FILE_UPLOADED,
            files: req.files
        });
    } catch (error) {
        getError(error, res);
    }
};