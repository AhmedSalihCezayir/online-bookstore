import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Row, Col, ListGroup, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Product = ({ history, product}) => {
  const [qty, setQty] = React.useState(1)

  const addToCartHandler = () => {
    history.push(`/cart/${product.id}?qty=${qty}`)
  }

  const addToWishListHandler = () => {
    
  }


  return (
    <Card className='my-3 p-3 rounded'>
      <Card.Text as='h3'>{product.title}</Card.Text>
      <Card.Body>
        <Card.Text>Author: {product.authorName}</Card.Text>
        <Card.Text>Page No: {product.pageNumber}</Card.Text>
        <Card.Text>Genres: {product.genres.map(genre => genre.name).join(', ')}</Card.Text> 
        <Card.Text>Price: ${product.price}</Card.Text>
        {/* <Card.Text>Status: {product.quantity > 0 ? 'In Stock' : 'Out Of Stock'}</Card.Text> */}
        
        {/* {product.countInStock > 0 && ( */}
        <ListGroup variant='flush'>
          {/* <ListGroup.Item>
            <Row>
              <Col>Qty</Col>
              <Col>
                <Form.Control
                  as='select'
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                >
                  {[...Array(product.countInStock).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    )
                  )}
                </Form.Control>
              </Col>
            </Row>
          </ListGroup.Item> */}
          <ListGroup.Item>
            <Row className='d-flex justify-content-md-center'>
              <Button
                onClick={addToCartHandler}
                type='button'
              >
                Add To Cart
              </Button>
              <Button variant='link' className='text-danger' onClick={addToWishListHandler}>
                <FontAwesomeIcon icon={faHeart} />
              </Button>
            </Row>
        </ListGroup.Item>
      </ListGroup>
      {/* )} */}
      </Card.Body>
    </Card>
  )
}

export default Product;




