import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import AuthContext from '../AuthContext';

import axios from 'axios';

const PlaceOrderScreen = ({ history }) => {
	const dispatch = useDispatch();
	const [coupon, setCoupon] = useState('');
	const [discount, setDiscount] = useState(null);
	const [couponError, setCouponError] = useState(false);

	const currentUser = useContext(AuthContext);
	const currentUserID = currentUser.id;

	const cart = useSelector((state) => state.cart);

	if (!cart.shippingAddress.streetAddress && !cart.paymentAddress.streetAddress) {
		history.push('/shipping');
	} else if (!cart.paymentMethod) {
		history.push('/payment');
	}
	//   Calculate prices
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2);
	};

	cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
	cart.shippingPrice = addDecimals(cart.itemsPrice > 100) ? 0 : 100;
	cart.totalPrice = Number(cart.itemsPrice).toFixed(2);

	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, success, error } = orderCreate;

	useEffect(() => {
		if (success) {
			history.push(`/order/${order.id}`);
			dispatch({ type: USER_DETAILS_RESET });
			dispatch({ type: ORDER_CREATE_RESET });
		}
		// eslint-disable-next-line
	}, [history, success]);

	const placeOrderHandler = () => {
		if (currentUserID) {
			dispatch(
				createOrder({
					currentUserID,
					orderItems: cart.cartItems,
					shippingAddress: cart.shippingAddress,
					paymentAddress: cart.paymentAddress,
					paymentMethod: cart.paymentMethod,
					itemsPrice: cart.itemsPrice,
					totalPrice: cart.totalPrice,
					discount,
					coupon,
				})
			);
		}
	};

	const validateCoupon = async () => {
		try {
			const { data } = await axios.post(`https://centered-motif-384420.uc.r.appspot.com/api/v1/coupons`, { couponCode: coupon });
			setDiscount(data.discountAmount);
			setCouponError(false);
		} catch (error) {
			setDiscount(null);
			setCouponError(true);
			console.error(error.response);
		}
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<u>Shipping Address:</u>
							<p>
								{cart.shippingAddress.streetAddress}, {cart.shippingAddress.state}/
								{cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
								{cart.shippingAddress.country}
							</p>
							<u>Payment Address:</u>
							<p>
								{cart.paymentAddress.streetAddress}, {cart.paymentAddress.state}/
								{cart.paymentAddress.city} {cart.paymentAddress.postalCode},{' '}
								{cart.paymentAddress.country}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cart.cartItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												{/* <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col> */}
												<Col>
													<Link to={`/product/${item.product}`}>{item.name}</Link>
												</Col>
												<Col>{item.authorName}</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							{/* <ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item> */}
							<ListGroup.Item>
								<Row>
									<Col>Total Price</Col>
									{!discount ? (
										<Col>${cart.totalPrice}</Col>
									) : (
										<>
											<Col>
												<span style={{ textDecoration: 'line-through' }}>
													${cart.totalPrice}
												</span>
												&nbsp;&nbsp;&nbsp;&nbsp;-{discount}%
											</Col>
										</>
									)}
								</Row>
							</ListGroup.Item>
							{discount ? (
								<ListGroup.Item>
									<Row>
										<Col>Discounted Price</Col>
										<Col style={{ fontWeight: 'bold' }}>
											${cart.totalPrice - cart.totalPrice * (discount / 100)}
										</Col>
									</Row>
								</ListGroup.Item>
							) : (
								<></>
							)}

							<ListGroup.Item>
								<Row>
									<Col md={7}>
										<Form.Control
											placeholder='Coupon Code'
											value={coupon}
											onChange={(e) => setCoupon(e.target.value.toUpperCase())}
										/>
									</Col>
									<Col>
										<Button onClick={validateCoupon} disabled={coupon.length === 0}>
											Apply
										</Button>
									</Col>
								</Row>
								<Row>
									{couponError ? (
										<Col className='mt-2'>
											<Message variant='danger'>Invalid Coupon</Message>
										</Col>
									) : (
										''
									)}
								</Row>
							</ListGroup.Item>
							{error && (
								<ListGroup.Item>
									{' '}
									<Message variant='danger'>{error}</Message>{' '}
								</ListGroup.Item>
							)}
							<ListGroup.Item>
								<Button
									type='button'
									className='btn-block'
									disabled={cart.cartItems === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
