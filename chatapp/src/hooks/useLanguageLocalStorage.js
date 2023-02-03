import { useState } from "react";

const useLanguageLocalStorage = () => {
  //get token from localstorage
  //0: vietnamese
  //1: english
  //check localStorage if token == null(first login page) =>  set localStorage language default = 0 (vietnamese)
  //else if token != null => setLanguage = token
  const getToken = () => {
    const token = localStorage.getItem("languauge");
    if (token == null) {
      localStorage.setItem("languauge", 0);
    }
    return token;
  };
  const [token, setToken] = useState(getToken);

  //save token into localStorage
  const saveToken = (tokenNew) => {
    // Saving data as key/value pair
    localStorage.setItem("languauge", tokenNew);
    setToken(tokenNew);
  };

  return {
    setToken: saveToken,
    token,
  };
};

export default useLanguageLocalStorage;
