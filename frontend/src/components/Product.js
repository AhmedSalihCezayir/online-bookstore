import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Row, Col, ListGroup, Form } from 'react-bootstrap'

const Product = ({ history, product}) => {
  const [qty, setQty] = React.useState(1)

  const addToCartHandler = () => {
    history.push(`/cart/${product.id}?qty=${qty}`)
  }

  return (
    <Card className='my-3 p-3 rounded'>
      <Card.Text as='h3'>{product.book.title}</Card.Text>
      <Card.Body>
        <Card.Text>Author: {product.book.authorName}</Card.Text>
        <Card.Text>Page No: {product.book.pageNumber}</Card.Text>
        <Card.Text>Genres: {product.book.genres.map(genre => genre.name).join(', ')}</Card.Text> 
        <Card.Text>Price: ${product.book.price}</Card.Text>
        <Card.Text>Status: {product.book.quantity > 0 ? 'In Stock' : 'Out Of Stock'}</Card.Text>
        
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
          <Button
            onClick={addToCartHandler}
            className='btn-block'
            type='button'
          >
            Add To Cart
          </Button>
        </ListGroup.Item>
      </ListGroup>
      {/* )} */}
      </Card.Body>
    </Card>
  )
}

export default Product;




