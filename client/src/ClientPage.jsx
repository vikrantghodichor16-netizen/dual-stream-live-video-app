import { useRef } from "react";
import { socket } from "./Socket.js";

function ClientPage() {
  const webcamRef = useRef(null);
  const screenRef = useRef(null);
  const peerConnection = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const addTimestamp = (stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    video.play();

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;

    const ctx = canvas.getContext("2d");

    function draw() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const time = new Date().toLocaleTimeString("en-GB");

      ctx.font = "40px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(time, 30, 60);

      requestAnimationFrame(draw);
    }

    draw();

    return canvas.captureStream(30);
  };

  const startStreaming = async () => {
    socket.emit("join-room", "room1");

    peerConnection.current = new RTCPeerConnection(servers);

    const webcamStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const webcamWithTime = addTimestamp(webcamStream);
    const screenWithTime = addTimestamp(screenStream);

    webcamRef.current.srcObject = webcamWithTime;
    screenRef.current.srcObject = screenWithTime;

    webcamWithTime.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, webcamWithTime);
    });

    screenWithTime.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, screenWithTime);
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId: "room1",
          candidate: event.candidate,
        });
      }
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("offer", {
      roomId: "room1",
      offer,
    });

    socket.on("answer", async (data) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
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
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Client Page</h1>

      <button onClick={startStreaming}>Start Streaming</button>

      <h2>Webcam With Timestamp</h2>
      <video
        ref={webcamRef}
        autoPlay
        playsInline
        muted
        width="500"
        style={{ border: "2px solid black" }}
      />

      <h2>Screen Share With Timestamp</h2>
      <video
        ref={screenRef}
        autoPlay
        playsInline
        muted
        width="500"
        style={{ border: "2px solid blue" }}
      />
    </div>
  );
}

export default ClientPage;