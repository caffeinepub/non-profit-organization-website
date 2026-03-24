import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface WalletState {
  address: string;
  walletType: "metamask" | "phantom" | "trust";
}

function truncate(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const STORAGE_KEY = "novachain_wallet";

function MetaMaskIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl">
      🦊
    </div>
  );
}

function PhantomIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="w-6 h-6"
        role="img"
        aria-label="Phantom wallet"
      >
        <circle cx="20" cy="20" r="20" fill="#AB9FF2" />
        <path
          d="M20 8C13.37 8 8 13.37 8 20s5.37 12 12 12 12-5.37 12-12S26.63 8 20 8zm0 4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 17c-3.31 0-6.24-1.69-8-4.26.04-2.65 5.34-4.11 8-4.11 2.65 0 7.96 1.46 8 4.11C26.24 27.31 23.31 29 20 29z"
          fill="white"
        />
      </svg>
    </div>
  );
}

function TrustIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="w-7 h-7"
        role="img"
        aria-label="Trust Wallet"
      >
        <path
          d="M20 4L7 9v9c0 7.18 5.59 13.9 13 15.93C27.41 31.9 33 25.18 33 18V9L20 4z"
          fill="#3375BB"
        />
        <path
          d="M17 20.5l-3-3-1.5 1.5 4.5 4.5 9-9-1.5-1.5-7.5 7.5z"
          fill="white"
        />
      </svg>
    </div>
  );
}

interface ConnectWalletModalProps {
  onClose: () => void;
  onConnected?: (address: string, walletType: string) => void;
}

export default function ConnectWalletModal({
  onClose,
  onConnected,
}: ConnectWalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<WalletState | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const saveWallet = (
    address: string,
    walletType: WalletState["walletType"],
  ) => {
    const state: WalletState = { address, walletType };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setConnected(state);
    onConnected?.(address, walletType);
  };

  const disconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConnected(null);
  };

  const connectMetaMask = async () => {
    setError(null);
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    try {
      setConnecting("metamask");
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts?.[0]) saveWallet(accounts[0], "metamask");
    } catch {
      setError("MetaMask connection cancelled or failed.");
    } finally {
      setConnecting(null);
    }
  };

  const connectPhantom = async () => {
    setError(null);
    if (!window.solana?.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }
    try {
      setConnecting("phantom");
      const resp = await window.solana.connect();
      saveWallet(resp.publicKey.toString(), "phantom");
    } catch {
      setError("Phantom connection cancelled or failed.");
    } finally {
      setConnecting(null);
    }
  };

  const connectTrust = async () => {
    setError(null);
    const trustProvider =
      window.trustwallet || (window.ethereum?.isTrust ? window.ethereum : null);
    if (!trustProvider) {
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `trust://open_url?coin_id=60&url=${encodeURIComponent(window.location.href)}`;
      } else {
        window.open("https://trustwallet.com/download", "_blank");
      }
      return;
    }
    try {
      setConnecting("trust");
      const accounts = (await trustProvider.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts?.[0]) saveWallet(accounts[0], "trust");
    } catch {
      setError("Trust Wallet connection cancelled or failed.");
    } finally {
      setConnecting(null);
    }
  };

  const wallets = [
    {
      id: "metamask",
      name: "MetaMask",
      desc: "Connect using browser or mobile app",
      icon: <MetaMaskIcon />,
      onClick: connectMetaMask,
    },
    {
      id: "phantom",
      name: "Phantom",
      desc: "Solana & multi-chain wallet",
      icon: <PhantomIcon />,
      onClick: connectPhantom,
    },
    {
      id: "trust",
      name: "Trust Wallet",
      desc: "Multi-asset crypto wallet",
      icon: <TrustIcon />,
      onClick: connectTrust,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-ocid="wallet.modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass-card rounded-3xl p-6 w-full max-w-sm border-nova-cyan/20 shadow-glass"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest gradient-text">
              Connect Wallet
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred wallet
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="wallet.close_button"
            className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {connected ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              <div className="glass-card rounded-2xl p-5 border-nova-cyan/20 neon-glow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-nova-cyan animate-pulse-glow" />
                  <span className="text-xs font-semibold text-nova-cyan uppercase tracking-widest">
                    Connected
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground font-mono">
                  {truncate(connected.address)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  via{" "}
                  {connected.walletType === "trust"
                    ? "Trust Wallet"
                    : connected.walletType}
                </p>
              </div>
              <Button
                type="button"
                onClick={disconnect}
                data-ocid="wallet.disconnect_button"
                className="w-full bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30 font-bold text-xs tracking-widest uppercase rounded-full transition-all"
              >
                Disconnect Wallet
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              {wallets.map((wallet) => (
                <motion.button
                  key={wallet.id}
                  type="button"
                  onClick={wallet.onClick}
                  disabled={connecting !== null}
                  data-ocid={`wallet.${wallet.id}.button`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full glass-card rounded-2xl p-4 border-nova-cyan/10 hover:border-nova-cyan/30 transition-all flex items-center gap-4 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {wallet.icon}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-nova-cyan transition-colors">
                      {wallet.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {wallet.desc}
                    </p>
                  </div>
                  {connecting === wallet.id ? (
                    <div className="w-4 h-4 border-2 border-nova-cyan/30 border-t-nova-cyan rounded-full animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-nova-cyan/20 flex items-center justify-center group-hover:border-nova-cyan/50 transition-all">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-nova-cyan transition-all" />
                    </div>
                  )}
                </motion.button>
              ))}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-ocid="wallet.error_state"
                  className="text-xs text-destructive text-center pt-1"
                >
                  {error}
                </motion.p>
              )}

              <p className="text-[10px] text-muted-foreground text-center pt-2">
                By connecting, you agree to our Terms of Service
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
