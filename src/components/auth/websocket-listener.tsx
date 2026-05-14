"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ACCOUNT_LOCKED_EVENT } from "@/components/locked-account-modal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const WS_URL = `${API_BASE_URL}/ws`;

export default function WebSocketListener() {
  const { profile, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only connect if user is logged in
    if (!isAuthenticated || !profile) return;

    console.log(`[WebSocket] Initiating connection to ${WS_URL} for user ${profile.id}`);

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (msg) => {
        // Only log in development
        if (process.env.NODE_ENV === "development") {
          console.log("[WebSocket Debug]", msg);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (_frame) => {
      console.log("[WebSocket] Connected successfully");

      // Subscribe to user-specific status updates
      const topic = `/topic/user-${profile.id}`;
      console.log(`[WebSocket] Subscribing to ${topic}`);

      stompClient.subscribe(topic, (message) => {
        console.log("[WebSocket] Message received:", message.body);
        if (message.body === "ACCOUNT_LOCKED") {
          console.warn("[WebSocket] ACCOUNT_LOCKED signal received!");
          window.dispatchEvent(new CustomEvent(ACCOUNT_LOCKED_EVENT));
        }
      });
    };

    stompClient.onStompError = (_frame) => {
      console.error("[WebSocket] Broker reported error:", _frame.headers["message"]);
      console.error("[WebSocket] Additional details:", _frame.body);
    };

    stompClient.onWebSocketClose = () => {
      console.log("[WebSocket] Connection closed");
    };

    stompClient.activate();

    return () => {
      console.log("[WebSocket] Deactivating connection");
      stompClient.deactivate();
    };
  }, [isAuthenticated, profile]);

  return null;
}
