import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera,
  Send,
  Trash2,
  CheckCircle2,
  QrCode,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface RegisterProps {
  onRegister: (file: File) => Promise<void>;
  isUploading: boolean;
  currentId?: string;
  onReset: () => void;
}

export function Register({
  onRegister,
  isUploading,
  currentId,
  onReset,
}: RegisterProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "web" ? "web" : "telegram";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      onRegister(file);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-black tracking-tight lg:text-xl uppercase font-mono">
          Receive Your Photos
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-serif italic">
          AI-Powered Face-Matching & Image Distribution System
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setSearchParams({ tab: v })}
        className="w-full"
      >
        <div className="flex justify-center mb-6 md:mb-10 px-4">
          <TabsList className="bg-muted/50 p-1 h-auto md:h-14 rounded-2xl border border-border/50 w-full md:w-auto grid grid-cols-2 md:flex">
            <TabsTrigger
              value="telegram"
              className="rounded-xl px-4 md:px-8 py-3 md:h-12 data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all duration-300 text-sm md:text-base"
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="truncate">Telegram Bot</span>
            </TabsTrigger>
            <TabsTrigger
              value="web"
              className="rounded-xl px-4 md:px-8 py-3 md:h-12 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 text-sm md:text-base"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="truncate">Web Registration</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Telegram Tab */}
        <TabsContent
          value="telegram"
          className="animate-in fade-in zoom-in-95 duration-500"
        >
          <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/50 overflow-hidden group">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-h-[56px]">
                <div className="space-y-1">
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    Telegram Bot
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Get matched photos delivered instantly to your chat
                  </CardDescription>
                </div>
                <Badge className="bg-sky-500 hover:bg-sky-600 text-white shrink-0">
                  Recommended
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="flex flex-col items-center justify-center space-y-4 h-64 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50 group-hover:border-sky-500/50 transition-colors duration-500">
                  <div className="relative p-4 bg-white rounded-[2.5rem] shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-sky-100">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://t.me/PhotoDistributionSystemBot&format=png&bgcolor=ffffff&color=050a14&margin=5"
                      alt="Telegram Bot QR Code"
                      className="w-32 h-32 rounded-[1.5rem]"
                    />
                    <div className="absolute -inset-2 border-2 border-sky-500/20 rounded-[3rem] animate-pulse" />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-sky-600 flex items-center gap-2">
                    <Smartphone className="h-3 w-3" />
                    Scan to Connect
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center font-black flex-shrink-0">
                        1
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">Scan QR or click link</p>
                        <p className="text-sm text-muted-foreground">
                          Open the bot in your Telegram app
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center font-black flex-shrink-0">
                        2
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">Send /start to the bot</p>
                        <p className="text-sm text-muted-foreground">
                          Initialize the matching process
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center font-black flex-shrink-0">
                        3
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">Upload your selfie</p>
                        <p className="text-sm text-muted-foreground">
                          Your photos find you, you don't find them.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 text-lg font-bold group/btn"
                    onClick={() =>
                      window.open(
                        "https://t.me/PhotoDistributionSystemBot",
                        "_blank",
                      )
                    }
                  >
                    <Send className="h-5 w-5 mr-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    Open @PhotoDistributionBot
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Web Tab */}
        <TabsContent
          value="web"
          className="animate-in fade-in zoom-in-95 duration-500"
        >
          <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/50 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-h-[56px]">
                <div className="space-y-1">
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    Web Registration
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Fastest way to register using your browser
                  </CardDescription>
                </div>
                {/* Invisible badge to match height on desktop */}
                <div className="hidden sm:block h-[22px] w-[95px]" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {currentId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-in fade-in duration-700">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] p-8 text-center space-y-4 h-64 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tight">
                      You are registered
                    </h3>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-600">
                        Registration Identity
                      </p>
                      <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-4 font-mono text-xs break-all shadow-inner border border-border/50">
                        {currentId}
                      </div>
                      <p className="text-sm text-muted-foreground font-serif italic">
                        Your face is encoded and we are searching for your
                        photos.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-grow h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                        onClick={() => (window.location.href = "/my-photos")}
                      >
                        Go to Collection
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-14 w-14 rounded-2xl border-dashed hover:border-destructive hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2rem] border-border/50 backdrop-blur-xl bg-card/80">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-black uppercase font-mono">
                              Reset Registration?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-serif italic text-lg">
                              This will clear your current session and allow you
                              to register with a new face. All matched photos
                              will be cleared from this view.
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
                              Reset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div
                    className={`relative cursor-pointer transition-all duration-500 rounded-[3rem] border-2 border-dashed h-64 flex flex-col items-center justify-center overflow-hidden
                      ${dragActive ? "border-primary bg-primary/5 scale-102" : "border-border hover:border-primary px-6 hover:bg-primary/5"}
                      ${preview ? "border-solid border-primary/20" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !preview && fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <div className="absolute inset-0 group/preview">
                        <img
                          src={preview}
                          alt="Selfie preview"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/preview:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-full h-12 w-12"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-border/50 backdrop-blur-xl bg-card/80">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-black uppercase font-mono">
                                  Remove Selfie?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-serif italic text-lg">
                                  Are you sure you want to remove this photo and
                                  choose a different one?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={clearSelection}
                                  className="rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="h-20 w-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:rotate-12 transition-transform duration-500">
                          <Camera className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold">Choose Selfie</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                            JPG, PNG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black flex-shrink-0">
                          1
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold">
                            Upload a clear selfie
                          </p>
                          <p className="text-sm text-muted-foreground">
                            A well-lit photo of your face
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black flex-shrink-0">
                          2
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold">
                            Register your identity
                          </p>
                          <p className="text-sm text-muted-foreground">
                            We generate your unique signature
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black flex-shrink-0">
                          3
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold">
                            Access your gallery
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Instantly view all matched photos
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all duration-300 active:scale-95"
                      disabled={!file || isUploading}
                      onClick={handleUpload}
                    >
                      {isUploading ? (
                        <span className="flex items-center">
                          <span className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                          AI ANALYZING...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <QrCode className="h-5 w-5 mr-3" />
                          FIND MY PHOTOS
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
