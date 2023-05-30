import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';
import AuthContext from '../AuthContext';

const OrderScreen = ({ match, history }) => {
	const orderID = match.params.id;
	const currentUser = useContext(AuthContext);
	const currentUserID = currentUser?.id;

	const [order, setOrder] = useState({});
	const [loading, setLoading] = useState(true);

	// const [sdkReady, setSdkReady] = useState(false)

	const dispatch = useDispatch();

	// const orderDetails = useSelector((state) => state.orderDetails)
	// const { order, loading, error } = orderDetails

	// const orderPay = useSelector((state) => state.orderPay)
	// const { loading: loadingPay, success: successPay } = orderPay

	// const orderDeliver = useSelector((state) => state.orderDeliver)
	// const { loading: loadingDeliver, success: successDeliver } = orderDeliver

	// const userLogin = useSelector((state) => state.userLogin)
	// const { userInfo } = userLogin

	// if (!loading) {
	// 	//   Calculate prices
	// 	const addDecimals = (num) => {
	// 		return (Math.round(num * 100) / 100).toFixed(2);
	// 	};

	// 	order.itemsPrice = addDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
	// }

	useEffect(() => {
		// if (!userInfo) {
		//   history.push('/login')
		// }

		// const addPayPalScript = async () => {
		//   const { data: clientId } = await axios.get('/api/config/paypal')
		//   const script = document.createElement('script')
		//   script.type = 'text/javascript'
		//   script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
		//   script.async = true
		//   script.onload = () => {
		//     setSdkReady(true)
		//   }
		//   document.body.appendChild(script)
		// }

		// if (!order || successPay || successDeliver || order._id !== orderId) {
		//   dispatch({ type: ORDER_PAY_RESET })
		//   dispatch({ type: ORDER_DELIVER_RESET })
		//   dispatch(getOrderDetails(orderId))
		// } else if (!order.isPaid) {
		//   if (!window.paypal) {
		//     addPayPalScript()
		//   } else {
		//     setSdkReady(true)
		//   }
		// }
		const fetchOrderInfo = async () => {
			setLoading(true);
			const { data } = await axios.get(`https://centered-motif-384420.uc.r.appspot.com/api/v1/customers/${currentUserID}/orders/${orderID}`);
      console.log("data: ", data)
			setOrder(data);
			setLoading(false);
		};

		if (currentUserID) {
			fetchOrderInfo();
		}
	}, [currentUserID]);

	// const successPaymentHandler = (paymentResult) => {
	//   console.log(paymentResult)
	//   dispatch(payOrder(orderId, paymentResult))
	// }

	// const deliverHandler = () => {
	//   dispatch(deliverOrder(order))
	// }

	return loading ? (
		<Loader />
	) : !order ? (
		''
	) : (
		<>
			<h1>Order {order.id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
                <strong>Name: </strong> {currentUser?.name}
              </p>
							<p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${currentUser?.email}`}>{currentUser?.email}</a>
              </p>
							<p>
								<strong>Address:</strong>
								{order.shipping.address.streetAddress}, {order.shipping.address.city}{' '}
								{order.shipping.address.postalCode}, {order.shipping.address.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>Delivered on {order.deliveredAt}</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>


						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.books.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.books.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col>
													<Link to={`/product/${item.product}`}>{item.book.title}</Link>
												</Col>
												<Col md={4}>
													{item.quantity} x ${item.book.price} = ${item.quantity * item.book.price}
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
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
