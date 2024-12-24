const getError = (e, res) => {
  console.error(e);
  if (!res || res.headersSent) return;
  return res.status(e.statusCode || 500).json({ error: e.message.replace('Error: ', ''), type: e.customName === 'ApiError' ? 'Error' : e.customName });
};

export default getError;
