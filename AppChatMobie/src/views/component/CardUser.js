import React from "react";

import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import conversationApi from "../../api/conversationApi";

import {
  SetUser,
  SetIdConversation,
  SetUserChatting,
} from "../../store/Actions";
import Contex from "../../store/Context";
import { checkUrlIsImage, checkUrlIsSticker } from "../../utilies/Validations";
// import { convertDateTimeToString, handleDate } from "../../utilies/DateTime";

export default CardUser = ({ value, navigation, setTyping, setSreachText }) => {
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting } = state;
  const handleClickOpenSreenChat = () => {
    console.log(value);
    // /11/26/2022 - 06:10 pm
    //auth: Anh Nguyen

    //có 2 trường hợp:
    //TH1: click vào user dang tìm kiếm -> add user đó vào lịch sử tìm kiếm -> mở cuộc hội thoại
    //đang tìm kiếm: searchingStatus = true

    //featch id conversation with id sender: user and receiver : u
    const featchConversation = async () => {
      try {
        const response = await conversationApi.getConversationDetails(
          user.uid,
          value.uid
        );
        //  console.log(response[0].conversations);
        if (response[0]) {
          console.log("co ");
          // console.log("render");
          depatch(SetIdConversation(response[0].conversations));
          depatch(SetUserChatting(response[0].inFo));
        } else {
          console.log("chua co ");
          const newInfo = {
            firstName: value.first_name,
            lastName: value.last_name,
            avatar: value.avatar,
            userIdFriend: value.uid,
            idCon: null,
          };
          //console.log(newInfo);
          depatch(SetIdConversation(null));
          depatch(SetUserChatting(newInfo));
        }
        //redict chat screen
        navigation.navigate("ChatScreen");
        setTyping(false);
        setSreachText("");

        //set userChangting = user currently clicked
        // depatch(SetUserChatting(u));
      } catch (error) {
        console.log("Failed to fetch conversation id: ", error);
      }
    };

    featchConversation();
  };

  return (
    <View style={styles.viewOne}>
      <TouchableOpacity onPress={() => handleClickOpenSreenChat()}>
        <View style={styles.chatBox}>
          {/* ảnh đại diện */}
          <View style={styles.imaContainer}>
            {/* {item.conversations} */}
            {value?.avatar ? (
              <Image
                style={styles.imaAvatar}
                source={{
                  uri: value?.avatar,
                }}></Image>
            ) : (
              <Image
                style={styles.imaAvatar}
                source={{
                  uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
                }}></Image>
            )}
          </View>

          <View style={styles.bodyContainer}>
            {/* tên */}
            <Text style={styles.textName}>
              {value?.first_name + " " + value?.last_name}
            </Text>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}></View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imaContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  notification: {
    width: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.2,
  },

  bodyListChat: {
    flex: 1,
    alignItems: "center",
  },

  viewOne: {
    width: "100%",
    height: 90,

    justifyContent: "center",
    alignItems: "center",
  },

  imaContainer: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  imaAvatar: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "yellow",
  },

  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: 0.2,
  },

  textName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "blod",
    color: "black",
    textTransform: "capitalize",
  },

  textLastMes: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 15,
    //color: "red",
  },

  chatBox: {
    width: "100%",
    height: 90,
    flexDirection: "row",
  },

  textNoti: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    width: 22,
    borderRadius: 10,
  },
});
