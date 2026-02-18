import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export const metadata = {
  title: "LUXE — Premium Curations",
  description: "Experience the pinnacle of luxury shopping.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en">
      <body>
        <Providers clientId={googleClientId}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
