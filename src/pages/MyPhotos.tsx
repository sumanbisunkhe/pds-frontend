import { useState } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Download,
  ExternalLink,
  UserPlus,
  RefreshCw,
  UserRoundPen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_URL, getMyPhotos } from "@/lib/api";
import { useEffect } from "react";

interface MyPhotosProps {
  onReset: () => void;
  searchId: string;
}

export function MyPhotos({ onReset, searchId }: MyPhotosProps) {
  useDocumentTitle("My Photos");
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleSearch = async (idToSearch?: string) => {
    const id = idToSearch || searchId;
    if (!id) return;

    setIsSearching(true);
    try {
      const result = await getMyPhotos(id);
      if (result.error) {
        toast({
          title: "Search Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setPhotos(result.photos);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to find photos",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchId) {
      handleSearch();
    }
  }, [searchId]);
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `pds-match-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  const handleDownloadAll = async () => {
    if (!searchId) return;
    setIsDownloadingAll(true);
    try {
      const response = await fetch(
        `${API_URL}/api/download-all?web_id=${searchId}`,
      );
      if (!response.ok) throw new Error("Failed to generate zip");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pds_photos_${searchId.substring(0, 8)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download Complete",
        description:
          "Your ZIP archive has been generated and downloaded successfully.",
      });
    } catch (error) {
      console.error("Download all failed:", error);
      toast({
        title: "Download Failed",
        description:
          "We couldn't generate your ZIP archive. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-black tracking-tight lg:text-xl uppercase font-mono">
          Your Collection
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto font-serif italic">
          {searchId
            ? `Explore your personalized memories`
            : `Register your face to unlock your personalized event memories.`}
        </p>
      </div>

      {/* Identity Status or Search Bar */}
      <div className="max-w-xl mx-auto">
        {searchId ? (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-sky-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-full px-4 py-4 md:px-6 md:py-4 bg-card border border-border/50 rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-grow sm:flex-initial h-10 md:h-9 px-3 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-colors border border-border/50 sm:border-none"
                      onClick={() => handleSearch()}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <RefreshCw
                          className={`h-3 w-3 mr-2 ${isSearching ? "animate-spin" : ""}`}
                        />
                      )}
                      REFRESH
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-grow sm:flex-initial h-10 md:h-9 px-3 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-colors border border-border/50 sm:border-none"
                        >
                          <UserRoundPen className="h-3.5 w-3.5 mr-2" />
                          CHANGE
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2rem] border-border/50 backdrop-blur-xl bg-card/80">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black uppercase font-mono">
                            Change Identity?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-serif italic text-lg">
                            This will reset your current session. You will need
                            to re-register with a selfie to find your photos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-bold">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={onReset}
                            className="rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Change
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {photos.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full sm:w-auto h-10 md:h-9 px-4 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 animate-in zoom-in-90 duration-300"
                      onClick={handleDownloadAll}
                      disabled={isDownloadingAll}
                    >
                      {isDownloadingAll ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <Download className="h-3 w-3 mr-2" />
                      )}
                      {isDownloadingAll ? "PREPARING..." : "DOWNLOAD ALL"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link to="/register">
              <Button className="h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20 group">
                <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                GET STARTED & REGISTER
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="min-h-[400px]">
        {isSearching ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="relative">
              <div className="h-20 w-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <ImageIcon className="absolute inset-0 m-auto h-8 w-8 text-primary/50" />
            </div>
            <p className="text-muted-foreground font-mono animate-bounce uppercase tracking-widest text-sm">
              Searching Matches...
            </p>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {photos.map((url, index) => (
              <Card
                key={index}
                className="group relative aspect-[3/4] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-2xl hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-700 bg-muted"
              >
                <img
                  src={url}
                  alt={`Match ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-0 lg:translate-y-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <div className="flex gap-1.5 md:gap-2">
                    <Button
                      size="sm"
                      className="flex-grow rounded-xl bg-white/90 hover:bg-white text-black text-[10px] font-bold backdrop-blur-md border-none shadow-lg transition-all active:scale-95 px-2 md:px-3 h-8 sm:h-9"
                      onClick={() => setSelectedPhoto(url)}
                    >
                      <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
                      <span className="hidden sm:inline">VIEW</span>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-grow rounded-xl bg-black/50 hover:bg-black/80 text-white hover:text-white border border-white/20 backdrop-blur-md transition-all active:scale-95 shadow-lg px-2 md:px-3 h-8 sm:h-9"
                      style={{ fontSize: "10px", fontWeight: "bold" }}
                      onClick={() => handleDownload(url)}
                    >
                      <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
                      <span className="hidden sm:inline">GET</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : searchId ? (
          <div className="h-[400px] border border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-6 animate-in zoom-in-95 duration-700 bg-muted/20 backdrop-blur-sm">
            <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center shadow-inner">
              <ImageIcon className="h-10 w-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-tight">
                No Photos Found Yet
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-serif italic text-lg leading-relaxed">
                We're processed our collection but haven't found your face in
                this ID yet. Keep checking!
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[400px] border border-dashed border-border/50 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-6 group hover:border-primary/30 transition-colors duration-700 bg-muted/10">
            <div className="h-32 w-32 border-2 border-border/30 rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700 shadow-inner">
              <UserPlus className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase tracking-widest font-mono">
                Identity Required
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm uppercase tracking-wider font-bold">
                Please register your face to begin the automated photo matching
              </p>
              <Link to="/register">
                <Button variant="outline" className="rounded-xl font-bold mt-4">
                  Go to Registration
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center gap-8 group">
        <div className="h-24 w-24 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-500">
          <ImageIcon className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="font-black uppercase tracking-tight font-mono text-xl">
            Where do these photos come from?
          </h4>
          <p className="text-muted-foreground font-serif italic text-lg">
            "Our professional event photographers upload directly to Cloudinary.
            Our AI then scans every pixel, matching faces to registrations in
            real-time."
          </p>
        </div>
      </div>

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-[98vw] w-full h-auto p-0 overflow-hidden rounded-2xl md:rounded-[2rem] border-none bg-black/90 backdrop-blur-lg translate-y-[-45%] md:translate-y-[-40%]">
          <DialogHeader className="sr-only">
            <DialogTitle>View Photo</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative group overflow-hidden">
              <img
                src={selectedPhoto}
                alt="Enlarged match"
                className="w-full h-full max-h-[75vh] md:max-h-[80vh] object-contain mx-auto animate-in zoom-in-95 duration-500"
              />
              <div className="absolute top-4 left-4 md:top-auto md:left-auto md:bottom-6 md:right-6">
                <Button
                  className="rounded-full h-10 w-10 md:h-14 md:w-14 bg-black hover:bg-zinc-900 text-white border-2 border-black p-0 shadow-2xl transition-all hover:scale-110 active:scale-95"
                  onClick={() => handleDownload(selectedPhoto)}
                  title="Download Photo"
                >
                  <Download className="h-4 w-4 md:h-6 md:w-6" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
