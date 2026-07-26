"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function ObjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { setFocusedObjectId } = useStore();

  useEffect(() => {
    if (params.id) {
      // Tell the scene to focus on this object
      setFocusedObjectId(params.id);
    }
  }, [params.id, setFocusedObjectId]);

  // Render the same main dashboard but with the object pre-focused
  // We redirect to root with the ID in state so the 3D scene still loads
  return (
    <div className="object-detail-wrapper">
      {/* The main dashboard renders the full 3D scene */}
      {/* The focused object is communicated via store */}
      <ObjectPermalinkLayout objectId={params.id} />
    </div>
  );
}

function ObjectPermalinkLayout({ objectId }: { objectId: string }) {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Optionally show a toast
      alert("Link copied to clipboard!");
    } catch {
      // Fallback
      prompt("Copy this link:", window.location.href);
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Import and render the main HUD/dashboard here */}
      {/* This re-uses the existing page.tsx layout */}
      <MainDashboard />
      
      {/* Share button overlay */}
      <button
        onClick={handleShare}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          padding: "8px 16px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 6,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          fontSize: 13,
        }}
      >
        🔗 Copy link to {objectId}
      </button>

      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1000,
          padding: "8px 16px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 6,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          fontSize: 13,
        }}
      >
        ← Dashboard
      </button>
    </div>
  );
}

// Lazy import to avoid circular deps — adjust import to match actual main component
import dynamic from "next/dynamic";
const MainDashboard = dynamic(() => import("@/app/page"), { ssr: false });