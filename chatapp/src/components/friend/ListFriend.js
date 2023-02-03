import "./index.scss";
import friend from "../../images/friend.png";
import Divider from "@mui/material/Divider";
import * as React from "react";
import Contex from "../../store/Context";
import { useContext } from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import friendApi from "../../api/friendApi";
import { SetListFriend } from "../../store/Actions";
import FriendCard from "./FriendCard";

const ListFriend = ({ socket }) => {
  const { state, depatch } = useContext(Contex);
  const [listFriend, setListFriend] = React.useState([]);

  const { user, idConversation } = state;

  //console.log(listFriend);

  React.useEffect(() => {
    const featchListMember = async (userId) => {
      try {
        const response = await friendApi.getListFriend(userId);
        setListFriend(response);

        //set value global
        depatch(SetListFriend(response));
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    featchListMember(user.uid);
  }, [user]);
  
  React.useEffect(() => {
    if (socket.current) {
      socket.current.on("update-invite", (idUser) => {
        if (idUser) {
          const featchListMember = async (userId) => {
            try {
              const response = await friendApi.getListFriend(userId);
              setListFriend(response);
            } catch (error) {
              console.log("Failed to fetch conversation list: ", error);
            }
          };
          featchListMember(user.uid);
        }
      });
      socket.current.on("update-inviteFr", (idFriend) => {
        if (idFriend) {
          const featchListMember = async (userId) => {
            try {
              const response = await friendApi.getListFriend(userId);
              setListFriend(response);
            } catch (error) {
              console.log("Failed to fetch conversation list: ", error);
            }
          };
          featchListMember(user.uid);
        }
      });
    }
  }, [user]);

  return (
    <div className="list_friend">
      <div className="block" style={{ padding: "0.5rem 1.5rem" }}>
        <span style={{ color: "blue" }}>
          <IoPersonAddSharp />
        </span>
        <p>thêm bạn bè bằng gmail</p>
      </div>
      <div className="block">
        <img src={friend} />
        <p>danh sách kết bạn</p>
      </div>

      <Divider />
      <p style={{ padding: "0.5rem 1rem", fontWeight: "500" }}>
        Bạn bè ({listFriend.length})
      </p>
      <div className="group_friend">
        {listFriend.map((item) => (
          <FriendCard item={item} />
        ))}
      </div>
    </div>
  );
};

export default ListFriend;
