import axios from 'axios';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { onAuthStateChanged } from 'firebase/auth';
import auth from './firebase_config';
import AuthContext from './AuthContext';
import backendClient from './config/axiosConfig';

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const { data } = await backendClient.get(`/api/v1/customers/me?email=${user.email}`);
					setCurrentUser(data);
				} catch (e) {
					const { data } = await backendClient.get(`/api/v1/admins`);
					//Find if any object in the admins array has same email as the user
					const admin = data.find((admin) => admin.email === user.email);
					admin.isAdmin = true;
					setCurrentUser(admin);
				}
			} else {
				setCurrentUser(user);
			}
		});
	}, []);

	return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
