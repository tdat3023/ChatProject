import { useState } from "react";
import useLanguageLocalStorage from "../hooks/useLanguageLocalStorage";
import "./LoginPageStyle.scss";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import GetPassWordForm from "../components/form/GetPasswordForm";

const GetPassWordPage = () => {
  //detructering
  const { token, setToken } = useLanguageLocalStorage();

  const [language, setLenguage] = useState(+token);

  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();

  //change languuge
  const handleLanguage = () => {
    if (language === 0) {
      setLenguage(1);
      setToken(1);
      // alert(window.location.href);
      // let loc = "http://localhost:3000/login";
      window.location.replace(window.location.hrefc + "?lng=" + "en");
    } else if (language === 1) {
      setLenguage(0);
      setToken(0);
      // alert(window.location.href);
      // let loc = "http://localhost:3000/login";
      window.location.replace(window.location.href + "?lng=" + "vi");
    }
  };

  useEffect(() => {
    document.title = t("recoverPassword");
  }, []);

  return (
    <div className="login">
      <h1>Zalo</h1>

      <p className="text">
        {t("recoverPassword")}
        <br />
        {t("login_title_02")}
      </p>
      <GetPassWordForm />
      <div className="option_language">
        <span
          onClick={handleLanguage}
          className={language == 0 ? "active" : ""}
        >
          Tiếng việt
        </span>
        <span
          onClick={handleLanguage}
          className={language == 1 ? "active" : ""}
        >
          English
        </span>
      </div>
    </div>
  );
};

export default GetPassWordPage;
