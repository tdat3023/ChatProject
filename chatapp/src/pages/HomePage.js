import React, { useEffect, useContext, useRef, useState } from "react";
import ChatFeed from "../components/chatfeed/ChatFeed";
import ChatList from "../components/chatlist/ChatList";
import TabBarComponent from "../components/TabBarComponent";
import ModelUpdateUser from "../components/model/ModelUpdateUser";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Contex from "../store/Context";
import TabInfomation from "../components/chatfeed/TabInfomation";
import ListRequestComponent from "../components/friend/ListRequestComponent";
import HomeComponent from "../components/Home/HomeComponent";
import ModelShowListImage from "../components/model/ModelShowListImage";
import io from "socket.io-client";
import ChatFeedGroup from "../components/chatfeed/ChatFeedGroup";
import { ToastContainer, toast } from "react-toastify";
// import {init} from '../store/socketClient';

const HomePage = () => {
  const socket = useRef();
  // const [a, setA] = useState("a");
  // console.log(socket);
  // let socket = init();

  //width, height of current screen
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  //console.log(dimensions);
  const { state, depatch } = React.useContext(Contex);

  //detructering...
  const {
    userChatting,
    groupChatting,
    showAlert,
    user,
    showTabInfo,
    indexTab,
    showListRequestFriend,
  } = state;

  useEffect(() => {
    if (user) {
      socket.current = io("https://13.212.137.7");
      // socket.current = io("http://localhost:5005");
      // console.log(socket);
      socket.current.emit("start", user);

      // console.log(socket);
      //socket.current.emit("start", user);
    }
  }, [user]);

  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();

  // useEffect(() => {
  //   document.title = t("homepage");
  // }, []);
  // React.useEffect(() => {
  //   function handleResize() {
  //     setDimensions({
  //       height: window.innerHeight,
  //       width: window.innerWidth,
  //     });
  //   }
  //   window.addEventListener("resize", handleResize);
  // }, [dimensions]);
  return (
    <React.Fragment>
      <TabBarComponent socket={socket} />
      {dimensions.width < 800 ? null : <ChatList socket={socket} />}
      {indexTab === 0 ? (
        <React.Fragment>
          {userChatting ? (
            <div
              style={
                showTabInfo
                  ? {
                      display: "grid",
                      gridTemplateColumns: "1.95fr 1.05fr",
                      flexGrow: "1",
                    }
                  : {
                      display: "grid",

                      flexGrow: "1",
                    }
              }
              className="chat_main"
            >
              <ChatFeed socket={socket} />
              {showTabInfo ? <TabInfomation socket={socket} /> : null}
            </div>
          ) : (
            // <HomeComponent />
            <React.Fragment>
              {groupChatting ? (
                <div
                  style={
                    showTabInfo
                      ? {
                          display: "grid",
                          gridTemplateColumns: "1.95fr 1.05fr",
                          flexGrow: "1",
                        }
                      : {
                          display: "grid",

                          flexGrow: "1",
                        }
                  }
                  className="chat_main"
                >
                  <ChatFeedGroup socket={socket} />
                  {showTabInfo ? <TabInfomation socket={socket} /> : null}
                </div>
              ) : (
                <HomeComponent />
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {showListRequestFriend ? (
            <ListRequestComponent socket={socket} />
          ) : (
            <div
              style={
                showTabInfo
                  ? {
                      display: "grid",
                      gridTemplateColumns: "1.95fr 1.05fr",
                      flexGrow: "1",
                    }
                  : {
                      display: "grid",

                      flexGrow: "1",
                    }
              }
              className="chat_main"
            >
              <ChatFeed socket={socket} />
              {showTabInfo ? <TabInfomation socket={socket} /> : null}
            </div>
          )}
        </React.Fragment>
      )}

      <ModelUpdateUser />
      {showAlert && (
        <Alert
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            backgroundColor: "rgba(0,0,0,0.7)",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
          severity="success"
        >
          Cập nhật thông tin thành công.
        </Alert>
      )}
      {/* <ModelShowListImage /> */}
      <ToastContainer />
    </React.Fragment>
  );
};

export default HomePage;
