import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

export default function FriendItem({ item }) {
  return (
    <View style={styles.viewOne}>
      <TouchableOpacity>
        <View style={styles.chatBox}>
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
            {/* <View style={styles.status}></View> */}
          </View>

          <View style={styles.bodyContainer}>
            {/* tên */}
            <Text style={styles.textName}>
              {item.userFistName} {item.userLastName}
            </Text>
          </View>

          <View style={styles.notification}>
            <Ionicons name="call-outline" size={24} color="black" />
            <Ionicons name="videocam-outline" size={24} color="black" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viewOne: {
    // width: "100%",
    // height: 90,
    // justifyContent: "center",
    // alignItems: "center",
  },

  chatBox: {
    width: "100%",
    flexDirection: "row",

    paddingHorizontal: 12,
  },

  imaContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // backgroundColor: "red",
  },

  imaAvatar: {
    //  marginLeft: 10,
    height: 60,
    width: 60,
    borderRadius: 100,
  },

  bodyContainer: {
    marginLeft: 10,
    paddingRight: 10,
    paddingLeft: 10,
    flex: 1,
    height: 90,
    // borderBottomWidth: 1,
    justifyContent: "center",
  },

  notification: {
    width: "20%",
    paddingRight: 13,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 90,
    //borderBottomWidth: 1,
  },

  textName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    position: "absolute",

    backgroundColor: "green",
    height: 10,
    width: 10,
    borderRadius: 10,
    bottom: 20,
    right: 4,
  },
});
