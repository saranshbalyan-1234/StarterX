const getError = (e, res, tokenType) => {
  console.error(e);
  let message = '';
  if (e.message) {
    let code = e.statusCode || 400;
    switch (e.name) {
      case 'TokenExpiredError':
        message = `${tokenType || 'Access'} Token Expired`;
        code = 403;
        break;
      case 'JsonWebTokenError':
        message = `Invalid ${tokenType || 'Access'} Token`;
        code = 401;
        break;
      default:
        message = e.message;
    }
    const formattedMessage = message.replace('Error: ', '');
    return res.status(code).json({ error: formattedMessage });
  }
  return res.status(500).json(e);
};

export default getError;
