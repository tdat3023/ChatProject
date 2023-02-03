import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

import { Dimensions } from "react-native";
import Contex from "../../../store/Context";
import MemberCard from "../../component/MemberCard";

// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import ImagePicker from "react-native-image-picker";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default MemberComponent = ({ navigation, route }) => {
  const { state, depatch } = React.useContext(Contex);
  const { user, idConversation, userChatting } = state;
  const { members, leaderId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top tag */}
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={{ alignItems: "center", marginLeft: 10 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.nameFriend}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                textTransform: "capitalize",
                color: "white",
                marginLeft: 12,
              }}>
              Quản lý thành viên
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "white",
                marginLeft: 12,
              }}></Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}>
        <Text styles={{ color: "#22A39F" }}>Thành viên ({members.length})</Text>
        {members.map((val) => {
          return (
            <MemberCard
              value={val}
              leaderId={leaderId}
              navigation={navigation}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e7eb",
  },

  headerContainer: {
    //display: "flex",
    height: 50,
    backgroundColor: "#0091ff",
    flexDirection: "row",
  },

  bodyContainer: {
    // display: "flex",

    backgroundColor: "yellow",
    height: windowHeight - 400,
    // height: 500,
  },

  footerContainer: {
    // height: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    //borderWidth: 0.2,
    backgroundColor: "white",
  },

  inputMess: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },

  moreTag: {
    display: "flex",
    marginRight: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  send: {
    paddingRight: 10,
  },

  moreAction: {
    marginLeft: 5,
  },

  textChat: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 5,
    // backgroundColor: "#E4E4E4",
    //  backgroundColor: "red",
  },

  bodyListChat: {
    //flex: 1,
    width: "100%",
    alignItems: "center",
  },
  bodyList: {
    width: "100%",
    //backgroundColor: "blue",
  },
});
