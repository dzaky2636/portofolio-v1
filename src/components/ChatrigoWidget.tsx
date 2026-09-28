"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    chatrigoSettings?: { position: string; type: string };
    chatrigoSDK?: {
      run: (config: {
        websiteToken: string;
        businessId: string;
        baseUrl: string;
        apiUrl: string;
      }) => void;
    };
  }
}

function getChatrigoConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_CHATRIGO_BASE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_CHATRIGO_API_URL;
  const websiteToken = process.env.NEXT_PUBLIC_CHATRIGO_WEBSITE_TOKEN;
  const businessId = process.env.NEXT_PUBLIC_CHATRIGO_BUSINESS_ID;

  if (!baseUrl || !apiUrl || !websiteToken || !businessId) {
    return null;
  }

  return {
    baseUrl,
    apiUrl,
    websiteToken,
    businessId,
    position: process.env.NEXT_PUBLIC_CHATRIGO_POSITION ?? "right",
    type: process.env.NEXT_PUBLIC_CHATRIGO_TYPE ?? "standard",
  };
}

export default function ChatrigoWidget() {
  useEffect(() => {
    const config = getChatrigoConfig();
    if (!config) return;

    window.chatrigoSettings = {
      position: config.position,
      type: config.type,
    };

    const script = document.createElement("script");
    script.src = `${config.baseUrl}/widget.js`;
    script.async = true;
    script.onload = () => {
      window.chatrigoSDK?.run({
        websiteToken: config.websiteToken,
        businessId: config.businessId,
        baseUrl: config.baseUrl,
        apiUrl: config.apiUrl,
      });
    };

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
