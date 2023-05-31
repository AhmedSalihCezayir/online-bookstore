import axios from 'axios';
import {
	USER_DETAILS_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_UPDATE_PROFILE_FAIL,
	USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
	USER_DETAILS_RESET,
	USER_LIST_FAIL,
	USER_LIST_SUCCESS,
	USER_LIST_REQUEST,
	USER_LIST_RESET,
	USER_DELETE_REQUEST,
	USER_DELETE_SUCCESS,
	USER_DELETE_FAIL,
	USER_UPDATE_FAIL,
	USER_UPDATE_SUCCESS,
	USER_UPDATE_REQUEST,
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import auth from '../firebase_config';
import backendClient from '../config/axiosConfig';

export const login = (email, password) => async (dispatch) => {
	dispatch({
		type: USER_LOGIN_REQUEST,
	});

	signInWithEmailAndPassword(auth, email, password)
		.then(async (userCredential) => {
			try {
				const { data } = await backendClient.get(`/api/v1/customers/me?email=${email}`);

				dispatch({
					type: USER_LOGIN_SUCCESS,
					payload: data,
				});

				localStorage.setItem('userInfo', JSON.stringify(data));
			} catch (e) {
				const { data } = await backendClient.get(`/api/v1/admins`);

				//Find if any object in the admins array has same email as the user
				const admin = data.find((admin) => admin.email === email);
				admin.isAdmin = true;

				dispatch({
					type: USER_LOGIN_SUCCESS,
					payload: admin,
				});

				localStorage.setItem('userInfo', JSON.stringify(admin));
			}
		})
		.catch((error) => {
			dispatch({
				type: USER_LOGIN_FAIL,
				payload: error.response && error.response.data.message ? error.response.data.message : error.message,
			});
		});
};

export const logout = () => (dispatch) => {
	signOut(auth)
		.then(() => {
			// Sign-out successful.
			localStorage.removeItem('userInfo');
			localStorage.removeItem('cartItems');
			localStorage.removeItem('shippingAddress');
			localStorage.removeItem('paymentAddress');
			localStorage.removeItem('paymentMethod');
			dispatch({ type: USER_LOGOUT });
			dispatch({ type: USER_DETAILS_RESET });
			dispatch({ type: ORDER_LIST_MY_RESET });
			dispatch({ type: USER_LIST_RESET });
			document.location.href = '/login';
		})
		.catch((error) => {
			// An error happened
			console.log(error.respone);
		});
};

export const register = (name, phoneNumber, email, password) => async (dispatch) => {
	dispatch({
		type: USER_REGISTER_REQUEST,
	});

	createUserWithEmailAndPassword(auth, email, password)
		.then(async (userCredential) => {
			// Signed in user
			const user = userCredential.user;

			dispatch({
				type: USER_REGISTER_SUCCESS,
				payload: user,
			});

			dispatch({
				type: USER_LOGIN_SUCCESS,
				payload: user,
			});

			try {
				const { data } = await backendClient.post(`/api/v1/customers`, {
					name,
					email,
					password,
					phoneNumber,
				});
				localStorage.setItem('userInfo', JSON.stringify(data));
			} catch (e) {
				console.log(e.respone);
			}
		})
		.catch((error) => {
			dispatch({
				type: USER_REGISTER_FAIL,
				payload: error.response && error.response.data.message ? error.response.data.message : error.message,
			});
		});
};

export const getUserDetails = (id) => async (dispatch) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
		});

		const { data } = await backendClient.get(`/api/v1/customers/${id}`);

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: USER_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const updateUserProfile = (user) => async (dispatch) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
		});

		const { data } = await backendClient.post(`/api/v1/customers`, user);

		dispatch({
			type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});
		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload: message,
		});
	}
};

export const listUsers = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});

		// const {
		//   userLogin: { userInfo },
		// } = getState()

		// const config = {
		//   headers: {
		//     Authorization: `Bearer ${userInfo.token}`,
		//   },
		// }

		// const { data } = await axios.get(`/api/customers`, config)
		const { data: customers } = await backendClient.get(`/api/v1/customers`);
		const { data: admins } = await backendClient.get(`/api/v1/admins`);
		const new_admins = admins.map((a) => {
			return { ...a, isAdmin: true } 
		})

		const users = new_admins.concat(customers)

		dispatch({
			type: USER_LIST_SUCCESS,
			payload: users,
		});
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: USER_LIST_FAIL,
			payload: message,
		});
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DELETE_REQUEST,
		});

		// const {
		//   userLogin: { userInfo },
		// } = getState()

		// const config = {
		//   headers: {
		//     Authorization: `Bearer ${userInfo.token}`,
		//   },
		// }

		// await axios.delete(`/api/customers/${id}`, config)

		const { data } = await backendClient.delete(`/api/v1/customers/${id}`);

		dispatch({ type: USER_DELETE_SUCCESS });
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: USER_DELETE_FAIL,
			payload: message,
		});
	}
};

export const updateUser = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_REQUEST,
		});

		// const {
		//   userLogin: { userInfo },
		// } = getState()

		// const config = {
		//   headers: {
		//     'Content-Type': 'application/json',
		//     Authorization: `Bearer ${userInfo.token}`,
		//   },
		// }

		// const { data } = await axios.post(`/api/customers/`, user, config)

		const { data } = await backendClient.post(`/api/v1/customers`, user);
		dispatch({ type: USER_UPDATE_SUCCESS });

		dispatch({ type: USER_DETAILS_SUCCESS, payload: data });

		dispatch({ type: USER_DETAILS_RESET });
	} catch (error) {
		const message = error.response && error.response.data.message ? error.response.data.message : error.message;
		if (message === 'Not authorized, token failed') {
			dispatch(logout());
		}
		dispatch({
			type: USER_UPDATE_FAIL,
			payload: message,
		});
	}
};
