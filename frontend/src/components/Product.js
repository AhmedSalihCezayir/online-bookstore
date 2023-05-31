import axios from 'axios'
import React, { useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Card, Button, Row, Col, ListGroup, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../AuthContext';

const Product = ({ product}) => {
  const [qty, setQty] = React.useState(1)
  const [wished, setWished] = React.useState(false)
  const currentUser = useContext(AuthContext);
  const currentUserID = currentUser?.id;
  
  const history = useHistory();

  const addToCartHandler = () => {
    history.push(`/cart/${product.id}?qty=${qty}`)
  }

  const addToWishListHandler = async () => {
    try { 
      if (currentUserID) {
        if(!wished) {
          setWished(true)
          await axios.post(`https://centered-motif-384420.uc.r.appspot.com/api/v1/customers/${currentUserID}/favourites`, {"bookId": product.id})
        } 
        else {
          setWished(false)
          await axios.delete(`https://centered-motif-384420.uc.r.appspot.com/api/v1/customers/${currentUserID}/favourites/${product.id}`)
        } 
      }
    } catch (error) {
      console.log('Error changing the wishlist:', error);
    }
  }

  useEffect(() => {
    if (product.wished) {
      setWished(true)
    }

    if(product.quantity <= 0) {
      setQty("Out of Stock")
    }
    else {
      setQty(product.quantity)
    }
  }, [product])

  return (
    <Card className='my-3 p-3 rounded'>
    <Card.Text style={{ marginTop: 5, marginBottom: 5 }}>
      <strong>{product.title}</strong>
    </Card.Text>
    <Card.Text>Author: {product.authorName}</Card.Text>
    <Card.Text>Page No: {product.pageNumber}</Card.Text>
    <Card.Text>Genres: {product.genres.map(genre => genre.name).join(', ')}</Card.Text>
    <Card.Text>Price: ${product.price} Stock: {qty}</Card.Text>
    <ListGroup variant='flush'>
      <ListGroup.Item>
        <Row className='d-flex justify-content-md-center'>
          <Button onClick={addToCartHandler} type='button'>
            Add To Cart
          </Button>
          <Button variant='link' className='text-danger' onClick={addToWishListHandler}>
            {wished ? <FontAwesomeIcon icon={faHeart} /> : <FontAwesomeIcon icon={faHeart} style={{ color: 'grey' }} />}
          </Button>
        </Row>
      </ListGroup.Item>
    </ListGroup>
  </Card>
  )
}

export default Product;




