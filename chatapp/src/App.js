import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/reset.scss";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useContext, useEffect, useState } from "react";

import Contex from "./store/Context";
import { SetUser } from "./store/Actions";

import firebase from "./firebase";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import PageLoading from "./pages/PageLoading";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import UserService from "./services/UserService";
import RegisterPage from "./pages/RegisterPage";
import GetPassWordPage from "./pages/GetPassWordPage";

function App() {
  
  const navigate = useNavigate();
  const { state, depatch } = useContext(Contex);
  const [loading, setLoading] = useState(true);
  //detructering...
  const { user } = state;
  //console.log(user);

  // var ref = firebase.firestore().collection("/users");

  // ref
  //   .doc("mpgsWVjXZQUr8tPOUTgojSQeWfs2")
  //   .get()
  //   .then(function (snapshot) {
  //     console.log("d" + snapshot.data().first_name);
  //   });
  // console.log("app.js");
  // console.log(firebase.auth());

  // // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((u) => {
      if (!u) {
        //setLoading = false
        setLoading(false);
        //redict login page
        navigate("/login");
      } else {
        UserService.getById(u.uid).then(function (snapshot) {
          console.log("d" + snapshot.data().first_name);
          const userTemp = { uid: u.uid, ...snapshot.data() };
          console.log(snapshot.data());
          depatch(SetUser(userTemp));
        });
        //setLoading = false

        setLoading(false);
        // navigate("/");
      }
    });

    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <div className="App">
      {loading ? (
        <PageLoading />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<LoginPage setToken={setToken} />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loading" element={<PageLoading />} />
          <Route path="/password" element={<GetPassWordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
