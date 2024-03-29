import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';
import AuthContext from '../AuthContext';
import backendClient from '../config/axiosConfig';

const HomeScreen = ({ history, match }) => {
	const dispatch = useDispatch();
	const currentUser = useContext(AuthContext);
	const currentUserID = currentUser?.id;

	const [pageNumber, setPageNumber] = useState(match.params.pageNumber || 0); // New state variable to store the current page number
	const [author, setAuthor] = useState('');
	const [title, setTitle] = useState('');
	const [publicationYear, setPublicationYear] = useState('');
	const [genre, setGenre] = useState(1);
	const [genreChoices, setGenreChoices] = useState([]); // New state variable to store the genre options from the database
	const [filters, setFilters] = useState({});
	const [selectedButton, setSelectedButton] = useState('popular'); // State variable to keep track of the selected button
	const [sortingType, setSortingType] = useState(0); // State variable to keep track of the sorting type [0: popular, 1: new, 2: wishlist, 3:filters]

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;

	useEffect(() => {
		if (currentUser && currentUser.isAdmin) {
			history.push("/admin/productlist")
		}
	}, [history, currentUser])

	useEffect(() => {
		let emptyFilters = {}
		if(sortingType === 3) {
			dispatch(listProducts(pageNumber, true, filters, sortingType, currentUserID));
		}
		else{
			dispatch(listProducts(pageNumber, true, emptyFilters, sortingType, currentUserID));
		}
	}, [dispatch, pageNumber, filters, sortingType, currentUserID]);

	useEffect(() => {
		// Fetch genre options from the database
		const fetchGenres = async () => {
			try {
				let genresInDB = await backendClient.get(`/api/v1/genres`);
				setGenreChoices(genresInDB.data);
			} catch (error) {
				console.log('Error fetching genres:', error);
			}
		};

		fetchGenres();
	}, []);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		if (name === 'author') {
			setAuthor(value.trim());
		} else if (name === 'title') {
			setTitle(value.trim());
		} else if (name === 'publicationYear') {
			setPublicationYear(value.trim());
		} else if (name === 'genre') {
			setGenre(value.trim());
		}
	};

	const handleFilterApply = () => {
		const temp = {};
		if (author !== '') {
			temp.author = author;
		}
		if (title !== '') {
			temp.title = title;
		}
		if (publicationYear !== '') {
			temp.publicationYear = publicationYear;
		}
		if (genre !== '') {
			temp.genre = genre;
		}
		setFilters(temp);
		console.log(temp);
	};

	const handleButtonClick = (button) => {
		console.log("button: ", button)
		setSelectedButton(button);
		// Update the product listing based on the selected button
		if (button === 'filter') {
			setSortingType(3);
		} else {
			if (button === 'popular') {
				setSortingType(0);
			} else if (button === 'new') {
				setSortingType(1);
			} else if (button === 'wishlist') {
				setSortingType(2);
			}
		}
	};

	return (
		<>
			<Row className='d-flex justify-content-around'>
				<Button
					variant={selectedButton === 'popular' ? 'primary' : 'secondary'}
					onClick={() => handleButtonClick('popular')}
				>
					Popular Products
				</Button>
				<Button
					variant={selectedButton === 'new' ? 'primary' : 'secondary'}
					onClick={() => handleButtonClick('new')}
				>
					New Products
				</Button>
				<Button
					variant={selectedButton === 'filter' ? 'primary' : 'secondary'}
					onClick={() => handleButtonClick('filter')}
				>
					Filter Products
				</Button>
				<Button
					variant={selectedButton === 'wishlist' ? 'primary' : 'secondary'}
					onClick={() => handleButtonClick('wishlist')}
				>
					Wishlist
				</Button>
			</Row>
			{selectedButton === 'filter' && (
				<Form className='mt-5'>
					<Row>
						<Col xs={12} md={6} lg={2}>
							<Form.Control
								type='text'
								placeholder='Author'
								name='author'
								value={author}
								onChange={handleFilterChange}
							/>
						</Col>
						<Col xs={12} md={6} lg={2}>
							<Form.Control
								type='text'
								placeholder='Title'
								name='title'
								value={title}
								onChange={handleFilterChange}
							/>
						</Col>
						<Col xs={12} md={6} lg={2}>
							<Form.Control
								type='text'
								placeholder='Publication Year'
								name='publicationYear'
								value={publicationYear}
								onChange={handleFilterChange}
							/>
						</Col>
						<Col xs={12} md={6} lg={2}>
							<Form.Control as='select' name='genre' value={genre} onChange={handleFilterChange}>
								{genreChoices.map((genre) => (
									<option key={genre.id} value={genre.id}>
										{genre.name}
									</option>
								))}
							</Form.Control>
						</Col>
						<Col xs={12} md={6} lg={2}>
							<Button onClick={handleFilterApply}>Apply Filter</Button>
						</Col>
					</Row>
				</Form>
			)}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<div className='mt-4'>
					{selectedButton === 'wishlist' && products.length === 0 ? (
						<Message>Your wishlist is empty</Message>
					) : (
						<Row style={{ marginTop: 20 }}>
							{products &&
								products.map((product) => (
									<Col key={product.id} xs={12} md={6} lg={4} xl={3}>
										<Product product={product} />
									</Col>
								))}
						</Row>
					)}
				</div>
			)}
      <Pagination>
        <Pagination.Prev disabled={pageNumber === 0} onClick={() => setPageNumber(pageNumber - 1)} />
        {/* {Array.from({ length: pages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === pageNumber}
            onClick={() => handleButtonClick(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))} */}
        <Pagination.Next disabled={pageNumber === pages} onClick={() => setPageNumber(pageNumber + 1)} />
      </Pagination>
		</>
	);
};

export default HomeScreen;
