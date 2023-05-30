import axios from 'axios';

// const baseURL =
// 	process.env.REACT_APP_ENV === 'development'
// 		? 'http://localhost:8080'
// 		: 'http://real_backend_domain';

const baseURL = 'https://centered-motif-384420.uc.r.appspot.com';

const backendClient = axios.create({ baseURL, withCredentials: true });

export default backendClient;
