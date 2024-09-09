import express from 'express';

const Router = express.Router();

Router.get('/health', (_req, res) =>
  res.json('Server is Working')
);

export default Router;
