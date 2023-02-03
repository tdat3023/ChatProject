import React, { Component } from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Stack, TextInput, IconButton } from "@react-native-material/core";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import { authetication, db } from "../../firebase/firebaseDB";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import Contex from "../../store/Context";
import { useContext } from "react";
import { SetUser } from "../../store/Actions";

export default Resgister = function ({ navigation, route }) {
  //store
  const { state, depatch } = useContext(Contex);
  const { user } = state;

  //states to store email/password
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [userDataTemp, setUserDataTemp] = useState(null);

  //register new account
  const handleRegister = async () => {
    //valid email
    var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email.match(regex)) {
      Alert.alert("Email không đúng định dạng!!");
      return;
    } else if (password.length < 8 || retypePassword.length < 8) {
      Alert.alert("Mật khẩu phải nhiều hơn 7 ký tự!");

      return;
    } else if (password != retypePassword) {
      Alert.alert("Mật khẩu không trùng khớp!!");

      return;
    } else if (firstName.length === 0 || lastName.length === 0) {
      Alert("Họ và Tên không được bỏ trống");

      return;
    }

    const userTemp = {
      first_name: firstName,
      last_name: lastName,
      email,
      sex: 0,
      avatar: "",
      is_active: true,
      create_date: new Date(),
    };

    //register with firebase
    createUserWithEmailAndPassword(authetication, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        const { uid } = user;
        const userCurrent = { uid, ...userTemp };
        //luu thong tin user moi tao vao firestore
        // Add a new document in collection "cities"
        const saveUser = async (database, name, id) => {
          await setDoc(doc(database, name, id), {
            first_name: firstName,
            last_name: lastName,
            email,
            sex: 0,
            avatar: "",
            is_active: true,
            create_date: new Date(),
            uid: id,
          });
        };

        saveUser(db, "users", userCurrent.uid);

        signInWithEmailAndPassword(authetication, email, password)
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
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            };

            getUser(db, userCredential.user.uid);

            //redict homepage

            navigation.navigate("HomeTabs");
          })
          .catch((error) => {
            alert("Email hoặc mật khẩu không chính xác!");
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          console.log(errorCode);

          Alert.alert("Email already in use");
        }
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={{ alignItems: "center", marginLeft: 5, marginRight: 10 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>

          <Text style={styles.textTop}>Tạo tài khoản</Text>
        </View>
        <View style={styles.textRemind}>
          <Text style={{ fontSize: 12 }}>
            Vui lòng nhập thông tin vào form dưới đây để đăng ký
          </Text>
        </View>
        {/* body */}
        <ScrollView style={styles.body}>
          {/* first name */}
          <View style={styles.inputText}>
            <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>
              Họ:
            </Text>

            <TextInput
              variant="standard"
              placeholder="Nhập họ..."
              onChangeText={(text) => {
                setFirstName(text);
              }}
            />
          </View>

          <View style={styles.inputText}>
            <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>
              Tên:
            </Text>

            <TextInput
              variant="standard"
              placeholder="Nhập tên..."
              onChangeText={(text) => {
                setLastName(text);
              }}
            />
          </View>

          <View style={styles.inputText}>
            <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>
              Email:
            </Text>

            <TextInput
              variant="standard"
              placeholder="Nhập email..."
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
          </View>

          <View style={styles.inputText}>
            <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>
              Mật khẩu:
            </Text>

            <TextInput
              variant="standard"
              placeholder="Nhập mật khẩu..."
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
          </View>

          <View style={styles.inputText}>
            <Text style={{ fontSize: 18, color: "black", marginBottom: 8 }}>
              Nhập lại mật khẩu:
            </Text>

            <TextInput
              variant="standard"
              placeholder="Nhập lại mật khẩu"
              onChangeText={(text) => {
                setRetypePassword(text);
              }}
            />
          </View>
        </ScrollView>

        {/* footer */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={{ width: 200, fontSize: 15, color: "gray" }}>
              Tiếp tục nghĩa là bạn đồng ý với các điều khoản sử dụng Zalo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnRegister}
            onPress={() => handleRegister()}
          >
            <AntDesign name="login" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },

  header: {
    height: 60,
    backgroundColor: "#66B2FF",
    alignItems: "center",
    flexDirection: "row",
  },

  textTop: {
    fontSize: 20,
    color: "white",
  },

  textRemind: {
    width: "100%",
    height: 50,
    backgroundColor: "#DCD7C9",
    justifyContent: "center",
    alignItems: "center",
  },

  body: {
    flex: 1,
    flexDirection: "column",
  },

  footer: {
    height: 60,
    marginTop: 20,
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  btnRegister: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 100,
  },

  textError: {
    color: "red",
    fontSize: 20,
    marginBottom: 5,
  },

  inputText: {
    fontWeight: 18,
    borderBottomColor: "#F9F9F9",
    marginHorizontal: 15,
    marginTop: 15,
  },
});
