const getError = (e, res) => {
  if (res.headersSent) return;
  console.error(e)
  return res.status(500).json({error: e.message.replace('Error: ', ''),type:e.name});
};

export default getError;
