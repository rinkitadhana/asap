# Asap

Asap is a high-quality, browser-based video calling and recording platform built for content creators, podcasters, and remote teams.  
It allows users to host, record, and collaborate in real time with locally captured, cloud-synced recordings that maintain studio-level quality.

---

## Overview

Asap focuses on solving one major problem with most video conferencing tools — poor recording quality.  
Instead of recording compressed internet streams, Asap records video and audio directly on each participant’s device, uploads it in chunks to the cloud, and automatically merges the final output for high-quality results.

The platform provides a modern, easy-to-use interface for hosting meetings, recording sessions, and managing all your content in one place.

---

## Features

### Core Features
- High-quality video calls powered by WebRTC (PeerJS)
- Real-time chat using Socket.IO
- Local video and audio recording with chunked uploads
- Cloud storage for finalized recordings
- Simple Google OAuth authentication
- Dashboard with recent meetings and recordings
- Pre-join screen for device testing and name setup
- Profile management (name, avatar, preferences)

### Additional Capabilities
- Screen sharing
- Meeting invite links and access codes
- Recording status tracking (uploading, processing, ready)
- Basic activity logs and past meeting history

---

## Technology Stack

| Area | Technology |
|-------|-------------|
| Frontend | Next.js, TypeScript, Tailwind CSS, Framer Motion |
| State Management | Zustand, TanStack Query |
| Backend | Express (Bun runtime), TypeScript |
| Database | PostgreSQL with Prisma ORM |
| Realtime | PeerJS (WebRTC), Socket.IO |
| Authentication | Google OAuth 2.0 |
| Storage | Cloud (AWS S3 or Supabase) |
| Deployment | Vercel (frontend), Fly.io or Railway (backend) |

---

## Architecture

1. **Frontend (Next.js)**  
   Handles the UI, authentication, dashboard, video calling, and communication with the backend.

2. **Backend (Express with Bun)**  
   Provides REST APIs for authentication, meetings, recordings, and uploads. Manages real-time connections for chat and peer signaling.

3. **Database (PostgreSQL)**  
   Stores users, meetings, participants, recordings, and chat messages using Prisma as the ORM.

4. **Storage Layer**  
   Stores uploaded recording chunks and final merged files on a cloud storage provider.

5. **WebRTC Layer**  
   Handles peer-to-peer media streaming using PeerJS for low-latency communication.

6. **Socket Layer**  
   Manages real-time chat, presence, and room events via Socket.IO.

---

## Use Cases

- Podcast recording with multiple remote guests  
- Video interviews and remote content production  
- Marketing or social media video creation  
- Educational lessons or webinars  
- Remote meetings that require high-quality recordings  

---

## Roadmap

**MVP**
- Google OAuth authentication  
- Dashboard with meeting creation and join options  
- Video calling interface with recording and chat  
- Chunked recording uploads  
- Recording management (view, playback, download)

**Next Versions**
- Multi-track recording per participant  
- AI-based transcription and summarization  
- Clip generation and editing tools  
- Team and workspace collaboration  
- Live streaming integrations  

---

## Vision

Asap aims to make remote content creation as seamless and high-quality as in-person production.  
It empowers creators, teams, and professionals to capture, manage, and publish video content effortlessly from anywhere.

---

## License

All rights reserved.  
This project is currently under active development and not yet open for public contribution.
