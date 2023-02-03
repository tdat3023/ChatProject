import React from "react";

import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

const WinWidth = Dimensions.get("window").width;
const WinHeight = Dimensions.get("window").height;

import { db } from "../../../firebase/firebaseDB";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import Contex from "../../../store/Context";
import AddGroupItem from "../../Contacts/addGroupItem";
import conversationApi from "../../../api/conversationApi";

const UserChoise = ({
  item,
  listUserAddToGroup,
  setListUserAddToGroup,
  setCount,
  count,
}) => {
  console.log(item);
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

export default AddMemberGroupComponent = ({ navigation, route }) => {
  const { state, depatch } = React.useContext(Contex);
  const { user, userSearched, idConversation, userChatting, socket } = state;
  const { members } = route.params;

  //list of user will be add a group
  const [listUserAddToGroup, setListUserAddToGroup] = useState([]);

  //state
  //khi tim kiem user thanh cong se add vao list de render data
  const [listUserSearch, setListUserSearch] = useState([]);
  console.log(listUserSearch);

  console.log("userChat", members);
  //search text
  const [textSearch, setTextSearch] = useState("");

  const [count, setCount] = useState(0);

  //handle search user by email
  const handleSearch = async (text) => {
    const q = query(collection(db, "users"), where("email", "==", text));
    const newArr = [];

    const querySnapshot = await getDocs(q);
    console.log("userSearch", querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      let checkJoied = false;
      //check user da co trong nhom chua
      members.forEach((val) => {
        console.log("may lan");
        console.log("iduser", val.userId);
        if (doc.id === val.userId) {
          checkJoied = true;
          return;
        }
      });

      if (checkJoied === true) {
        checkJoied = false;
        newArr.push({ ...doc.data(), status: true });
      } else {
        checkJoied = false;
        newArr.push({ ...doc.data(), status: false });
      }
    });

    // console.log("neew   ", newArr);
    setListUserSearch(newArr);
  };

  //create agroup
  const handleAddMember = () => {
    //get list id in users will add to group
    const idList = listUserAddToGroup.map((val) => {
      return val.uid;
    });

    console.log(idList);

    //call api save data
    const addMemberIntoGroup = async () => {
      try {
        const response = await conversationApi.addMember(
          idConversation._id,
          user.uid,
          idList
        );
        setListUserAddToGroup([]);
        console.log("add member thanh cong" + response);
      } catch (error) {
        console.log("Failed to add member: ", error);
      }
    };

    //call custom hook
    addMemberIntoGroup(idConversation, user.uid, idList);

    //socket in here
    if (socket.current) {
      socket.current.emit("kickUser", {
        idConversation: idConversation._id,
        // idLeader:user.uid,
        idUserKick: user.uid,
      });
    }
    navigation.navigate("ChatScreen");
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
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Thêm vào nhóm
            </Text>
            <Text style={{ fontSize: 12 }}>
              Đã chọn:
              <Text> {count} </Text>
            </Text>
          </View>
        </View>

        {/* tên nhóm */}
        <View style={{ alignItems: "center", marginTop: 24 }}>
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
                onPress={() => handleAddMember()}>
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
