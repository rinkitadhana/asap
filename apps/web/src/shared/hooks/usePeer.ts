import { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { useSocket } from "@/shared/context/socket";
import { useParams } from "next/navigation";

const usePeer = () => {
  const socket = useSocket();
  const params = useParams();
  const roomId = params.roomId as string;
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myId, setMyId] = useState("");
  const isPeerSet = useRef(false);

  useEffect(() => {
    console.log("usePeer - roomId from params:", roomId);
    console.log("usePeer - socket available:", !!socket);
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;
    (async function initPeer() {
      const myPeer = new (await import("peerjs")).default();
      setPeer(myPeer);

      myPeer.on("open", (id) => {
        console.log("My peer ID is: ", id);
        console.log(
          "Emitting join-room event for roomId:",
          roomId,
          "userId:",
          id,
        );
        setMyId(id);
        socket?.emit("join-room", roomId, id);
      });
    })();
  }, [roomId, socket]);

  return { peer, myId };
};

export default usePeer;
