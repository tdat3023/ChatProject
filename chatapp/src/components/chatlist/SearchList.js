import React, { useEffect, useState } from "react";
import UserSearchedService from "../../services/UserSearchedService";
import UserService from "../../services/UserService";
import Contex from "../../store/Context";

import "./ChatListStyle.scss";
import "./SearchListStyle.scss";
import UserSearchCard from "./UserSearchCard";

import Skeleton from "@mui/material/Skeleton";
import { SetLoadingSearchFunc, SetSearchedUser } from "../../store/Actions";

import { FcSearch } from "react-icons/fc";

import searchIcon from "../../images/searchIcon.png";

const SearchList = () => {
  const { state, depatch } = React.useContext(Contex);
  //detructering...
  const {
    user,
    userSearched,
    loadingSearchFunc,
    searchingStatus,
    searchedUsers,
  } = state;
  // console.log(userSearched);

  // const [loading, setLoading] = useState(true);

  //get list user was searched
  useEffect(() => {
    UserSearchedService.getById(user?.uid).then(function (snapshot) {
      // console.log("d" + snapshot.data().first_name);
      if (snapshot.data()) {
        const { users } = snapshot.data();
        console.log(snapshot.data());
        // console.log(users);
        //set list of seared users
        depatch(SetSearchedUser(users));
        depatch(SetLoadingSearchFunc(false));
      }
    });

    if (searchedUsers.length === 0) {
      depatch(SetLoadingSearchFunc(false));
    }
  }, []);

  return (
    <div className="search_list">
      {loadingSearchFunc ? (
        <div style={{ padding: "1rem" }}>
          {" "}
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </div>
      ) : (
        <div className="listChatCard">
          {searchingStatus ? (
            userSearched?.length != 0 ? (
              <>
                <p>Tìm kiếm bằng gmail: </p>
                {userSearched?.map((val) => {
                  return <UserSearchCard u={val} />;
                })}
              </>
            ) : (
              <div className="blockNotResult">
                <img src={searchIcon} />
                <p>
                  không tìm thấy kết quả <br /> vui lòng thử lại từ khóa khác
                </p>
              </div>
            )
          ) : (
            <React.Fragment>
              <p>Tìm kiếm gần đây</p>
              {searchedUsers ? (
                searchedUsers?.map((u) => {
                  return <UserSearchCard u={u} />;
                })
              ) : (
                <p style={{ fontWeight: "500" }}>
                  Không có tìm kiếm nào gần đây
                </p>
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchList;
