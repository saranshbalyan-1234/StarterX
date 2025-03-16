import NodeCache from 'node-cache';
const cache = new NodeCache({ checkperiod: 60 });

const get = (key) => cache.get(key);

const set = (key, data, ttl) => cache.set(key, data, ttl);

const del = (key) => cache.del(key);

const keys = () => cache.keys();

export default { del, get, keys, set };
