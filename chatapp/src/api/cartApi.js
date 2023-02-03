
import axiosClientNew from './axiosClientNew'
// api/productApi.js
const cartApi  = {
  getById : (url,params) => {
    const URL = `/${url}`;
    return axiosClientNew.get(URL, { params });
  },

  
 
 
}

export default cartApi;