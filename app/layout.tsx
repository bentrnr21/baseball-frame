import "./globals.css";
import { ReactNode } from "react";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export const metadata = {
  title: "BaseBall MiniApp",
  description: "Arkanoid × Base × Farcaster",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniKitProvider
          projectId="your-project-id" // à remplacer plus tard si besoin
          notificationProxyUrl="/api/notification"
          chain="base-mainnet"
        >
          {children}
        </MiniKitProvider>
      </body>
    </html>
  );
}
