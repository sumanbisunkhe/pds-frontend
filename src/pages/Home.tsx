import { Camera, Users, Zap, RefreshCw } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import CircularGallery from "@/components/CircularGallery";
import { useDocumentTitle } from "@/hooks/use-document-title";

interface HomeProps {
  stats: {
    total_photos: number;
    total_users: number;
    total_encodings: number;
    recent_matches?: string;
  };
  recentPhotos: Array<{ url: string; public_id: string }>;
  isSyncing: boolean;
  onSync: () => void;
}

export function Home({ stats, recentPhotos, isSyncing }: HomeProps) {
  useDocumentTitle("Home");
  const galleryItems = recentPhotos.map((photo) => ({
    image: photo.url,
    text: "",
  }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SpotlightCard
          className="border-border/50 bg-card shadow-xl backdrop-blur-sm group hover:border-primary/50 transition-all duration-300 p-6"
          spotlightColor="rgba(59, 130, 246, 0.15)"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-slate-300">Total Photos</h3>
            <Camera className="h-4 w-4 text-primary" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">
              {stats.total_photos}
            </div>
            <p className="text-xs text-slate-400 mt-1">Managed in Cloudinary</p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          className="border-border/50 bg-card shadow-xl backdrop-blur-sm group hover:border-primary/50 transition-all duration-300 p-6"
          spotlightColor="rgba(59, 130, 246, 0.15)"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-slate-300">Active Users</h3>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">
              {stats.total_users}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Registered for matching
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          className="border-border/50 bg-card shadow-xl backdrop-blur-sm group hover:border-primary/50 transition-all duration-300 p-6"
          spotlightColor="rgba(59, 130, 246, 0.15)"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-slate-300">
              Face Encodings
            </h3>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">
              {stats.total_encodings}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Processed AI signatures
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          className="border-border/50 bg-card shadow-xl backdrop-blur-sm group hover:border-primary/50 transition-all duration-300 p-6 relative overflow-hidden"
          spotlightColor="rgba(59, 130, 246, 0.15)"
        >
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <RefreshCw className="h-20 w-20 text-foreground" />
          </div>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <h3 className="text-sm font-medium text-slate-300">
              Process Status
            </h3>
            <div
              className={`h-2 w-2 rounded-full ${isSyncing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
            />
          </div>
          <div className="pt-2 relative z-10">
            <div className="text-2xl font-bold uppercase tracking-wider text-white">
              {isSyncing ? "Processing" : "Idle"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time matching engine
            </p>
          </div>
        </SpotlightCard>
      </section>

      {/* Live Photo Wall */}
      <section className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight lg:text-xl uppercase font-mono">
              Live Photo Wall
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-serif italic">
              Recently uploaded and processed event photos
            </p>
          </div>
        </div>

        <div className="h-[300px] w-full rounded-3xl overflow-hidden bg-white !border-none !shadow-none">
          {recentPhotos.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="h-12 w-12 mb-4 opacity-20" />
              <p>No photos processed yet</p>
            </div>
          ) : (
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#000000"
              font="bold 16px Figtree"
              borderRadius={0.05}
            />
          )}
        </div>
      </section>
    </div>
  );
}
