import "./LoginFormStyle.scss";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Context from "../../store/Context";
import { useNavigate } from "react-router-dom";
import firebase from "../../firebase";
import { useTranslation } from "react-i18next";
import PageLoading from "../../pages/PageLoading";
import CircularProgress from "@mui/material/CircularProgress";

const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [activeLoginBtn, setActiveLoginBtn] = React.useState(false);
  const [textNo, setTextNo] = React.useState("");

  const { state, depatch } = React.useContext(Context);
  //loading effect in button login
  const [loading, setLoading] = React.useState(false);

  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();
  //detructering...
  const { user } = state;

  const navigate = useNavigate();

  const handleLogin = () => {
    //valid email
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email.match(regex)) {
      setTextNo("Email không đúng định dạng!!");
      return;
    } else if (password.length < 8) {
      setTextNo("Mật khẩu phải lớn hơn 7 ký tự!!");
      return;
    }
    //send email, pass to server
    const loginFunc = (mail, pass) => {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, pass)
        .then((userCredential) => {
          //redict homepage
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setTextNo(
            "Tên đăng nhập hoặc mật khẩu không khớp, vui lòng nhập lại"
          );
        });
    };
    loginFunc(email, password);
  };

  const handleEmail = (e) => {
    const emailTempl = e.target.value;
    setEmail(emailTempl);
    if (password >= 7 && emailTempl) {
      setActiveLoginBtn(true);
    } else if (!emailTempl) {
      setActiveLoginBtn(false);
    }
  };
  const handlePassword = (e) => {
    const passTemp = e.target.value;
    setPassword(passTemp);
    if (passTemp.length >= 7 && email) {
      setActiveLoginBtn(true);
    } else if (passTemp.length < 7) {
      setActiveLoginBtn(false);
    }
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      handleLogin();
    }
  };

  return (
    <div className="login_form">
      <form>
        <TextField
          style={{ width: "100%" }}
          id="username"
          label="Email"
          variant="outlined"
          onKeyDown={onEnterPress}
          onChange={(e) => handleEmail(e)}
        />
        <TextField
          style={{
            width: "100%",
            margin: "0.5rem 0",
          }}
          id="password"
          variant="outlined"
          label={t("password")}
          type="password"
          onKeyDown={onEnterPress}
          onChange={(e) => handlePassword(e)}
        />
        {textNo ? <p className="erro">{textNo}</p> : null}

        <div style={{ width: "100%" }}>
          <Button
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "10px 12px",
            }}
            variant="contained"
            onClick={() => handleLogin()}
            disabled={activeLoginBtn ? false : true}
          >
            {loading ? (
              <span>
                <CircularProgress
                  style={{
                    color: "blue",
                    height: "20px",
                    width: "20px",
                    marginRight: "8px",
                  }}
                />
              </span>
            ) : null}

            {t("login")}
          </Button>
          <p className="forget" onClick={() => navigate("/password")}>
            {t("forgotPass")}?
          </p>
        </div>
      </form>
      <p>
        {t("login_textAlert")}?{" "}
        <span onClick={() => navigate("/register")}>{t("registerNow")}</span>
      </p>
    </div>
  );
};

export default LoginForm;
