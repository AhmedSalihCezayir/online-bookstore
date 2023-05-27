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
  const [countInStock, setCountInStock] = useState(0)
  const [isbn, setIsbn] = useState('0000000000000')
  const [pageNumber, setPageNumber] = useState(0)
  const [price, setPrice] = useState(0)
  const [genres, setGenres] = useState([''])
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
      if (!product.title || product.id !== productId) {
        console.log("GENRES in if", product.genres)
        console.log("product.id", product.id)
        console.log("productId", productId)
        dispatch(listProductDetails(productId))

      } else {
        setTitle(product.title)
        setAuthorName(product.authorName)
        setPublisher(product.publisher)
        setPublicationYear(product.publicationYear)
        setCountInStock(product.countInStock)
        setIsbn(product.isbn)
        setPageNumber(product.pageNumber)
        setPrice(product.price)
        setGenres(product.genres)
        console.log("GENRES in else", product.genres)
      }
    }
  }, [dispatch, history, productId, successUpdate])

  // const uploadFileHandler = async (e) => {
  //   const file = e.target.files[0]
  //   const formData = new FormData()
  //   formData.append('image', file)
  //   setUploading(true)

  //   try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }

  //     const { data } = await axios.post('/api/upload', formData, config)

  //     // setImage(data)
  //     setUploading(false)
  //   } catch (error) {
  //     console.error(error)
  //     setUploading(false)
  //   }
  // }

  const submitHandler = (e) => {
    e.preventDefault();

    const newGenres = tempGenre.split(',').map((genre) => genre.trim());
    const updatedGenres = [...newGenres];
    
    dispatch(
      updateProduct({
        id: productId,
        title,
        authorName,
        publisher,
        publicationYear,
        isbn,
        pageNumber,
        price,
        genres: updatedGenres,
        countInStock,
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
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='author'>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter author name'
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='publisher'>
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Publisher'
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(parseInt(e.target.value, 10))}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='publicationYear'>
              <Form.Label>Year</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter publication year'
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='ISBN'>
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter ISBN'
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='pageNumber'>
              <Form.Label>Page #</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter page number'
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='genres'>
              <Form.Label>Genres</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter genres'
                value={tempGenre}
                onChange={(e) => setTempGenre(e.target.value)}
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
