import * as React from "react";
import "./GetPasswordForm.scss";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Context from "../../store/Context";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import CircularProgress from "@mui/material/CircularProgress";
import { IoIosArrowBack } from "react-icons/io";
import firebase from "../../firebase";

const GetPassWordForm = () => {
  const [email, setEmail] = React.useState("");
  const [textNo, setTextNo] = React.useState("");

  const [activeLoginBtn, setActiveLoginBtn] = React.useState(false);

  const { state, depatch } = React.useContext(Context);
  //loading effect in button login
  const [loading, setLoading] = React.useState(false);

  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();
  // //detructering...
  // const { user } = state;

  const navigate = useNavigate();

  const handleEmail = (e) => {
    const emailTempl = e.target.value;
    setEmail(emailTempl);
    if (emailTempl.length > 0) {
      setActiveLoginBtn(true);
    } else {
      setActiveLoginBtn(false);
      setTextNo("");
    }
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      handleContinue();
    }
  };

  //click button continue
  const handleContinue = () => {
    //check la gmail khong?
    //valid email
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email.match(regex)) {
      setTextNo("Email không đúng định dạng!!");
      return;
    }
    setTextNo("");

    function sendPasswordReset(mail) {
      // [START auth_send_password_reset]
      firebase
        .auth()
        .sendPasswordResetEmail(mail)
        .then(() => {
          // Password reset email sent!
          alert("Đã gửi đường dẫn thay đổi mật khẩu cho email: " + mail);

          //redict into login page
          navigate("/login");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
      // [END auth_send_password_reset]
    }
    sendPasswordReset(email);
  };
  return (
    <div className="password_form">
      <form style={{ height: "auto" }} onSubmit={() => handleContinue()}>
        <p className="getPass_title"> {t("recoverPassword_title")}</p>

        {!textNo ? (
          <TextField
            style={{ width: "100%", margin: "1.5rem 0" }}
            id="username"
            label="Email"
            variant="outlined"
            onKeyDown={onEnterPress}
            onChange={(e) => handleEmail(e)}
          />
        ) : (
          <TextField
            error
            style={{ width: "100%", margin: "1.5rem 0" }}
            id="username"
            label={t("validEmail")}
            variant="outlined"
            onKeyDown={onEnterPress}
            onChange={(e) => handleEmail(e)}
          />
        )}

        <div style={{ width: "100%" }}>
          <Button
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "10px 12px",
            }}
            variant="contained"
            onClick={() => handleContinue()}
            disabled={activeLoginBtn ? false : true}
          >
            {loading ? (
              <span>
                {" "}
                <CircularProgress />
              </span>
            ) : null}
            {t("continue")}
          </Button>
        </div>
        <p className="come_back" onClick={() => navigate("/login")}>
          <p style={{ marginTop: "2px" }}>
            <IoIosArrowBack />
          </p>

          <p>{t("back")}</p>
        </p>
      </form>
      <p className="password_signin">
        {t("login_textAlert")}?{" "}
        <span onClick={() => navigate("/register")}>{t("registerNow")}</span>
      </p>
    </div>
  );
};

export default GetPassWordForm;
