/**
 * P2P file transfer base using PeerJS.
 * Pro feature: share or receive files directly between browsers without server storage.
 */

type PeerClass = typeof import("peerjs").default;

let PeerJS: PeerClass | null = null;

export async function loadPeerJS(): Promise<PeerClass> {
  if (PeerJS) return PeerJS;
  const mod = await import("peerjs");
  PeerJS = mod.default;
  return PeerJS;
}

export type PeerConnectionState = "disconnected" | "connecting" | "connected";

/**
 * Create a Peer instance (call from client only).
 * You need a PeerJS server or use PeerJS cloud for development.
 */
export async function createPeer(id?: string): Promise<InstanceType<PeerClass>> {
  const P = await loadPeerJS();
  return new P(id ?? "", {
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    secure: true,
  });
}
