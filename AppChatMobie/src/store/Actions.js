//actions

export const SET_ISSIGNEDIN = "set_isSignedIn";
export const SET_USER = "set_User";
export const SET_USERSEARCHED = "set_UserSearch";
export const SET_SHOWDIALOG = "set_Dialog";
export const SET_SHOWUPDATEFORM = "set_ShowUpdateForm";
export const SET_SHOWALERT = "set_ShowAlert";
export const SET_SHOWTABHISTORYSEARH = "set_ShowTabHistorySearch";
export const SET_LOADINGSEARCHFUNC = "set_LoadingSearchFunc";
export const SET_SEARCHINGSTATUS = "set_SearchStatus";
export const SET_SHOWTABINFO = "set_ShowTabInfo";
export const SET_INDEXTAB = "set_IndexTab";
export const SET_USERCHATTING = "set_UserChatting";
export const SET_SEARCHEDUSERS = "set_SearchUsers";
export const SET_IDCONVERSATION = "set_IdConversation";
export const SET_SOCKET = "set_Socket";

export const SetIsSignedIn = (payload) => {
  return {
    type: SET_ISSIGNEDIN,
    payload,
  };
};

export const SetIndexTab = (payload) => {
  return {
    type: SET_INDEXTAB,
    payload,
  };
};

export const SetShowTabInfo = (payload) => {
  return {
    type: SET_SHOWTABINFO,
    payload,
  };
};

export const SetUser = (payload) => {
  return {
    type: SET_USER,
    payload,
  };
};
export const SetUserSearched = (payload) => {
  return {
    type: SET_USERSEARCHED,
    payload,
  };
};
export const SetDialogShow = (payload) => {
  return {
    type: SET_SHOWDIALOG,
    payload,
  };
};
export const SetShowUpdateForm = (payload) => {
  return {
    type: SET_SHOWUPDATEFORM,
    payload,
  };
};

export const SetShowALert = (payload) => {
  return {
    type: SET_SHOWALERT,
    payload,
  };
};

export const SetShowTabHistorySearch = (payload) => {
  return {
    type: SET_SHOWTABHISTORYSEARH,
    payload,
  };
};

export const SetLoadingSearchFunc = (payload) => {
  return {
    type: SET_LOADINGSEARCHFUNC,
    payload,
  };
};

export const SetSearchingStatus = (payload) => {
  return {
    type: SET_SEARCHINGSTATUS,
    payload,
  };
};
export const SetUserChatting = (payload) => {
  return {
    type: SET_USERCHATTING,
    payload,
  };
};

export const SetSearchedUser = (payload) => {
  return {
    type: SET_SEARCHEDUSERS,
    payload,
  };
};

export const SetIdConversation = (payload) => {
  return {
    type: SET_IDCONVERSATION,
    payload,
  };
};
export const SetSocket = (payload) => {
  return {
    type: SET_SOCKET,
    payload,
  };
};
