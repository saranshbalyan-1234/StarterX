import { exec } from 'child_process';
import express from 'express';
const Router = express.Router();

Router.get('/load-test', (_req, res) => {
  const k6Command = 'k6 run ./K6/load-test.js';

  exec(k6Command, (error, stdout, stderr) => {
    console.log('Running K6');
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send(`Error running K6: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log('success');
    return res.send(stdout);
  });
});

export default Router;
