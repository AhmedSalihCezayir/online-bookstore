import axios from 'axios'
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from '../constants/productConstants'
import { logout } from './userActions'

export const listProducts = (pageNumber = 1, ifBook = true, filters = null, sortingType = null, customerId = null) => async (
  dispatch
) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })

    let info = {}
    let url = "https://centered-motif-384420.uc.r.appspot.com/api/v1/books"
    let totalPages;

    if(ifBook){
      if(filters && Object.keys(filters).length !== 0){  
        if (filters.title && filters.title !== ""){
          url += `?title=${filters.title}&`
        }
        if (filters.author && filters.author !== ""){
          if (url.endsWith("&"))
            url += `author=${filters.author}&`
          else
            url += `?author=${filters.author}&`
        }
        if (filters.publicationYear && filters.publicationYear !== ""){
          if (url.endsWith("&"))
            url += `publicationYear=${filters.publicationYear}&`
          else
            url += `?publicationYear=${filters.publicationYear}&`
        }
        if (filters.genre && filters.genre !== ""){
          if (url.endsWith("&"))
            url += `genreId=${filters.genre}&`
          else
            url += `?genreId=${filters.genre}&`
        }
        url += `page=${pageNumber}&size=10`
      }
      else{
        url += `?page=${pageNumber}&size=10`
      }
    
      const { data } = await axios.get(url)
      console.log("URL", url)
      
      if(customerId){
        const { data: wishList } = await axios.get(`https://centered-motif-384420.uc.r.appspot.com/api/v1/customers/${customerId}/favourites`)

        const updatedBooks = data.content.map((book) => {
          const matchingWishlistItem = wishList.find((wishlistItem) => wishlistItem.book.id === book.id);
          return matchingWishlistItem ? { ...book, wishAddedAt: matchingWishlistItem.addedAt, wished: true} : {...book, wished: false};
        });

        data.content.books = updatedBooks;
        totalPages = data.totalPages;
      }

      info = data.content.books

      if(sortingType === 0){ //Sort by popularity
        info = info.slice(0,20).sort((a, b) => (a.countVisit < b.countVisit ? 1 : -1))
      }

      if(sortingType === 1){ //Sort by new 
        info = info.slice(0, 20).sort((a, b) => (a.id < b.id ? 1 : -1))
      }

      if(sortingType === 2){ //Sort by wishlist add time
        info = info.filter((book) => book.wished)
        info = info.slice(0, 20).sort((a, b) => (a.wishAddedAt < b.wishAddedAt ? 1 : -1))
      }
    }

    else {
      // Get every inventory
      const { data } = await axios.get("https://centered-motif-384420.uc.r.appspot.com/api/v1/inventories")
      info = data
    }

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: {info: info, pageNumber: totalPages}
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`https://centered-motif-384420.uc.r.appspot.com/api/v1/inventories/${id}`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteProduct = (ids) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    })

    // const {
    //   userLogin: { userInfo },
    // } = getState()

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // }

    // await axios.delete(`https://centered-motif-384420.uc.r.appspot.com/api/v1/books/${id}`, config)

    const { inventoryId, bookId } = ids

    await axios.delete(`https://centered-motif-384420.uc.r.appspot.com/api/v1/inventories/${inventoryId}`)

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: message,
    })
  }
}

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    })

    // const {
    //   userLogin: { userInfo },
    // } = getState()

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // }

    // const { data } = await axios.post(`http://localhost:8080/api/v1/books`, {}, config)

    const newBook = {
      "title": "",
      "authorName": "",
      "publisher": "",
      "publicationYear": "",
      "isbn": "0000000000000",
      "pageNumber": 0,
      "price": 0,
      "countVisit": 0,
      "genres": [],
    }

    let { data } = await axios.post(`https://centered-motif-384420.uc.r.appspot.com/api/v1/books`, newBook)

    const newInventory = {
      book: data,
      "purchasePrice": 0,
      "quantity": 0,
      "lastAcquired": new Date(),
      "lastUpdated": new Date(),
    }

    const result = await axios.post(`https://centered-motif-384420.uc.r.appspot.com/api/v1/inventories`, newInventory)

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: result.data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    })

    // const {
    //   userLogin: { userInfo },
    // } = getState()

    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // }

    // const { data } = await axios.put(
    //   `http://localhost:8080/api/v1/books/${product.id}`,
    //   product,
    //   config
    // )

    //get genres
    let genresInDB = await axios.get(
      `https://centered-motif-384420.uc.r.appspot.com/api/v1/genres`,
    )

    genresInDB = genresInDB.data
    
    let newGenre = []
    let updatedGenresOfBook = []

    
    if (product.book.genres.length === 1 && product.book.genres[0] === "") {
      product.book.genres = [];
    }

    //get genres of product
    product.book.genres.forEach(async (genreName) => {
      let matchingGenre = genresInDB.find((genre) => genre.name.toLowerCase() === genreName.toLowerCase());
      if (!matchingGenre) {
        // Genre doesn't exist in the database, add it
        newGenre = { name: genreName.toLowerCase() };
        
        let { data } = await axios.post(
          `https://centered-motif-384420.uc.r.appspot.com/api/v1/genres`,
          newGenre
        ) // Now new genre have an id

        // get genres
        let genresInDBTemp = await axios.get(
          `https://centered-motif-384420.uc.r.appspot.com/api/v1/genres`,
        )

        genresInDBTemp = genresInDBTemp.data
        let matchingGenre = genresInDBTemp.find((genre) => genre.name.toLowerCase() === genreName.toLowerCase());
        matchingGenre = newGenre;
      }
      updatedGenresOfBook.push(matchingGenre);
    });
    
    product.book.genres = updatedGenresOfBook;

    const { data } = await axios.post(
      `https://centered-motif-384420.uc.r.appspot.com/api/v1/books`,
      product.book
    )

    product.lastUpdated = new Date();
    product.lastAcquired = product.lastUpdated;

    let result = await axios.post(
      `https://centered-motif-384420.uc.r.appspot.com/api/v1/inventories`,
      product
    )

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: message,
    })
  }
}

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST })

    const { data } = await axios.get(`https://centered-motif-384420.uc.r.appspot.com/api/v1/books?page=0&size=10`)
    let popularBooks = data.content.filter((product) => product.countVisit >= 0)
    
    popularBooks = popularBooks.sort((a, b) => (a.countVisit < b.countVisit ? 1 : -1))
    

    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: popularBooks,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
