// eslint-disable-next-line import/no-unresolved
import { sleep } from 'k6';
// eslint-disable-next-line import/no-unresolved
import http from 'k6/http';

export const options = {
  // Number of virtual users
  duration: '30s',
  vus: 500 // Test duration
};

const test = () => {
  // Replace with the API you want to test
  const url = 'https://starterx.onrender.com/health';
  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  http.get(url, params);
  sleep(1);
};

export default test;
