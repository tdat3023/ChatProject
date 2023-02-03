import { useState } from "react";

const useToken = () => {
  //get token from localstorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };
  const [token, setToken] = useState(getToken);

  //save token into localStorage
  const saveToken = (tokenNew) => {
    // Saving data as key/value pair
    localStorage.setItem("token", tokenNew);
    setToken(tokenNew);
  };

  //delete token in localStorage
  const deleteToken = () => {
    localStorage.removeItem("token");
  };
  return {
    setToken: saveToken,
    token,
    deleteToken,
  };
};

export default useToken;
