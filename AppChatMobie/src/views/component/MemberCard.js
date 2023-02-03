import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";

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

function MemberCard({ value, leaderId, navigation }) {
  const { state, depatch } = React.useContext(Contex);
  const { user, idConversation, userChatting, socket } = state;

  console.log("navigation", navigation);

  const [userName, setUserName] = useState(
    value?.userFistName + " " + value?.userLastName
  );

  //handle kick user
  const handleKickUser = (navigation) => {
    console.log("user kick id ", value);

    //cal api kick user
    //get list image in the conversation
    const kickUser = async () => {
      try {
        const response = await conversationApi.kickUserOutGroup(
          idConversation._id,
          user.uid,
          value.userId
        );
        console.log(response);
        ToastAndroid.show("Đã xóa thành viên ra khỏi nhóm", ToastAndroid.LONG);
      } catch (error) {
        console.log("Failed to kick member: ", error);
      }
    };
    //neu user hien tai dang nhap la leader (moi co giao dien thuc hien chuc nang kick user)
    //=> idLeader = user.uid
    kickUser();

    //emit socket kick user
    if (socket.current) {
      socket.current.emit("kickUser", {
        idConversation: idConversation._id,
        idLeader: leaderId,
        idUserKick: value.userId,
      });
    }

    navigation.navigate("ChatScreen");

    //call socket in here
  };
  //show aleart kick user
  const handleClik = () => {
    //k la truong nhom
    if (value.userId === leaderId) {
      return;
    }

    Alert.alert(
      "Xoá thành viên",
      `Bạn muốn xóa ${userName.toUpperCase()} khỏi nhóm?`,
      [
        {
          text: "Hủy",
          onPress: () => console.log("navigation", navigation),
          style: "cancel",
        },
        { text: "Đồng ý", onPress: () => handleKickUser(navigation) },
      ]
    );
  };

  return (
    <View style={styles.viewOne}>
      <TouchableOpacity onPress={() => handleClik()}>
        <View style={styles.chatBox}>
          {/* ảnh đại diện */}
          <View style={styles.imaContainer}>
            {/* {item.conversations} */}
            {value?.avaUser ? (
              <Image
                style={styles.imaAvatar}
                source={{
                  uri: value?.avaUser,
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
              {value?.userFistName + " " + value?.userLastName}
            </Text>
            {value.userId === leaderId ? (
              <Text style={styles.textNameLeader}>Trưởng nhóm</Text>
            ) : null}
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
    borderBottomWidth: 0.2,
  },

  bodyListChat: {
    flex: 1,
    alignItems: "center",
  },

  viewOne: {
    display: "flex",
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
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: "yellow",
  },

  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: 0.2,
  },

  textNameLeader: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "blod",
    color: "#395B64",
    textTransform: "capitalize",
  },
  textName: {
    marginLeft: 10,
    fontSize: 16,
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

export default MemberCard;
