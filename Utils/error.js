const getError = (e, res) => {
  if (res.headersSent) return;
  console.error(e);
  return res.status(e.statusCode || 500).json({ error: e.message.replace('Error: ', ''), type: e.customName === 'ApiError' ? 'Error' : e.customName });
};

export default getError;
