import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Copy, Loader2, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_SOL_GAS_ADDRESS = "GasF33addr9xNovaChainSo1DefauLt1111111111";

interface Props {
  username: string;
  onClose: () => void;
}

export default function ClaimAirdropModal({ username, onClose }: Props) {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(() => {
    try {
      return !!localStorage.getItem("novachain_claim");
    } catch {
      return false;
    }
  });
  const [walletError, setWalletError] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleClaim = async () => {
    if (!walletAddress.trim()) {
      setWalletError("Please enter your wallet address");
      return;
    }
    if (walletAddress.trim().length < 20) {
      setWalletError("Invalid wallet address");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    const claimData = {
      solGasAddress: DEFAULT_SOL_GAS_ADDRESS,
      memo: username,
      walletAddress: walletAddress.trim(),
      timestamp: Date.now(),
    };
    localStorage.setItem("novachain_claim", JSON.stringify(claimData));
    setClaimed(true);
    toast.success("Airdrop claimed! 🎉 Tokens will be sent within 24h.");
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <dialog
      open
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent border-0 max-w-none w-full h-full"
      style={{
        background: "rgba(7,11,18,0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleBackdropKeyDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3 }}
        data-ocid="claim.modal"
        className="glass-card rounded-3xl p-8 w-full max-w-md border-nova-cyan/20 shadow-glass relative"
      >
        <button
          type="button"
          onClick={onClose}
          data-ocid="claim.close_button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nova-cyan to-nova-purple flex items-center justify-center neon-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wide text-foreground">
              Claim Your Airdrop
            </h2>
            <p className="text-xs text-muted-foreground">
              Fill in details to receive your $NOVA tokens
            </p>
          </div>
        </div>

        {claimed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="claim.success_state"
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="w-20 h-20 rounded-full bg-nova-cyan/15 border-2 border-nova-cyan neon-glow flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-nova-cyan" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-foreground mb-2">
                Airdrop Claimed! 🎉
              </h3>
              <p className="text-sm text-muted-foreground">
                Your $NOVA tokens will be sent to your wallet within 24 hours.
              </p>
            </div>
            <div className="w-full glass-card rounded-xl p-4 border-nova-cyan/15">
              <p className="text-xs text-muted-foreground mb-1">
                Memo (your username)
              </p>
              <p className="text-sm font-bold text-nova-cyan">{username}</p>
            </div>
            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-nova-cyan text-nova-dark font-black text-sm tracking-widest uppercase rounded-xl"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                SOL Address for Gas Fee
              </Label>
              <div className="relative">
                <Input
                  data-ocid="claim.sol_address.input"
                  value={DEFAULT_SOL_GAS_ADDRESS}
                  readOnly
                  className="bg-muted/30 border-border rounded-xl text-muted-foreground font-mono text-xs pr-10 cursor-default"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(DEFAULT_SOL_GAS_ADDRESS)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-nova-cyan transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Default SOL address pre-filled for gas fee
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Memo
              </Label>
              <div className="relative">
                <Input
                  data-ocid="claim.memo.input"
                  value={username}
                  readOnly
                  className="bg-muted/30 border-border rounded-xl text-nova-cyan font-semibold cursor-default pr-10"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(username)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-nova-cyan transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Your username is used as memo for gas fee confirmation
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Your Wallet Address to Receive Tokens
              </Label>
              <Input
                data-ocid="claim.wallet_address.input"
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                  setWalletError("");
                }}
                placeholder="Enter your wallet address"
                className="bg-muted/50 border-border focus:border-nova-cyan rounded-xl text-foreground placeholder:text-muted-foreground font-mono text-xs"
              />
              {walletError && (
                <span
                  data-ocid="claim.wallet_error"
                  className="text-xs text-destructive"
                >
                  {walletError}
                </span>
              )}
            </div>

            <div className="glass-card rounded-xl p-4 border-nova-cyan/10 bg-nova-cyan/5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ⚡ You will receive{" "}
                <span className="text-nova-cyan font-bold">1,000 $NOVA</span>{" "}
                tokens as airdrop reward. Make sure your wallet supports SPL
                tokens on Solana.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleClaim}
              disabled={loading}
              data-ocid="claim.submit_button"
              className="w-full bg-nova-cyan text-nova-dark font-black text-sm tracking-widest uppercase rounded-xl py-6 neon-glow hover:bg-nova-cyan/90 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Processing..." : "Claim Airdrop"}
            </Button>
          </div>
        )}
      </motion.div>
    </dialog>
  );
}
