# Multi-Agent Chat

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture Diagram](#architecture-diagram)
- [Technical Decisions & Reasoning](#technical-decisions--reasoning)
- [Process & Task Approach](#process--task-approach)
- [Installation](#installation)
- [Setup & Configuration](#setup--configuration)
- [Usage](#usage)
- [Examples](#examples)

## Overview

This project implements a multi-agent chat interface using the OpenAI Agents SDK. The system allows users to interact with a set of specialized agents through a chat interface built with Next.js and TypeScript. Each agent has a dedicated role, such as input classification, database interaction, or general finance knowledge, and messages are routed accordingly.

## Features

- Three predefined users selectable from a dropdown menu in the chat UI (e.g., alice@example.com)
- Chat interface built with Next.js and React (v0 UI)
- Multi-agent architecture using OpenAI Agents SDK
- Input Guardrail Agent to filter finance-related prompts
- Orchestrator Agent to coordinate responses
- DB Agent integrated with Prisma to retrieve user-specific data
- General Finance Agent for static finance Q&A
- Backend communication using tRPC
- User model stored in a PostgreSQL database via Prisma

## Multi-Agent Architecture Diagram

<p align="center">
  <img src="./public/agentArchitecture.svg" alt="Agent Architecture Diagram" style="max-width: 600px; width: 60%;" />
</p>

## Technical Decisions & Reasoning

### Backend and Agent Architecture

The backend uses `tRPC` for fully typesafe API communication and `Prisma` as the ORM. The core logic for handling messages is built around a modular multi-agent architecture using the OpenAI Agents SDK. Here's how each agent contributes:

- **Input Guardrail Agent**: This is the first filter. It determines whether a message is finance-related. If it’s not, the system routes the input to a fallback general-purpose agent.

- **Orchestrator Agent**: If the input is finance-related, the Orchestrator classifies the intent of the question as either user-specific (`DB`) or general finance (`FINANCE`) and routes accordingly.

- **DB Agent**: Uses a `FunctionTool` to query the Prisma-managed SQLite database. It fetches user information (e.g., name, profile) securely using the user’s email.

- **Finance Agent**: Answers general finance questions such as “What is inflation?” or “How do credit cards work?” without accessing user-specific data.

- **General Agent**: Handles non-financial queries when the guardrail rejects the input. It serves as a fallback for unrelated or casual inputs.

The routing and execution trace is logged and displayed in the chat UI, enhancing transparency and debugging.

- **Next.js with TypeScript**: Chosen for ease of building full-stack applications with modern React features.
- **tRPC**: Enables type-safe, end-to-end communication between frontend and backend.
- **Prisma**: Provides a type-safe and flexible ORM to manage the User model. For demo purposes, SQLite was used as the database to simplify local setup and testing.
- **OpenAI Agents SDK**: Abstracts the complexity of managing multi-agent logic and message routing.
- **Agent design**: Modularity of agents allows for separation of concerns and easier scalability.

## Process & Task Approach

1. Initialized project with Next.js and configured TypeScript and ESLint.
2. Set up Prisma schema and database connection.
3. Built basic tRPC backend and defined User procedures.
4. Created chat interface with message send/receive support.
5. Implemented Input Guardrail Agent to classify prompts.
6. Developed Orchestrator Agent to route messages to:
   - DB Agent: Fetch user data from the Prisma DB.
   - General Finance Agent: Answer common finance questions.
7. Connected all parts through the tRPC API and validated agent routing.

## Installation

```bash
npm install
```

## Setup & Configuration

1. Create a `.env` file with the following environment variables:

```
DATABASE_URL=file:./prisma/dev.db
OPENAI_API_KEY=sk-...
```

2. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Usage

To run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the app.

## Examples

### Example 1:

**Prompt:** What is compound interest?
**Response:** Compound interest is the interest calculated on the initial principal as well as on the accumulated interest of previous periods. In other words,... (Processing path: InputGuardrail → Orchestrator → FinanceAgent)

### Example 2:

**Prompt:** show me my account info
**Response:** The user with the email "alice@example.com" is named Alice and her profile is Data Scientist. (Processing path: InputGuardrail → Orchestrator → DBAgent)

### Example 3:

**Prompt:** What are the latest stock prices?
**Response:** I'm unable to provide real-time stock prices as they constantly fluctuate during trading hours. It's best to check a reliable financial news website or use a stock market app for the latest stock prices. (Processing path: InputGuardrail → Orchestrator → FinanceAgent)

### Example 4:

**Prompt:** Hi, how are you?
**Response:** Hello! I'm just a computer program, so I don't have feelings, but I'm here and ready to help you. How can I assist you today? (Processing path: InputGuardrail → GeneralAgent)
