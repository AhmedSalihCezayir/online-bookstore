import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [publisher, setPublisher] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [isbn, setIsbn] = useState('0000000000000')
  const [pageNumber, setPageNumber] = useState(0)
  const [price, setPrice] = useState(0)
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [genres, setGenres] = useState([])
  const [tempGenre, setTempGenre] = useState(''); // New state variable to store the temporary genre value
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.id || product.id !== productId) {
        dispatch(listProductDetails(productId))        
      } else {
        setTitle(product.book.title)
        setAuthorName(product.book.authorName)
        setPublisher(product.book.publisher)
        setPublicationYear(product.book.publicationYear)
        setIsbn(product.book.isbn)
        setPageNumber(product.book.pageNumber)
        setPrice(product.book.price)
        setGenres(product.book.genres)
        setPurchasePrice(product.book.purchasePrice)
        setQuantity(product.book.quantity)
      }
    }
  }, [dispatch, history, productId, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();

    const newGenres = tempGenre.split(',').map((genre) => genre.trim());
    const updatedGenres = [...newGenres];
    
    dispatch(
      updateProduct({
        id: productId,
        book:{
          id: product.book.id,
          title,
          authorName,
          publisher,
          publicationYear,
          isbn,
          pageNumber,
          price,
          genres: updatedGenres,
        },
        quantity,
        purchasePrice,
      })
    )
    setTempGenre(''); // Clear the tempGenre state
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back 
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter title'
                value={title}
                onChange={(e) => setTitle(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='author'>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter author name'
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='publisher'>
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Publisher'
                value={publisher}
                onChange={(e) => setPublisher(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='publicationYear'>
              <Form.Label>Year</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter publication year'
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='ISBN'>
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter ISBN'
                value={isbn}
                onChange={(e) => setIsbn(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='pageNumber'>
              <Form.Label>Page #</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter page number'
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='purchasePrice'>
              <Form.Label>Purchase Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter purchase price'
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='quantity'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='genres'>
              <Form.Label>Genres</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter genres'
                value={tempGenre}
                onChange={(e) => setTempGenre(e.target.value.trim())}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
