'use client'

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  //  Fetch balance function (can call manually)
  const fetchBalance = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      setLoading(true);
      const res = await api.get(`Wb/get_wallet?user_id=${user.id}`);

      if (res.data?.status === 0) {
        setBalance(res.data?.data?.wallet_balance || 0);
      }
    } catch (err) {
      console.error("Wallet fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  //  Auto refresh every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchBalance(); // initial fetch

    const interval = setInterval(() => {
      fetchBalance();
    }, 10000); // 10 sec

    return () => clearInterval(interval);
  }, [fetchBalance, isAuthenticated]);

  return (
    <WalletContext.Provider
      value={{
        balance,
        loading,
        refreshWallet: fetchBalance, //  manual refresh
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};