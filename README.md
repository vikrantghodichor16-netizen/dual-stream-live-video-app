# Dual-Stream Live Video Application

## Project Overview

This project is a real-time dual-stream video application built using WebRTC and Socket.IO.

The application captures:

* Webcam Stream
* Screen Share Stream

and sends them to a separate Host Dashboard with low latency.

---

## Technologies Used

* React.js
* Vite
* Node.js
* Express.js
* Socket.IO
* WebRTC

---

## Features

* Real-time webcam streaming
* Real-time screen sharing
* Host dashboard for receiving streams
* Peer-to-peer communication using WebRTC
* Socket.IO signaling server
* Live timestamp overlay on video stream

---

## Project Structure

* client → React frontend
* server → Node.js backend

---

## How to Run

### Backend

```bash
cd server
npm install
node index.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Routes

* /client → Client streaming page
* /host → Host dashboard

---

## Author

Vikrant Ghodichor
