import NodeCache from 'node-cache';

// Initialize cache with 1 hour TTL (time to live)
const cache = new NodeCache({ stdTTL: 3600 });

export default cache;
