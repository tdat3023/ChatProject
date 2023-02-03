import LoginForm from "../components/form/LoginForm";
import "./LoginPageStyle.scss";
import RegisterForm from "../components/form/RegisterForm";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
const RegisterPage = ({ setToken }) => {
  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("registerPage");
  }, []);
  return (
    <div className="login" style={{ height: "auto" }}>
      <h1>ZenChat</h1>
      <p className="text">{t("registerTitle")}</p>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
