import { sleep } from 'k6';
import http from 'k6/http';

export const options = {
  // Number of virtual users
  duration: '10s',
  vus: 50 // Test duration
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
