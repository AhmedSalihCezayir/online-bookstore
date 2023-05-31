import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import AuthContext from '../AuthContext';

const Header = (props) => {
	const dispatch = useDispatch();
	const currentUser = useContext(AuthContext);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<header>
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>Book Store</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='ml-auto'>
							{userInfo && !userInfo.isAdmin && (
								<LinkContainer to='/cart'>
									<Nav.Link>
										<i className='fas fa-shopping-cart'></i> Cart
									</Nav.Link>
								</LinkContainer>
							)}

							{userInfo && !userInfo.isAdmin ? (
								<NavDropdown title={userInfo.name} id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
								</NavDropdown>
							) : !userInfo ? (
								<LinkContainer to='/login'>
									<Nav.Link>
										<i className='fas fa-user'></i> Sign In
									</Nav.Link>
								</LinkContainer>
							) : ''}
							{userInfo && userInfo.isAdmin && (
								<NavDropdown title='Admin' id='adminmenu'>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productlist'>
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderlist'>
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
