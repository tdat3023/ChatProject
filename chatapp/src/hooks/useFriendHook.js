import friendApi from "../api/friendApi";
const useFriendHook = () => {
  // const [statusFriend, setStatusFriend] = useState(null);
  const featchAddFriend = async (userId, freId) => {
    try {
      return await friendApi.sendInvite(userId, freId);
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error);
    }
  };

  const featchStatusFriend = async (userId, freId) => {
    try {
      const response = await friendApi.checkStatus(userId, freId);

      console.log(response);
    } catch (error) {
      console.log("Failed to fetch conversation list: ", error);
    }
  };

  return {
    featchAddFriend: featchAddFriend,
    featchStatusFriend: featchStatusFriend,
  };
};

export default useFriendHook;
