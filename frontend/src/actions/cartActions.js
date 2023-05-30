import axios from 'axios'
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
	const { data } = await axios.get(`http://localhost:8080/api/v1/books/${id}`);

	dispatch({
		type: CART_ADD_ITEM,
		payload: {
			product: data.id, // book id
			name: data.title,
			authorName: data.authorName,
			// image: data.image,
			price: data.price,
			countInStock: data.quantity,
			qty,
		},
	});

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data.shippingAddress))
  localStorage.setItem('paymentAddress', JSON.stringify(data.paymentAddress))
}

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}
