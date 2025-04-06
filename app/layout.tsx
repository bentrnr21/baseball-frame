import "./globals.css";
import { ReactNode } from "react";
import { baseSepolia } from "viem/chains";
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
          chain={baseSepolia}
          projectId="your-project-id" // à remplacer plus tard
          notificationProxyUrl="/api/notification"
        >
          {children}
        </MiniKitProvider>
      </body>
    </html>
  );
}
