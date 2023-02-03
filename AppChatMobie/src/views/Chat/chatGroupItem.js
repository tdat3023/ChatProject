import React, { Component } from "react";

//import { formatInTimeZone } from "date-fns-tz";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import avt_group from "../../images/avtgroup.jpg";

import Ionicons from "react-native-vector-icons/Ionicons";

import Contex from "../../store/Context";
import {
  SetUser,
  SetIdConversation,
  SetUserChatting,
} from "../../store/Actions";
import { checkUrlIsImage, checkUrlIsSticker } from "../../utilies/Validations";

import { convertDateTimeToString, handleDate } from "../../utilies/DateTime";

function ChatGroupItem({ item, navigation, socket }) {
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting } = state;
  const onPress = () => {
    navigation.navigate("ChatScreen");
    // type conversation is true set conversation= conversation, chatUser= GroupInfo
    depatch(SetIdConversation(item.conversations));
    depatch(SetUserChatting(item.inFo));
  };

  //  console.log("image", item.inFo.avatar);

  function renderImaAvatar() {
    if (item.inFo.avatar.length == 2) {
      return (
        <Image
          style={styles.imaAvatarOne}
          source={{
            uri: item.inFo.avatar[0].avaUser
              ? item.inFo.avatar[0].avaUser
              : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
          }}></Image>
      );
    }
    return (
      <View style={styles.imaGroupAvata}>
        <View style={styles.imaGroup}>
          <Image
            style={styles.imaAvatar}
            source={{
              uri: item.inFo.avatar[0].avaUser
                ? item.inFo.avatar[0].avaUser
                : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
            }}></Image>
          <Image
            style={styles.imaAvatar}
            source={{
              uri: item.inFo.avatar[1]
                ? item.inFo.avatar[1].avaUser
                : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
            }}></Image>
        </View>
        <View style={styles.imaGroup}>
          <Image
            style={styles.imaAvatar}
            source={{
              uri:
                item.inFo.avatar.length > 3
                  ? item.inFo.avatar[2].avaUser
                  : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
            }}></Image>

          {item.inFo.avatar.length == 3 && null}

          {item.inFo.avatar.length == 4 && (
            <Image
              style={styles.imaAvatar}
              source={{
                uri: item.inFo.avatar[3].avaUser
                  ? item.inFo.avatar[3].avaUser
                  : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
              }}></Image>
          )}

          {item.inFo.avatar.length > 4 && (
            <View style={styles.imaAvatar}>
              <Text style={styles.numberOfMember}>3</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.viewOne}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.chatBox}>
          {/* ảnh đại diện */}
          <View style={styles.imaContainer}>
            <Image style={styles.imaAvatarOne} source={avt_group}></Image>
          </View>
          {/* <View style={styles.imaContainer}>{renderImaAvatar()}</View> */}

          <View style={styles.bodyContainer}>
            {/* tên */}
            <Text style={styles.textName}>{item.inFo.name}</Text>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={styles.textLastMes}>
                {/* check name user send mess */}
                {item.conversations?.lastMessage[0].type.endsWith("NOTIFY")
                  ? ""
                  : item.conversations?.lastMessage[0]?.userId === user.uid
                  ? "Bạn: "
                  : item.inFo?.userInfo?.map((u) => {
                      if (
                        item.conversations?.lastMessage[0]?.userId === u?.userId
                      ) {
                        return u?.userFistName + " " + u?.userLastName + ": ";
                      }
                    })}
                {/* check  type lastmess */}
                {checkUrlIsImage(item.conversations.lastMessage[0].content)
                  ? "[Image]"
                  : checkUrlIsSticker(item.conversations.lastMessage[0].content)
                  ? "[Sticker]"
                  : item.conversations.lastMessage[0].content.length > 30
                  ? item.conversations.lastMessage[0].content.slice(0, 28) +
                    " ..."
                  : item.conversations.lastMessage[0].content + " "}
              </Text>
              <Text style={styles.textLastMes}>
                {/* {handleDate(
                  new Date(),
                  new Date(
                    `${item.conversations.lastMessage[0].updatedAt}`.toLocaleString(
                      "en-US",
                      { timeZone: "Asia/Ho_Chi_Minh" }
                    )
                  )
                )} */}
              </Text>
            </View>
          </View>

          <View style={styles.notification}>
            {/* <Ionicons name="notifications-outline" size={24} color="black" /> */}
            <Text>2 phut</Text>
            {item.conversations.mb.numberUnread > 0 && (
              <View style={styles.textNoti}>
                <Text style={{ color: "white", fontSize: 12 }}>
                  {item.conversations.mb.numberUnread}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

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
  },

  viewOne: {
    // display: "flex",
    // width: "100%",
    // height: 90,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
  },

  imaGroupAvata: {
    height: 70,
    width: 70,
    flexDirection: "row",
    padding: 10,
    paddingTop: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  imaContainer: {
    flexDirection: "row",
    width: 70,
    height: 30,
    paddingLeft: 10,
    paddingTop: 13,
  },

  imaAvatar: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },

  imaAvatarOne: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "red",
  },

  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    // borderBottomWidth: 0.8,
    marginLeft: 10,
  },

  textName: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "blod",
    color: "black",
  },

  textLastMes: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 15,
    // justifyContent: "space-evenly",
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
    width: 20,
    borderRadius: 10,
  },
});

export default ChatGroupItem;
