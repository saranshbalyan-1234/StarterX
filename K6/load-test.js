import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    vus: 50, // Number of virtual users
    duration: '30s', // Test duration
};

export default function () {
    // Replace with the API you want to test
    const url = 'http://localhost:3001/health';
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    http.get(url, params);
    sleep(2);
}
