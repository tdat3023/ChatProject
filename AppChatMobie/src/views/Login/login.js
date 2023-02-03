import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { isValidEmail, isValidPassword } from "../../utilies/Validations";

import Contex from "../../store/Context";
import { SetUser } from "../../store/Actions";

import { authetication, db } from "../../firebase/firebaseDB";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
// const fdb = firebase.firestore().collection('users');
const WinWidth = Dimensions.get("window").width;
const WinHeight = Dimensions.get("window").height;

export default Login = function ({ navigation }) {
  const { state, depatch } = useContext(Contex);
  const { user } = state;
  // console.log("context", Contex);
  // const user = auth().currentUser;
  const [getPassWordVisible, setPassWordVisible] = useState(false);
  //states for validatingpp
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  //states to store email/password

  const [email, setEmail] = useState("hao1@gmail.com");
  const [password, setPassword] = useState("11111111");

  //false: chua bamlogin
  //true: khong cho ng dung bam nut  login
  const [status, setStatus] = useState(false);

  const isValidationOK = () => {
    email.length > 0 &&
      password.length > 0 &&
      isValidEmail(email) == true &&
      isValidPassword(password) == true;
  };

  // console.log("userLogin: ", user);
  const handleLogin = () => {
    if (status) {
      Alert.alert("Đang xử lý login...");
    }

    setStatus(true);
    //send email, pass to server
    const loginFunc = (mail, pass) => {
      signInWithEmailAndPassword(authetication, mail, pass)
        .then((userCredential) => {
          // console.log(userCredential.user.uid);
          const getUser = async (db, id) => {
            //get info user by id
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());
            if (docSnap.exists()) {
              // return docSnap.data();
              //console.log("Document data:", docSnap.data());
              //set user
              depatch(SetUser(docSnap.data()));
              setStatus(false);
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
              setStatus(false);
            }
          };

          getUser(db, userCredential.user.uid);

          //redict homepage

          navigation.navigate("HomeTabs");
          setStatus(false);
        })
        .catch((error) => {
          alert("Email hoặc mật khẩu không chính xác!");
        });
    };
    console.log(email);
    console.log(password);
    loginFunc(email, password);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* button back */}
        <View style={styles.topTag}>
          <TouchableOpacity
            style={{ alignItems: "center", marginLeft: 5 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="arrowleft" size={30} color="white"></AntDesign>
          </TouchableOpacity>
          <Text style={styles.textTopTag}>Đăng nhập</Text>
        </View>

        <View style={styles.textRemind}>
          <Text style={{ fontSize: 12 }}>
            Vui lòng nhập email và mật khẩu để đăng nhập
          </Text>
        </View>

        {/* input login*/}
        <View style={styles.input}>
          {/* email */}
          <View style={styles.viewAcc}>
            <TextInput
              style={styles.inputAcc}
              value={email}
              onChangeText={(text) => {
                setErrorEmail(
                  isValidEmail(text) == true
                    ? ""
                    : "Email not in correct format"
                );
                setEmail(text);
              }}
              placeholder="example@gmail.com"
            ></TextInput>
          </View>

          {/* password */}
          <View style={styles.viewPassword}>
            <TextInput
              style={styles.inputPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              placeholder="Enter your password"
              secureTextEntry={getPassWordVisible ? false : true}
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                setPassWordVisible(!getPassWordVisible);
              }}
            >
              {getPassWordVisible ? (
                <Ionicons
                  style={styles.imageEye}
                  name="eye"
                  size={24}
                  color="black"
                />
              ) : (
                <Ionicons
                  style={styles.imageEye}
                  name="eye-off"
                  size={24}
                  color="black"
                />
              )}
            </TouchableOpacity>
          </View>

          {/* recover password */}
          <View style={styles.recoverPassword}>
            <TouchableOpacity
              onPress={() => {
                alert("Emai= ${email}");
              }}
            >
              <Text style={{ fontSize: 15, color: "blue", marginTop: 15 }}>
                Lấy lại mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ask */}
        <View style={styles.ask}>
          <TouchableOpacity>
            <Text style={{ fontSize: 15, color: "gray" }}>
              Câu hỏi thường gặp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.login}
            disabled={isValidationOK() == false}
            onPress={() => handleLogin()}
          >
            <AntDesign name="login" size={30} color="white"></AntDesign>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  topTag: {
    display: "flex",
    width: "100%",
    height: 45,
    backgroundColor: "#66B2FF",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  textTopTag: {
    alignItems: "center",
    marginRight: "40%",
    fontSize: 18,
    color: "white",
  },

  textRemind: {
    width: "100%",
    height: 50,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },

  viewPassword: {
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
    height: 40,
    flexDirection: "row",
  },

  viewAcc: {
    marginTop: 10,
    width: "95%",
    height: 40,
  },

  inputPassword: {
    width: "100%",
    height: 40,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    fontSize: 16,
    marginTop: 14,
  },

  inputAcc: {
    width: "100%",
    height: 40,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    fontSize: 16,
    marginTop: 14,
  },

  imageEye: {
    padding: 5,
    height: "100%",
    width: 40,
    position: "absolute",
    right: 0,
    marginTop: 15,
  },

  recoverPassword: {
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
    height: 40,
    flexDirection: "row",
  },

  ask: {
    marginLeft: "5%",
    width: "95%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  login: {
    marginBottom: 20,
    marginRight: "5%",
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
});
