import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import React from "react";
import friendApi from "../../api/friendApi";
import Contex from "../../store/Context";

export default function FriendRequest({ item }) {
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting, socket } = state;

  const handDeleteInvite = async () => {
    try {
      await friendApi
        .deleteInvite(user.uid, item.inviteId)
        .then(console.log("delete ok"));
      console.log("idinvite", item.inviteId);
    } catch (error) {
      console.log("errors");
    }
    if (socket) {
      if (socket.current) {
        socket.current.emit("handle-request-friend", {
          idUser: user.uid,
          idFriend: item.inviteId,
          idCon: idConversation._id,
        });
        console.log("friend request");
      }
    }
  };
  const handAceptFriend = async () => {
    console.log("handAceptFriend");
    try {
      const { conversationId } = await friendApi.acceptFriend(
        user.uid,
        item.inviteId
      );
      console.log("acceptFriend", conversationId);
      //console.log("idinvite", item.inviteId);
    } catch (error) {
      console.log("errors acceptFriend");
    }
  };

  //console.log("item", item);
  return (
    <View style={styles.viewOne}>
      {/* ảnh đại diện */}
      <View style={styles.imaContainer}>
        {item.avaUser == "" ? (
          <Image
            style={styles.imaAvatar}
            source={{
              uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
            }}
          ></Image>
        ) : (
          <Image
            style={styles.imaAvatar}
            source={{
              uri: item.avaUser,
            }}
          ></Image>
        )}
      </View>

      {/* Thông tin */}
      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          {/* tên */}
          <Text style={styles.textName}>
            {item.userFistName} {item.userLastName}
          </Text>
          <View
            style={[
              styles.viewGroupCommon,
              { justifyContent: "space-evenly", marginVertical: 8 },
            ]}
          >
            <View style={[styles.viewGroupCommon, { marginRight: 12 }]}>
              <View style={styles.viewDot}></View>
              <Text style={styles.textDate}>Nhóm chung: </Text>
              <Text style={styles.textDate}>{item.numCommonGroup}</Text>
            </View>

            <View style={styles.viewGroupCommon}>
              <View style={styles.viewDot}></View>
              <Text style={styles.textDate}>Bạn chung: </Text>
              <Text style={styles.textDate}>{item.numCommonFriend}</Text>
            </View>
          </View>
        </View>

        {/* lời nhắn */}
        {/* <View style={styles.bodyContainer}>
          <Text style={styles.text}>
            Xin chào, mình là Nguyễn Tiến Đạt. Kết bạn với mình nhé!
          </Text>
        </View> */}

        {/* nút */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={handDeleteInvite}
            style={[
              styles.btn,
              { backgroundColor: "#CCCCCC", marginRight: 16 },
            ]}
          >
            <Text>TỪ CHỐI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handAceptFriend}
            style={[styles.btn, { backgroundColor: "#66B2FF" }]}
          >
            <Text style={{ color: "white" }}>ĐỒNG Ý</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewOne: {
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  imaAvatar: {
    marginTop: 10,
    //marginLeft: 10,
    height: 60,
    width: 60,
    borderRadius: 100,
    //  backgroundColor: "red",
  },

  infoContainer: {
    // backgroundColor: "red",
    marginLeft: 12,
  },

  textName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "bold",
  },

  textDate: {
    //paddingLeft: 15,
  },

  headerContainer: {
    // marginTop: 13,
    // marginBottom: 5,
  },

  bodyContainer: {
    // width: 320,
    // marginBottom: 10,
  },

  text: {
    // width: 290,
    // height: 60,
    // marginLeft: 13,
    // paddingLeft: 10,
    // paddingTop: 10,
    // borderRadius: 10,
    // borderWidth: 1,
  },

  footerContainer: {
    flexDirection: "row",
  },

  btn: {
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 6,
  },
  viewDot: {
    height: 7,
    width: 7,
    borderRadius: 100,
    backgroundColor: "green",
    marginRight: 10,
  },
  viewGroupCommon: {
    flexDirection: "row",
    //justifyContent: "center",
    alignItems: "center",
  },
});
