import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Blog Management System",
  description: "Full-stack blog with authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
