import axios from 'axios';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { onAuthStateChanged } from 'firebase/auth';
import auth from './firebase_config';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				const { data } = await axios.get(`http://localhost:8080/api/v1/customers/me?email=${user.email}`);
				setCurrentUser(data);
			} else {
				setCurrentUser(user);
			}
		});
	}, []);

	return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
