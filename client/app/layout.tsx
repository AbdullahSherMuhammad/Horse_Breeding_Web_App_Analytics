import "./globals.css";
import ProviderWrapper from "./ProviderWrapper"; 

export const metadata = {
  title: "Alendis Horse Breeding - Dashboard",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
