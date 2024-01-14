import axios from 'axios';

const isLocal = true;
const baseURL = isLocal ? 'http://localhost:8080' : 'https://centered-motif-384420.uc.r.appspot.com';

const backendClient = axios.create({ baseURL });

export default backendClient;
