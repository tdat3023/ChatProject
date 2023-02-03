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
import MessengerItem from "./MessengerItem";
import CreateAboutScreen from "./about.js";
import AboutGroupScreen from "./aboutGroup";
import Contex from "../../store/Context";
import messageApi from "../../api/messageApi";
import { Dimensions } from "react-native";
import conversationApi from "../../api/conversationApi";
import { SetIdConversation, SetUserChatting } from "../../store/Actions";
import { format } from "timeago.js";
import useDateLogic from "../../hook/useDateLogic";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { convertDateTimeToString, handleDate } from "../../utilies/DateTime";

export default ChatScreen = ({ props, navigation }) => {
  const [onFocus, setOnFocus] = useState(false);
  // const {item} = route.params;
  const [typing, setTyping] = useState(false);
  const [members, setMembers] = useState([]);
  const [leaderId, setLeaderId] = useState("");
  //const { handleDate } = useDateLogic();

  const [friendStatus, setFriendStatus] = useState();

  const { state, depatch } = React.useContext(Contex);
  const { user, idConversation, userChatting, socket } = state;
  const [listMessgae, setListMessage] = useState([]);
  // if (socket) {
  //   console.log("socket", socket);
  // }

  console.log("friend", friendStatus);
  const onFoucsInPut = () => {
    setOnFocus(!onFocus);
  };
  const onDismiss = () => {
    Keyboard.dismiss;
    setOnFocus(!onFocus);
  };

  // useEffect(() => {
  //   //scroll last message
  //   scrollToBottom();
  // });

  const [newMess, setNewMess] = useState("");
  //console.log(listMessgae);
  //console.log("id", user.uid);
  React.useEffect(() => {
    const fetchMessages = async () => {
      // console.log("user:", user.user.uid);
      try {
        // user.uid,page,size
        const response = await messageApi.getMess(
          idConversation?._id,
          user.uid,
          0,
          200
        );
        const { data, page, size, totalPages, friendStatus } = response;
        // console.log("listMess ", data[0].messages);
        if (response) {
          setListMessage(data[0].messages);
          setFriendStatus(friendStatus);

          //  console.log("listMess", data[0].messages);
        }
      } catch (error) {
        console.log("Failed to fetch conversation list 1: ", error);
      }
    };
    socket.current?.on("messNotifi", (idC) => {
      fetchMessages();
      console.log("fetch notifi kick user");
    });

    fetchMessages();
  }, [userChatting]);

  React.useEffect(() => {
    const featchListMember = async (_id) => {
      try {
        const response = await conversationApi.getListMember(_id);
        // console.log("data::: ", response);

        setMembers(response.members);
        setLeaderId(response.leaderId);
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    socket.current?.on("notifi-kickUser", (data) => {
      featchListMember(idConversation?._id);
      console.log("kich dm ");
    });
    if (idConversation) {
      socket?.current.emit(
        "get-user-online",
        userChatting.userIdFriend,
        ({ isOnline, lastLogin }) => {
          depatch(
            SetUserChatting({
              ...userChatting,
              isOnline: isOnline,
              lastLogin: lastLogin,
            })
          );
          console.log("online:", isOnline);
          console.log("lasst login:", userChatting?.lastLogin);
        }
      );
    }

    featchListMember(idConversation?._id);
  }, []);
  console.log("userChattting:", userChatting);

  useEffect(() => {
    console.log("renderrr");
    socket.current?.emit("join-room", {
      idCon: idConversation?._id,
      // isNew:false
    });

    socket.current?.on("get-message", ({ senderId, message }) => {
      //console.log("get");
      if (senderId === user.uid) {
        console.log("send nhung k them vao list ---> ");
      } else {
        console.log("mess nhan dc ---> ");
        console.log(message);
        // console.log(message);
        setListMessage((prev) => [...prev, { ...message }]);
      }
    });
  }, []);

  const handSendMess = async () => {
    //if newMessage === "" return
    if (!newMess) {
      return;
    }
    //ckeck
    //th1: chưa từng trò chuyện, có idConversation == null
    setNewMess("");
    if (!idConversation) {
      console.log("chua co conversation ---> create");
      //tao cuoc tro chuyen
      const createConversation = async () => {
        try {
          const response = await conversationApi.createConversation(
            user.uid,
            userChatting.userIdFriend
          );

          console.log("id conversation moi tao ---> " + response);
          //cal api get the conversation
          try {
            const response = await conversationApi.getConversationDetails(
              user.uid,
              userChatting.userIdFriend
            );
            console.log(response[0]);
            if (response[0]) {
              console.log("co ");
              // console.log("render");
              depatch(SetIdConversation(response[0].conversations));
              depatch(SetUserChatting(response[0].inFo));
            }
          } catch (error) {
            console.log("Failed to fetch the conversation id: ", error);
          }

          //join a room with name = id conversation
          socket.current.emit("join-room", {
            idCon: response,
            isNew: true,
          });
          try {
            const newMessSend = {
              userId: user.uid,
              content: newMess,
              conversationId: response,
              type: "TEXT",
            };
            console.log("messSend conver new :", newMessSend);
            const messSave = await messageApi.addTextMess(newMessSend);

            if (socket.current) {
              socket.current.emit("send-message", {
                senderId: user.uid,
                receiverId: userChatting.userIdFriend,
                message: messSave,
                idCon: response,
                isNew: true,
              });
              console.log("send");
            }
          } catch (error) {
            console.log("Failed all: ", error);
          }
        } catch (error) {
          console.log("Failed to create the conversation: ", error);
        }
      };

      createConversation();
    } else {
      try {
        //th2: đã có cuộc trò chuyện
        console.log(" co conversation ---> create");
        //create new message
        const newMessSend = {
          userId: user.uid,
          content: newMess,
          conversationId: idConversation?._id,
          type: "TEXT",
        };
        console.log(newMessSend);
        setNewMess("");
        const messSave = await messageApi.addTextMess(newMessSend);

        //  console.log("mess send", messSave);

        setListMessage((prev) => [...prev, { ...messSave }]);

        if (socket) {
          if (socket.current) {
            //call soket in here
            if (idConversation.type) {
              if (socket.current) {
                socket.current.emit("send-message", {
                  senderId: user.uid,
                  idCon: idConversation._id,
                  message: messSave,
                  isGroup: true,
                });
                console.log("send group");
              }
            } else {
              socket.current.emit("send-message", {
                senderId: user.uid,
                receiverId: userChatting.userIdFriend,
                message: messSave,
                idCon: idConversation._id,
              });
              // console.log("sender", user.uid);
              console.log("rec", idConversation);
            }
          }
          console.log("send");
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    }
  };
  // if (socket) {
  //   console.log("socket connected", socket);
  // }
  // UI send mes
  const handleChangText = (text) => {
    if (text.length > 0) {
      setTyping(true);
    } else if (text.length === 0) {
      setTyping(false);
    }
    setNewMess(text);
  };

  // UI send image
  // Open choose Image
  const [filePath, setFilePath] = useState({});
  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      console.log("base64 -> ", response.base64);
      console.log("uri -> ", response.uri);
      console.log("width -> ", response.width);
      console.log("height -> ", response.height);
      console.log("fileSize -> ", response.fileSize);
      console.log("type -> ", response.type);
      console.log("fileName -> ", response.fileName);
      setFilePath(response);
    });
  };

  //more
  const aboutScreen = () => {
    if (idConversation?.type) {
      // console.log("type", con.conversations.type);
      return navigation.navigate("AboutGroupScreen", { members, leaderId });
    } else {
      return navigation.navigate("CreateAboutScreen");
    }
  };

  const [opacity, setOpacity] = useState(1);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Top tag */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ alignItems: "center", marginLeft: 10 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.nameFriend}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  textTransform: "capitalize",
                  color: "white",
                  marginLeft: 12,
                }}
              >
                {/* check type conversations ? set name group : set name user chat */}
                {idConversation?.type
                  ? userChatting?.name
                  : userChatting?.firstName + " " + userChatting?.lastName}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "white",
                  marginLeft: 12,
                }}
              >
                {/* check type conversations ? set name group : set name user chat */}
                {idConversation?.type ? (
                  <Text>{members.length} thành viên</Text>
                ) : (
                  <>
                    {friendStatus ? (
                      userChatting?.isOnline ? (
                        <Text>Đang truy cập</Text>
                      ) : (
                        <Text>
                          {" "}
                          {handleDate(
                            new Date(),
                            new Date(
                              `${userChatting?.lastLogin}`.toLocaleString(
                                "en-US",
                                {
                                  timeZone: "Asia/Ho_Chi_Minh",
                                }
                              )
                            )
                          )}
                          {" trước"}
                        </Text>
                      )
                    ) : (
                      <Text>Người lạ</Text>
                    )}
                  </>
                )}
              </Text>
            </View>
          </View>

          <View style={styles.moreTag}>
            <TouchableOpacity>
              <Ionicons name="call-outline" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Ionicons name="videocam-outline" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: "center",
                marginLeft: 10,
                marginRight: 10,
              }}
              onPress={() => {
                aboutScreen();
              }}
            >
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={{ flex: 1, opacity }}>
          <View style={styles.bodyListChat}>
            <FlatList
              // invertStickyHeaders={false}
              inverted={true}
              style={styles.bodyList}
              data={(() => [...listMessgae].reverse())()}
              renderItem={({ item }) => (
                <MessengerItem
                  messend={item}
                  setOpacity={setOpacity}
                  opacity={opacity}
                ></MessengerItem>
              )}
              //</View>key={"&{item.}timestamp"}
            ></FlatList>
          </View>

          {/*Footer */}
          <View style={styles.footerContainer}>
            <View style={styles.inputMess}>
              <TouchableOpacity style={styles.moreAction}>
                <Ionicons name="happy-outline" size={30} />
              </TouchableOpacity>
              <TextInput
                style={styles.textChat}
                value={newMess}
                onChangeText={(text) => handleChangText(text)}
                onFocus={onFoucsInPut}
                onBlur={onFoucsInPut}
                onSubmitEditing={handSendMess}
                blurOnSubmit={false}
                placeholder="Tin nhắn"
              ></TextInput>
            </View>

            {/* input */}
            {typing ? (
              <View style={styles.send}>
                <TouchableOpacity>
                  <Feather name="send" size={27} color="#3F4E4F" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.moreTag}>
                {/* <TouchableOpacity>
                  <Feather name="more-horizontal" size={27} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="mic" size={27} color="black" />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => chooseFile("photo")}>
                  <Feather name="image" size={27} color="#3F4E4F" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* <View
            style={{ float: "left", clear: "both" }}
            ref={messagesEnd}
          ></View> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "space-between",
  },

  headerContainer: {
    height: 50,
    backgroundColor: "#0091ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bodyContainer: {
    width: "100%",
  },

  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderBottomWidth: 0.2,
  },

  inputMess: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },

  moreTag: {
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
  },

  bodyListChat: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  bodyList: {
    width: "100%",
    //backgroundColor: "blue",
  },
});
