import ClaimAirdropModal from "@/components/ClaimAirdropModal";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import SignUpModal from "@/components/SignUpModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  ChevronRight,
  Globe,
  Layers,
  Lock,
  Menu,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface UserData {
  username: string;
  email: string;
  country: string;
  signedUp: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const TARGET_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

function truncateAddress(addr: string) {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const socialLinks = [
  {
    id: "facebook",
    label: "Facebook",
    href: "#",
    color: "#1877F2",
    hoverClass:
      "hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 hover:shadow-[0_0_16px_#1877F240]",
    icon: (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "#",
    color: "#E4405F",
    hoverClass:
      "hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10 hover:shadow-[0_0_16px_#E4405F40]",
    icon: (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "#",
    color: "#FF0000",
    hoverClass:
      "hover:border-[#FF0000]/60 hover:bg-[#FF0000]/10 hover:shadow-[0_0_16px_#FF000040]",
    icon: (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: "#",
    color: "#FFFFFF",
    hoverClass:
      "hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_16px_#ffffff30]",
    icon: (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "#",
    color: "#26A5E4",
    hoverClass:
      "hover:border-[#26A5E4]/60 hover:bg-[#26A5E4]/10 hover:shadow-[0_0_16px_#26A5E440]",
    icon: (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const stored = localStorage.getItem("novachain_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("novachain_wallet");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.address || null;
    } catch {
      return null;
    }
  });
  const [showSignUp, setShowSignUp] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success">(
    "idle",
  );
  const timeLeft = useCountdown(TARGET_DATE);

  const heroRef = useRef<HTMLElement>(null);
  const presaleRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleClaimClick = () => {
    if (!userData?.signedUp) {
      setShowSignUp(true);
    } else {
      setShowClaim(true);
    }
  };

  const handleSignUpSuccess = (data: UserData) => {
    localStorage.setItem("novachain_user", JSON.stringify(data));
    setUserData(data);
    setShowSignUp(false);
  };

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  const handleSubscribe = () => {
    if (subscribeEmail.trim()) {
      setSubscribeStatus("success");
      setTimeout(() => {
        setSubscribeStatus("idle");
        setSubscribeEmail("");
        setShowSubscribe(false);
      }, 3000);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Decentralized Governance",
      desc: "Community-driven decisions through transparent on-chain voting. Every $NOVA holder has a voice.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Chain Support",
      desc: "Seamlessly operate across Solana, Ethereum, and BNB chains with unified liquidity.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Staking Rewards",
      desc: "Earn passive income by staking your $NOVA tokens. Up to 42% APY for early adopters.",
    },
  ];

  const roadmap = [
    {
      quarter: "Q2 2025",
      title: "Platform Launch",
      desc: "Public mainnet launch, token distribution, and initial DEX listing.",
      done: true,
    },
    {
      quarter: "Q3 2025",
      title: "Token Listing on DEX",
      desc: "Multi-DEX listing on Raydium, Uniswap, and PancakeSwap.",
      done: false,
    },
    {
      quarter: "Q4 2025",
      title: "Mobile App & Cross-chain Bridge",
      desc: "Native iOS/Android app and seamless cross-chain asset bridge.",
      done: false,
    },
    {
      quarter: "Q1 2026",
      title: "DAO Governance & Full Ecosystem",
      desc: "Full DAO deployment, grant program, and ecosystem fund activation.",
      done: false,
    },
  ];

  const navLinks = [
    { label: "Airdrop", ref: heroRef },
    { label: "Presale", ref: presaleRef },
    { label: "Features", ref: featuresRef },
    { label: "Roadmap", ref: roadmapRef },
  ];

  return (
    <div className="min-h-screen hud-grid overflow-x-hidden">
      {/* Sticky Nav */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nova-cyan to-nova-purple flex items-center justify-center neon-glow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-widest uppercase gradient-text">
              NovaChain
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.ref)}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className="text-sm font-medium text-muted-foreground hover:text-nova-cyan transition-colors tracking-wide uppercase"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {userData?.signedUp ? (
              <span className="hidden sm:block text-xs text-muted-foreground">
                👋 {userData.username}
              </span>
            ) : null}

            {/* Connect Wallet Button */}
            <Button
              type="button"
              onClick={() => setShowWallet(true)}
              data-ocid="nav.connect_wallet.button"
              variant="outline"
              className="hidden md:inline-flex border-nova-cyan/30 text-nova-cyan font-bold text-xs tracking-widest uppercase rounded-full px-4 hover:bg-nova-cyan/10 hover:border-nova-cyan/60 transition-all gap-2"
            >
              <Wallet className="w-3.5 h-3.5" />
              {walletAddress
                ? truncateAddress(walletAddress)
                : "Connect Wallet"}
            </Button>

            <Button
              type="button"
              onClick={() =>
                userData?.signedUp ? setShowClaim(true) : setShowSignUp(true)
              }
              data-ocid="nav.signup.button"
              className="hidden md:inline-flex bg-nova-cyan text-nova-dark font-bold text-xs tracking-widest uppercase rounded-full px-6 hover:bg-nova-cyan/90 neon-glow transition-all"
            >
              {userData?.signedUp ? "Claim Airdrop" : "Launch App"}
            </Button>
            <button
              type="button"
              className="md:hidden text-foreground p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-card border-t border-nova-cyan/10"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => scrollTo(link.ref)}
                    className="text-sm font-medium text-muted-foreground hover:text-nova-cyan transition-colors tracking-wide uppercase text-left py-2"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowWallet(true);
                  }}
                  data-ocid="mobile.connect_wallet.button"
                  variant="outline"
                  className="border-nova-cyan/30 text-nova-cyan font-bold text-xs tracking-widest uppercase rounded-full gap-2"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  {walletAddress
                    ? truncateAddress(walletAddress)
                    : "Connect Wallet"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (userData?.signedUp) setShowClaim(true);
                    else setShowSignUp(true);
                  }}
                  className="bg-nova-cyan text-nova-dark font-bold text-xs tracking-widest uppercase rounded-full mt-1"
                >
                  {userData?.signedUp ? "Claim Airdrop" : "Launch App"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          id="airdrop"
          className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-nova-cyan/30 bg-nova-cyan/5 w-fit">
                <div className="w-2 h-2 rounded-full bg-nova-cyan animate-pulse-glow" />
                <span className="text-xs font-semibold text-nova-cyan tracking-widest uppercase">
                  Airdrop Live
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tight">
                <span className="text-foreground">GET YOUR</span>
                <br />
                <span className="gradient-text neon-text-glow">$NOVA</span>
                <br />
                <span className="text-foreground">AIRDROP</span>
              </h1>

              <p className="text-base text-muted-foreground max-w-md leading-relaxed">
                Join thousands of early adopters and claim your share of
                10,000,000 $NOVA tokens. The future of decentralized finance
                starts here.
              </p>

              {/* Countdown */}
              <div className="flex items-center gap-3">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hrs", val: timeLeft.hours },
                  { label: "Min", val: timeLeft.minutes },
                  { label: "Sec", val: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div className="glass-card rounded-xl w-16 h-16 flex items-center justify-center border-nova-cyan/20 neon-glow">
                      <span className="text-2xl font-black text-nova-cyan font-mono">
                        {pad(item.val)}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social media icons above action buttons */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                    Follow Us
                  </span>
                  <div className="flex-1 h-px bg-nova-cyan/10" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`hero.${social.id}.link`}
                      aria-label={social.label}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.07 }}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ color: social.color }}
                      className={`w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 ${social.hoverClass}`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleClaimClick}
                  data-ocid="hero.claim_airdrop.button"
                  size="lg"
                  className="btn-blink bg-nova-cyan text-nova-dark font-black text-sm tracking-widest uppercase rounded-full px-8 py-6 hover:bg-nova-cyan/90 transition-all hover:scale-105"
                >
                  CLAIM AIRDROP
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowWallet(true)}
                  data-ocid="hero.connect_wallet.button"
                  size="lg"
                  variant="outline"
                  className="border-nova-cyan/30 text-nova-cyan font-black text-sm tracking-widest uppercase rounded-full px-8 py-6 hover:bg-nova-cyan/10 hover:border-nova-cyan/60 transition-all hover:scale-105 gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  {walletAddress
                    ? truncateAddress(walletAddress)
                    : "CONNECT WALLET"}
                </Button>
              </div>
            </motion.div>

            {/* Token Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-nova-cyan/20 to-nova-purple/20 blur-3xl" />
                <div className="glass-card rounded-3xl p-6 relative border-nova-cyan/20 purple-glow">
                  <img
                    src="/assets/generated/token-hero.dim_500x500.png"
                    alt="$NOVA Token"
                    className="w-72 h-72 sm:w-96 sm:h-96 object-contain animate-float"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Presale Section */}
        <section ref={presaleRef} id="presale" className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="glass-card rounded-3xl p-8 md:p-12 border-nova-cyan/15 shadow-glass">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-xs font-semibold text-nova-cyan tracking-widest uppercase mb-2">
                        Token Sale
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black uppercase">
                        <span className="text-foreground">PRESALE</span>
                        <br />
                        <span className="gradient-text">TOKEN SALE</span>
                      </h2>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black gradient-text">
                        $NOVA
                      </span>
                      <span className="text-muted-foreground text-sm">=</span>
                      <span className="text-2xl font-bold text-foreground">
                        $0.05
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: <Lock className="w-3 h-3" />, label: "Secure" },
                        {
                          icon: <Globe className="w-3 h-3" />,
                          label: "Multi-Chain",
                        },
                        {
                          icon: <BarChart3 className="w-3 h-3" />,
                          label: "Governance",
                        },
                        {
                          icon: <Layers className="w-3 h-3" />,
                          label: "Staking",
                        },
                      ].map((tag) => (
                        <span
                          key={tag.label}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nova-cyan/10 border border-nova-cyan/20 text-nova-cyan text-xs font-semibold"
                        >
                          {tag.icon}
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={handleClaimClick}
                      data-ocid="presale.contribute.button"
                      className="w-fit bg-transparent border border-nova-cyan/40 text-nova-cyan font-bold text-xs tracking-widest uppercase rounded-full px-6 hover:bg-nova-cyan/10 transition-all"
                    >
                      Contribute Now
                      <ChevronRight className="ml-2 w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="glass-card rounded-2xl p-6 border-nova-cyan/10">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          Raised
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          Goal
                        </span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-2xl font-black text-foreground">
                          $315,000
                        </span>
                        <span className="text-2xl font-black text-muted-foreground">
                          $500,000
                        </span>
                      </div>
                      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "63%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-nova-cyan to-nova-blue progress-glow"
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-nova-cyan font-bold">
                          63% Complete
                        </span>
                        <span className="text-xs text-muted-foreground">
                          37% remaining
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Total Supply", val: "1B $NOVA" },
                        { label: "Airdrop Pool", val: "10M $NOVA" },
                        { label: "Presale Price", val: "$0.05" },
                        { label: "Listing Price", val: "$0.12" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="glass-card rounded-xl p-4 border-nova-cyan/10"
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            {stat.label}
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {stat.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features" className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-nova-cyan tracking-widest uppercase mb-3">
                Why NovaChain
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase">
                <span className="gradient-text">FEATURES</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div className="glass-card rounded-2xl p-8 h-full border-nova-cyan/10 hover:border-nova-cyan/30 transition-all hover:shadow-neon-cyan group">
                    <div className="w-14 h-14 rounded-2xl bg-nova-cyan/10 border border-nova-cyan/20 flex items-center justify-center mb-6 text-nova-cyan group-hover:bg-nova-cyan/20 transition-all">
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section ref={roadmapRef} id="roadmap" className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-nova-cyan tracking-widest uppercase mb-3">
                Our Journey
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase">
                <span className="gradient-text">ROADMAP</span>
              </h2>
            </motion.div>

            <div className="glass-card rounded-3xl p-8 md:p-12 border-nova-cyan/15">
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 timeline-line rounded-full" />
                <div className="flex flex-col gap-10">
                  {roadmap.map((item, i) => (
                    <motion.div
                      key={item.quarter}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.15 }}
                      data-ocid={`roadmap.item.${i + 1}`}
                      className="flex gap-6 pl-14 relative"
                    >
                      <div
                        className={`absolute left-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                          item.done
                            ? "bg-nova-cyan/20 border-nova-cyan neon-glow"
                            : "bg-muted border-border"
                        }`}
                      >
                        {item.done ? (
                          <div className="w-3 h-3 rounded-full bg-nova-cyan" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold tracking-widest uppercase ${
                            item.done
                              ? "text-nova-cyan"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.quarter}
                        </span>
                        <h3 className="text-lg font-bold text-foreground mt-1 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-nova-cyan/10 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-5"
          >
            <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
              Follow Us
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`footer.${social.id}.link`}
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ scale: 1.18, y: -3 }}
                  whileTap={{ scale: 0.93 }}
                  style={{ color: social.color }}
                  className={`w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 ${social.hoverClass}`}
                >
                  {social.icon}
                </motion.a>
              ))}

              {/* Divider */}
              <div className="w-px h-8 bg-nova-cyan/20 mx-1" />

              {/* Subscribe Button */}
              <AnimatePresence mode="wait">
                {!showSubscribe ? (
                  <motion.button
                    key="subscribe-btn"
                    type="button"
                    onClick={() => setShowSubscribe(true)}
                    data-ocid="footer.subscribe.button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-nova-cyan/40 bg-nova-cyan/10 text-nova-cyan text-xs font-bold tracking-widest uppercase hover:bg-nova-cyan/20 hover:border-nova-cyan/70 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3.5 h-3.5"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Subscribe
                  </motion.button>
                ) : (
                  <motion.div
                    key="subscribe-form"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden"
                  >
                    {subscribeStatus === "success" ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-ocid="footer.subscribe.success_state"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 text-xs font-bold tracking-wide"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          className="w-3.5 h-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Subscribed!
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={subscribeEmail}
                          onChange={(e) => setSubscribeEmail(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSubscribe()
                          }
                          data-ocid="footer.subscribe.input"
                          className="h-9 w-44 rounded-full border-nova-cyan/30 bg-nova-cyan/5 text-foreground text-xs placeholder:text-muted-foreground/50 focus:border-nova-cyan/60 focus:ring-nova-cyan/20 px-4"
                        />
                        <button
                          type="button"
                          onClick={handleSubscribe}
                          data-ocid="footer.subscribe.submit_button"
                          className="h-9 px-4 rounded-full bg-nova-cyan text-nova-dark text-xs font-bold tracking-wide uppercase hover:bg-nova-cyan/90 transition-all neon-glow"
                        >
                          Go
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSubscribe(false);
                            setSubscribeEmail("");
                          }}
                          data-ocid="footer.subscribe.cancel_button"
                          className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20 flex items-center justify-center transition-all text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-nova-cyan/20 to-transparent" />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-nova-cyan to-nova-purple flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="font-black text-sm tracking-widest uppercase gradient-text">
                NovaChain
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nova-cyan hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex gap-4">
              {["Terms", "Privacy", "Whitepaper"].map((l) => (
                <button
                  key={l}
                  type="button"
                  className="text-xs text-muted-foreground hover:text-nova-cyan transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showSignUp && (
          <SignUpModal
            onClose={() => setShowSignUp(false)}
            onSuccess={handleSignUpSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClaim && userData && (
          <ClaimAirdropModal
            username={userData.username}
            onClose={() => setShowClaim(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWallet && (
          <ConnectWalletModal
            onClose={() => setShowWallet(false)}
            onConnected={handleWalletConnected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
