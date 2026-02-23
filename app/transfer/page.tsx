"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createPeer } from "@/lib/peer";
import { useAuthStore } from "@/store/useAuthStore";
import { useProStore } from "@/store/useProStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Download, Loader2, Crown } from "lucide-react";

type PeerConnection = ReturnType<Awaited<ReturnType<typeof createPeer>>["connect"]> extends infer C
  ? C extends { send: (data: unknown) => void } ? C : never
  : never;

export default function TransferPage() {
  const isPro = useAuthStore((s) => s.isPro);
  const p2pEnabled = useProStore((s) => s.p2pEnabled);
  const canUseP2P = isPro || p2pEnabled;
  const [mode, setMode] = useState<"share" | "receive">("share");
  const [peerId, setPeerId] = useState("");
  const [myId, setMyId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [peer, setPeer] = useState<InstanceType<typeof import("peerjs").default> | null>(null);
  const [conn, setConn] = useState<PeerConnection | null>(null);
  const [receivedFiles, setReceivedFiles] = useState<{ name: string; blob: Blob }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const startShare = useCallback(async () => {
    if (!canUseP2P) return;
    setLoading(true);
    setStatus("Creating peer...");
    try {
      const p = await createPeer();
      setPeer(p);
      p.on("open", (id) => {
        setMyId(id);
        setPeerId(id);
        setStatus("Share your ID with the receiver. Waiting for connection...");
      });
      p.on("connection", (connection) => {
        connection.on("open", () => {
          setConn(connection as PeerConnection);
          setStatus("Connected. You can send files.");
        });
        connection.on("data", (data: unknown) => {
          const d = data as { type?: string; name?: string; data?: ArrayBuffer };
          if (d?.type === "file" && d.name && d.data) {
            setReceivedFiles((prev) => [...prev, { name: d.name!, blob: new Blob([d.data!]) }]);
          }
        });
      });
      p.on("error", (err) => setStatus(`Error: ${err.message}`));
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to start");
    } finally {
      setLoading(false);
    }
  }, [canUseP2P]);

  const startReceive = useCallback(async () => {
    if (!canUseP2P || !remoteId.trim()) return;
    setLoading(true);
    setStatus("Connecting...");
    try {
      const p = await createPeer();
      setPeer(p);
      const connection = p.connect(remoteId.trim());
      setConn(connection as PeerConnection);
      connection.on("open", () => {
        setStatus("Connected. Send files from the other tab or wait for incoming.");
      });
      connection.on("data", (data: unknown) => {
        const d = data as { type?: string; name?: string; data?: ArrayBuffer };
        if (d?.type === "file" && d.name && d.data) {
          setReceivedFiles((prev) => [...prev, { name: d.name!, blob: new Blob([d.data!]) }]);
        }
      });
      connection.on("close", () => setStatus("Connection closed."));
      p.on("error", (err) => setStatus(`Error: ${err.message}`));
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to connect");
    } finally {
      setLoading(false);
    }
  }, [canUseP2P, remoteId]);

  const sendFiles = useCallback(() => {
    if (!conn || selectedFiles.length === 0) return;
    for (const file of selectedFiles) {
      file.arrayBuffer().then((buf) => {
        conn.send({ type: "file", name: file.name, data: buf });
      });
    }
    setStatus(`Sending ${selectedFiles.length} file(s)...`);
    setSelectedFiles([]);
  }, [conn, selectedFiles]);

  useEffect(() => {
    return () => {
      peer?.destroy();
    };
  }, [peer]);

  const download = (name: string, blob: Blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!canUseP2P) {
    return (
      <div className="container py-12">
        <h1 className="mb-2 text-3xl font-bold">P2P File Transfer</h1>
        <p className="mb-6 text-muted-foreground">
          Send files directly between browsers. No server storage. Pro feature.
        </p>
        <Card className="max-w-md border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Pro Required
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              P2P transfer is a Pro feature. Unlock batch conversion, history, and P2P with Pro.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button>Unlock Pro</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/tools" className="text-sm text-muted-foreground hover:underline">
          ← All tools
        </Link>
        <h1 className="mt-2 text-3xl font-bold">P2P File Transfer</h1>
        <p className="text-muted-foreground">
          Send files directly between two browser tabs/devices. No upload to our servers. Pro feature.
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={mode === "share" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("share")}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share (create ID)
        </Button>
        <Button
          variant={mode === "receive" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("receive")}
        >
          <Download className="mr-2 h-4 w-4" />
          Receive (enter ID)
        </Button>
      </div>

      {mode === "share" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Share files</CardTitle>
            <p className="text-sm text-muted-foreground">
              Start to get your peer ID. Share it with the receiver. After they connect, you can send files.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!peer ? (
              <Button onClick={startShare} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start sharing"
                )}
              </Button>
            ) : (
              <>
                <div>
                  <label className="text-xs text-muted-foreground">Your ID (share with receiver)</label>
                  <p className="font-mono text-lg font-semibold">{myId || "..."}</p>
                </div>
                {conn && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Send files</label>
                    <input
                      type="file"
                      multiple
                      className="block w-full text-sm"
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                    />
                    <Button size="sm" onClick={sendFiles} disabled={selectedFiles.length === 0}>
                      Send
                    </Button>
                  </div>
                )}
              </>
            )}
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </CardContent>
        </Card>
      )}

      {mode === "receive" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Receive files</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the sender&apos;s peer ID and connect. Received files appear below.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Sender&apos;s ID</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste peer ID"
                  value={remoteId}
                  onChange={(e) => setRemoteId(e.target.value)}
                />
                <Button onClick={startReceive} disabled={loading || !remoteId.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                </Button>
              </div>
            </div>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </CardContent>
        </Card>
      )}

      {receivedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Received files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {receivedFiles.map((f) => (
                <Button
                  key={f.name}
                  variant="outline"
                  size="sm"
                  onClick={() => download(f.name, f.blob)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {f.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
