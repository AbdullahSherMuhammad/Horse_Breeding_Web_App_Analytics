'use client';

import { Provider } from "react-redux";
import { store } from "@/app/Store/store";

interface ProviderWrapperProps {
  children: React.ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ProviderWrapper;
