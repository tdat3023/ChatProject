import io from "socket.io-client";

export let socket;

export function init() {
  return (socket = io("https://13.228.206.211", {
    transports: ["websocket"],
  }));
}
