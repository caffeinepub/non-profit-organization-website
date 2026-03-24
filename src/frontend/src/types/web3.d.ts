interface EthereumProvider {
  isMetaMask?: boolean;
  isTrust?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  selectedAddress?: string | null;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
}

interface SolanaProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  publicKey?: { toString: () => string } | null;
}

interface TrustWalletProvider {
  isTrustWallet?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  selectedAddress?: string | null;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    solana?: SolanaProvider;
    trustwallet?: TrustWalletProvider;
  }
}

export {};
