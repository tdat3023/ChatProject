import axiosClientNew from "./axiosClient";

const userApi = {
  // POST: /users/login
  // send username, password
  // res: token, user
  login: (url, email, password) => {
    console.log(url);
    return axiosClientNew.post(url, {
      email,
      password,
    });
  },

  //POST /users/me
  //send token
  //res: user
  me: () => {
    return axiosClientNew.get("users/me");
  },

  logout: () => {
    return axiosClientNew.post("users/me/logout");
  },
};

export default userApi;
