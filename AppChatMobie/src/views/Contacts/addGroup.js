import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AddGroupItem from "./addGroupItem";

const WinWidth = Dimensions.get("window").width;
const WinHeight = Dimensions.get("window").height;

import { db } from "../../firebase/firebaseDB";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import Contex from "../../store/Context";
import conversationApi from "../../api/conversationApi";
import { SetIdConversation, SetUserChatting } from "../../store/Actions";

const UserChoise = ({
  item,
  listUserAddToGroup,
  setListUserAddToGroup,
  setCount,
  count,
}) => {
  //remove user out list of create goup
  const handleRemoveOutGroupList = () => {
    //remove user out group list
    const newArrAfterRemo = listUserAddToGroup.filter((val) => {
      return val.uid !== item.uid;
    });

    setCount(--count);
    setListUserAddToGroup(newArrAfterRemo);
  };
  return (
    <TouchableOpacity
      style={styles.itemChoose}
      key={Math.random()}
      onPress={() => handleRemoveOutGroupList()}>
      {item.avatar ? (
        <Image style={styles.imaAvatar} source={{ uri: item.avatar }}></Image>
      ) : (
        <Image
          style={styles.imaAvatar}
          source={{
            uri: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/908.jpg",
          }}></Image>
      )}

      <View style={styles.status}>
        <TouchableOpacity>
          <AntDesign name="close" size={12} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const AddGroup = ({ navigation, route }) => {
  //get socket from navigation value
  // const socket = route?.params;
  //console.log(socket);
  // if(socket){
  //   console.log("socket is connected");
  // }else{
  //   console.log("socket is cc");

  // }
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting, socket } = state;

  if (socket.current) {
    console.log("socket is connected");
  } else {
    console.log("socket is cc");
  }
  //list of user will be add a group
  const [listUserAddToGroup, setListUserAddToGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  console.log(listUserAddToGroup);

  //state
  //khi tim kiem user thanh cong se add vao list de render data
  const [listUserSearch, setListUserSearch] = useState([]);

  //search text
  const [textSearch, setTextSearch] = useState("");
  const [users, setUsers] = useState([
    {
      id: "1",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "2",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "3",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "4",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "5",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "6",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "7",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "8",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
    {
      id: "9",
      url: "https://www.sightseeingtoursitaly.com/wp-content/uploads/2019/06/Famous-Italian-dishes.jpg",
      name: "Tiến Đạt",
      lastMessage: "Hello",
    },
  ]);

  const [count, setCount] = useState(0);

  //handle search user by email
  const handleSearch = async (text) => {
    const q = query(collection(db, "users"), where("email", "==", text));
    const newArr = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      newArr.push(doc.data());
    });

    setListUserSearch(newArr);
  };

  //create agroup
  const handleCreateGroup = () => {
    //check name group
    if (groupName.length < 1) {
      Alert.alert("Vui lòng nhập tên nhóm!!");
      return;
    }
    //check list co du 2 thanh vien k
    if (listUserAddToGroup.length < 2) {
      Alert.alert("Phải trên 3 thành viên mới được tạo nhóm!!");
      return;
    } else {
      //du dieu kien
      //cal api create group in here
      //handle create group

      const idList = listUserAddToGroup.map((val) => {
        return val.uid;
      });
      //  console.log(idList);

      //upload image into firebase
      //co avatar

      console.log("khong co avatar ----> ");
      //call api save data
      const createGroup = async () => {
        try {
          const temp = {
            userId: user.uid,
            name: groupName,
            userList: [...idList],
            avatar: "",
          };
          // console.log(temp);
          const response = await conversationApi.createConversationGroup(temp);

          //cuoc hoi thoai da dc luu vao db -> chinh la cuoc hoi thoai dau tien trong mang tra ve
          //get cuoc hoi thoai nhom vua moi tao
          const fetchConversations = async () => {
            // console.log("user:", user.user.uid);
            try {
              // user.uid,page,size
              const response = await conversationApi.getConversations(
                user.uid,
                0,
                1
              );
              const { data, page, size, totalPages } = response;
              // console.log("data", data);
              if (response) {
                setListUserAddToGroup([]);
                console.log(response);
                // type conversation is true set conversation= conversation, chatUser= GroupInfo
                depatch(SetIdConversation(data[0].conversations));
                depatch(SetUserChatting(data[0].inFo));

                navigation.navigate("ChatScreen", { item: data[0] });
              }
            } catch (error) {
              if (error) {
                console.log("Failed to fetch conversation list group: ", error);
              }
            }
          };

          fetchConversations();

          //redict trang nhan tin
          // navigation.navigate("ChatScreen");
          console.log("tao nhom thanh cong" + response);
          //socket create group in here
          console.log("vooo");
          socket.current?.emit("create-conversation", {
            idConversation: response,
            idList,
          });
        } catch (error) {
          console.log("Failed create group: ", error);
        }
      };
      createGroup();
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* button back */}

        <View style={styles.topTag}>
          <TouchableOpacity style={{ alignItems: "center", marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <View style={styles.topTag1}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Nhóm mới</Text>
            <Text style={{ fontSize: 12 }}>
              Đã chọn:
              <Text> {count} </Text>
            </Text>
          </View>
        </View>

        {/* tên nhóm */}
        <View style={{ alignItems: "center" }}>
          <View style={styles.topTag0}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
                borderRadius: 100,
                backgroundColor: "#d6dbe1",
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}>
              <AntDesign name="camera" size={24} color="gray" />
            </TouchableOpacity>
            <View style={styles.sreach}>
              <TextInput
                style={styles.textTopTag}
                placeholder="Đặt tên nhóm"
                placeholderTextColor="gray"
                onChangeText={(text) => setGroupName(text)}></TextInput>
            </View>
          </View>

          {/* sreach */}
          <View style={styles.topTag2}>
            <TouchableOpacity style={{ alignItems: "center", marginLeft: 10 }}>
              <AntDesign name="search1" size={20} color="gray" />
            </TouchableOpacity>
            <View style={styles.sreach}>
              <TextInput
                style={styles.textTopTag}
                onChangeText={(text) => handleSearch(text)}
                placeholder="Tìm kiếm"
                placeholderTextColor="gray"></TextInput>
            </View>
          </View>
        </View>

        {/* List */}
        <View style={styles.bodyListChat}>
          <FlatList
            style={styles.bodyList}
            data={listUserSearch}
            renderItem={({ item }) => (
              <AddGroupItem
                setListUserAddToGroup={setListUserAddToGroup}
                listUserAddToGroup={listUserAddToGroup}
                item={item}
                setCount={setCount}
                count={count}
                key={Math.random() + item.uid}
              />
            )}
            keyExtractor={(item) =>
              item.uid + Math.random() + Math.random()
            }></FlatList>
        </View>

        {listUserAddToGroup.length > 0 ? (
          <View style={styles.footer}>
            <View style={styles.listChoose}>
              <FlatList
                horizontal
                // style={{ justifyContent: "center" }}
                data={listUserAddToGroup}
                renderItem={({ item }) => (
                  <UserChoise
                    item={item}
                    setCount={setCount}
                    count={count}
                    key={Math.random()}
                    setListUserAddToGroup={setListUserAddToGroup}
                    listUserAddToGroup={listUserAddToGroup}
                  />
                )}
                keyExtractor={(item) =>
                  item.uid + Math.random() + Math.random()
                }></FlatList>
            </View>
            <View style={styles.viewbtn}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleCreateGroup()}>
                <Feather name="arrow-right" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    // flex: 1,
  },

  sreach: {
    marginLeft: 10,
    width: 280,
  },

  moreTag: {
    marginRight: 10,
    marginLeft: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  topTag: {
    width: "100%",
    height: 55,
    backgroundColor: "#dfe2e7",
    flexDirection: "row",
    alignItems: "center",
  },
  topTag0: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },

  topTag2: {
    //height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dfe2e7",
    borderRadius: 10,
  },

  topTag1: {
    marginLeft: 10,
    flexDirection: "column",
  },

  textTopTag: {
    fontSize: 16,
  },

  text1: {
    fontSize: 20,
  },

  text2: {
    fontSize: 20,
    color: "blue",
  },

  bodyListChat: {
    flex: 1,
    paddingHorizontal: 14,
    marginTop: 12,
  },

  footer: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
  },

  btn: {
    marginRight: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0091ff",
    justifyContent: "center",
    alignItems: "center",
  },

  imaAvatar: {
    height: "100%",
    width: "100%",
    borderRadius: 100,
  },

  listChoose: {
    flex: 1,
    justifyContent: "center",
    marginTop: 5,
    marginHorizontal: 10,
  },

  itemChoose: {
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 50,
    height: 45,
    width: 45,
    marginRight: 10,
  },

  status: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 15,
    width: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 20,
  },
});

export default AddGroup;
