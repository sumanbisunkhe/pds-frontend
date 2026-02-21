import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  getStats,
  getRecentPhotos,
  registerWeb,
  triggerProcessing,
  API_URL,
} from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { MyPhotos } from "@/pages/MyPhotos";
import { Register } from "@/pages/Register";
import { About } from "@/pages/About";

function App() {
  const [stats, setStats] = useState<{
    total_photos: number;
    total_users: number;
    total_encodings: number;
    recent_matches?: string;
  }>({ total_photos: 0, total_users: 0, total_encodings: 0 });
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [webId, setWebId] = useState("");
  const [searchId, setSearchId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [statsData, recentData] = await Promise.all([
        getStats(),
        getRecentPhotos(),
      ]);
      setStats(statsData);
      setRecentPhotos(recentData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleRegister = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await registerWeb(file);
      if (result.error) {
        toast({
          title: "Registration Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setWebId(result.web_id);
        localStorage.setItem("pds_web_id", result.web_id);
        toast({
          title: "Registration Successful",
          description: `Your ID: ${result.web_id}. We've analyzed your face!`,
        });
        setSearchId(result.web_id);
        navigate("/my-photos");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetRegistration = () => {
    localStorage.removeItem("pds_web_id");
    setWebId("");
    setSearchId("");
    toast({
      title: "Session Reset",
      description: "You have been logged out. You can now register a new face.",
    });
    navigate("/register?tab=web");
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await triggerProcessing();
      toast({
        title: "Processing Started",
        description:
          result.message || "Photo processing has been triggered successfully.",
      });
      // Refresh data after a short delay
      setTimeout(fetchData, 2000);
    } catch (error: any) {
      toast({
        title: "Sync Error",
        description: error.message || "Failed to trigger processing",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // SSE for Real-time Updates
    const eventSource = new EventSource(`${API_URL}/api/stream`);

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "new_photo") {
          const newPhoto = message.data;
          setRecentPhotos((prev) => [newPhoto, ...prev].slice(0, 12));
          // Optimistically update stats
          setStats((prev) => ({
            ...prev,
            total_photos: prev.total_photos + 1,
          }));
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
      eventSource.close();
    };

    const savedId = localStorage.getItem("pds_web_id");
    if (savedId) {
      setWebId(savedId);
      setSearchId(savedId);
    }

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />

      <main className="container mx-auto pt-24 pb-8 px-4">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                stats={stats}
                recentPhotos={recentPhotos}
                isSyncing={isSyncing}
                onSync={handleSync}
              />
            }
          />
          <Route
            path="/my-photos"
            element={
              <MyPhotos onReset={resetRegistration} searchId={searchId} />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                onRegister={handleRegister}
                isUploading={isUploading}
                currentId={webId}
                onReset={resetRegistration}
              />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Toaster />
    </div>
  );
}

export default App;
