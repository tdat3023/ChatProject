import "./NewMessageForm.scss";
import { MdInsertEmoticon } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { GrImage } from "react-icons/gr";
import { useState, useRef } from "react";
import { SearchComponent } from "stipop-react-sdk";
import Context from "../../store/Context";
import { useContext, useEffect } from "react";
import messageApi from "../../api/messageApi";
// import {socket} from '../../store/socketClient';

import io from "socket.io-client";
import conversationApi from "../../api/conversationApi";
// import {init} from '../../store/socketClient';
import { SetIdConversation, SetMessageSent } from "../../store/Actions";

const NewMessageGroupForm = ({ messages, setMessages, socket }) => {
  // const [socket,setSocket] = useState(null);
  const [showStickers, setShowStickers] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const { state, depatch } = useContext(Context);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMess, setArrivalMess] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [newMessageSticker, setNewMessageSticker] = useState("");

  const { user, messageSent, idConversation,groupChatting } = state;
  const inputChooseIMG = useRef();
  //detructering...
  // console.log({ user });

  const divMessage = useRef();
  const handleFocus = (params) => {
    divMessage.current.classList.add("booderTop");
  };
  const handleBlur = (params) => {
    divMessage.current.classList.remove("booderTop");
  };

  const handleShowStickers = () => {
    setShowStickers(!showStickers);
  };
  // SEND FILE
  const changeHandler = async (event) => {
    const file = event.target.files[0];
    // setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
    let TYPE = file.type.split("/")[0].trim().toUpperCase();
    let SIZE = file.size / 1024 / 1024;
    if (file) {
      //th2: đã có cuộc trò chuyện
      console.log(" co conversation ---> create");
      console.log(TYPE);
      const formData2 = new FormData();
      formData2.append("userId", user.uid);
      formData2.append("file", file);
      formData2.append("type", TYPE);
      formData2.append("conversationId", idConversation);
      try {
        //call api save data
        const messSave = await messageApi.addFileMess(formData2);
        console.log("TYPE");

        //socket in here
        if(socket.current){
          socket.current.emit("send-message", {
            senderId: user.uid,
            idCon: idConversation,
            message: messSave,
            isGroup: true,
            name: user.first_name+""+user.last_name,
            avatar: user.avatar,
            nameGroup: groupChatting.name,
          });
          console.log("send");
        }
        // setMessages([...messages,messSave]);
        setNewMessage("");
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    }
  };

  const onHandlChoiseFile = () => {
    inputChooseIMG.current.click();
  };
  //handle send sticker
  const handleSendSticker = async (url) => {
    //console.log(url?.url)
    //set text = url of sticker
    setNewMessageSticker(url?.url);
    //ckeck
    //ckeck

    //th2: đã có cuộc trò chuyện
    console.log(" co conversation ---> create");
    try {
      const newMess = {
        userId: user.uid,
        content: url?.url,
        conversationId: idConversation,
        type: "TEXT",
      };

     // console.log(newMess);

      //call api save db
      const messSave = await messageApi.addTextMess(newMess);
      console.log(messSave);

      //socket in here
      if(socket.current){
        socket.current.emit("send-message", {
          senderId: user.uid,
          idCon: idConversation,
          message: messSave,
          isGroup: true,
          name: user.first_name+""+user.last_name,
          avatar: user.avatar,
          nameGroup: groupChatting.name,
        });
        console.log("send");
      }
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error);
    }

    setNewMessageSticker("");
    setShowStickers(false);
  };

  //gui 1 tin nhan dang text
  const onFormSubmit = async (e) => {
    e.preventDefault();

    //if newMessage === "" return
    if (!newMessage) {
      return;
    }

    //đã có cuộc trò chuyện
    console.log(" co group conversation ---> send");
    try {
      const newMess = {
        userId: user.uid,
        content: newMessage,
        conversationId: idConversation,
        type: "TEXT",
      };
      //set messageSent
      //console.log(newMess);
      depatch(
        SetMessageSent({
          ...newMess,
          _id: Math.random() + "1",
          createdAt: new Date(),
        })
      );

      //call api add a message into db
      const messSave = await messageApi.addTextMess(newMess);
      console.log(groupChatting);

      //socket
      if(socket.current){
        socket.current.emit("send-message", {
          senderId: user.uid,
          idCon: idConversation,
          message: messSave,
          isGroup: true,
          name: user.first_name+""+user.last_name,
          avatar: user.avatar,
          nameGroup: groupChatting.name,
        });
        console.log("send");
      }

      setNewMessage("");
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error.message);
    }
  };
  return (
    <div className="new_message" ref={divMessage}>
      <form onSubmit={onFormSubmit}>
        <input
          onFocus={() => handleFocus()}
          onBlur={(e) => handleBlur(e)}
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          type="text"
          placeholder={"Nhập @, để nhắn tới ..."}
        />
        <span style={{ color: "#333", fontSize: "20px" }} title="Gửi hình ảnh">
          <input
            type="file"
            ref={inputChooseIMG}
            hidden
            multiple
            accept='application/pdf, image/png'
            onChange={changeHandler}
          ></input>
          <GrImage onClick={onHandlChoiseFile} />
          {/* <button onClick={submitFile}>Submit</button> */}
        </span>
        {/* <input type="file" onChange={changeHandler} /> */}

        <span
          style={{ color: "#333" }}
          title="Biểu cảm"
          onClick={() => handleShowStickers()}
          className={showStickers ? "choise" : ""}
        >
          <MdInsertEmoticon />
        </span>
        <span title="Gửi nhanh cảm xúc">
          <FcLike />
        </span>
      </form>
      {showStickers ? (
        <SearchComponent
          className="searchIcons"
          params={{
            apikey: "110a13915f6cb9503c563964f58cee2d",
            userId: user?.uid || Math.random(),
          }}
          stickerClick={(url) => handleSendSticker(url)}
        />
      ) : null}
    </div>
  );
};

export default NewMessageGroupForm;
