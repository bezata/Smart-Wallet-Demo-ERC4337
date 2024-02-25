import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface UserBalance {
  formatted: string;
  symbol: string;
}

interface BiconomyContextType {
  saAddress: string; // Renamed for clarity
  setSmartAddress: Dispatch<SetStateAction<string>>; // Ensure this is correct
  setUserBalance: Dispatch<SetStateAction<UserBalance>>;
}

const BiconomyContext = createContext<BiconomyContextType | undefined>(
  undefined
);

export const useBiconomy = () => {
  const context = useContext(BiconomyContext);
  if (context === undefined) {
    throw new Error("useBiconomy must be used within a BiconomyProvider");
  }
  return context;
};

export const BiconomyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [saAddress, setSmartAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<UserBalance>({
    formatted: "",
    symbol: "",
  });

  const value = { saAddress, setSmartAddress, userBalance, setUserBalance };

  return (
    <BiconomyContext.Provider value={value}>
      {children}
    </BiconomyContext.Provider>
  );
};
