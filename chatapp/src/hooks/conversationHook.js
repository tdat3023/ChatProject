import { useState } from "react";
import conversationApi from "../api/conversationApi";
const conversationHook = () => {
  //call api add member into group
  const addMemberIntoGroup = async (
    idConversation,
    idUserWillAddMember,
    idListMember
  ) => {
    try {
      const response = await conversationApi.addMember(
        idConversation,
        idUserWillAddMember,
        idListMember
      );

      console.log("add member thanh cong" + response);
    } catch (error) {
      console.log("Failed to add member: ", error);
    }
  };

  return {
    addMemberIntoGroup: addMemberIntoGroup,
  };
};

export default conversationHook;
