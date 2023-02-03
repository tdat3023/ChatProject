import "./RegisterForm.scss";
import * as React from "react";

import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import Context from "../../store/Context";

import { useNavigate } from "react-router-dom";

import firebase from "../../firebase";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import UserService from "../../services/UserService";
import CircularProgress from "@mui/material/CircularProgress";
import PageLoading from "../../pages/PageLoading";
import { useTranslation } from "react-i18next";
const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordTwo, setPasswordTwo] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  //male or female
  const [value, setValue] = React.useState("female");

  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();

  //alert status erro
  const [textNo, setTextNo] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  //state login
  const [loaddingLogin, setLoadingLogin] = React.useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const { state, depatch } = React.useContext(Context);
  //detructering...
  const { user } = state;

  const navigate = useNavigate();

  const handleRegister = () => {
    //valid email
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email.match(regex)) {
      setTextNo("Email không đúng định dạng!!");
      document.getElementById("username").select();
      return;
    } else if (password.length < 8 || passwordTwo.length < 8) {
      setTextNo("Mật khẩu phải nhiều hơn 7 ký tự!");
      document.getElementById("password").select();
      return;
    } else if (password != passwordTwo) {
      setTextNo("Mật khẩu không trùng khớp!!");
      document.getElementById("passwordAgain").select();
      return;
    } else if (firstName.length === 0 || lastName.length === 0) {
      setTextNo("Họ và Tên không được bỏ trống");
      document.getElementById("firstName").select();
      return;
    }

    const userTemp = {
      first_name: firstName,
      last_name: lastName,
      email,
      sex: value === "female" ? 0 : 1,
      avatar: "",
      is_active: true,
      create_date: new Date(),
    };
    //update UI: loading will show
    setLoading(true);
    //create user firebase
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        const { uid } = user;
        const userCurrent = { uid, ...userTemp };
        //lưu thông tin user vao firestore
        UserService.create(userCurrent, user.uid)
          .then((querySnapshot) => {
            navigate("/loading");
            //sign in
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then((userCredential) => {
                //redict homepage
                navigate("/");
              })
              .catch((erro) => {
                alert(erro.message);
              });
          })
          .catch((error) => {
            console.log("Error put user infomation into firebase: ", error);
          });

        // send verification mail.
        // userCredential.user.sendEmailVerification();
        // firebase.auth().signOut();
        // alert("Email sent");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          console.log(errorCode);
          setTextNo(t("registerErro"));
          setLoading(false);
          document.getElementById("username").select();
        }
        console.log(errorMessage);
      });
  };

  const handleEmail = (e) => {
    const emailTempl = e.target.value;
    setEmail(emailTempl);
  };

  const handlePassword = (e) => {
    const passTemp = e.target.value;
    setPassword(passTemp);
  };

  const handlePasswordTwo = (e) => {
    const passTemp = e.target.value;
    setPasswordTwo(passTemp);
  };

  const handleFirstName = (e) => {
    const firstName = e.target.value;
    setFirstName(firstName);
  };

  const handleLastName = (e) => {
    const lastName = e.target.value;
    setLastName(lastName);
  };

  //handle status checkbox
  const handleChangeGender = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="login_form">
      <form style={{ height: "auto" }}>
        <TextField
          style={{ width: "100%", marginBottom: "0.5rem" }}
          id="username"
          label="Email"
          variant="outlined"
          onChange={(e) => handleEmail(e)}
        />
        <TextField
          style={{ width: "100%", margin: "0.5rem 0" }}
          id="password"
          variant="outlined"
          label={t("password")}
          type="password"
          onChange={(e) => handlePassword(e)}
        />
        <TextField
          style={{ width: "100%", margin: "0.5rem 0" }}
          id="passwordAgain"
          variant="outlined"
          label={t("password")}
          type="password"
          onChange={(e) => handlePasswordTwo(e)}
        />
        <TextField
          style={{ width: "100%", margin: "0.5rem 0" }}
          id="firstName"
          variant="outlined"
          label={t("firstName")}
          type="text"
          onChange={(e) => handleFirstName(e)}
        />
        <TextField
          style={{ width: "100%", margin: "0.5rem 0" }}
          id="lastName"
          variant="outlined"
          label={t("surname")}
          type="text"
          onChange={(e) => handleLastName(e)}
        />

        <FormControl style={{ alignItems: "flex-start" }}>
          <FormLabel id="demo-controlled-radio-buttons-group">
            {t("gender")}
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value ?? null}
            row
            onChange={handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label={t("female") === "Giống cái" ? "Nữ" : t("female")}
              onClick={handleChangeGender}
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label={t("male") === "Nam giới" ? "Nam" : t("male")}
              onClick={handleChangeGender}
            />
          </RadioGroup>
        </FormControl>
        {textNo ? <p className="erro">{textNo}</p> : null}
        <div style={{ width: "100%" }}>
          <Button
            style={{
              width: "100%",
              marginBottom: "1rem",
              marginTop: "1rem",
              padding: "10px 12px",
            }}
            variant="contained"
            onClick={() => handleRegister()}
            disabled={loading ? true : false}
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
            {t("register")}
          </Button>
        </div>
      </form>
      <p>
        {t("question")}?{" "}
        <span onClick={() => navigate("/login")}>{t("signIn")}</span>
      </p>
    </div>
  );
};

export default LoginForm;
