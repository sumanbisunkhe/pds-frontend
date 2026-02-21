import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Zap,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Facebook,
} from "lucide-react";
import { getAboutDetails } from "@/lib/api";
import TrueFocus from "@/components/TrueFocus";
import Shuffle from "@/components/Shuffle";
import { useDocumentTitle } from "@/hooks/use-document-title";

interface Member {
  name: string;
  role: string;
  image: string;
  socials?: {
    email?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
}

interface Feature {
  name: string;
  detail: string;
}

interface AboutData {
  mission: {
    title: string;
    description: string;
    stats: {
      trustedBy: string;
      totalEvents: string;
      satisfactionRate: string;
    };
  };
  tech: {
    title: string;
    description: string;
    features: Feature[];
  };
  team: {
    title: string;
    description: string;
    members: Member[];
  };
}

export function About() {
  useDocumentTitle("About");
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getAboutDetails();
        setData(details);
      } catch (error) {
        console.error("Error fetching about details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <Zap className="w-8 h-8 rotate-180" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          System Unavailable
        </h2>
        <p className="text-muted-foreground">
          Please ensure the backend is active.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-24 md:space-y-48 pt-4 pb-16 px-4 md:px-6 font-sans overflow-x-hidden"
    >
      {/* Hero Section - The Mission */}
      <section className="text-center space-y-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-8 relative z-10 font-mono">
          <motion.div variants={itemVariants} className="flex justify-center">
            <TrueFocus
              sentence={data.mission.title}
              mainColor="hsl(var(--foreground))"
              borderColor="hsl(var(--primary))"
              glowColor="hsl(var(--primary) / 0.4)"
              fontSize="clamp(3.5rem, 8vw, 5.5rem)"
            />
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground/80 max-w-4xl mx-auto leading-relaxed font-serif text-balance"
          >
            {data.mission.description}
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 pt-8"
        >
          {Object.entries({
            "Trusted By": data.mission.stats.trustedBy,
            "Events Managed": data.mission.stats.totalEvents,
            "Satisfaction Rate": data.mission.stats.satisfactionRate,
          }).map(([label, value]) => (
            <div key={label} className="group flex flex-col items-center">
              <span className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors font-serif">
                {value}
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-semibold font-sans mt-2">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* The Tech Section - Features */}
      <section className="space-y-12 md:space-y-24">
        <div className="text-center space-y-6">
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center "
          >
            <Shuffle
              text={data.tech.title}
              tag="h2"
              className="font-black uppercase tracking-tight text-foreground !text-[clamp(2rem,5vw,3rem)] font-mono"
              shuffleDirection="down"
              duration={0.4}
            />
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg font-serif italic"
          >
            {data.tech.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:px-12">
          {data.tech.features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-primary shrink-0">
                  {idx === 0 && <Cpu className="w-6 h-6" />}
                  {idx === 1 && <Sparkles className="w-6 h-6" />}
                  {idx === 2 && <Zap className="w-6 h-6" />}
                  {idx === 3 && <ShieldCheck className="w-6 h-6" />}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {feature.name}
                  </h3>
                  <p className="text-muted-foreground/80 leading-relaxed ">
                    {feature.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Team Section */}
      <section className="space-y-16">
        <div className="text-center space-y-6">
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center font-mono"
          >
            <Shuffle
              text={data.team.title}
              tag="h2"
              className="font-black uppercase tracking-tight text-foreground !text-[clamp(2rem,5vw,3rem)] font-mono"
              shuffleDirection="down"
              duration={0.4}
            />
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg font-serif italic"
          >
            {data.team.description}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 px-4">
          {data.team.members.map((member, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative w-full max-w-[280px]"
            >
              {/* Decorative Background Aura */}
              <div className="absolute -inset-4 bg-primary/5 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Image Container with Stylish Frame */}
                <div className="relative aspect-[4/5] p-2 rounded-[3rem] bg-gradient-to-br from-border/50 via-transparent to-border/50 border border-border/20 shadow-xl overflow-hidden group-hover:border-primary/30 transition-colors duration-500">
                  <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-zinc-900">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ease-out"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center px-4">
                  <div className="flex flex-col items-center">
                    <div className="h-1 w-8 bg-primary/20 rounded-full mb-2 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                    <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="h-px w-4 bg-border" />
                      <p className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase opacity-80 font-mono">
                        {member.role}
                      </p>
                      <span className="h-px w-4 bg-border" />
                    </div>

                    {/* Socials */}
                    <div className="mt-4 flex items-center justify-center gap-4">
                      {[
                        {
                          icon: Github,
                          label: "GitHub",
                          link: member.socials?.github,
                        },
                        {
                          icon: Linkedin,
                          label: "LinkedIn",
                          link: member.socials?.linkedin,
                        },
                        {
                          icon: Mail,
                          label: "Gmail",
                          link: member.socials?.email
                            ? `mailto:${member.socials.email}`
                            : null,
                        },
                        {
                          icon: Facebook,
                          label: "Facebook",
                          link: member.socials?.facebook,
                        },
                      ].map(
                        (item) =>
                          item.link && (
                            <motion.a
                              key={item.label}
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{
                                y: -4,
                                backgroundColor: "hsl(var(--primary))",
                                color: "white",
                                borderColor: "hsl(var(--primary))",
                              }}
                              className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                            >
                              <item.icon className="w-4 h-4" />
                            </motion.a>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clean Modern CTA */}
      <motion.section
        variants={itemVariants}
        className="relative group p-1 lg:p-1.5 rounded-[2.5rem] sm:rounded-[4rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10 overflow-hidden"
      >
        <div className="relative bg-foreground rounded-[2.3rem] sm:rounded-[3.8rem] p-8 sm:p-16 lg:p-24 text-center space-y-8 md:space-y-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

          <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight sm:leading-[0.9] text-background tracking-tighter">
              Ready to automate <br className="hidden sm:block" /> your event
              photos?
            </h2>
            <p className="text-background/50 text-base sm:text-xl font-light max-w-xl mx-auto">
              Join the future of instant photo delivery. Simple. Private. Fast.
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/register")}
            className="group relative inline-flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-6 bg-background text-foreground rounded-full font-black uppercase tracking-widest text-[10px] sm:text-sm hover:translate-y-[-4px] transition-all active:translate-y-0 shadow-2xl"
          >
            Get Started
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
