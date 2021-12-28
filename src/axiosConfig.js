// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
     baseURL: process.env.REACT_APP_API_URL
    //baseURL: 'http://localhost:8888/hlaccounting/api'
});

export default instance;