const getError = (e, res) => {
  e.message = e.message ? e.message.replaceAll('Error: ', '').replaceAll('ApiError: ', '') : '';
  console.error(e);
  if (!res || res.headersSent) return;
  return res.status(e.statusCode || 500).json({ error: e.message, type: e.customName === 'ApiError' ? 'Error' : e.customName });
};

export default getError;
