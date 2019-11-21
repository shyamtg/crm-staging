import axios from 'axios';

export const CancelToken = axios.CancelToken;
export default axios.create({
     baseURL: 'http://127.0.0.1:8000/api/v1'
    //baseURL: 'http://192.168.0.104:8000'
});