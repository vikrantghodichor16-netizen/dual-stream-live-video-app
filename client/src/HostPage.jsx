import { useEffect, useRef } from "react";
import { socket } from "./Socket.js";

function HostPage() {
  const webcamRef = useRef(null);
  const screenRef = useRef(null);
  const peerConnection = useRef(null);
  const streamCount = useRef(0);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    socket.emit("join-room", "room1");

    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.ontrack = (event) => {
      streamCount.current += 1;

      if (streamCount.current === 1) {
        webcamRef.current.srcObject = event.streams[0];
      } else {
        screenRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId: "room1",
          candidate: event.candidate,
        });
      }
    };

    socket.on("offer", async (data) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", {
        roomId: "room1",
        answer,
      });
    });

    socket.on("ice-candidate", async (data) => {
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Host Dashboard</h1>

      <h2>Received Webcam Stream</h2>
      <video
        ref={webcamRef}
        autoPlay
        playsInline
        width="500"
        style={{ border: "3px solid green" }}
      />

      <h2>Received Screen Share Stream</h2>
      <video
        ref={screenRef}
        autoPlay
        playsInline
        width="500"
        style={{ border: "3px solid blue" }}
      />
    </div>
  );
}

export default HostPage;