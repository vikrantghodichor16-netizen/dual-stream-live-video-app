# Methodology & Challenges

## Project Overview

The goal of this project was to build a real-time dual-stream live video application capable of transmitting both webcam and screen-share streams from a client interface to a separate host dashboard with minimal latency.

The application was built using WebRTC for peer-to-peer media streaming and Socket.IO for signaling communication.

---

# Architecture Choice

## Why WebRTC?

WebRTC was selected because it provides:

- Real-time peer-to-peer communication
- Low latency media streaming
- Built-in browser support
- Efficient media transfer without routing video through the backend server

This makes WebRTC ideal for applications such as Zoom, Google Meet, and live collaboration systems.

---

## Why Socket.IO?

Socket.IO was used as the signaling mechanism because WebRTC itself cannot establish initial peer connections.

Socket.IO helps exchange:

- SDP Offers
- SDP Answers
- ICE Candidates

between the client and host.

---

## Backend Architecture

The backend was built using:

- Node.js
- Express.js
- Socket.IO

The backend acts only as a signaling server and does not process video streams directly.

This architecture reduces backend load and minimizes streaming latency.

---

# Streaming Workflow

1. Client captures:
   - Webcam stream
   - Screen-share stream

2. Timestamp overlay is added using:
   - HTML Canvas API
   - canvas.captureStream()

3. Streams are added into:
   - RTCPeerConnection

4. Socket.IO exchanges:
   - Offer
   - Answer
   - ICE Candidates

5. Direct WebRTC connection is established.

6. Host dashboard receives and displays streams.

---

# Timestamp Overlay Logic

A live digital clock was added using:

- HTML Canvas
- requestAnimationFrame()

Each video frame is continuously drawn onto the canvas along with the current system time.

The canvas stream is then transmitted instead of the raw media stream.

---

# Challenges Faced

## 1. WebRTC Peer Connection Issues

Initially, the peer connection object was resetting during React re-renders.

### Solution

The issue was solved using:

```js
useRef()
```

to persist the RTCPeerConnection instance.

---

## 2. ICE Candidate Synchronization

There were issues in establishing peer-to-peer communication because ICE candidates were not exchanged correctly.

### Solution

Socket.IO signaling events were implemented carefully for both:
- sending candidates
- receiving candidates

---

## 3. Timestamp Rendering

Adding a live timestamp directly into the outgoing stream was difficult.

### Solution

Canvas API was used to draw:
- video frames
- live clock

before converting the canvas into a media stream.

---

## 4. Multiple Stream Handling

Handling webcam and screen-share simultaneously required separate track management.

### Solution

Tracks from both streams were added individually into the same peer connection.

---

# Final Outcome

The application successfully:

- Captures webcam and screen-share simultaneously
- Streams media in real time
- Displays streams on a separate host dashboard
- Adds live timestamp overlay
- Uses low-latency WebRTC communication

---

# Technologies Used

Frontend:
- React
- Vite
- WebRTC
- Socket.IO Client

Backend:
- Node.js
- Express.js
- Socket.IO

---

# Author

Vikrant Ghodichor