import express from 'express';

const Router = express.Router();

Router.get('/status', (_req, res) =>
  res.json('Server is Working')
);

export default Router;
