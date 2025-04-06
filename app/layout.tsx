// app/layout.tsx

import "./globals.css";
import { ReactNode } from "react";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export const metadata = {
  title: "BaseBall MiniApp",
  description: "Arkanoid x Base x Farcaster",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniKitProvider
          projectId="your-project-id" // à mettre plus tard
          notificationProxyUrl="/api/notification"
        >
          {children}
        </MiniKitProvider>
      </body>
    </html>
  );
}
