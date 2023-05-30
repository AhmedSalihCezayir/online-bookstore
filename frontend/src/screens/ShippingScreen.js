import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, FormControl, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';
import AuthContext from '../AuthContext';

import axios from 'axios';

const ShippingScreen = ({ history }) => {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress: shipping, paymentAddress: payment } = cart;

	const [userAddresses, setUserAddresses] = useState([]);
	const [shippingAddress, setShippingAddress] = useState(shipping);
	const [paymentAddress, setPaymentAddress] = useState(payment);
	
	const currentUser = useContext(AuthContext);
	const currentUserID = currentUser.id;

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(saveShippingAddress({ shippingAddress, paymentAddress }));
		history.push('/payment');
	};

	useEffect(() => {
		const fetchAddresses = async () => {
			const { data } = await axios.get(`http://localhost:8080/api/v1/customers/${currentUserID}/addresses`);
			setUserAddresses(data);
		};

		fetchAddresses();
	}, []);

	const handleShipping = (event) => {
		const selectedAddress = userAddresses.find((address) => address.streetAddress === event.target.value);
		setShippingAddress(selectedAddress);
	};

	const handlePayment = (event) => {
		const selectedAddress = userAddresses.find((address) => address.streetAddress === event.target.value);
		setPaymentAddress(selectedAddress);
	};

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 />
			<h1>Shipping</h1>
			{/* <Form.Check style={{ fontSize: "1.5em"}} type='checkbox' label={`default `} /> */}
			<Form>
				<Row>
					<Form.Label className='ml-3'>Shipping Address</Form.Label>
				</Row>
				<Row>
					<Col>
						<Form.Group controlId='exampleForm.SelectCustom'>
							<FormControl as='select' value={shippingAddress.streetAddress} onChange={handleShipping}>
								{userAddresses.map((address) => {
									return <option key={address.id}>{address.streetAddress}</option>;
								})}
							</FormControl>
						</Form.Group>
					</Col>
				</Row>
			</Form>

			<Form>
				<Row>
					<Form.Label className='ml-3'>Payment Address</Form.Label>
				</Row>
				<Row>
					<Col>
						<Form.Group controlId='exampleForm.SelectCustom'>
							<FormControl as='select' value={paymentAddress.streetAddress} onChange={handlePayment}>
								{userAddresses.map((address) => {
									return <option key={address.id}>{address.streetAddress}</option>;
								})}
							</FormControl>
						</Form.Group>
					</Col>
				</Row>
			</Form>

			<Row>
				<Col className='d-flex justify-content-center'>
					<Button className='w-100' onClick={() => history.push('/new_address')}>
						Add new Address
					</Button>
				</Col>
				<Col className='d-flex justify-content-center'>
					<Button className='w-100' variant='primary' onClick={submitHandler}>
						Continue
					</Button>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default ShippingScreen;
