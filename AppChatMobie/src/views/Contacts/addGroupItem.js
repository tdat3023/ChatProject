import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import { useState, useEffect, useRef } from "react";

export default function AddGroupItem({
  item,
  setCount,
  count,
  setListUserAddToGroup,
  listUserAddToGroup,
}) {
  const [typing, setTyping] = useState(false);

  //add user into a list -> create group
  const handleOnPress = () => {
    //neu da tham gia nhom => khong them vao nhom
    if (item?.status) {
      Alert.alert("Đã tham gia nhóm");
      return;
    }

    // if (typing) {
    //   setCount(count - 1);
    // } else {
    //   setCount(count + 1);
    // }
    //  setTyping(!typing);

    //check user da co trong listUserAddToGroup chua => khong cho them
    let status = 0;
    listUserAddToGroup.forEach((val) => {
      if (val.uid === item.uid) {
        status = 1;
      }
    });

    if (status === 0) {
      setListUserAddToGroup([...listUserAddToGroup, item]);
      setCount(++count);
    } else if (status === 1) {
      //remove user out group list
      const newArrAfterRemo = listUserAddToGroup.filter((val) => {
        return val.uid !== item.uid;
      });
      //  console.log(newArrAfterRemo);
      setCount(--count);
      setListUserAddToGroup(newArrAfterRemo);
    }
  };

  return (
    <TouchableOpacity style={styles.viewOne} onPress={() => handleOnPress()}>
      <View style={styles.chatBox}>
        {/* ảnh đại diện */}
        <View style={styles.imaContainer}>
          {item.avatar ? (
            <Image
              style={styles.imaAvatar}
              source={{ uri: item.avatar }}
            ></Image>
          ) : (
            <Image
              style={styles.imaAvatar}
              source={{
                uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
              }}
            ></Image>
          )}

          {/* <View style={styles.status}></View> */}
        </View>

        <View style={styles.bodyContainer}>
          {/* tên */}
          <Text style={styles.textName}>
            {item?.first_name + " " + item?.last_name}
          </Text>
          {item?.status ? (
            <Text style={{ color: "#333", fontSize: 12 }}>Đã tham gia</Text>
          ) : null}
        </View>

        <View style={styles.notification}>
          <TouchableOpacity>
            {typing ? (
              <Ionicons name="checkbox" size={24} color="#0091ff" />
            ) : (
              <Ionicons name="checkbox-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewOne: {
    width: "100%",
  },

  chatBox: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  imaContainer: {
    // justifyContent: "center",
    // alignItems: "center",
  },

  imaAvatar: {
    height: 50,
    width: 50,
    borderRadius: 100,

    backgroundColor: "#FFF6BF",
    marginRight: 12,
  },

  bodyContainer: {
    flex: 1,
    justifyContent: "center",
  },

  notification: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 100,
    justifyContent: "space-between",
  },

  textName: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    textTransform: "capitalize",
  },

  status: {
    position: "absolute",
    top: 65,
    left: 55,
    backgroundColor: "green",
    height: 10,
    width: 10,
    borderRadius: 10,
  },
});
