import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	// ! THESE ARE PRIVATE DATA DO NOT PUSH TO PUBLIC REPO
	apiKey: 'AIzaSyAI5mk6IPsX1OaQ2PwrBQ8NqDwDFSNczrc',
	// authDomain: 'centered-motif-384420.firebaseapp.com',
	projectId: 'bookstore-auth-222c8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
	/* extra options */
});

export default auth;
