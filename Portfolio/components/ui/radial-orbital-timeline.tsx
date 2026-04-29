"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: LucideIcon;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

// Pure position calc — lives outside component, no closure lag
function calcPosition(index: number, total: number, angleDeg: number) {
  const deg = ((index / total) * 360 + angleDeg) % 360;
  const rad = (deg * Math.PI) / 180;
  const r = 200;
  return {
    x: r * Math.cos(rad),
    y: r * Math.sin(rad),
    zIndex: Math.round(100 + 50 * Math.cos(rad)),
    opacity: Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2))),
  };
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  // rotationAngle is only used as a snapshot for React renders (expand/collapse)
  const [rotationAngle, setRotationAngle] = useState(0);

  const autoRotateRef = useRef(true);
  const angleRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => { setMounted(true); }, []);

  // RAF orbit loop — no React state updates, direct DOM writes = 60fps
  useEffect(() => {
    if (!mounted) return;

    const tick = () => {
      if (autoRotateRef.current) {
        angleRef.current = (angleRef.current + 0.45) % 360;
        timelineData.forEach((item, i) => {
          const el = nodeRefs.current[item.id];
          if (!el) return;
          const p = calcPosition(i, timelineData.length, angleRef.current);
          el.style.transform = `translate(${p.x}px, ${p.y}px)`;
          el.style.opacity = String(p.opacity);
          el.style.zIndex = String(p.zIndex);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mounted, timelineData]);

  const getRelatedItems = useCallback((id: number) =>
    timelineData.find((i) => i.id === id)?.relatedIds ?? [], [timelineData]);

  const isRelatedToActive = useCallback((id: number) =>
    activeNodeId ? getRelatedItems(activeNodeId).includes(id) : false, [activeNodeId, getRelatedItems]);

  const toggleItem = (id: number) => {
    // Snapshot angle into state so React render uses current orbit position
    setRotationAngle(angleRef.current);

    setExpandedItems((prev) => {
      const next: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => { next[parseInt(k)] = false; });
      next[id] = !prev[id];

      if (!prev[id]) {
        autoRotateRef.current = false;
        setActiveNodeId(id);
        const pulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((r) => { pulse[r] = true; });
        setPulseEffect(pulse);
        // Smoothly rotate so clicked node comes to top
        const nodeIndex = timelineData.findIndex((i) => i.id === id);
        angleRef.current = (270 - (nodeIndex / timelineData.length) * 360 + 360) % 360;
        setRotationAngle(angleRef.current);
      } else {
        autoRotateRef.current = true;
        setActiveNodeId(null);
        setPulseEffect({});
      }
      return next;
    });
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      autoRotateRef.current = true;
    }
  };

  const getStatusStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":   return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      default:            return "text-white bg-black/40 border-white/50";
    }
  };

  const anyExpanded = Object.values(expandedItems).some(Boolean);

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Centre orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 via-pink-500 to-fuchsia-600 animate-pulse flex items-center justify-center z-10 shadow-[0_0_30px_rgba(255,0,127,0.5)]">
            <div className="absolute w-20 h-20 rounded-full border border-pink-500/30 animate-ping opacity-60" />
            <div className="absolute w-28 h-28 rounded-full border border-pink-500/15 animate-ping opacity-40" style={{ animationDelay: "0.6s" }} />
            <div className="w-7 h-7 rounded-full bg-white/85 backdrop-blur-md" />
          </div>

          {/* Orbit ring */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-pink-500/15 shadow-[0_0_20px_rgba(255,0,127,0.06)]" />

          {/* Nodes */}
          {timelineData.map((item, index) => {
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            // Position used only during React renders (expand/collapse)
            const reactPos = calcPosition(index, timelineData.length, rotationAngle);

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute cursor-pointer"
                style={
                  !mounted
                    ? { opacity: 0 }
                    : isExpanded
                    ? {
                        transform: `translate(${reactPos.x}px, ${reactPos.y}px)`,
                        zIndex: 200,
                        opacity: 1,
                        transition: "transform 0.5s ease, opacity 0.3s ease",
                      }
                    : undefined // RAF owns the style during orbit
                }
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Pulse halo */}
                {isPulsing && (
                  <div
                    className="absolute rounded-full animate-pulse"
                    style={{
                      background: "radial-gradient(circle, rgba(255,0,127,0.25) 0%, transparent 70%)",
                      width: `${item.energy * 0.5 + 40}px`,
                      height: `${item.energy * 0.5 + 40}px`,
                      left: `-${(item.energy * 0.5) / 2}px`,
                      top: `-${(item.energy * 0.5) / 2}px`,
                    }}
                  />
                )}

                {/* Node circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isExpanded
                      ? "bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_rgba(255,0,127,0.6)] scale-150"
                      : isRelated
                      ? "bg-pink-500/30 text-pink-300 border-pink-400/60 animate-pulse"
                      : "bg-black text-white border-white/30 hover:border-pink-500/50"}`}
                >
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300
                  ${isExpanded ? "text-pink-400 scale-110" : "text-white/60"}`}
                >
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/95 backdrop-blur-lg border-pink-500/30 shadow-[0_0_30px_rgba(255,0,127,0.15)] overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-pink-500/50" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "COMPLETE" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                        </Badge>
                        <span className="text-xs font-mono text-white/40">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/70">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center text-pink-400/80"><Zap size={10} className="mr-1" />Energy</span>
                          <span className="font-mono text-white/60">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-pink-600 to-fuchsia-500 transition-all duration-700"
                            style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-pink-400/60 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/50">Connected</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relId) => {
                              const rel = timelineData.find((i) => i.id === relId);
                              return (
                                <Button
                                  key={relId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs rounded-none border-pink-500/20 bg-transparent hover:bg-pink-500/10 text-white/70 hover:text-white"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={8} className="ml-1" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
