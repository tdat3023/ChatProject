import "./ChatFeedStyle.scss";
import * as React from "react";
import { useRef, useState, useEffect } from "react";

import ChatHeader from "./ChatHeader";
import NewMessageForm from "./NewMessageForm";
import Message from "./Message";
import Avatar from "@mui/material/Avatar";
import "./MessageStyle.scss";
import TimeLine from "./TimeLine";
import { IoIosArrowDown } from "react-icons/io";

import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
import Contex from "../../store/Context";
import messageApi from "../../api/messageApi";
import CircularProgress from "@mui/material/CircularProgress";
import {
  SetIdMessageDeletedWithMe,
  SetMessageSent,
  SetStatusMessage,
} from "../../store/Actions";
import WordsComponent from "../filecomponent/WordsComponent";
import ChatHeaderGroup from "./ChatHeaderGroup";
import NewMessageGroupForm from "./NewMessageGroupForm";
import NotifyComponent from "./NotifyComponent";
// import {socket} from '../../store/socketClient';

const ChatFeedGroup = ({ socket }) => {
  const { state, depatch } = React.useContext(Contex);
  const [messages, setMessages] = useState([]);
  // console.log(messages);
  const [idReMessage, setIdReMessage] = useState("");
  const [statusLoadMessage, setStatusLoadMessage] = useState(true);
  const [statusLoadOldMessage, setStatusLoadOldMessage] = useState(false);
  // const [arrivalMess, setArrivalMess] = useState(null);
  const [arrivalMess, setArrivalMess] = useState("");

  //console.log("chetfeed message ---->" + messages);
  // console.log(messages);
  //detructering...
  const {
    userChatting,
    idConversation,
    user,
    messageSent,
    idMessageDeletedWithMe,
    groupChatting,
  } = state;

  const messagesEnd = useRef();

  const [panigation, setPanigation] = React.useState({ page: 0, size: 50 });
  const [page, setPage] = React.useState(0);

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  // console.log(arrivalMess);

  useEffect(() => {
    //scroll last message
    scrollToBottom();
  });

  useEffect(() => {
    
    socket.current.on("get-message", ({ senderId, message,isGroup }) => {
      console.log("get");
      if(isGroup){
        console.log("mess nhan dc ---> ");
        console.log(message);
        setArrivalMess(message);
      }
    });

    //socket on tha reaction
    socket.current?.on("reaction", (idC) => {
      console.log("reaction"+idC);
      const featchMessages = async (idC) => {
        try {
          //cal api get total page
          const response = await messageApi.getMess(
            idC,
            user.uid,
            panigation.page,
            panigation.size
          );
          const { totalPages } = response;
          console.log(totalPages);
  
          //th1: so luong tin nhan < 30, page = 1
          if (totalPages <= 1) {
            setMessages(response.data[0].messages);
            //update page current
            setPage(totalPages);
          } else {
            const newPage = totalPages - 1;
            //get 30 tin moi nhat
            const currnetResponse = await messageApi.getMess(
              idC,
              user.uid,
              newPage,
              panigation.size
            );
  
            const { data, info, friendStatus, size } = currnetResponse;
            //neu khong tra ve du 30 tin nhan -> lui 1 page
            if (data[0].messages.length < 20) {
              const cPage = newPage - 1;
              //get 30 tin moi nhat
              const newResponse = await messageApi.getMess(
                idC,
                user.uid,
                cPage,
                panigation.size + data[0].messages.length
              );
              if (newResponse) {
                setMessages(newResponse.data[0].messages);
                setPage(cPage);
              }
            } else {
              setMessages(data[0].messages);
              setPage(newPage);
            }
          }
  
          // //update page current
          // setPage(newPage);
          setStatusLoadMessage(false);
        } catch (error) {
          setMessages([]);
          setStatusLoadMessage(false);
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      featchMessages(idC);
    });


    socket.current?.on("messNotifi", (idC) => {
    
      const featchMessages = async (idC) => {
        try {
          //cal api get total page
          const response = await messageApi.getMess(
            idC,
            user.uid,
            panigation.page,
            panigation.size
          );
          const { totalPages } = response;
          console.log(totalPages);
  
          //th1: so luong tin nhan < 30, page = 1
          if (totalPages <= 1) {
            setMessages(response.data[0].messages);
            //update page current
            setPage(totalPages);
          } else {
            const newPage = totalPages - 1;
            //get 30 tin moi nhat
            const currnetResponse = await messageApi.getMess(
              idC,
              user.uid,
              newPage,
              panigation.size
            );
  
            const { data, info, friendStatus, size } = currnetResponse;
            //neu khong tra ve du 30 tin nhan -> lui 1 page
            if (data[0].messages.length < 20) {
              const cPage = newPage - 1;
              //get 30 tin moi nhat
              const newResponse = await messageApi.getMess(
                idC,
                user.uid,
                cPage,
                panigation.size + data[0].messages.length
              );
              if (newResponse) {
                setMessages(newResponse.data[0].messages);
                setPage(cPage);
              }
            } else {
              setMessages(data[0].messages);
              setPage(newPage);
            }
          }
  
          // //update page current
          // setPage(newPage);
          setStatusLoadMessage(false);
        } catch (error) {
          setMessages([]);
          setStatusLoadMessage(false);
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      featchMessages(idC);
    });

    // socket.current?.on("mess-leave-group", (idC) => {
    //   console.log("mess-leave-group");
    
    //   const featchMessages = async (idC) => {
    //     try {
    //       //cal api get total page
    //       const response = await messageApi.getMess(
    //         idC,
    //         user.uid,
    //         panigation.page,
    //         panigation.size
    //       );
    //       const { totalPages } = response;
    //       console.log(totalPages);
  
    //       //th1: so luong tin nhan < 30, page = 1
    //       if (totalPages <= 1) {
    //         setMessages(response.data[0].messages);
    //         //update page current
    //         setPage(totalPages);
    //       } else {
    //         const newPage = totalPages - 1;
    //         //get 30 tin moi nhat
    //         const currnetResponse = await messageApi.getMess(
    //           idC,
    //           user.uid,
    //           newPage,
    //           panigation.size
    //         );
  
    //         const { data, info, friendStatus, size } = currnetResponse;
    //         //neu khong tra ve du 30 tin nhan -> lui 1 page
    //         if (data[0].messages.length < 20) {
    //           const cPage = newPage - 1;
    //           //get 30 tin moi nhat
    //           const newResponse = await messageApi.getMess(
    //             idC,
    //             user.uid,
    //             cPage,
    //             panigation.size + data[0].messages.length
    //           );
    //           if (newResponse) {
    //             setMessages(newResponse.data[0].messages);
    //             setPage(cPage);
    //           }
    //         } else {
    //           setMessages(data[0].messages);
    //           setPage(newPage);
    //         }
    //       }
  
    //       // //update page current
    //       // setPage(newPage);
    //       setStatusLoadMessage(false);
    //     } catch (error) {
    //       setMessages([]);
    //       setStatusLoadMessage(false);
    //       console.log("Failed to fetch conversation list: ", error);
    //     }
    //   };

    //   featchMessages(idC);
    // });

    //socket on thu hoi tin nhan
    socket.current?.on("reMessage", (data) => {
      console.log("add");
      setIdReMessage(data);
    });

  }, []);

  //cap nhat mess da thu hoi len giao dien
  useEffect(() => {
    if (idReMessage) {
      const newMess = messages.map((mess) => {
        if (mess._id === idReMessage) {
          return { ...mess, isDeleted: true };
        }
        return mess;
      });
      //console.log(newMess);
      setMessages(newMess);
    }
  }, [idReMessage]);

  //cap nhat mess da xoa phia toi len giao dien
  useEffect(() => {
    if (idMessageDeletedWithMe) {
      console.log("useEffcet delete message start");
      const newMess = messages.filter((mess) => {
        return mess._id != idMessageDeletedWithMe;
      });
      console.log(newMess);
      setMessages(newMess);
      depatch(SetIdMessageDeletedWithMe(""));
    }
  }, [idMessageDeletedWithMe]);

  useEffect(() => {
    // socket.current.emit("seen-message", {
    //   conversationId: idConversation,
    //   userId: user.uid,
    // });

    //xoa di message cuoi cung cua array (message mẫu)
    if (messageSent != "") {
      const messagesCurrent = messages.filter((val, idx) => {
        return idx !== messages.length - 1;
      });
      depatch(SetMessageSent(""));
      // console.log(messagesCurrent);
      arrivalMess &&
        idConversation === arrivalMess.conversationId &&
        setMessages((prev) => [...messagesCurrent, arrivalMess]);
    } else {
      arrivalMess &&
        idConversation === arrivalMess.conversationId &&
        setMessages((prev) => [...prev, arrivalMess]);
    }
  }, [arrivalMess, idConversation]);



  //khi tin nhan duoc gui thi them tin nhan do vao messages -> render
  useEffect(() => {

    
    // console.log("useEffect --->");
    // console.log(messageSent);
    if (messageSent != "" && idConversation === messageSent.conversationId) {
      setMessages((prev) => [...prev, messageSent]);
    }
    // messageSent &&
    //   idConversation === messageSent.conversationId &&
  }, [messageSent]);

  useEffect(() => {
    setStatusLoadMessage(true);
    console.log("useEffect load message");
    //call api get all message
    //set state
    const featchMessages = async () => {
      try {
        //cal api get total page
        const response = await messageApi.getMess(
          idConversation,
          user.uid,
          panigation.page,
          panigation.size
        );
        const { totalPages } = response;
        console.log(totalPages);

        //th1: so luong tin nhan < 30, page = 1
        if (totalPages <= 1) {
          setMessages(response.data[0].messages);
          //update page current
          setPage(totalPages);
        } else {
          const newPage = totalPages - 1;
          //get 30 tin moi nhat
          const currnetResponse = await messageApi.getMess(
            idConversation,
            user.uid,
            newPage,
            panigation.size
          );

          const { data, info, friendStatus, size } = currnetResponse;
          //neu khong tra ve du 30 tin nhan -> lui 1 page
          if (data[0].messages.length < 20) {
            const cPage = newPage - 1;
            //get 30 tin moi nhat
            const newResponse = await messageApi.getMess(
              idConversation,
              user.uid,
              cPage,
              panigation.size + data[0].messages.length
            );
            if (newResponse) {
              setMessages(newResponse.data[0].messages);
              setPage(cPage);
            }
          } else {
            setMessages(data[0].messages);
            setPage(newPage);
          }
        }

        // //update page current
        // setPage(newPage);
        setStatusLoadMessage(false);
      } catch (error) {
        setMessages([]);
        setStatusLoadMessage(false);
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    featchMessages();
  }, [groupChatting, idConversation]);

  return (
    <div className="chat_feed">
      <ChatHeaderGroup />
      <div
        className="message_content"
        //onScroll={(e) => handelScroll(e)}
      >
        <div className="card_title">
          <div className="title_top">
            <Avatar
              className=""
              style={{ textTransform: "capitalize" }}
            ></Avatar>

            <div className="topContent">
              <p style={{ textTransform: "capitalize" }}>
                {groupChatting?.name}
              </p>

              <p>Hãy bắt đầu cùng nhau chia sẻ những...</p>
            </div>
          </div>
          <div className="title_image"></div>
        </div>
        {statusLoadOldMessage ? (
          <div className="messageLoadingOldMessage">
            <CircularProgress className="circle_loading" />
            <p>Đang tải tin nhắn</p>
          </div>
        ) : null}

        {messages.map((mess, idx) => {
          //neu message co "type": "NOTIFY"
          if (mess.type === "NOTIFY") {
            return <NotifyComponent text={mess.content} />;
          }
          //neu la tin nhan cuoi cung
          //truyen 1 trang thai la isLastMessage
          if (idx === messages?.length - 1) {
            return (
              <Message
                key={mess._id}
                mess={mess}
                socket={socket}
                isLastMessage
                userId={mess.userId}
                preMessage={[messages[idx - 1]]}
              />
            );
          }

          //truyen vao prevent meassage bat dau tu idx = 1 : messages[idx - 1]
          //neu idx = 0 thi khong truyen prevent message
          if (idx === 0 || messages[idx - 1].type === "NOTIFY") {
            return <Message key={mess._id} mess={mess} socket={socket} />;
          } else {
            return (
              <Message
                key={mess._id}
                mess={mess}
                socket={socket}
                userId={mess.userId}
                preMessage={[messages[idx - 1]]}
              />
            );
          }
        })}

        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <span className="goToBottom" onClick={scrollToBottom}>
        <IoIosArrowDown />
      </span>
      {statusLoadMessage ? (
        <div className="meassage_loadingStatus">
          <CircularProgress className="circle_loading" />
          <p>Đang tải tin nhắn</p>
        </div>
      ) : null}

      <NewMessageGroupForm socket={socket}/>
    </div>
  );
};
export default ChatFeedGroup;
