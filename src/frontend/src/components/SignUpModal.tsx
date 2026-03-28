import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy, Loader2, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Myanmar",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Venezuela",
  "Vietnam",
  "Zimbabwe",
];

interface UserData {
  username: string;
  email: string;
  country: string;
  signedUp: boolean;
}

interface Props {
  onClose: () => void;
  onSuccess: (data: UserData) => void;
}

export default function SignUpModal({ onClose, onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [referredBy, setReferredBy] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = "Username is required";
    else if (username.length < 3) e.username = "Min 3 characters";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) e.email = "Invalid email";
    if (!country) e.country = "Please select your country";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const code =
      username.trim().toUpperCase().slice(0, 4) +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    setReferralCode(code);
    setShowReferral(true);
    toast.success("Welcome to EV Energy! 🚀");
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
        data-ocid="signup.modal"
        className="glass-card rounded-3xl p-8 w-full max-w-md border-nova-cyan/20 shadow-glass relative"
      >
        <button
          type="button"
          onClick={onClose}
          data-ocid="signup.close_button"
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
              Sign Up to EV Energy
            </h2>
            <p className="text-xs text-muted-foreground">
              Create your account to claim your airdrop
            </p>
          </div>
        </div>

        {showReferral ? (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-nova-cyan/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-nova-cyan" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-1">
                Account Created!
              </h3>
              <p className="text-sm text-muted-foreground">
                Your referral code is ready to share
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">
                Your Referral Code
              </Label>
              <div className="flex items-center gap-2">
                <div
                  data-ocid="signup.referral_code.panel"
                  className="flex-1 bg-nova-cyan/10 border border-nova-cyan/30 rounded-xl px-4 py-3 text-nova-cyan font-black text-lg tracking-widest text-center"
                >
                  {referralCode}
                </div>
                <Button
                  type="button"
                  data-ocid="signup.copy_referral.button"
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-12 h-12 rounded-xl bg-nova-cyan/20 hover:bg-nova-cyan/30 border border-nova-cyan/30 text-nova-cyan p-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Share this code with friends to earn bonus tokens!
              </p>
            </div>
            <Button
              type="button"
              data-ocid="signup.done.button"
              onClick={() => {
                onSuccess({
                  username: username.trim(),
                  email: email.trim(),
                  country,
                  signedUp: true,
                });
                onClose();
              }}
              className="w-full bg-nova-cyan text-nova-dark font-black text-sm tracking-widest uppercase rounded-xl py-6 neon-glow hover:bg-nova-cyan/90 transition-all"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Username
              </Label>
              <Input
                data-ocid="signup.username.input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((p) => ({ ...p, username: "" }));
                }}
                placeholder="e.g. crypto_ninja"
                className="bg-muted/50 border-border focus:border-nova-cyan rounded-xl text-foreground placeholder:text-muted-foreground"
              />
              {errors.username && (
                <span
                  data-ocid="signup.username_error"
                  className="text-xs text-destructive"
                >
                  {errors.username}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Email
              </Label>
              <Input
                data-ocid="signup.email.input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: "" }));
                }}
                placeholder="you@example.com"
                className="bg-muted/50 border-border focus:border-nova-cyan rounded-xl text-foreground placeholder:text-muted-foreground"
              />
              {errors.email && (
                <span
                  data-ocid="signup.email_error"
                  className="text-xs text-destructive"
                >
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Country
              </Label>
              <Select
                value={country}
                onValueChange={(v) => {
                  setCountry(v);
                  setErrors((p) => ({ ...p, country: "" }));
                }}
              >
                <SelectTrigger
                  data-ocid="signup.country.select"
                  className="bg-muted/50 border-border rounded-xl text-foreground"
                >
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-60">
                  {COUNTRIES.map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                      className="text-foreground hover:bg-muted"
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <span
                  data-ocid="signup.country_error"
                  className="text-xs text-destructive"
                >
                  {errors.country}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Referred By (Optional)
              </Label>
              <Input
                data-ocid="signup.referred_by.input"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                placeholder="Enter referral code"
                className="bg-muted/50 border-border focus:border-nova-cyan rounded-xl text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              data-ocid="signup.submit_button"
              className="w-full bg-nova-cyan text-nova-dark font-black text-sm tracking-widest uppercase rounded-xl py-6 neon-glow hover:bg-nova-cyan/90 transition-all mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <button type="button" className="text-nova-cyan hover:underline">
                Terms
              </button>{" "}
              and{" "}
              <button type="button" className="text-nova-cyan hover:underline">
                Privacy Policy
              </button>
            </p>
          </div>
        )}
      </motion.div>
    </dialog>
  );
}
