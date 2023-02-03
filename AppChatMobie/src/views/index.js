import React, { Component, useContext, useEffect, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "./Login/home";
import Login from "./Login/login";
import PasswordRes from "./Login/PassWordRes";
import ChatApp from "./Chat/chatList";
import ProFile from "./profile";
import Contact from "./Contacts/contacts";
import ChatScreen from "./Chat/chatScreen";
import Resgister from "./Login/resgister";
import CreateAboutScreen from "./Chat/about";
import AboutGroupScreen from "./Chat/aboutGroup";

import AddGroup from "./Contacts/addGroup";
import { firebase } from "../firebase/firebaseDB";
import "firebase/compat/auth";

import AddFriend from "./Contacts/addGroup";
import MemberComponent from "./Chat/group/MemberComponent";
import AddMemberGroupComponent from "./Chat/group/AddMemberGroupComponent";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function MyTabs({ route }) {
  return (
    <Tab.Navigator
    //screenOptions={{ headerShown: false }}
    //  barStyle={{ backgroundColor: "#694fad" }}
    //initialRouteName="HomeTabs"
    >
      <Tab.Screen
        name="Chats"
        component={ChatApp}
        // options={{headerShown: false,
        //tapBarColor: 'bule',
        // }}
        //name="Feed"
        // component={Feed}

        options={{
          tabBarLabel: "Chats",
          tabBarColor: "red",
          tabBarStyle: {
            backgroundColor: "red",
          },

          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contact}
        //options={{headerShown: false,
        // }}

        options={{
          tabBarLabel: "Contacts",
          tabBarColor: "#009387",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={ProFile}
        //  options={{headerShown: false, }}
        options={{
          tabBarLabel: "Profile",
          tabBarColor: "#694fad",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default RootComponent = function () {
  // // Listen to the Firebase Auth state and set the local state.
  // useEffect(() => {
  //   const unregisterAuthObserver = onAuthStateChanged(authetication, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User

  //       // console.log(userCredential.user.uid);
  //       const getUser = async (db, id) => {
  //         //get info user by id
  //         const docRef = doc(db, "users", id);
  //         const docSnap = await getDoc(docRef);

  //         if (docSnap.exists()) {
  //           // return docSnap.data();
  //           console.log("Document data:", docSnap.data());
  //           //set user
  //           depatch(SetUser(docSnap.data()));
  //           //redict home page
  //         } else {
  //           // doc.data() will be undefined in this case
  //           console.log("No such document!");
  //         }
  //       };

  //       getUser(db, user.uid);
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });

  //   return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="HomeTabs"
          component={MyTabs}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="MemberScreen" component={MemberComponent} />
        <Stack.Screen name="Resgister" component={Resgister} />
        <Stack.Screen name="CreateAboutScreen" component={CreateAboutScreen} />
        <Stack.Screen name="AboutGroupScreen" component={AboutGroupScreen} />
        <Stack.Screen name="AddGroup" component={AddGroup} />

        <Stack.Screen name="Password" component={PasswordRes} />
        <Stack.Screen
          name="AddMemberGroupComponent"
          component={AddMemberGroupComponent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
