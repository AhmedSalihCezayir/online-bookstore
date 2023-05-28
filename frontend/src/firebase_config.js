import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	// TODO THESE ARE PRIVATE DATA DO NOT PUSH TO PUBLIC REPO
	apiKey: 'AIzaSyA5GsGgFJOUfXfWQ5In9GtBnX2hrEdbUx4',
	authDomain: 'centered-motif-384420.firebaseapp.com',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
	/* extra options */
});

export default auth;
