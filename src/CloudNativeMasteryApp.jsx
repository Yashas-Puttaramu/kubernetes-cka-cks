import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, Sun, Moon, ChevronDown, ChevronRight, Copy, Check, Box, Server, Shield,
  Rocket, Terminal, Layers, Network, Cpu, Database, Lock, GitBranch, Activity, Menu,
  X, CheckCircle2, Circle, BookOpen, FlaskConical, FileCode2, LayoutGrid, ListChecks,
  HardDrive, Package, ShieldCheck, Workflow, Gauge, Route, Container, AlertTriangle,
  Wrench, Eye, Fingerprint, Radar, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

/* =====================================================================================
   CloudNativeMasteryApp
   -------------------------------------------------------------------------------------
   A single-file, production-grade interactive encyclopedia covering Docker/OCI runtimes,
   the CKA and CKS curricula, and Day-2 cloud-native operations (GitOps, Observability,
   Service Mesh, Gateway API, Helm). All diagrams are hand-crafted SVG.
   ===================================================================================== */

/* ------------------------------------------------------------------------------------
   THEME SYSTEM
   A small token map keeps the app independent of the Tailwind `darkMode` configuration:
   every color class is resolved at render time from the active theme object.
   ------------------------------------------------------------------------------------ */
const THEMES = {
  dark: {
    name: "dark",
    app: "bg-slate-950 text-slate-200",
    sidebar: "bg-slate-900/80 border-slate-800",
    header: "bg-slate-900/70 border-slate-800 backdrop-blur",
    card: "bg-slate-900 border-slate-800",
    cardSoft: "bg-slate-900/60 border-slate-800",
    panel: "bg-slate-950 border-slate-800",
    input: "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-cyan-500",
    muted: "text-slate-400",
    faint: "text-slate-500",
    heading: "text-slate-50",
    accent: "text-cyan-400",
    accentBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-300",
    tabActive: "bg-cyan-500/15 text-cyan-300 border-cyan-500/50",
    tabIdle: "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800",
    navActive: "bg-cyan-500/10 text-cyan-300",
    navIdle: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70",
    code: "bg-slate-950 border-slate-800 text-slate-200",
    codeHeader: "bg-slate-900 border-slate-800 text-slate-400",
    terminal: "bg-black/80 border-slate-800 text-emerald-300",
    chip: "bg-slate-800 text-slate-300 border-slate-700",
    progressTrack: "bg-slate-800",
    progressFill: "bg-gradient-to-r from-cyan-500 to-emerald-400",
    divider: "border-slate-800",
    svgText: "#e2e8f0",
    svgMuted: "#94a3b8",
    svgBg: "#0f172a",
    svgBorder: "#334155",
    svgNode: "#1e293b",
  },
  light: {
    name: "light",
    app: "bg-slate-100 text-slate-800",
    sidebar: "bg-white border-slate-200",
    header: "bg-white/80 border-slate-200 backdrop-blur",
    card: "bg-white border-slate-200",
    cardSoft: "bg-white/70 border-slate-200",
    panel: "bg-slate-50 border-slate-200",
    input: "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-cyan-600",
    muted: "text-slate-600",
    faint: "text-slate-500",
    heading: "text-slate-900",
    accent: "text-cyan-700",
    accentBg: "bg-cyan-50 border-cyan-300 text-cyan-800",
    tabActive: "bg-cyan-50 text-cyan-800 border-cyan-400",
    tabIdle: "text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100",
    navActive: "bg-cyan-50 text-cyan-800",
    navIdle: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    code: "bg-slate-900 border-slate-300 text-slate-100",
    codeHeader: "bg-slate-800 border-slate-700 text-slate-300",
    terminal: "bg-slate-900 border-slate-300 text-emerald-300",
    chip: "bg-slate-100 text-slate-700 border-slate-300",
    progressTrack: "bg-slate-200",
    progressFill: "bg-gradient-to-r from-cyan-600 to-emerald-500",
    divider: "border-slate-200",
    svgText: "#0f172a",
    svgMuted: "#475569",
    svgBg: "#f8fafc",
    svgNode: "#ffffff",
    svgBorder: "#94a3b8",
  },
};

/* ------------------------------------------------------------------------------------
   CLIPBOARD + CODE BLOCK
   ------------------------------------------------------------------------------------ */
function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function CopyButton({ text, t }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    copyText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [text]);
  return (
    <button
      onClick={onCopy}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition ${
        copied ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : t.chip + " hover:opacity-80"
      }`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ title, lang = "yaml", code, t }) {
  return (
    <div className={`overflow-hidden rounded-xl border ${t.code} shadow-sm`}>
      <div className={`flex items-center justify-between border-b px-3 py-2 text-xs ${t.codeHeader}`}>
        <div className="flex items-center gap-2">
          <FileCode2 size={14} />
          <span className="font-semibold">{title}</span>
          <span className="rounded bg-slate-700/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">
            {lang}
          </span>
        </div>
        <CopyButton text={code} t={t} />
      </div>
      <pre className="max-h-[560px] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TerminalBlock({ cmd, output, t }) {
  return (
    <div className={`overflow-hidden rounded-xl border ${t.terminal}`}>
      <div className={`flex items-center justify-between border-b px-3 py-1.5 text-xs ${t.codeHeader}`}>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 font-mono">bash — lab session</span>
        </div>
        <CopyButton text={cmd} t={t} />
      </div>
      <pre className="overflow-auto p-4 font-mono text-[12.5px] leading-relaxed">
        <span className="text-cyan-300">$ </span>
        <span className="text-slate-100">{cmd}</span>
        {output ? <span className="block whitespace-pre text-emerald-300/90">{output}</span> : null}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------------------------
   SVG PRIMITIVES — shared defs (gradients, arrow markers, pulse animation)
   ------------------------------------------------------------------------------------ */
function Diagram({ viewBox, height = 520, title, t, children }) {
  return (
    <div className={`overflow-hidden rounded-2xl border ${t.card}`}>
      {title ? (
        <div className={`flex items-center gap-2 border-b px-4 py-2 text-xs font-semibold uppercase tracking-wider ${t.codeHeader}`}>
          <LayoutGrid size={14} /> {title}
        </div>
      ) : null}
      <svg viewBox={viewBox} className="w-full" style={{ maxHeight: height, background: t.svgBg }} role="img" aria-label={title}>
        <defs>
          <linearGradient id="gCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          <linearGradient id="gViolet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="gEmerald" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="gAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="gRose" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
          <linearGradient id="gSlate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="gKernel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
          </marker>
          <marker id="arrowAmber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
          </marker>
          <marker id="arrowRose" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb7185" />
          </marker>
          <marker id="arrowEmerald" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
          </marker>
          <marker id="arrowMuted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={t.name === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="0.6" />
          </pattern>
        </defs>
        <style>{`
          .flow { stroke-dasharray: 8 6; animation: dashflow 1.4s linear infinite; }
          .flow-slow { stroke-dasharray: 6 8; animation: dashflow 2.6s linear infinite; }
          .pulse { animation: pulseglow 1.8s ease-in-out infinite; }
          .blink { animation: blink 1.2s steps(2, start) infinite; }
          .clickable { cursor: pointer; transition: opacity .15s ease; }
          .clickable:hover { opacity: .85; }
          @keyframes dashflow { to { stroke-dashoffset: -28; } }
          @keyframes pulseglow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
          @keyframes blink { to { visibility: hidden; } }
        `}</style>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {children}
      </svg>
    </div>
  );
}

function Node({ x, y, w, h, label, sub, fill = "url(#gSlate)", stroke = "#334155", textFill = "#f1f5f9", subFill = "#94a3b8", rx = 10, onClick, active, fontSize = 12 }) {
  return (
    <g className={onClick ? "clickable" : ""} onClick={onClick} filter={active ? "url(#glow)" : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={active ? "#22d3ee" : stroke} strokeWidth={active ? 2.5 : 1.4} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fill={textFill} fontSize={fontSize} fontWeight="600" fontFamily="ui-sans-serif, system-ui">
        {label}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill={subFill} fontSize={fontSize - 2.5} fontFamily="ui-monospace, monospace">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Zone({ x, y, w, h, label, stroke = "#475569", fill = "rgba(30,41,59,0.35)", labelFill = "#94a3b8", dashed = true }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray={dashed ? "6 4" : undefined} />
      <text x={x + 12} y={y + 18} fill={labelFill} fontSize="11" fontWeight="700" letterSpacing="1.5" fontFamily="ui-sans-serif, system-ui">
        {label}
      </text>
    </g>
  );
}

function Edge({ d, color = "#22d3ee", marker = "url(#arrow)", animated = true, width = 1.8, label, lx, ly, labelFill = "#cbd5e1", dash }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} markerEnd={marker} className={animated ? "flow" : ""} strokeDasharray={!animated && dash ? dash : undefined} />
      {label ? (
        <text x={lx} y={ly} fill={labelFill} fontSize="10" fontFamily="ui-monospace, monospace" textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Label({ x, y, text, fill = "#94a3b8", size = 10, anchor = "start", mono = true, weight = "500" }) {
  return (
    <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontWeight={weight} fontFamily={mono ? "ui-monospace, monospace" : "ui-sans-serif, system-ui"}>
      {text}
    </text>
  );
}
/* ====================================================================================
   TRACK 1 DIAGRAMS — Containers & Modern Runtimes
   ==================================================================================== */

/** Cross-section of a Linux host: kernel space vs user space, namespaces, cgroups, OverlayFS. */
function LinuxHostDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 980 560" title="Linux Host Cross-Section — Namespaces, cgroups v2 and OverlayFS" t={t}>
      {/* USER SPACE */}
      <Zone x={20} y={20} w={940} h={300} label="USER SPACE" stroke="#0891b2" fill="rgba(8,145,178,0.06)" labelFill="#22d3ee" />
      {/* Container A */}
      <Zone x={40} y={50} w={280} h={250} label="CONTAINER A  (pid ns 1)" stroke="#7c3aed" fill="rgba(124,58,237,0.10)" labelFill="#c4b5fd" dashed={false} />
      <Node x={60} y={80} w={110} h={40} label="PID 1: tini" sub="init / reaper" fill="url(#gViolet)" />
      <Node x={190} y={80} w={110} h={40} label="PID 7: node" sub="app server" fill="url(#gViolet)" />
      <Edge d="M 115 120 L 115 150" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Node x={60} y={150} w={240} h={34} label="net ns: eth0 10.244.1.12  •  veth → cni0" fill="#1e1b4b" stroke="#6d28d9" fontSize={10.5} />
      <Node x={60} y={192} w={115} h={34} label="mnt ns: / (merged)" fill="#1e1b4b" stroke="#6d28d9" fontSize={10.5} />
      <Node x={185} y={192} w={115} h={34} label="uts ns: host=web-a" fill="#1e1b4b" stroke="#6d28d9" fontSize={10.5} />
      <Node x={60} y={234} w={115} h={34} label="ipc ns: shm/sem" fill="#1e1b4b" stroke="#6d28d9" fontSize={10.5} />
      <Node x={185} y={234} w={115} h={34} label="user ns: 0 → 100000" fill="#1e1b4b" stroke="#6d28d9" fontSize={10.5} />

      {/* Container B */}
      <Zone x={340} y={50} w={280} h={250} label="CONTAINER B  (pid ns 2)" stroke="#059669" fill="rgba(5,150,105,0.10)" labelFill="#6ee7b7" dashed={false} />
      <Node x={360} y={80} w={110} h={40} label="PID 1: postgres" sub="non-root uid 999" fill="url(#gEmerald)" />
      <Node x={490} y={80} w={110} h={40} label="PID 22: wal-writer" sub="child process" fill="url(#gEmerald)" />
      <Node x={360} y={150} w={240} h={34} label="net ns: eth0 10.244.1.13  •  veth → cni0" fill="#022c22" stroke="#059669" fontSize={10.5} />
      <Node x={360} y={192} w={115} h={34} label="mnt ns: /var/lib/pg" fill="#022c22" stroke="#059669" fontSize={10.5} />
      <Node x={485} y={192} w={115} h={34} label="uts ns: host=db-b" fill="#022c22" stroke="#059669" fontSize={10.5} />
      <Node x={360} y={234} w={240} h={34} label="seccomp: RuntimeDefault • caps: drop ALL" fill="#022c22" stroke="#059669" fontSize={10.5} />

      {/* Host process + runtime */}
      <Zone x={640} y={50} w={300} h={250} label="HOST PROCESSES (root ns)" stroke="#475569" labelFill="#94a3b8" />
      <Node x={660} y={80} w={260} h={40} label="containerd  (PID 1123)" sub="/run/containerd/containerd.sock" />
      <Node x={660} y={130} w={125} h={40} label="containerd-shim" sub="runc-v2 (A)" />
      <Node x={795} y={130} w={125} h={40} label="containerd-shim" sub="runc-v2 (B)" />
      <Node x={660} y={180} w={125} h={36} label="runc create" sub="clone(CLONE_NEW*)" fill="url(#gAmber)" />
      <Node x={795} y={180} w={125} h={36} label="runc create" sub="setns / pivot_root" fill="url(#gAmber)" />
      <Node x={660} y={230} w={260} h={40} label="kubelet  (PID 902)" sub="CRI gRPC → containerd" />
      <Edge d="M 722 120 L 722 130" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 857 120 L 857 130" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 722 170 L 722 180" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 857 170 L 857 180" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 660 198 C 620 198, 330 100, 305 100" color="#fbbf24" marker="url(#arrowAmber)" />
      <Edge d="M 795 198 C 760 198, 640 100, 605 100" color="#fbbf24" marker="url(#arrowAmber)" />

      {/* KERNEL SPACE */}
      <Zone x={20} y={335} w={940} h={205} label="KERNEL SPACE" stroke="#a78bfa" fill="url(#gKernel)" labelFill="#c4b5fd" dashed={false} />
      {/* Namespaces */}
      <Node x={40} y={365} w={200} h={30} label="Namespace subsystem" fill="#312e81" stroke="#818cf8" />
      <Node x={40} y={402} w={62} h={26} label="pid" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={108} y={402} w={62} h={26} label="net" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={176} y={402} w={64} h={26} label="mnt" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={40} y={434} w={62} h={26} label="uts" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={108} y={434} w={62} h={26} label="ipc" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={176} y={434} w={64} h={26} label="user" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={40} y={466} w={200} h={26} label="cgroup ns  •  time ns" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />

      {/* cgroups v2 */}
      <Node x={270} y={365} w={300} h={30} label="cgroups v2 — unified hierarchy (/sys/fs/cgroup)" fill="#312e81" stroke="#818cf8" />
      <Node x={270} y={402} w={140} h={40} label="cpu.max" sub="200000 100000 (2 CPU)" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={430} y={402} w={140} h={40} label="memory.max" sub="536870912 (512Mi)" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={270} y={452} w={140} h={40} label="pids.max" sub="4096" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Node x={430} y={452} w={140} h={40} label="io.max" sub="8:0 rbps=104857600" fill="#1e1b4b" stroke="#6366f1" fontSize={10.5} />
      <Label x={280} y={520} text="kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod<uid>.slice" fill="#a5b4fc" size={9.5} />
      {/* throttle lines */}
      <Edge d="M 340 402 C 340 340, 200 330, 180 300" color="#a78bfa" marker="url(#arrowMuted)" width={1.2} label="throttle" lx={250} ly={340} />
      <Edge d="M 500 402 C 500 340, 470 330, 480 300" color="#a78bfa" marker="url(#arrowMuted)" width={1.2} label="OOM-kill" lx={540} ly={340} />

      {/* OverlayFS */}
      <Node x={600} y={365} w={340} h={30} label="OverlayFS (storage driver: overlay2)" fill="#312e81" stroke="#818cf8" />
      <Node x={600} y={402} w={340} h={26} label="merged  → /var/lib/containerd/.../rootfs  (what the container sees)" fill="#0e7490" stroke="#22d3ee" fontSize={10} />
      <Node x={600} y={432} w={165} h={26} label="upperdir (RW, per-container)" fill="#78350f" stroke="#f59e0b" fontSize={10} />
      <Node x={775} y={432} w={165} h={26} label="workdir (atomic rename)" fill="#3f3f46" stroke="#a1a1aa" fontSize={10} />
      <Node x={600} y={462} w={340} h={26} label="lowerdir: L3 app ▸ L2 deps ▸ L1 distroless base  (RO, shared, CoW)" fill="#1e293b" stroke="#64748b" fontSize={10} />
      <Edge d="M 660 462 L 660 458" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Label x={605} y={508} text="write → copy_up() from lowerdir into upperdir (write amplification = full file copy)" fill="#fbbf24" size={9.5} />
      <Label x={605} y={524} text="delete → whiteout char device 0/0 in upperdir; opaque dir xattr trusted.overlay.opaque" fill="#94a3b8" size={9.5} />

      {/* syscall boundary */}
      <Edge d="M 115 268 L 115 335" color="#22d3ee" label="syscalls" lx={140} ly={318} />
      <Edge d="M 415 268 L 415 335" color="#22d3ee" label="seccomp filter" lx={460} ly={318} />
      <Edge d="M 790 270 L 790 335" color="#22d3ee" label="clone/setns/mount" lx={850} ly={318} />
    </Diagram>
  );
}

/** OverlayFS stack & copy-on-write mechanics. */
function OverlayFSDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 980 420" title="OverlayFS Layer Mechanics — Copy-on-Write, Whiteouts and Write Amplification" t={t} height={440}>
      <Zone x={20} y={20} w={560} h={380} label="LAYER STACK (one container instance)" stroke="#0891b2" labelFill="#22d3ee" />
      <Node x={40} y={50} w={520} h={44} label="MERGED VIEW  /  (bind-mounted as rootfs via pivot_root)" sub="lookup order: upperdir → lowerdir[0] → lowerdir[1] → ... (first hit wins)" fill="url(#gCyan)" stroke="#22d3ee" />
      <Node x={40} y={110} w={340} h={44} label="UPPERDIR  (container-writable diff)" sub="/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/91/fs" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={400} y={110} w={160} h={44} label="WORKDIR" sub="tmp for atomic ops" fill="#3f3f46" stroke="#a1a1aa" />
      <Node x={40} y={170} w={520} h={40} label="LOWERDIR[0]  layer sha256:8f2a…  COPY ./dist /app  (2.1 MB)" fill="#1e293b" stroke="#64748b" fontSize={11} />
      <Node x={40} y={218} w={520} h={40} label="LOWERDIR[1]  layer sha256:c41d…  npm ci --omit=dev  (48 MB)" fill="#1e293b" stroke="#64748b" fontSize={11} />
      <Node x={40} y={266} w={520} h={40} label="LOWERDIR[2]  layer sha256:0be9…  gcr.io/distroless/nodejs22  (36 MB)" fill="#1e293b" stroke="#64748b" fontSize={11} />
      <Label x={40} y={332} text="lower layers are content-addressed, immutable and shared by every container from the same image" fill="#94a3b8" />
      <Label x={40} y={350} text="each layer is a tar diff; the snapshotter unpacks them once and references by chain-id" fill="#94a3b8" />
      <Label x={40} y={380} text="mount -t overlay overlay -o lowerdir=L0:L1:L2,upperdir=U,workdir=W /merged" fill="#22d3ee" size={10.5} />

      {/* Operations */}
      <Zone x={600} y={20} w={360} h={380} label="OPERATIONS" stroke="#7c3aed" labelFill="#c4b5fd" />
      <Node x={620} y={52} w={320} h={54} label="READ /app/server.js" sub="found in LOWERDIR[0] → served directly, zero copy" fill="#022c22" stroke="#34d399" />
      <Node x={620} y={118} w={320} h={66} label="WRITE /etc/nginx/nginx.conf (1 byte)" sub="copy_up(): entire 12 KB file copied → upperdir, then modified" fill="#451a03" stroke="#fbbf24" />
      <Label x={630} y={178} text="write amplification: 1 B write ⇒ 12 KB copy (for a 2 GB DB file ⇒ 2 GB copy!)" fill="#fbbf24" size={9.5} />
      <Node x={620} y={196} w={320} h={54} label="DELETE /usr/share/doc" sub="whiteout: mknod c 0 0 in upperdir; dir → xattr trusted.overlay.opaque=y" fill="#4c0519" stroke="#fb7185" />
      <Node x={620} y={262} w={320} h={54} label="rename() across layers" sub="redirect_dir=on → xattr trusted.overlay.redirect, else EXDEV → copy" fill="#1e1b4b" stroke="#818cf8" />
      <Node x={620} y={328} w={320} h={54} label="Volumes / PVC mounts bypass overlay" sub="bind mount inside mnt ns → direct block/network FS I/O" fill="#0e7490" stroke="#22d3ee" />
      <Edge d="M 620 146 C 590 146, 590 132, 380 132" color="#fbbf24" marker="url(#arrowAmber)" />
      <Edge d="M 620 78 C 590 78, 590 190, 560 190" color="#34d399" marker="url(#arrowEmerald)" />
    </Diagram>
  );
}

/** Runtime stack: kubelet → CRI → containerd/CRI-O → shim → runc → kernel. */
function RuntimeStackDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 980 440" title="Container Runtime Architecture — CRI, containerd, CRI-O, shims and runc" t={t} height={460}>
      <Node x={40} y={30} w={200} h={48} label="kubelet" sub="--container-runtime-endpoint" fill="url(#gCyan)" stroke="#22d3ee" />
      <Node x={40} y={110} w={200} h={48} label="crictl / ctr / nerdctl" sub="debug clients" />
      <Edge d="M 140 78 L 140 110" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Node x={40} y={200} w={200} h={60} label="CRI gRPC API" sub="RuntimeService • ImageService" fill="url(#gViolet)" stroke="#a78bfa" />
      <Edge d="M 140 158 L 140 200" label="unix:///run/containerd/containerd.sock" lx={140} ly={182} />

      {/* containerd path */}
      <Zone x={300} y={20} w={320} h={400} label="PATH A — containerd" stroke="#0891b2" labelFill="#22d3ee" />
      <Node x={320} y={50} w={280} h={44} label="containerd daemon" sub="plugins: cri, snapshotter, content store, gc" fill="url(#gCyan)" />
      <Node x={320} y={106} w={135} h={40} label="CRI plugin" sub="pod sandbox mgmt" />
      <Node x={465} y={106} w={135} h={40} label="overlayfs snapshotter" sub="layer mounts" />
      <Node x={320} y={158} w={280} h={40} label="containerd-shim-runc-v2 (per pod / per container)" sub="ttrpc • keeps stdio + exit status if daemon restarts" fill="#1e293b" stroke="#64748b" />
      <Node x={320} y={210} w={280} h={40} label="runc (OCI runtime-spec)" sub="config.json → clone3(), cgroup2, seccomp, pivot_root, execve" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={320} y={262} w={135} h={40} label="CNI plugins" sub="/opt/cni/bin" fill="#022c22" stroke="#34d399" />
      <Node x={465} y={262} w={135} h={40} label="pause container" sub="holds net/ipc ns" fill="#022c22" stroke="#34d399" />
      <Node x={320} y={314} w={280} h={40} label="alt. OCI runtimes: gVisor (runsc) • Kata (VM) • youki" sub="RuntimeClass handler → containerd runtime config" fill="#1e1b4b" stroke="#818cf8" fontSize={10.5} />
      <Label x={320} y={385} text="config: /etc/containerd/config.toml" fill="#94a3b8" />
      <Label x={320} y={402} text={'[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options] SystemdCgroup = true'} fill="#22d3ee" size={9.5} />
      <Edge d="M 240 230 C 280 230, 280 72, 320 72" />
      <Edge d="M 460 94 L 460 106" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 460 146 L 460 158" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 460 198 L 460 210" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 460 250 L 460 262" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />

      {/* CRI-O path */}
      <Zone x={640} y={20} w={320} h={400} label="PATH B — CRI-O" stroke="#7c3aed" labelFill="#c4b5fd" />
      <Node x={660} y={50} w={280} h={44} label="crio daemon" sub="purpose-built CRI (OpenShift default)" fill="url(#gViolet)" />
      <Node x={660} y={106} w={135} h={40} label="containers/storage" sub="overlay driver" />
      <Node x={795} y={106} w={135} h={40} label="containers/image" sub="pull, verify sigs" />
      <Node x={660} y={158} w={280} h={40} label="conmon (per container monitor)" sub="C, tiny; captures logs to /var/log/pods" fill="#1e293b" stroke="#64748b" />
      <Node x={660} y={210} w={280} h={40} label="runc / crun" sub="crun: C impl, ~1ms start, lower RSS" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={660} y={262} w={280} h={40} label="policy.json + registries.conf" sub="signature verification (sigstore, GPG)" fill="#4c0519" stroke="#fb7185" />
      <Label x={660} y={330} text="socket: unix:///var/run/crio/crio.sock" fill="#94a3b8" />
      <Label x={660} y={347} text="config: /etc/crio/crio.conf.d/" fill="#94a3b8" />
      <Label x={660} y={364} text="logs: journalctl -u crio" fill="#94a3b8" />
      <Edge d="M 240 245 C 300 245, 640 300, 640 72 L 660 72" color="#a78bfa" marker="url(#arrowMuted)" />
      <Edge d="M 800 94 L 800 106" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 800 146 L 800 158" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 800 198 L 800 210" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />

      {/* Kernel bar */}
      <Node x={40} y={395} w={200} h={30} label="Linux kernel (ns, cgroup2, LSM)" fill="url(#gKernel)" stroke="#818cf8" fontSize={11} />
      <Edge d="M 140 300 L 140 395" color="#a78bfa" marker="url(#arrowMuted)" label="syscalls" lx={170} ly={350} />
    </Diagram>
  );
}

/** Multi-stage build & image layering pipeline. */
function DockerBuildDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 980 380" title="Production Image Pipeline — Multi-stage builds, cache keys and distroless runtime" t={t} height={400}>
      <Zone x={20} y={20} w={440} h={340} label="BUILD STAGES (BuildKit DAG)" stroke="#0891b2" labelFill="#22d3ee" />
      <Node x={40} y={50} w={400} h={44} label="stage: deps   FROM node:22-bookworm-slim AS deps" sub="COPY package*.json → npm ci   (cache key = lockfile hash)" fill="url(#gCyan)" />
      <Node x={40} y={110} w={400} h={44} label="stage: build  FROM deps AS build" sub="COPY . → npm run build → prune dev deps" fill="url(#gCyan)" />
      <Node x={40} y={170} w={400} h={44} label="stage: test   FROM build AS test" sub="npm test  (RUN --mount=type=cache)" fill="#1e293b" stroke="#64748b" />
      <Node x={40} y={230} w={400} h={44} label="stage: runtime FROM gcr.io/distroless/nodejs22-debian12:nonroot" sub="COPY --from=build /app/dist /app  •  USER 65532  •  tini/ENTRYPOINT" fill="url(#gEmerald)" stroke="#34d399" />
      <Label x={40} y={300} text="--target runtime → only the final stage's layers are exported" fill="#94a3b8" />
      <Label x={40} y={318} text="--mount=type=cache,target=/root/.npm keeps package cache off the image" fill="#94a3b8" />
      <Label x={40} y={336} text="--mount=type=secret,id=npmrc never persists credentials to a layer" fill="#94a3b8" />
      <Edge d="M 240 94 L 240 110" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 240 154 L 240 170" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 440 132 C 480 132, 480 252, 440 252" color="#34d399" marker="url(#arrowEmerald)" label="COPY --from" lx={505} ly={195} />

      <Zone x={480} y={20} w={480} h={340} label="IMAGE SIZE & ATTACK SURFACE" stroke="#7c3aed" labelFill="#c4b5fd" />
      {[
        { y: 52, w: 400, label: "node:22 (full)  ~1.1 GB  •  shell, apt, gcc, 380 pkgs", fill: "url(#gRose)", stroke: "#fb7185" },
        { y: 104, w: 300, label: "node:22-slim  ~230 MB  •  shell, apt, 120 pkgs", fill: "url(#gAmber)", stroke: "#fbbf24" },
        { y: 156, w: 200, label: "node:22-alpine  ~140 MB  •  musl, busybox", fill: "url(#gAmber)", stroke: "#fbbf24" },
        { y: 208, w: 140, label: "distroless/nodejs22  ~130 MB  •  no shell", fill: "url(#gEmerald)", stroke: "#34d399" },
        { y: 260, w: 90, label: "scratch + static binary  ~12 MB", fill: "url(#gEmerald)", stroke: "#34d399" },
      ].map((b, i) => (
        <g key={i}>
          <rect x={500} y={b.y} width={b.w} height={36} rx={8} fill={b.fill} stroke={b.stroke} strokeWidth="1.3" />
          <text x={508} y={b.y + 22} fill="#f8fafc" fontSize="10.5" fontFamily="ui-monospace, monospace">{b.label}</text>
        </g>
      ))}
      <Label x={500} y={325} text="Fewer packages ⇒ fewer CVEs for Trivy/Grype to find ⇒ smaller pull time ⇒ faster scale-out" fill="#94a3b8" />
      <Label x={500} y={343} text="Rule: no shell in prod images; debug with ephemeral containers (kubectl debug)" fill="#22d3ee" />
    </Diagram>
  );
}

/* ====================================================================================
   TRACK 1 MODULE DATA
   ==================================================================================== */
const TRACK1_MODULES = [
  {
    id: "oci-namespaces",
    track: "docker",
    title: "Linux Namespaces & cgroups v2",
    subtitle: "How the kernel builds the illusion of a container",
    icon: "cpu",
    keywords: "namespace pid net mnt uts ipc user cgroup v2 cpu.max memory.max unshare nsenter throttling oom",
    theory: {
      diagram: "linuxHost",
      intro: [
        "A container is not a kernel object. It is a regular Linux process (or process tree) that the runtime starts inside a private set of namespaces, pins into a cgroup for resource accounting, restricts with capabilities, seccomp and an LSM profile, and roots into an OverlayFS mount. Understanding each primitive independently is what lets you debug 'it works on Docker but not on Kubernetes' problems from first principles.",
        "Namespaces virtualize what a process can see; cgroups limit what it can consume. The diagram shows two containers in user space sharing a single kernel. Each container's PID 1 believes it owns the machine, but the host sees ordinary PIDs 1123 → shim → runc → app.",
      ],
      sections: [
        {
          h: "The seven namespaces that matter",
          p: "pid (process tree isolation, PID 1 semantics and zombie reaping), net (own interfaces, routing table, iptables/nftables rules, sockets — the reason a pod needs a pause container to anchor its network), mnt (private mount table; pivot_root swaps the root), uts (hostname/domain), ipc (System V IPC and POSIX message queues — shared between containers in one pod), user (uid/gid remapping so root inside is unprivileged outside; the basis of rootless containers), and cgroup (virtualizes the cgroup root so the container cannot see host slices). The time namespace (5.6+) is used by checkpoint/restore.",
        },
        {
          h: "cgroups v2 unified hierarchy",
          p: "cgroups v2 replaces the per-controller trees of v1 with a single tree mounted at /sys/fs/cgroup. Kubernetes maps QoS classes onto slices: kubepods.slice → kubepods-burstable.slice → kubepods-burstable-pod<uid>.slice → cri-containerd-<id>.scope. Resource requests set cpu.weight (proportional share) and limits set cpu.max (quota period) and memory.max (hard ceiling; exceeding triggers the OOM killer inside the cgroup, visible as OOMKilled with exit code 137). memory.high provides a soft throttle before OOM. pids.max prevents fork bombs. The kubelet requires systemd cgroup driver on cgroup v2 hosts (SystemdCgroup = true in containerd).",
        },
        {
          h: "CPU throttling is the #1 latency mystery",
          p: "CFS quota is enforced per 100ms period. A container with limit 500m that bursts across 4 threads consumes its 50ms quota in 12.5ms wall time and is then frozen for the remaining 87.5ms. This shows up as p99 latency spikes with low average CPU. Inspect cpu.stat for nr_throttled and throttled_usec. Mitigations: raise limits, remove CPU limits for latency-sensitive services (keep requests), or use the static CPU manager policy for exclusive cores.",
        },
        {
          h: "Capabilities, seccomp and LSMs complete the sandbox",
          p: "Namespaces do not stop a root process from loading kernel modules or mounting filesystems. Linux capabilities split root into ~40 privileges (CAP_NET_BIND_SERVICE, CAP_SYS_ADMIN...). Runtimes drop most by default; the CKS-restricted profile drops ALL. Seccomp filters individual syscalls (RuntimeDefault blocks ~50 dangerous ones such as mount, ptrace, keyctl). AppArmor/SELinux add path- or label-based mandatory access control. Together these are the difference between 'isolated' and 'contained'.",
        },
      ],
      keyPoints: [
        "Containers = process + namespaces + cgroups + capabilities + seccomp + rootfs. No hypervisor.",
        "cgroup v2 path pattern: /sys/fs/cgroup/kubepods.slice/kubepods-<qos>.slice/kubepods-<qos>-pod<uid>.slice",
        "Exit code 137 = SIGKILL (usually OOM); 143 = SIGTERM handled; 139 = SIGSEGV.",
        "CPU limits throttle in 100ms windows; check cpu.stat nr_throttled before scaling.",
        "PID 1 must reap zombies and forward signals: use tini or dumb-init, never a bare shell script.",
      ],
    },
    lab: {
      objective: "Manually construct a container with unshare and cgroups v2, then inspect a real containerd container's isolation from the host to correlate kernel primitives with what crictl reports.",
      steps: [
        {
          title: "Create an isolated shell with new pid/mnt/uts/net namespaces",
          cmd: "sudo unshare --pid --fork --mount-proc --uts --net --mount --ipc bash -c 'hostname lab-ns; hostname; ps -ef; ip link'",
          output: "lab-ns\nUID        PID  PPID  C STIME TTY          TIME CMD\nroot         1     0  0 10:02 pts/0    00:00:00 bash -c hostname lab-ns; hostname; ps -ef; ip link\nroot         3     1  0 10:02 pts/0    00:00:00 ps -ef\n1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000",
          note: "PID 1 inside, only loopback in the new net namespace, isolated hostname. This is 90% of what runc does; the rest is cgroups, capabilities and pivot_root.",
        },
        {
          title: "Create a cgroup v2 leaf and throttle it to half a CPU + 64 MiB",
          cmd: "sudo mkdir /sys/fs/cgroup/lab && echo '50000 100000' | sudo tee /sys/fs/cgroup/lab/cpu.max && echo 67108864 | sudo tee /sys/fs/cgroup/lab/memory.max && echo $$ | sudo tee /sys/fs/cgroup/lab/cgroup.procs && cat /sys/fs/cgroup/lab/cpu.max /sys/fs/cgroup/lab/memory.max",
          output: "50000 100000\n67108864\n41233\n50000 100000\n67108864",
          note: "Now run `yes > /dev/null &` twice and watch `cat /sys/fs/cgroup/lab/cpu.stat` — nr_throttled climbs every 100ms period.",
        },
        {
          title: "Inspect which namespaces a running containerd container uses",
          cmd: "PID=$(sudo crictl inspect $(sudo crictl ps -q --name api | head -1) | jq .info.pid) && sudo ls -l /proc/$PID/ns && sudo readlink /proc/1/ns/net /proc/$PID/ns/net",
          output: "lrwxrwxrwx 1 root root 0 cgroup -> 'cgroup:[4026532789]'\nlrwxrwxrwx 1 root root 0 ipc -> 'ipc:[4026532701]'\nlrwxrwxrwx 1 root root 0 mnt -> 'mnt:[4026532786]'\nlrwxrwxrwx 1 root root 0 net -> 'net:[4026532704]'\nlrwxrwxrwx 1 root root 0 pid -> 'pid:[4026532788]'\nlrwxrwxrwx 1 root root 0 user -> 'user:[4026531837]'\nlrwxrwxrwx 1 root root 0 uts -> 'uts:[4026532787]'\nnet:[4026531840]\nnet:[4026532704]",
          note: "Different inode numbers = different namespaces. Note user ns matches the host (4026531837) — standard containerd does not use user namespaces unless the pod sets hostUsers: false.",
        },
        {
          title: "Enter the container's network namespace without a shell in the image",
          cmd: "sudo nsenter -t $PID -n ss -ltnp && sudo nsenter -t $PID -n ip -br addr",
          output: "State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN 0      4096         0.0.0.0:8080       0.0.0.0:*     users:((\"node\",pid=41288,fd=18))\nlo     UNKNOWN 127.0.0.1/8 ::1/128\neth0@if14 UP  10.244.1.12/24 fe80::ac1e:2ff:fe51:9a3c/64",
          note: "nsenter is the distroless debugging superpower — host tooling, container namespace. This is exactly what `kubectl debug --target` automates.",
        },
        {
          title: "Read the container's cgroup limits and throttling counters",
          cmd: "CG=$(cat /proc/$PID/cgroup | cut -d: -f3) && cat /sys/fs/cgroup$CG/cpu.max /sys/fs/cgroup$CG/memory.max && grep -E 'nr_throttled|throttled_usec' /sys/fs/cgroup$CG/cpu.stat && cat /sys/fs/cgroup$CG/memory.current",
          output: "50000 100000\n268435456\nnr_throttled 1842\nthrottled_usec 91234500\n201326592",
          note: "1842 throttled periods with 91s of accumulated throttle on a 500m limit means this service is CPU starved despite 'low utilization' graphs.",
        },
        {
          title: "Verify the effective capability set and seccomp mode",
          cmd: "sudo grep -E 'CapEff|Seccomp|NoNewPrivs' /proc/$PID/status && sudo capsh --decode=$(sudo grep CapEff /proc/$PID/status | awk '{print $2}')",
          output: "CapEff: 00000000a80425fb\nNoNewPrivs: 1\nSeccomp: 2\n0x00000000a80425fb=cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap",
          note: "Seccomp: 2 = filter mode active. This is the default bounding set; CKS restricted profile expects CapEff of 0000000000000000 (drop ALL) plus NET_BIND_SERVICE only when needed.",
        },
      ],
      success: [
        "unshare produced PID 1 with an isolated hostname and empty network stack",
        "cpu.stat nr_throttled increases when the cgroup is over quota",
        "You can map a crictl container ID → host PID → namespace inodes → cgroup path",
        "You can enumerate the container's effective capabilities with capsh",
      ],
    },
    blueprints: [
      {
        title: "Pod spec exercising every kernel isolation knob",
        lang: "yaml",
        code: `apiVersion: v1
kind: Pod
metadata:
  name: isolation-showcase
  namespace: platform
  labels:
    app: isolation-showcase
spec:
  # Run the pod in a user namespace: root (uid 0) inside maps to an unprivileged host uid.
  # Requires kubelet feature gate UserNamespacesSupport (beta, default on since v1.30) and idmap-capable FS.
  hostUsers: false
  # Never share the host's namespaces — each is a full breakout path.
  hostNetwork: false
  hostPID: false
  hostIPC: false
  # Pod-level defaults inherited by every container.
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    fsGroup: 10001
    fsGroupChangePolicy: OnRootMismatch     # avoid recursive chown on large volumes
    seccompProfile:
      type: RuntimeDefault                  # containerd default syscall allowlist
    sysctls:
      - name: net.ipv4.ip_unprivileged_port_start   # safe (namespaced) sysctl
        value: "80"
  containers:
    - name: api
      image: ghcr.io/example/api@sha256:5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c
      ports:
        - containerPort: 8080
          name: http
      resources:
        requests:               # scheduler placement + cpu.weight
          cpu: 250m
          memory: 256Mi
        limits:                 # cpu.max quota + memory.max ceiling (OOMKilled above)
          cpu: "1"
          memory: 256Mi         # memory request == limit → Guaranteed-style memory behaviour
      securityContext:
        allowPrivilegeEscalation: false     # sets no_new_privs; blocks setuid binaries
        readOnlyRootFilesystem: true        # overlay upperdir becomes read-only
        capabilities:
          drop: ["ALL"]
      volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/.cache
      livenessProbe:
        httpGet: { path: /healthz, port: http }
        periodSeconds: 10
      readinessProbe:
        httpGet: { path: /ready, port: http }
        periodSeconds: 5
  volumes:
    - name: tmp
      emptyDir:
        medium: Memory          # tmpfs inside the mnt namespace, counts against memory limit
        sizeLimit: 64Mi
    - name: cache
      emptyDir:
        sizeLimit: 200Mi
  terminationGracePeriodSeconds: 30
`,
      },
      {
        title: "systemd + containerd cgroup v2 configuration (config.toml excerpt)",
        lang: "toml",
        code: `# /etc/containerd/config.toml — generated with: containerd config default > /etc/containerd/config.toml
version = 2

[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
  # Enable image signature verification hooks and restrict to a private mirror if required.
  [plugins."io.containerd.grpc.v1.cri".registry]
    config_path = "/etc/containerd/certs.d"

  [plugins."io.containerd.grpc.v1.cri".containerd]
    default_runtime_name = "runc"
    # Optional hardened runtime class for untrusted workloads
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
      runtime_type = "io.containerd.runc.v2"
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
        SystemdCgroup = true          # MUST match kubelet cgroupDriver: systemd on cgroup v2 hosts
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.gvisor]
      runtime_type = "io.containerd.runsc.v1"
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.kata]
      runtime_type = "io.containerd.kata.v2"

[plugins."io.containerd.grpc.v1.cri".cni]
  bin_dir = "/opt/cni/bin"
  conf_dir = "/etc/cni/net.d"

# Kubelet side (KubeletConfiguration):
#   cgroupDriver: systemd
#   featureGates:
#     UserNamespacesSupport: true
`,
      },
    ],
  },
  {
    id: "oci-overlayfs",
    track: "docker",
    title: "Storage Drivers & OverlayFS",
    subtitle: "Layers, copy-on-write, whiteouts and write amplification",
    icon: "harddrive",
    keywords: "overlay2 overlayfs snapshotter layers copy-on-write cow whiteout upperdir lowerdir workdir image size disk pressure",
    theory: {
      diagram: "overlayfs",
      intro: [
        "Every image is an ordered list of content-addressed tar diffs. The storage driver (overlay2 in Docker, the overlayfs snapshotter in containerd) stacks those read-only layers under a single per-container writable layer using the kernel's OverlayFS union filesystem. The container process sees one coherent root at the merged mount point.",
        "Because lower layers are immutable and shared, 500 replicas of the same image on a node consume one copy of the layers on disk plus 500 tiny upperdirs. This is why image pulls are deduplicated and why layer ordering in a Dockerfile determines cache efficiency.",
      ],
      sections: [
        {
          h: "Lookup and copy-up semantics",
          p: "A path lookup walks upperdir first, then each lowerdir in order; the first match wins. Reads of lower files are served directly from the lower layer inode with no copy. The first write to a lower file triggers copy_up: OverlayFS copies the entire file into upperdir (metadata_only copy-up can defer data copy for chmod/chown), then applies the write. This is write amplification — appending 1 byte to a 2 GB SQLite file in the image copies 2 GB. Databases, caches and logs belong on volumes, never on the container layer.",
        },
        {
          h: "Whiteouts, opaque directories and redirects",
          p: "Deleting a lower file creates a whiteout — a character device with major/minor 0/0 — in the upperdir with the same name, which hides the lower entry. Deleting a directory and recreating it marks the new one opaque via the trusted.overlay.opaque xattr so lower contents no longer merge in. These artifacts are why `RUN rm -rf /var/lib/apt/lists` in a separate layer does not shrink an image: the bytes remain in the earlier layer and are only hidden. Cleanup must happen in the same RUN instruction that created the files.",
        },
        {
          h: "containerd snapshotter and garbage collection",
          p: "containerd stores blobs in /var/lib/containerd/io.containerd.content.v1.content (by digest) and unpacked layers in io.containerd.snapshotter.v1.overlayfs/snapshots/<n>/fs. Snapshots are a parent-chain; an image's chain ID is sha256(parent-chain-id + \" \" + diff-id). The kubelet's image GC deletes unused images when disk usage crosses imageGCHighThresholdPercent (85%) down to imageGCLowThresholdPercent (80%). Node-pressure eviction thresholds (nodefs.available < 10%, imagefs.available < 15%) evict pods when the runtime partition fills up.",
        },
        {
          h: "Alternatives: stargz, nydus, zstd:chunked and CSI ephemeral volumes",
          p: "Lazy-pulling snapshotters (stargz-snapshotter, nydus) mount images before the full blob arrives by seeking within an eStargz/zstd:chunked index — cold start time drops from seconds to milliseconds for large ML images. For large writable scratch space use generic ephemeral volumes backed by a StorageClass instead of emptyDir on the node root disk.",
        },
      ],
      keyPoints: [
        "Layer order = cache efficiency: copy dependency manifests before source code.",
        "rm in a later layer hides, never removes — clean up in the same RUN.",
        "Any heavy write path (DB, logs, cache) must be a volume to avoid copy-up amplification.",
        "kubelet image GC thresholds: high 85% / low 80%; eviction at imagefs.available < 15%.",
        "readOnlyRootFilesystem: true makes the upperdir immutable — pair with emptyDir for /tmp.",
      ],
    },
    lab: {
      objective: "Build an OverlayFS mount by hand, observe copy-up and whiteouts, then correlate with containerd snapshot storage and kubelet disk accounting.",
      steps: [
        {
          title: "Assemble a two-lower-layer overlay by hand",
          cmd: "mkdir -p /tmp/ov/{lower1,lower2,upper,work,merged} && echo base > /tmp/ov/lower2/os-release && echo app-v1 > /tmp/ov/lower1/app.txt && dd if=/dev/zero of=/tmp/ov/lower1/big.bin bs=1M count=64 status=none && sudo mount -t overlay overlay -o lowerdir=/tmp/ov/lower1:/tmp/ov/lower2,upperdir=/tmp/ov/upper,workdir=/tmp/ov/work /tmp/ov/merged && ls -la /tmp/ov/merged",
          output: "total 65548\ndrwxr-xr-x 1 root root       80 Sep 20 10:11 .\n-rw-r--r-- 1 root root        7 Sep 20 10:11 app.txt\n-rw-r--r-- 1 root root 67108864 Sep 20 10:11 big.bin\n-rw-r--r-- 1 root root        5 Sep 20 10:11 os-release",
          note: "The merged view unions both lowers. upperdir is still empty — verify with `ls /tmp/ov/upper`.",
        },
        {
          title: "Trigger copy-up with a one-byte append and measure amplification",
          cmd: "echo x >> /tmp/ov/merged/big.bin && du -sh /tmp/ov/upper/big.bin && ls -la /tmp/ov/upper",
          output: "65M\t/tmp/ov/upper/big.bin\n-rw-r--r-- 1 root root 67108866 Sep 20 10:12 big.bin",
          note: "A 2-byte write cost a 64 MB copy. This is the runtime cost of writing to the container layer.",
        },
        {
          title: "Observe a whiteout and an opaque directory",
          cmd: "rm /tmp/ov/merged/os-release && mkdir /tmp/ov/merged/etc && ls -la /tmp/ov/upper && getfattr -d -m . /tmp/ov/upper/etc 2>/dev/null; ls /tmp/ov/merged",
          output: "c--------- 1 root root 0, 0 Sep 20 10:13 os-release\ndrwxr-xr-x 2 root root  40 Sep 20 10:13 etc\n-rw-r--r-- 1 root root 67108866 Sep 20 10:12 big.bin\napp.txt  big.bin  etc",
          note: "The 0/0 character device is the whiteout hiding os-release. The bytes still live in lower2.",
        },
        {
          title: "Inspect containerd's real snapshot chain for a running pod",
          cmd: "sudo ctr -n k8s.io snapshots --snapshotter overlayfs ls | head -5 && sudo ctr -n k8s.io snapshots --snapshotter overlayfs mounts /tmp/x $(sudo crictl inspect $(sudo crictl ps -q | head -1) | jq -r .info.snapshotKey) | tr ',' '\\n' | head -6",
          output: "KEY                                                                 PARENT                                                                  KIND\n2f0a...9c3d                                                          sha256:6a1b...e4f0                                                      Active\nsha256:6a1b...e4f0                                                   sha256:9d22...0c1a                                                      Committed\nmount -t overlay overlay /tmp/x -o index=off\nworkdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/91/work\nupperdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/91/fs\nlowerdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/88/fs:/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/87/fs",
          note: "Active snapshot = container upperdir; Committed snapshots = image layers, referenced by every container using the image.",
        },
        {
          title: "Check node disk pressure signals the kubelet acts on",
          cmd: "sudo crictl imagefsinfo | jq '.imageFilesystems[0] | {mountpoint: .fsId.mountpoint, usedBytes: .usedBytes.value, inodesUsed: .inodesUsed.value}' && kubectl get --raw /api/v1/nodes/$(hostname)/proxy/stats/summary | jq '.node.fs | {availableBytes, capacityBytes}'",
          output: "{\n  \"mountpoint\": \"/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs\",\n  \"usedBytes\": \"18734592000\",\n  \"inodesUsed\": \"412330\"\n}\n{\n  \"availableBytes\": 21474836480,\n  \"capacityBytes\": 107374182400\n}",
          note: "20% available is above the 15% imagefs eviction threshold but image GC will already be running (usage > 80%). Prune with `crictl rmi --prune`.",
        },
      ],
      success: [
        "Merged mount shows union of lowers; upperdir empty until the first write",
        "One small write produced a full-file copy in upperdir (measured with du)",
        "A whiteout char device appeared after rm",
        "You can map crictl container → snapshotKey → overlay mount options",
      ],
    },
    blueprints: [
      {
        title: "Layer-optimized Dockerfile with in-RUN cleanup and cache mounts",
        lang: "dockerfile",
        code: `# syntax=docker/dockerfile:1.7
# Demonstrates layer hygiene: every RUN cleans up what it creates so no hidden bytes survive.
FROM debian:bookworm-slim AS base

# Single RUN: install + cleanup in the same layer. A separate 'rm' layer would only add whiteouts.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \\
    --mount=type=cache,target=/var/lib/apt,sharing=locked \\
    apt-get update \\
 && apt-get install -y --no-install-recommends ca-certificates curl tini \\
 && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man

FROM base AS build
WORKDIR /src
# Dependency manifests first → this layer's cache survives source-code edits.
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/root/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \\
    CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

# Runtime: static binary on scratch → 1 layer, ~12 MB, zero package CVEs.
FROM scratch AS runtime
COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=base /usr/bin/tini-static /tini
COPY --from=build --chown=65532:65532 /out/server /server
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/tini", "--", "/server"]
`,
      },
      {
        title: "KubeletConfiguration — image GC & eviction thresholds tuned for a 100 GB image disk",
        lang: "yaml",
        code: `apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
# Image garbage collection: begin deleting unused images at 80%, stop at 70%.
imageGCHighThresholdPercent: 80
imageGCLowThresholdPercent: 70
imageMinimumGCAge: 2m
imageMaximumGCAge: 168h              # v1.30+: evict images unused for 7 days regardless of disk
# Hard eviction: pods are killed without grace when these fire.
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "10%"
  nodefs.inodesFree: "5%"
  imagefs.available: "15%"
  imagefs.inodesFree: "5%"
# Soft eviction: gives pods a grace period before termination.
evictionSoft:
  memory.available: "1Gi"
  nodefs.available: "15%"
  imagefs.available: "20%"
evictionSoftGracePeriod:
  memory.available: "1m30s"
  nodefs.available: "2m"
  imagefs.available: "2m"
evictionMaxPodGracePeriod: 60
evictionPressureTransitionPeriod: 5m
# Reserve resources for system daemons so the runtime never starves.
systemReserved:
  cpu: 500m
  memory: 1Gi
  ephemeral-storage: 5Gi
kubeReserved:
  cpu: 500m
  memory: 1Gi
  ephemeral-storage: 5Gi
enforceNodeAllocatable: ["pods"]
containerLogMaxSize: 20Mi
containerLogMaxFiles: 5
serializeImagePulls: false
maxParallelImagePulls: 4
`,
      },
    ],
  },
  {
    id: "oci-runtimes",
    track: "docker",
    title: "Container Runtimes: containerd, CRI-O & runc",
    subtitle: "The CRI contract, shims, OCI runtime-spec and sandboxed runtimes",
    icon: "container",
    keywords: "containerd cri-o runc crun cri shim ctr crictl nerdctl oci runtime-spec runtimeclass gvisor kata pause sandbox",
    theory: {
      diagram: "runtimeStack",
      intro: [
        "Kubernetes talks to a runtime through one gRPC contract, the Container Runtime Interface (CRI), which exposes two services: RuntimeService (sandbox and container lifecycle, exec, attach, port-forward, stats) and ImageService (pull, list, remove). Any implementation of that contract — containerd's CRI plugin, CRI-O, or an experimental runtime — plugs into the kubelet unchanged. Docker Engine required the dockershim adapter, which was removed in v1.24; Mirantis cri-dockerd exists for legacy needs.",
        "Below the CRI layer sits the OCI runtime-spec: a config.json describing namespaces, cgroups, mounts, capabilities, seccomp and the process to exec. runc (Go), crun (C) and youki (Rust) all implement it. Sandboxed runtimes — gVisor's runsc (user-space kernel) and Kata Containers (micro-VM per pod) — implement the same interface for stronger isolation and are selected per pod with RuntimeClass.",
      ],
      sections: [
        {
          h: "Pod sandbox and the pause container",
          p: "RunPodSandbox creates the pod-level namespaces (net, ipc, uts) and a cgroup parent, then starts the pause container — a ~700 KB binary whose only job is to hold those namespaces open and reap zombies when shareProcessNamespace is set. Only after CNI ADD returns an IP does the kubelet call CreateContainer for each container, each joining the sandbox namespaces. If the pause container dies, every container in the pod is restarted: it is the pod's anchor.",
        },
        {
          h: "Why shims exist",
          p: "The containerd daemon must be restartable without killing workloads. Each pod gets a containerd-shim-runc-v2 process that becomes the parent of the container processes, owns their stdio pipes and records exit codes over ttrpc. runc itself exits immediately after `runc create/start`; it is a launcher, not a supervisor. CRI-O achieves the same with conmon. When you see many shim processes in `ps`, that is normal — one per pod (runc v2 shims are pod-scoped).",
        },
        {
          h: "Reading an OCI bundle",
          p: "runc state lives in /run/containerd/io.containerd.runtime.v2.task/k8s.io/<id>/ with config.json (the full spec: linux.namespaces, linux.resources.cpu.quota, linux.seccomp, process.capabilities, mounts with overlay options) and rootfs (the merged overlay mount). `runc --root /run/containerd/runc/k8s.io list` shows containers as runc sees them. This is the ground truth when the kubelet and reality disagree.",
        },
        {
          h: "RuntimeClass and per-workload isolation",
          p: "RuntimeClass maps a handler name (runc, gvisor, kata) to a runtime configured in containerd's config.toml. It also carries scheduling nodeSelectors (only nodes with the runtime installed) and overhead (extra CPU/memory the sandbox itself needs, added to pod requests). For CKS, untrusted or multi-tenant workloads should run under gVisor or Kata; you will be asked to create a RuntimeClass and assign it to a pod.",
        },
      ],
      keyPoints: [
        "kubelet ↔ CRI (gRPC over unix socket) ↔ containerd/CRI-O ↔ shim ↔ runc ↔ kernel.",
        "The pause container holds the pod's net/ipc/uts namespaces; it must never be OOM-killed.",
        "crictl is the CRI-level debugger; ctr is containerd-native (namespace k8s.io); nerdctl is the Docker-compatible UX.",
        "RuntimeClass = handler + nodeSelector + overhead; gVisor/Kata for untrusted tenants.",
        "SystemdCgroup=true in containerd must match kubelet cgroupDriver: systemd.",
      ],
    },
    lab: {
      objective: "Drive the runtime directly with crictl and ctr, read the OCI bundle runc actually executed, and enable a sandboxed runtime through RuntimeClass.",
      steps: [
        {
          title: "Configure crictl and list sandboxes vs containers",
          cmd: "cat <<EOF | sudo tee /etc/crictl.yaml\nruntime-endpoint: unix:///run/containerd/containerd.sock\nimage-endpoint: unix:///run/containerd/containerd.sock\ntimeout: 10\ndebug: false\nEOF\nsudo crictl pods --namespace kube-system -o table | head -4 && sudo crictl ps --pod $(sudo crictl pods --name coredns -q | head -1)",
          output: "POD ID        CREATED       STATE   NAME                       NAMESPACE     ATTEMPT  RUNTIME\n9a2c1f0e4b7d  2 hours ago   Ready   coredns-7c65d6cfc9-x2k9p   kube-system   0        (default)\n4d8b9e2a1c3f  2 hours ago   Ready   kube-proxy-lm4t8           kube-system   0        (default)\nCONTAINER     IMAGE          CREATED      STATE    NAME     ATTEMPT  POD ID        POD\n61e0c2ab9d4f  c69fa2e9cbf5f  2 hours ago  Running  coredns  0        9a2c1f0e4b7d  coredns-7c65d6cfc9-x2k9p",
          note: "A pod (sandbox) and a container are different CRI objects. The pause container is invisible in crictl ps — see it with `ctr -n k8s.io c ls`.",
        },
        {
          title: "Pull, run and exec a container purely through CRI (no kubelet involved)",
          cmd: "sudo crictl pull docker.io/library/busybox:1.36 && cat > /tmp/sb.json <<EOF\n{\"metadata\":{\"name\":\"lab-sb\",\"namespace\":\"default\",\"uid\":\"lab-1\"},\"log_directory\":\"/tmp\",\"linux\":{}}\nEOF\ncat > /tmp/ctr.json <<EOF\n{\"metadata\":{\"name\":\"bb\"},\"image\":{\"image\":\"docker.io/library/busybox:1.36\"},\"command\":[\"sleep\",\"3600\"],\"log_path\":\"bb.log\",\"linux\":{}}\nEOF\nSB=$(sudo crictl runp /tmp/sb.json) && C=$(sudo crictl create $SB /tmp/ctr.json /tmp/sb.json) && sudo crictl start $C && sudo crictl exec $C cat /proc/1/comm",
          output: "Image is up to date for sha256:3f57d9401f8d42f986df300f0c69192fc41da28ccc8d797829467780db3dd741\n5ce4d1c0b2a7e8f9d3b1c0a2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2\nsleep",
          note: "The kubelet does exactly this sequence: RunPodSandbox → PullImage → CreateContainer → StartContainer. Clean up later with `crictl rmp -f $SB`.",
        },
        {
          title: "Read the OCI bundle runc executed",
          cmd: "sudo cat /run/containerd/io.containerd.runtime.v2.task/k8s.io/$C/config.json | jq '{ns: [.linux.namespaces[].type], caps: .process.capabilities.bounding, cpu: .linux.resources.cpu, seccomp: (.linux.seccomp.defaultAction // \"none\"), rootfs: .root}'",
          output: "{\n  \"ns\": [\"pid\", \"ipc\", \"uts\", \"mount\", \"network\"],\n  \"caps\": [\"CAP_CHOWN\", \"CAP_DAC_OVERRIDE\", \"CAP_FSETID\", \"CAP_FOWNER\", \"CAP_MKNOD\", \"CAP_NET_RAW\", \"CAP_SETGID\", \"CAP_SETUID\", \"CAP_SETFCAP\", \"CAP_SETPCAP\", \"CAP_NET_BIND_SERVICE\", \"CAP_SYS_CHROOT\", \"CAP_KILL\", \"CAP_AUDIT_WRITE\"],\n  \"cpu\": {\"shares\": 2, \"quota\": 0, \"period\": 100000},\n  \"seccomp\": \"none\",\n  \"rootfs\": {\"path\": \"rootfs\"}\n}",
          note: "No seccomp because the CRI request set none — the kubelet would send RuntimeDefault when the pod asks. The 'network' namespace is a path to the sandbox's ns, not a new one.",
        },
        {
          title: "Cross-check with runc and containerd-native views",
          cmd: "sudo runc --root /run/containerd/runc/k8s.io list | head -3 && sudo ctr -n k8s.io task ls | head -3 && sudo ctr -n k8s.io containers info $C | jq -r '.Runtime.Name'",
          output: "ID                                                                 PID     STATUS   BUNDLE                                                                 CREATED\n5ce4d1c0b2a7e8f9d3b1c0a2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2   52310   running  /run/containerd/io.containerd.runtime.v2.task/k8s.io/5ce4d1c0b2a7...  2026-09-20T14:20:11Z\nTASK                                                               PID     STATUS\n5ce4d1c0b2a7e8f9d3b1c0a2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2   52310   RUNNING\nio.containerd.runc.v2",
          note: "Three tools, one PID. If crictl shows Running but runc shows stopped, the shim lost track — restart the pod sandbox.",
        },
        {
          title: "Enable gVisor and schedule a pod onto it with RuntimeClass",
          cmd: "kubectl apply -f runtimeclass-gvisor.yaml && kubectl run sandboxed --image=nginx:1.27 --overrides='{\"spec\":{\"runtimeClassName\":\"gvisor\"}}' && sleep 8 && kubectl exec sandboxed -- dmesg | head -3",
          output: "runtimeclass.node.k8s.io/gvisor created\npod/sandboxed created\n[    0.000000] Starting gVisor...\n[    0.412207] Checking naughty and nice process list...\n[    0.598812] Creating cloned children...",
          note: "A gVisor dmesg is the tell — the container is talking to Sentry, a user-space kernel, not the host kernel.",
        },
      ],
      success: [
        "crictl runp/create/start/exec works without the kubelet",
        "config.json namespaces and capabilities match the pod securityContext",
        "runc list, ctr task ls and crictl ps agree on the container PID",
        "A pod scheduled with runtimeClassName: gvisor prints gVisor's dmesg",
      ],
    },
    blueprints: [
      {
        title: "RuntimeClass definitions for gVisor and Kata with scheduling + overhead",
        lang: "yaml",
        code: `apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
# Must match the runtime key in containerd's config.toml:
# [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.gvisor]
handler: gvisor
# Only schedule onto nodes that advertise the runtime.
scheduling:
  nodeSelector:
    runtime.example.com/gvisor: "true"
  tolerations:
    - key: sandbox.example.com/dedicated
      operator: Equal
      value: gvisor
      effect: NoSchedule
# Sentry + Gofer processes cost real resources; added to pod requests for scheduling and quota.
overhead:
  podFixed:
    cpu: 250m
    memory: 128Mi
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata
handler: kata
scheduling:
  nodeSelector:
    runtime.example.com/kata: "true"
overhead:
  podFixed:
    cpu: 500m
    memory: 256Mi        # micro-VM guest kernel + agent
---
# Untrusted tenant workload pinned to the sandboxed runtime
apiVersion: v1
kind: Pod
metadata:
  name: untrusted-job
  namespace: tenant-a
spec:
  runtimeClassName: gvisor
  securityContext:
    runAsNonRoot: true
    runAsUser: 65532
    seccompProfile: { type: RuntimeDefault }
  containers:
    - name: worker
      image: ghcr.io/example/worker@sha256:9b1e4c8f3a2d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f
      resources:
        requests: { cpu: 500m, memory: 512Mi }
        limits: { cpu: "1", memory: 512Mi }
      securityContext:
        allowPrivilegeEscalation: false
        capabilities: { drop: ["ALL"] }
        readOnlyRootFilesystem: true
`,
      },
      {
        title: "containerd runtime handlers + registry mirror with mTLS (certs.d)",
        lang: "toml",
        code: `# /etc/containerd/config.toml (runtime section)
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.gvisor]
  runtime_type = "io.containerd.runsc.v1"
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.gvisor.options]
    TypeUrl = "io.containerd.runsc.v1.options"
    ConfigPath = "/etc/containerd/runsc.toml"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.kata]
  runtime_type = "io.containerd.kata.v2"
  privileged_without_host_devices = true

# /etc/containerd/certs.d/registry.internal.example.com/hosts.toml
# server = "https://registry.internal.example.com"
#
# [host."https://registry.internal.example.com"]
#   capabilities = ["pull", "resolve"]
#   ca = "/etc/containerd/certs.d/registry.internal.example.com/ca.crt"
#   client = [["/etc/containerd/certs.d/registry.internal.example.com/client.crt",
#              "/etc/containerd/certs.d/registry.internal.example.com/client.key"]]
#
# /etc/containerd/certs.d/docker.io/hosts.toml  (pull-through cache for Docker Hub)
# server = "https://registry-1.docker.io"
# [host."https://mirror.internal.example.com/v2/dockerhub"]
#   capabilities = ["pull", "resolve"]
#   override_path = true
`,
      },
    ],
  },
  {
    id: "docker-images",
    track: "docker",
    title: "Production Dockerfiles & Image Hygiene",
    subtitle: "Multi-stage builds, BuildKit cache, distroless, tini and non-root by default",
    icon: "package",
    keywords: "dockerfile multi-stage buildkit cache distroless alpine tini init non-root user healthcheck sbom provenance attestations buildx",
    theory: {
      diagram: "dockerBuild",
      intro: [
        "A production image has four properties: it is small (fewer bytes, fewer CVEs, faster pulls), reproducible (pinned digests, deterministic layers), safe (non-root, no shell, no secrets in layers) and observable (labels, SBOM and provenance attestations). Multi-stage builds are the mechanism: build tooling lives in throwaway stages; only the artifact is copied into a minimal runtime stage.",
        "BuildKit (the default builder in Docker 23+ and buildx) evaluates the Dockerfile as a DAG, executes independent stages in parallel, skips stages not needed by --target, and offers RUN --mount for caches and secrets that never touch a layer.",
      ],
      sections: [
        {
          h: "Cache invalidation rules",
          p: "An instruction's cache key includes the instruction text and, for COPY/ADD, the checksum of copied files. Once a layer misses, every subsequent layer rebuilds. Therefore order from least- to most-volatile: base image → OS packages → dependency manifests (package.json, go.sum, requirements.txt) → dependency install → source → build. Use .dockerignore to exclude .git, node_modules and build output; otherwise `COPY . .` invalidates on every commit and ships secrets.",
        },
        {
          h: "Init, signals and graceful shutdown",
          p: "PID 1 in a pid namespace does not receive default signal handlers: SIGTERM is ignored unless the process installs a handler, and zombies are never reaped unless PID 1 waits on them. Shell-form CMD (`CMD node server.js`) wraps the app in /bin/sh -c, so the shell is PID 1 and never forwards SIGTERM — the container is force-killed after terminationGracePeriodSeconds. Use exec form with tini (`ENTRYPOINT [\"/tini\",\"--\"]`) or docker run --init. In Kubernetes, Kubelet sends SIGTERM to PID 1 of each container, waits for the grace period, then SIGKILL.",
        },
        {
          h: "Distroless vs Alpine vs scratch",
          p: "Alpine uses musl libc: smaller, but DNS resolution differences (no search-domain ndots behaviour parity, historically no TCP fallback), performance regressions in memory allocators, and Python wheels compiled for glibc need rebuilds. Distroless (Google) keeps glibc, ca-certificates, tzdata and the language runtime with no shell or package manager; the :nonroot tag runs as uid 65532. scratch is the empty image for static binaries (Go with CGO_ENABLED=0, Rust with musl target). Choose distroless as the default and scratch when the binary is truly static.",
        },
        {
          h: "Supply-chain metadata at build time",
          p: "buildx --sbom=true --provenance=mode=max attaches SPDX SBOM and SLSA provenance attestations to the OCI index. OCI annotations (org.opencontainers.image.source, .revision, .version) let scanners and admission controllers trace an image to a commit. Always push by digest into deployment manifests; tags are mutable and are the most common supply-chain confusion vector.",
        },
      ],
      keyPoints: [
        "Order layers by volatility; copy manifests before source; use .dockerignore.",
        "Exec-form ENTRYPOINT + tini so SIGTERM reaches the app and zombies are reaped.",
        "Never store secrets in layers: RUN --mount=type=secret; never ARG for tokens.",
        "Distroless :nonroot by default; scratch for static binaries; Alpine only when you accept musl.",
        "Pin base images by digest and emit SBOM + provenance from buildx.",
      ],
    },
    lab: {
      objective: "Build the same service three ways, measure size and CVE count, prove signal handling, and generate SBOM/provenance attestations.",
      steps: [
        {
          title: "Build the naive and optimized images and compare sizes",
          cmd: "docker build -t api:naive -f Dockerfile.naive . && docker build --target runtime -t api:prod . && docker image ls api --format 'table {{.Repository}}:{{.Tag}}\\t{{.Size}}'",
          output: "REPOSITORY:TAG   SIZE\napi:naive        1.12GB\napi:prod         131MB",
          note: "8.5x smaller. `docker history api:prod --no-trunc` shows exactly which instruction produced each layer.",
        },
        {
          title: "Scan both for vulnerabilities and count",
          cmd: "for i in naive prod; do echo -n \"api:$i → \"; trivy image --quiet --severity HIGH,CRITICAL --format json api:$i | jq '[.Results[].Vulnerabilities // [] | length] | add'; done",
          output: "api:naive → 214\napi:prod → 3",
          note: "The remaining 3 are in the Node runtime itself — fix by bumping the distroless tag, not by adding packages.",
        },
        {
          title: "Prove SIGTERM handling with and without tini",
          cmd: "docker run -d --name bad --entrypoint sh api:naive -c 'node server.js' && time docker stop bad; docker run -d --name good api:prod && time docker stop good",
          output: "bad\nreal    0m10.31s      # sh is PID 1, ignores SIGTERM, killed after 10s timeout\ngood\nreal    0m0.42s       # tini forwards SIGTERM, app closes listeners and exits 0",
          note: "In Kubernetes the same bug costs the full terminationGracePeriodSeconds on every rollout and drops in-flight requests.",
        },
        {
          title: "Verify non-root, read-only root FS and no shell",
          cmd: "docker run --rm api:prod id 2>&1 | head -1; docker inspect api:prod --format '{{.Config.User}} {{.Config.Entrypoint}}' && docker run --rm --read-only --tmpfs /tmp api:prod --version",
          output: "docker: Error response from daemon: ... exec: \"id\": executable file not found in $PATH\n65532:65532 [/tini -- /nodejs/bin/node /app/server.js]\nv22.11.0",
          note: "No `id`, no `sh` — an attacker who lands RCE has no tools. Debug in K8s with `kubectl debug -it pod --image=busybox --target=api`.",
        },
        {
          title: "Build with SBOM + provenance and push by digest",
          cmd: "docker buildx build --platform linux/amd64,linux/arm64 --sbom=true --provenance=mode=max --target runtime -t ghcr.io/example/api:1.4.2 --push . && docker buildx imagetools inspect ghcr.io/example/api:1.4.2 --format '{{json .Manifest.Digest}}'",
          output: "=> exporting attestation manifest sha256:7d1e...\n=> pushing ghcr.io/example/api:1.4.2\n\"sha256:5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c\"",
          note: "Record that digest in your Deployment (image: ghcr.io/example/api@sha256:5c8f...). Tags drift; digests do not.",
        },
      ],
      success: [
        "Optimized image is < 15% of the naive image size",
        "HIGH/CRITICAL CVE count drops by more than an order of magnitude",
        "docker stop returns in < 1s with tini; ~10s without",
        "Image runs as uid 65532 with a read-only root filesystem and no shell",
        "buildx produced SBOM and provenance attestations",
      ],
    },
    blueprints: [
      {
        title: "Production Node.js Dockerfile — multi-stage, distroless, tini, non-root, cache/secret mounts",
        lang: "dockerfile",
        code: `# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Stage 1: deps — install exactly what the lockfile says, cached on the lockfile hash
# ---------------------------------------------------------------------------
ARG NODE_VERSION=22.11.0
FROM node:\${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# npm cache persists across builds; the private .npmrc is mounted as a secret and never written to a layer.
RUN --mount=type=cache,target=/root/.npm \\
    --mount=type=secret,id=npmrc,target=/root/.npmrc \\
    npm ci --omit=dev --ignore-scripts

# ---------------------------------------------------------------------------
# Stage 2: build — needs dev deps for TypeScript; discarded afterwards
# ---------------------------------------------------------------------------
FROM node:\${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 3: test — only executed when --target test is requested (CI)
# ---------------------------------------------------------------------------
FROM build AS test
COPY test ./test
RUN npm test

# ---------------------------------------------------------------------------
# Stage 4: tini — pull a static init binary from a pinned Debian stage
# ---------------------------------------------------------------------------
FROM debian:bookworm-slim AS tini
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \\
    --mount=type=cache,target=/var/lib/apt,sharing=locked \\
    apt-get update && apt-get install -y --no-install-recommends tini

# ---------------------------------------------------------------------------
# Stage 5: runtime — distroless, non-root, no shell, no package manager
# ---------------------------------------------------------------------------
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runtime
ARG GIT_SHA=unknown
ARG VERSION=0.0.0
LABEL org.opencontainers.image.source="https://github.com/example/api" \\
      org.opencontainers.image.revision="\${GIT_SHA}" \\
      org.opencontainers.image.version="\${VERSION}" \\
      org.opencontainers.image.vendor="Example Inc." \\
      org.opencontainers.image.title="api"
WORKDIR /app
ENV NODE_ENV=production \\
    NODE_OPTIONS="--max-old-space-size=384 --enable-source-maps" \\
    PORT=8080
COPY --from=tini /usr/bin/tini-static /tini
COPY --from=deps  --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --chown=nonroot:nonroot package.json ./
USER nonroot:nonroot
EXPOSE 8080
# Distroless has no shell: HEALTHCHECK must exec a binary. Kubernetes probes replace this; kept for docker run.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \\
  CMD ["/nodejs/bin/node", "dist/healthcheck.js"]
ENTRYPOINT ["/tini", "--", "/nodejs/bin/node", "dist/server.js"]
`,
      },
      {
        title: ".dockerignore + buildx bake for reproducible CI builds",
        lang: "hcl",
        code: `# .dockerignore
# .git
# node_modules
# dist
# coverage
# **/*.env
# **/.env.*
# Dockerfile*
# docker-compose*.yml

# docker-bake.hcl — run with: docker buildx bake --push
variable "REGISTRY" { default = "ghcr.io/example" }
variable "VERSION"  { default = "0.0.0-dev" }
variable "GIT_SHA"  { default = "unknown" }

group "default" { targets = ["api"] }

target "api" {
  context    = "."
  dockerfile = "Dockerfile"
  target     = "runtime"
  platforms  = ["linux/amd64", "linux/arm64"]
  args = {
    VERSION = VERSION
    GIT_SHA = GIT_SHA
  }
  secret = ["id=npmrc,src=./.npmrc"]
  tags = [
    "\${REGISTRY}/api:\${VERSION}",
    "\${REGISTRY}/api:sha-\${GIT_SHA}"
  ]
  attest = [
    "type=sbom",
    "type=provenance,mode=max"
  ]
  cache-from = ["type=registry,ref=\${REGISTRY}/api:buildcache"]
  cache-to   = ["type=registry,ref=\${REGISTRY}/api:buildcache,mode=max"]
  labels = {
    "org.opencontainers.image.created" = timestamp()
  }
}

target "test" {
  inherits = ["api"]
  target   = "test"
  platforms = ["linux/amd64"]
  output   = ["type=cacheonly"]
}
`,
      },
    ],
  },
];
/* ====================================================================================
   TRACK 2 DIAGRAMS — Kubernetes Core & Administration (CKA)
   ==================================================================================== */

/** Full cluster topology with an API request traced from kubectl to etcd. */
function ClusterTopologyDiagram({ t }) {
  const pipeline = [
    ["Authentication", "x509 • OIDC • SA token • webhook", 70],
    ["Authorization", "RBAC → Node → Webhook (any allow)", 100],
    ["Mutating admission", "webhooks • defaults • sidecar inject", 130],
    ["Schema validation + Validating admission", "CEL VAP • PSA • OPA/Kyverno webhooks", 160],
    ["Storage (etcd3 codec)", "encrypt-at-rest (KMSv2) → protobuf", 190],
  ];
  return (
    <Diagram viewBox="0 0 1000 600" title="Cluster Topology & API Request Path — kubectl → authn → authz → admission → etcd" t={t} height={620}>
      <Node x={20} y={40} w={130} h={54} label="kubectl apply" sub="~/.kube/config" fill="url(#gCyan)" stroke="#22d3ee" />
      <Edge d="M 150 67 L 205 67" label="HTTPS :6443" lx={178} ly={58} />

      <Zone x={205} y={20} w={560} h={330} label="CONTROL PLANE (stacked etcd, 3 nodes behind LB)" stroke="#7c3aed" fill="rgba(124,58,237,0.06)" labelFill="#c4b5fd" />
      <Zone x={220} y={45} w={330} h={175} label="kube-apiserver request pipeline" stroke="#0891b2" fill="rgba(8,145,178,0.08)" labelFill="#22d3ee" dashed={false} />
      {pipeline.map(([l, s, y], i) => (
        <g key={i}>
          <rect x={232} y={y} width={306} height={26} rx={6} fill={i === 4 ? "url(#gViolet)" : "#0e7490"} stroke={i === 4 ? "#a78bfa" : "#22d3ee"} strokeWidth="1" />
          <text x={240} y={y + 12} fill="#f8fafc" fontSize="10" fontWeight="600" fontFamily="ui-sans-serif, system-ui">{l}</text>
          <text x={240} y={y + 22} fill="#cbd5e1" fontSize="8.5" fontFamily="ui-monospace, monospace">{s}</text>
          {i < 4 ? <path d={`M 520 ${y + 26} L 520 ${y + 30}`} stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arrow)" /> : null}
        </g>
      ))}
      <Node x={570} y={60} w={180} h={64} label="etcd (Raft quorum 3/5)" sub="2379 client • 2380 peer" fill="url(#gViolet)" stroke="#a78bfa" />
      <Label x={578} y={140} text="leader ← heartbeat → followers" fill="#c4b5fd" size={9.5} />
      <Label x={578} y={154} text="/registry/pods/<ns>/<name>" fill="#c4b5fd" size={9.5} />
      <Label x={578} y={168} text="fsync WAL → commit index" fill="#c4b5fd" size={9.5} />
      <Edge d="M 538 203 C 560 203, 560 92, 570 92" color="#a78bfa" marker="url(#arrowMuted)" label="PUT /registry/..." lx={600} ly={195} />
      <Edge d="M 570 110 C 560 110, 560 225, 538 225" color="#34d399" marker="url(#arrowEmerald)" label="watch events" lx={615} ly={215} />

      <Node x={220} y={240} w={160} h={52} label="kube-controller-manager" sub="Deployment→RS→Pod loops" fill="url(#gEmerald)" stroke="#34d399" />
      <Node x={395} y={240} w={155} h={52} label="kube-scheduler" sub="Filter → Score → Bind" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={570} y={240} w={180} h={52} label="cloud-controller-manager" sub="LB • routes • node lifecycle" />
      <Edge d="M 300 240 L 300 220" color="#34d399" marker="url(#arrowEmerald)" />
      <Edge d="M 470 240 L 470 220" color="#fbbf24" marker="url(#arrowAmber)" />
      <Label x={228} y={318} text="informers: LIST once, WATCH resourceVersion → shared cache → workqueue → reconcile()" fill="#94a3b8" size={9.5} />
      <Label x={228} y={334} text="scheduler: NodeAffinity, TaintToleration, PodTopologySpread, NodeResourcesFit → score 0-100 → Bind" fill="#94a3b8" size={9.5} />

      <Node x={790} y={40} w={190} h={40} label="LB / VIP  6443" sub="kube-vip • HAProxy • ELB" />
      <Edge d="M 790 60 L 765 60" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />

      {[0, 1].map((n) => {
        const x = 20 + n * 490;
        return (
          <g key={n}>
            <Zone x={x} y={380} w={470} h={200} label={`WORKER NODE ${n + 1}  •  10.0.1.${11 + n}`} stroke="#059669" fill="rgba(5,150,105,0.06)" labelFill="#6ee7b7" />
            <Node x={x + 15} y={410} w={135} h={46} label="kubelet" sub="PodSpec → CRI/CNI/CSI" fill="url(#gCyan)" />
            <Node x={x + 160} y={410} w={135} h={46} label="kube-proxy" sub="iptables/IPVS/nftables" />
            <Node x={x + 305} y={410} w={150} h={46} label="containerd" sub="shim → runc" />
            <Node x={x + 15} y={470} w={135} h={40} label="CNI agent" sub="cilium / calico-node" fill="#022c22" stroke="#34d399" />
            <Node x={x + 160} y={470} w={135} h={40} label="CSI node plugin" sub="mount / stage volumes" fill="#022c22" stroke="#34d399" />
            <Node x={x + 305} y={470} w={150} h={40} label="pause + app pods" sub={`10.244.${n + 1}.0/24`} fill="#1e1b4b" stroke="#818cf8" />
            <Label x={x + 15} y={535} text="logs: /var/log/pods/<ns>_<pod>_<uid>/<ctr>/0.log  •  journalctl -u kubelet" fill="#94a3b8" size={9} />
            <Label x={x + 15} y={550} text="config: /var/lib/kubelet/config.yaml  •  /etc/kubernetes/kubelet.conf" fill="#94a3b8" size={9} />
            <Label x={x + 15} y={565} text="10250 kubelet API (authn/authz via apiserver)  •  10256 kube-proxy healthz" fill="#94a3b8" size={9} />
            <Edge d={`M ${x + 82} 410 C ${x + 82} 370, 385 300, 385 292`} color="#22d3ee" marker="url(#arrow)" label={n === 0 ? "watch pods (nodeName=me)" : ""} lx={230} ly={372} />
          </g>
        );
      })}
    </Diagram>
  );
}

/** Kubelet pod lifecycle: SyncPod → CRI sandbox → CNI ADD → CSI NodePublish → containers → probes. */
function PodLifecycleDiagram({ t }) {
  const steps = [
    ["1. Bind", "scheduler sets spec.nodeName", "#0e7490"],
    ["2. SyncPod", "kubelet watch → PLEG", "#0e7490"],
    ["3. Volumes", "CSI NodeStage/NodePublish", "#047857"],
    ["4. Sandbox", "CRI RunPodSandbox (pause)", "#6d28d9"],
    ["5. CNI ADD", "veth + IP + routes", "#047857"],
    ["6. Init ctrs", "sequential, must exit 0", "#b45309"],
    ["7. App ctrs", "CreateContainer/Start", "#6d28d9"],
    ["8. Probes", "startup → readiness → liveness", "#b45309"],
    ["9. Endpoints", "EndpointSlice ready=true", "#0e7490"],
  ];
  return (
    <Diagram viewBox="0 0 1000 420" title="Kubelet Pod Lifecycle — CRI, CNI and CSI interaction" t={t} height={440}>
      {steps.map(([l, s, c], i) => {
        const x = 20 + (i % 5) * 195;
        const y = i < 5 ? 40 : 130;
        return (
          <g key={i}>
            <Node x={x} y={y} w={175} h={54} label={l} sub={s} fill={c} stroke="#cbd5e1" />
            {(i < 4 || (i > 4 && i < 8)) ? <Edge d={`M ${x + 175} ${y + 27} L ${x + 195} ${y + 27}`} /> : null}
            {i === 4 ? <Edge d={`M ${x + 87} ${y + 54} C ${x + 87} 120, 107 90, 107 130`} /> : null}
          </g>
        );
      })}
      <Zone x={20} y={215} w={300} h={185} label="CRI — gRPC unix socket" stroke="#a78bfa" labelFill="#c4b5fd" />
      <Label x={35} y={250} text="RunPodSandbox / StopPodSandbox" fill="#e2e8f0" />
      <Label x={35} y={268} text="CreateContainer / StartContainer" fill="#e2e8f0" />
      <Label x={35} y={286} text="ExecSync (probes) / Exec / Attach" fill="#e2e8f0" />
      <Label x={35} y={304} text="ListPodSandboxStats / ContainerStats" fill="#e2e8f0" />
      <Label x={35} y={322} text="PullImage / ImageFsInfo" fill="#e2e8f0" />
      <Label x={35} y={350} text="socket: /run/containerd/containerd.sock" fill="#94a3b8" size={9.5} />
      <Label x={35} y={366} text="debug: crictl • kubelet -v=4 logs" fill="#94a3b8" size={9.5} />

      <Zone x={340} y={215} w={320} h={185} label="CNI — exec plugins, JSON on stdin" stroke="#34d399" labelFill="#6ee7b7" />
      <Label x={355} y={250} text="ADD  → {ips, routes, dns} for pause netns" fill="#e2e8f0" />
      <Label x={355} y={268} text="DEL  → release IP, remove veth" fill="#e2e8f0" />
      <Label x={355} y={286} text="CHECK / VERSION / GC" fill="#e2e8f0" />
      <Label x={355} y={304} text="chain: bridge|cilium → portmap → bandwidth" fill="#e2e8f0" />
      <Label x={355} y={332} text="conf: /etc/cni/net.d/10-cilium.conflist" fill="#94a3b8" size={9.5} />
      <Label x={355} y={348} text="bins: /opt/cni/bin/*  •  IPAM: host-local | cluster-pool" fill="#94a3b8" size={9.5} />
      <Label x={355} y={364} text="failure ⇒ pod stuck ContainerCreating (no IP)" fill="#fb7185" size={9.5} />

      <Zone x={680} y={215} w={300} h={185} label="CSI — controller + node plugins" stroke="#fbbf24" labelFill="#fde68a" />
      <Label x={695} y={250} text="Controller: CreateVolume / ControllerPublish" fill="#e2e8f0" />
      <Label x={695} y={268} text="Node: NodeStageVolume → /var/lib/kubelet/plugins/…" fill="#e2e8f0" />
      <Label x={695} y={286} text="Node: NodePublishVolume → …/pods/<uid>/volumes/…" fill="#e2e8f0" />
      <Label x={695} y={304} text="fsGroup chown • volume expansion • snapshots" fill="#e2e8f0" />
      <Label x={695} y={332} text="socket: /var/lib/kubelet/plugins/<drv>/csi.sock" fill="#94a3b8" size={9.5} />
      <Label x={695} y={348} text="objects: VolumeAttachment, CSINode, CSIDriver" fill="#94a3b8" size={9.5} />
      <Label x={695} y={364} text="failure ⇒ FailedMount / FailedAttachVolume events" fill="#fb7185" size={9.5} />
      <Edge d="M 605 94 C 605 140, 170 150, 170 215" color="#a78bfa" marker="url(#arrowMuted)" />
      <Edge d="M 800 94 C 800 150, 500 150, 500 215" color="#34d399" marker="url(#arrowEmerald)" />
      <Edge d="M 410 94 C 410 150, 830 150, 830 215" color="#fbbf24" marker="url(#arrowAmber)" />
    </Diagram>
  );
}

/** Pod-to-pod cross-node packet path with VXLAN encapsulation, plus service DNAT. */
function CNIPacketDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 480" title="Cluster Networking — Pod→Service DNAT and cross-node VXLAN encapsulation / decapsulation" t={t} height={500}>
      {/* Node A */}
      <Zone x={20} y={20} w={450} h={300} label="NODE A  10.0.1.11  (eth0)" stroke="#0891b2" fill="rgba(8,145,178,0.06)" labelFill="#22d3ee" />
      <Node x={40} y={55} w={150} h={54} label="pod web" sub="10.244.1.12 / eth0" fill="url(#gViolet)" stroke="#a78bfa" />
      <Node x={40} y={125} w={150} h={40} label="veth pair" sub="eth0 ↔ vethab12@host" fill="#1e293b" stroke="#64748b" />
      <Node x={215} y={125} w={120} h={40} label="cni0 bridge" sub="10.244.1.1" fill="#1e293b" stroke="#64748b" />
      <Node x={40} y={190} w={295} h={50} label="netfilter / eBPF (kube-proxy | cilium)" sub="DNAT 10.96.0.20:80 → 10.244.2.7:8080 (conntrack)" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={40} y={255} w={140} h={44} label="route table" sub="10.244.2.0/24 via flannel.1" fill="#1e293b" stroke="#64748b" />
      <Node x={195} y={255} w={140} h={44} label="flannel.1 / cilium_vxlan" sub="VXLAN VNI 1, UDP 8472" fill="url(#gCyan)" stroke="#22d3ee" />
      <Node x={350} y={255} w={100} h={44} label="eth0" sub="10.0.1.11" fill="#1e293b" stroke="#64748b" />
      <Edge d="M 115 109 L 115 125" />
      <Edge d="M 190 145 L 215 145" />
      <Edge d="M 275 165 L 275 190" />
      <Edge d="M 110 240 L 110 255" />
      <Edge d="M 180 277 L 195 277" />
      <Edge d="M 335 277 L 350 277" />
      <Label x={355} y={70} text="dst: 10.96.0.20:80" fill="#c4b5fd" size={9.5} />
      <Label x={355} y={84} text="(ClusterIP svc api)" fill="#c4b5fd" size={9.5} />
      <Label x={355} y={110} text="CoreDNS: api.prod.svc" fill="#94a3b8" size={9.5} />
      <Label x={355} y={124} text=".cluster.local → 10.96.0.20" fill="#94a3b8" size={9.5} />

      {/* Wire */}
      <Zone x={470} y={210} w={90} h={120} label="" stroke="#475569" fill="rgba(15,23,42,0.4)" />
      <Label x={476} y={232} text="physical" fill="#94a3b8" size={9} />
      <Label x={476} y={244} text="underlay" fill="#94a3b8" size={9} />
      <Edge d="M 450 277 L 560 277" color="#fbbf24" marker="url(#arrowAmber)" width={2.4} />
      <Label x={478} y={312} text="MTU 1450" fill="#fbbf24" size={9} />

      {/* Node B */}
      <Zone x={560} y={20} w={420} h={300} label="NODE B  10.0.1.12  (eth0)" stroke="#059669" fill="rgba(5,150,105,0.06)" labelFill="#6ee7b7" />
      <Node x={580} y={255} w={100} h={44} label="eth0" sub="10.0.1.12" fill="#1e293b" stroke="#64748b" />
      <Node x={695} y={255} w={140} h={44} label="flannel.1 / cilium_vxlan" sub="decap: strip outer hdrs" fill="url(#gCyan)" stroke="#22d3ee" />
      <Node x={850} y={255} w={110} h={44} label="cni0 bridge" sub="10.244.2.1" fill="#1e293b" stroke="#64748b" />
      <Node x={695} y={125} w={140} h={40} label="veth pair" sub="vethcd34 ↔ eth0" fill="#1e293b" stroke="#64748b" />
      <Node x={695} y={55} w={150} h={54} label="pod api" sub="10.244.2.7 / :8080" fill="url(#gEmerald)" stroke="#34d399" />
      <Node x={580} y={125} w={100} h={40} label="netpol" sub="eBPF/iptables" fill="#4c0519" stroke="#fb7185" />
      <Edge d="M 680 277 L 695 277" />
      <Edge d="M 835 277 L 850 277" />
      <Edge d="M 905 255 C 905 200, 770 200, 770 165" />
      <Edge d="M 770 125 L 770 109" />
      <Label x={860} y={70} text="reply: SNAT reversed" fill="#6ee7b7" size={9.5} />
      <Label x={860} y={84} text="by conntrack on Node A" fill="#6ee7b7" size={9.5} />

      {/* Packet anatomy */}
      <Zone x={20} y={335} w={960} h={130} label="PACKET ON THE WIRE (VXLAN)  vs  NATIVE ROUTING / eBPF" stroke="#7c3aed" labelFill="#c4b5fd" />
      {[
        ["outer Eth", "#334155"], ["outer IP 10.0.1.11→10.0.1.12", "#0e7490"], ["UDP :8472", "#0e7490"], ["VXLAN VNI 1", "#6d28d9"],
        ["inner Eth", "#334155"], ["inner IP 10.244.1.12→10.244.2.7", "#047857"], ["TCP →8080", "#047857"], ["payload", "#b45309"],
      ].map(([l, c], i) => {
        const widths = [70, 190, 70, 90, 70, 200, 80, 100];
        const x = 40 + widths.slice(0, i).reduce((a, b) => a + b, 0) + i * 6;
        return (
          <g key={i}>
            <rect x={x} y={362} width={widths[i]} height={28} rx={5} fill={c} stroke="#cbd5e1" strokeWidth="0.8" />
            <text x={x + widths[i] / 2} y={380} textAnchor="middle" fill="#f8fafc" fontSize="9.5" fontFamily="ui-monospace, monospace">{l}</text>
          </g>
        );
      })}
      <Label x={40} y={415} text="Overhead: 50 bytes ⇒ pod MTU = underlay MTU − 50 (1450). Mismatch ⇒ PMTU black holes, hanging TLS handshakes." fill="#fbbf24" size={9.5} />
      <Label x={40} y={432} text="Calico BGP / Cilium native routing: no encapsulation — node routes 10.244.2.0/24 via 10.0.1.12 directly (needs L2 adjacency or BGP peering)." fill="#94a3b8" size={9.5} />
      <Label x={40} y={449} text="Cilium eBPF kube-proxy replacement: DNAT at socket level (cgroup/connect4 hook) — packet never carries the ClusterIP; iptables chains eliminated." fill="#94a3b8" size={9.5} />
    </Diagram>
  );
}

/** Scheduler + topology spread visual for workload placement. */
function WorkloadTopologyDiagram({ t }) {
  const zones = ["zone-a", "zone-b", "zone-c"];
  return (
    <Diagram viewBox="0 0 1000 400" title="Workload Placement — topologySpreadConstraints, anti-affinity and StatefulSet ordinals" t={t} height={420}>
      {zones.map((z, zi) => (
        <g key={z}>
          <Zone x={20 + zi * 325} y={20} w={310} h={230} label={`topology.kubernetes.io/zone=${z}`} stroke="#0891b2" fill="rgba(8,145,178,0.05)" labelFill="#22d3ee" />
          {[0, 1].map((ni) => (
            <g key={ni}>
              <Node x={35 + zi * 325 + ni * 145} y={50} w={135} h={30} label={`node-${z.slice(-1)}${ni + 1}`} sub="" fill="#1e293b" stroke="#64748b" fontSize={11} />
              {/* deployment replicas: spread maxSkew=1 across zones, anti-affinity per node */}
              <Node x={40 + zi * 325 + ni * 145} y={95} w={125} h={34} label={`web-${zi * 2 + ni}`} sub="Deployment" fill="url(#gViolet)" stroke="#a78bfa" fontSize={10.5} />
              {ni === 0 ? <Node x={40 + zi * 325} y={140} w={125} h={34} label={`db-${zi}`} sub={`pvc data-db-${zi}`} fill="url(#gEmerald)" stroke="#34d399" fontSize={10.5} /> : null}
              {ni === 1 && zi === 0 ? <Node x={40 + zi * 325 + 145} y={140} w={125} h={34} label="cache-0" sub="spot / preempt" fill="url(#gAmber)" stroke="#fbbf24" fontSize={10.5} /> : null}
            </g>
          ))}
          <Label x={35 + zi * 325} y={205} text="skew(web) = 2 - min(2) = 0 ≤ maxSkew 1  ✓" fill="#6ee7b7" size={9.5} />
          <Label x={35 + zi * 325} y={222} text={`PV ${z}: WaitForFirstConsumer → PV created in this zone`} fill="#94a3b8" size={9.5} />
        </g>
      ))}
      <Zone x={20} y={265} w={960} h={120} label="SCHEDULING CYCLE" stroke="#fbbf24" labelFill="#fde68a" />
      {[
        ["PreFilter", "compute spread counts"], ["Filter", "NodeResourcesFit • Taints • Affinity • PodTopologySpread(hard)"],
        ["PostFilter", "preemption if unschedulable"], ["Score", "LeastAllocated • ImageLocality • Spread(soft)"],
        ["Reserve/Permit", "gang scheduling hooks"], ["Bind", "POST pods/<name>/binding"],
      ].map(([l, s], i) => (
        <g key={i}>
          <Node x={35 + i * 158} y={295} w={148} h={44} label={l} sub={s} fill={i === 5 ? "url(#gEmerald)" : "url(#gSlate)"} stroke="#cbd5e1" fontSize={10.5} />
          {i < 5 ? <Edge d={`M ${183 + i * 158} 317 L ${193 + i * 158} 317`} color="#fbbf24" marker="url(#arrowAmber)" /> : null}
        </g>
      ))}
      <Label x={35} y={368} text="Pending forever? kubectl describe pod → Events: 0/6 nodes are available: 3 node(s) didn't match pod topology spread constraints, 3 Insufficient cpu." fill="#fb7185" size={9.5} />
    </Diagram>
  );
}

/** Troubleshooting decision flow. */
function TroubleshootingFlowDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 440" title="Troubleshooting Decision Flow — from symptom to subsystem" t={t} height={460}>
      <Node x={400} y={20} w={200} h={44} label="Symptom observed" sub="kubectl get pods -A | grep -v Running" fill="url(#gCyan)" stroke="#22d3ee" />
      {[
        ["Pending", "scheduler / resources / PVC", "kubectl describe pod → Events", "#b45309", 20],
        ["ContainerCreating", "CNI / CSI / image pull / secrets", "journalctl -u kubelet; crictl ps -a", "#6d28d9", 215],
        ["CrashLoopBackOff", "app exit code / probes / OOM", "kubectl logs -p; describe → Last State", "#9f1239", 410],
        ["NotReady node", "kubelet / runtime / disk / cert", "systemctl status kubelet; df -h; openssl x509", "#0e7490", 605],
        ["DNS / Service fail", "CoreDNS / kube-proxy / NetPol", "nslookup; iptables-save | grep svc", "#047857", 800],
      ].map(([l, s, c, col, x], i) => (
        <g key={i}>
          <Edge d={`M 500 64 C 500 100, ${x + 90} 90, ${x + 90} 120`} color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
          <Node x={x} y={120} w={180} h={54} label={l} sub={s} fill={col} stroke="#cbd5e1" />
          <rect x={x} y={185} width={180} height={40} rx={8} fill="#020617" stroke="#334155" />
          <text x={x + 8} y={209} fill="#6ee7b7" fontSize="9" fontFamily="ui-monospace, monospace">{c}</text>
        </g>
      ))}
      <Zone x={20} y={245} w={960} h={180} label="CONTROL-PLANE HEALTH MATRIX (static pods in /etc/kubernetes/manifests)" stroke="#7c3aed" labelFill="#c4b5fd" />
      {[
        ["kube-apiserver", "crictl logs $(crictl ps -q --name apiserver)", "curl -k https://127.0.0.1:6443/livez?verbose"],
        ["etcd", "etcdctl endpoint health --cluster", "etcdctl endpoint status -w table"],
        ["kube-scheduler", "kubectl -n kube-system logs kube-scheduler-cp1", "kubectl get lease -n kube-system kube-scheduler"],
        ["kube-controller-manager", "kubectl -n kube-system logs kube-controller-manager-cp1", "kubectl get lease -n kube-system kube-controller-manager"],
        ["certificates", "kubeadm certs check-expiration", "openssl x509 -in apiserver.crt -noout -dates"],
      ].map(([n, a, b], i) => (
        <g key={i}>
          <rect x={35 + i * 190} y={275} width={180} height={130} rx={10} fill="#0f172a" stroke="#475569" />
          <text x={45 + i * 190} y={295} fill="#f8fafc" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif, system-ui">{n}</text>
          <foreignObject x={40 + i * 190} y={302} width={172} height={100}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: "ui-monospace, monospace", fontSize: "8.5px", color: "#94a3b8", lineHeight: "1.35", wordBreak: "break-all" }}>
              <div style={{ color: "#22d3ee" }}>{a}</div>
              <div style={{ marginTop: 6 }}>{b}</div>
            </div>
          </foreignObject>
        </g>
      ))}
    </Diagram>
  );
}

/* ====================================================================================
   TRACK 2 MODULE DATA
   ==================================================================================== */
const TRACK2_MODULES = [
  {
    id: "cka-control-plane",
    track: "cka",
    title: "Control Plane Internals",
    subtitle: "etcd Raft, API server pipeline, controller reconciliation, scheduler scoring",
    icon: "server",
    keywords: "etcd raft quorum apiserver admission webhook mutating validating controller-manager reconcile informer scheduler filter score bind kubeadm static pod leader election lease",
    theory: {
      diagram: "clusterTopology",
      intro: [
        "The control plane is a set of stateless services around one stateful store. kube-apiserver is the only process that reads or writes etcd; every other component — scheduler, controllers, kubelets, kubectl — is an API client using LIST+WATCH. This single-writer design is what makes the cluster consistent: etcd's Raft log is the source of truth, and the API server's admission pipeline is the single choke point where policy is enforced.",
        "On a kubeadm cluster the control-plane components run as static pods defined in /etc/kubernetes/manifests, started by the kubelet directly from disk. That is why you can break the API server and still fix it: edit the manifest file, and the kubelet restarts the pod without needing the API.",
      ],
      sections: [
        {
          h: "etcd and Raft consensus",
          p: "etcd stores every object as a key under /registry/<resource>/<namespace>/<name>, serialized as protobuf (optionally encrypted with an EncryptionConfiguration and KMSv2). Writes go to the Raft leader, which appends the entry to its WAL, replicates to followers, and commits when a majority (quorum = floor(n/2)+1) has fsynced. With 3 members you tolerate 1 failure; with 5, 2. Losing quorum makes the cluster read-only: pods keep running, but nothing can change. Disk fsync latency (aim < 10 ms p99) is the number-one etcd performance factor — never co-locate etcd with heavy I/O. Compaction and defragmentation keep the 8 GB default DB quota from being exceeded, which triggers NOSPACE alarms and blocks writes.",
        },
        {
          h: "The API server request pipeline",
          p: "Every request traverses authentication (client certs, bearer tokens for ServiceAccounts, OIDC, webhook), authorization (RBAC, Node authorizer for kubelets, ABAC, webhook — modes are tried in order, first decision wins), mutating admission (defaulting, mutating webhooks such as sidecar injectors, ordered but re-invoked if a later webhook mutates), schema validation with CEL rules from the CRD/ValidatingAdmissionPolicy, validating admission (PodSecurity admission, Kyverno/Gatekeeper webhooks — run in parallel, any deny rejects), and finally storage. Aggregation (APIService objects) routes /apis/metrics.k8s.io to metrics-server; CRDs are served natively. Priority and Fairness (APF) queues requests by FlowSchema so a runaway controller cannot starve kubelets.",
        },
        {
          h: "Controllers and the reconciliation loop",
          p: "A controller never receives commands; it observes desired state (spec) and current state (status) and takes one step to close the gap, then re-queues. Informers maintain a local cache fed by WATCH streams keyed on resourceVersion; on disconnect they resume from the last version or relist. The Deployment controller creates ReplicaSets with pod-template-hash labels and manages rollouts (maxSurge/maxUnavailable); the ReplicaSet controller creates Pods; the Node lifecycle controller taints unreachable nodes (node.kubernetes.io/unreachable) after 40 s and evicts after the 5-minute toleration. Leader election via Lease objects in kube-system guarantees a single active controller-manager and scheduler in HA setups.",
        },
        {
          h: "Scheduler: filtering and scoring",
          p: "For each Pending pod the scheduling framework runs PreFilter and Filter plugins (NodeUnschedulable, NodeName, TaintToleration, NodeAffinity, NodeResourcesFit, VolumeBinding, PodTopologySpread hard constraints, InterPodAffinity) to produce feasible nodes, then Score plugins (NodeResourcesBalancedAllocation, LeastAllocated, ImageLocality, PodTopologySpread soft, InterPodAffinity weights) normalised to 0–100 with configurable weights, picks the highest, Reserves resources in its cache, and Binds by POSTing pods/<name>/binding. If nothing fits, PostFilter attempts preemption of lower-PriorityClass pods. The percentageOfNodesToScore setting caps how many nodes are scored on large clusters.",
        },
      ],
      keyPoints: [
        "Only kube-apiserver talks to etcd; everything else is LIST/WATCH over the API.",
        "Quorum = floor(n/2)+1. Loss of quorum → read-only cluster; workloads keep running.",
        "Static pod manifests in /etc/kubernetes/manifests are edited on disk, not with kubectl.",
        "Admission order: authn → authz → mutating → validation → validating → storage.",
        "Scheduler = Filter (hard) → Score (soft) → Bind; check Events for 'didn't match' reasons.",
        "kube-system Leases show which controller-manager/scheduler replica is the leader.",
      ],
    },
    lab: {
      objective: "Read and write etcd directly, trace a request through the admission chain with audit logs and verbose kubectl, inspect leader elections and observe scheduler decisions.",
      steps: [
        {
          title: "Health-check etcd with the certificates from the static pod manifest",
          cmd: "export ETCDCTL_API=3 && alias e='sudo etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key' && e endpoint status --cluster -w table",
          output: "+----------------------------+------------------+---------+---------+-----------+-----------+------------+\n|          ENDPOINT          |        ID        | VERSION | DB SIZE | IS LEADER | RAFT TERM | RAFT INDEX |\n+----------------------------+------------------+---------+---------+-----------+-----------+------------+\n| https://10.0.0.11:2379     | 8e9e05c52164694d | 3.5.16  |   41 MB |      true |        12 |     982341 |\n| https://10.0.0.12:2379     | a1b2c3d4e5f60718 | 3.5.16  |   41 MB |     false |        12 |     982341 |\n| https://10.0.0.13:2379     | 3c4d5e6f70819a2b | 3.5.16  |   41 MB |     false |        12 |     982341 |\n+----------------------------+------------------+---------+---------+-----------+-----------+------------+",
          note: "Same RAFT INDEX on all members = fully replicated. Divergent indexes point at a slow follower (disk or network).",
        },
        {
          title: "Read a Secret straight from etcd to prove why encryption-at-rest matters",
          cmd: "kubectl create secret generic lab-secret --from-literal=password=hunter2 && e get /registry/secrets/default/lab-secret | strings | grep -a -E 'hunter2|k8s:enc'",
          output: "hunter2",
          note: "Plaintext in etcd. After enabling an EncryptionConfiguration and running `kubectl get secrets -A -o json | kubectl replace -f -`, the same query shows k8s:enc:aescbc:v1: or k8s:enc:kms:v2: prefixes.",
        },
        {
          title: "Watch the API request pipeline with verbose kubectl",
          cmd: "kubectl -v=8 create deployment trace --image=nginx:1.27 2>&1 | grep -E 'POST|Response Status|Impersonate|Warning' | head -4",
          output: "I0920 15:02:11.120931  POST https://10.0.0.10:6443/apis/apps/v1/namespaces/default/deployments?fieldManager=kubectl-create&fieldValidation=Strict\nI0920 15:02:11.170203  Response Status: 201 Created in 49 milliseconds",
          note: "fieldValidation=Strict is server-side schema validation rejecting unknown fields — a typo like 'replica:' returns 400 instead of silently being ignored.",
        },
        {
          title: "Confirm authz and admission decisions in the audit log",
          cmd: "sudo tail -n 200 /var/log/kubernetes/audit/audit.log | jq -c 'select(.objectRef.name==\"trace\" and .verb==\"create\") | {user: .user.username, verb, stage, authz: .annotations[\"authorization.k8s.io/decision\"], reason: .annotations[\"authorization.k8s.io/reason\"], pss: .annotations[\"pod-security.kubernetes.io/audit-violations\"]}'",
          output: "{\"user\":\"kubernetes-admin\",\"verb\":\"create\",\"stage\":\"ResponseComplete\",\"authz\":\"allow\",\"reason\":\"RBAC: allowed by ClusterRoleBinding \\\"cluster-admin\\\" of ClusterRole \\\"cluster-admin\\\" to Group \\\"kubemaster\\\"\",\"pss\":null}",
          note: "The audit annotation names the exact RoleBinding that allowed the call — the fastest way to answer 'why can this user do that?'.",
        },
        {
          title: "Identify the active scheduler / controller-manager leader",
          cmd: "kubectl -n kube-system get lease kube-scheduler kube-controller-manager -o custom-columns=NAME:.metadata.name,HOLDER:.spec.holderIdentity,RENEW:.spec.renewTime",
          output: "NAME                      HOLDER                                          RENEW\nkube-scheduler            cp1_5a1f2b3c-8d9e-4f01-a2b3-c4d5e6f7a8b9       2026-09-20T15:03:40.112Z\nkube-controller-manager   cp2_0b1c2d3e-4f50-6a7b-8c9d-e0f1a2b3c4d5       2026-09-20T15:03:41.007Z",
          note: "A stale renewTime (> leaseDurationSeconds, default 15 s) means the leader is dead and failover is in progress.",
        },
        {
          title: "Observe a scheduling decision and a scheduling failure",
          cmd: "kubectl run big --image=nginx:1.27 --requests=cpu=64 && sleep 3 && kubectl get events --field-selector involvedObject.name=big -o custom-columns=REASON:.reason,MSG:.message && kubectl -n kube-system logs -l component=kube-scheduler --tail=200 | grep -E 'trace-|big' | tail -2",
          output: "REASON             MSG\nFailedScheduling   0/4 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: }, 3 Insufficient cpu. preemption: 0/4 nodes are available: 1 Preemption is not helpful for scheduling, 3 No preemption victims found for incoming pod.\nI0920 15:04:02.881  \"Successfully bound pod to node\" pod=\"default/trace-6f8d9c7b5-k2p9x\" node=\"worker2\" evaluatedNodes=4 feasibleNodes=3",
          note: "The event lists every Filter plugin's rejection reason per node. 'evaluatedNodes/feasibleNodes' in scheduler logs shows the filter stage's output.",
        },
        {
          title: "Take and verify an etcd snapshot (CKA exam staple)",
          cmd: "e snapshot save /var/backups/etcd-$(date +%F).db && sudo etcdutl snapshot status /var/backups/etcd-$(date +%F).db -w table",
          output: "Snapshot saved at /var/backups/etcd-2026-09-20.db\n+----------+----------+------------+------------+\n|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |\n+----------+----------+------------+------------+\n| 7b3c9d1e |   982390 |       1842 |      41 MB |\n+----------+----------+------------+------------+",
          note: "Restore: stop the apiserver (move its manifest out of /etc/kubernetes/manifests), `etcdutl snapshot restore --data-dir /var/lib/etcd-restored`, point the etcd manifest's hostPath at the new dir, move manifests back.",
        },
      ],
      success: [
        "etcdctl endpoint status shows one leader and identical Raft index across members",
        "You can read a raw key from /registry and recognise plaintext vs encrypted prefixes",
        "Audit log entries name the RBAC binding that authorized a request",
        "Lease holders identify the active scheduler and controller-manager",
        "A FailedScheduling event explains per-node Filter rejections",
        "A snapshot file passes etcdutl snapshot status",
      ],
    },
    blueprints: [
      {
        title: "kubeadm ClusterConfiguration — HA control plane with audit, encryption and hardened flags",
        lang: "yaml",
        code: `apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.31.2
clusterName: prod-east
controlPlaneEndpoint: "k8s-api.prod.example.com:6443"   # LB VIP in front of all control-plane nodes
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/12
  dnsDomain: cluster.local
etcd:
  local:
    dataDir: /var/lib/etcd
    extraArgs:
      - name: quota-backend-bytes
        value: "8589934592"          # 8 GiB
      - name: auto-compaction-mode
        value: periodic
      - name: auto-compaction-retention
        value: "1h"
      - name: heartbeat-interval
        value: "100"
      - name: election-timeout
        value: "1000"
apiServer:
  certSANs:
    - k8s-api.prod.example.com
    - 10.0.0.10
  extraArgs:
    - name: anonymous-auth
      value: "false"
    - name: authorization-mode
      value: Node,RBAC
    - name: enable-admission-plugins
      value: NodeRestriction,PodSecurity,ValidatingAdmissionPolicy,EventRateLimit
    - name: admission-control-config-file
      value: /etc/kubernetes/admission/config.yaml
    - name: audit-policy-file
      value: /etc/kubernetes/audit/policy.yaml
    - name: audit-log-path
      value: /var/log/kubernetes/audit/audit.log
    - name: audit-log-maxage
      value: "30"
    - name: audit-log-maxbackup
      value: "10"
    - name: audit-log-maxsize
      value: "100"
    - name: encryption-provider-config
      value: /etc/kubernetes/enc/encryption.yaml
    - name: profiling
      value: "false"
    - name: service-account-lookup
      value: "true"
    - name: tls-min-version
      value: VersionTLS12
    - name: tls-cipher-suites
      value: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    - name: request-timeout
      value: "300s"
  extraVolumes:
    - name: audit
      hostPath: /etc/kubernetes/audit
      mountPath: /etc/kubernetes/audit
      readOnly: true
      pathType: DirectoryOrCreate
    - name: audit-log
      hostPath: /var/log/kubernetes/audit
      mountPath: /var/log/kubernetes/audit
      pathType: DirectoryOrCreate
    - name: enc
      hostPath: /etc/kubernetes/enc
      mountPath: /etc/kubernetes/enc
      readOnly: true
      pathType: DirectoryOrCreate
    - name: admission
      hostPath: /etc/kubernetes/admission
      mountPath: /etc/kubernetes/admission
      readOnly: true
      pathType: DirectoryOrCreate
controllerManager:
  extraArgs:
    - name: bind-address
      value: 127.0.0.1
    - name: profiling
      value: "false"
    - name: terminated-pod-gc-threshold
      value: "1000"
    - name: node-monitor-grace-period
      value: "40s"
scheduler:
  extraArgs:
    - name: bind-address
      value: 127.0.0.1
    - name: profiling
      value: "false"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
serverTLSBootstrap: true          # kubelet serving certs signed by the cluster CA (approve CSRs)
rotateCertificates: true
protectKernelDefaults: true
readOnlyPort: 0
authentication:
  anonymous: { enabled: false }
  webhook: { enabled: true }
authorization:
  mode: Webhook
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: ipvs
ipvs:
  scheduler: rr
  strictARP: true                  # required for MetalLB L2 mode
`,
      },
      {
        title: "EncryptionConfiguration (KMSv2 with AES-GCM fallback) + ValidatingAdmissionPolicy",
        lang: "yaml",
        code: `# /etc/kubernetes/enc/encryption.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example      # any CRD can be listed
    providers:
      - kms:
          apiVersion: v2
          name: vault-kms
          endpoint: unix:///var/run/kmsplugin/socket.sock
          timeout: 3s
      - aesgcm:                         # local fallback key for reads when KMS is unreachable
          keys:
            - name: key1
              secret: c2VjcmV0LWtleS0zMi1ieXRlcy1sb25nLWJhc2U2NA==
      - identity: {}                    # keep LAST so old plaintext objects can still be read
---
# CEL-based admission without a webhook: require resource limits on every container in prod namespaces.
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: require-limits
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: ["apps", ""]
        apiVersions: ["v1"]
        operations: ["CREATE", "UPDATE"]
        resources: ["deployments", "statefulsets", "daemonsets", "pods"]
  variables:
    - name: containers
      expression: >-
        object.kind == 'Pod' ? object.spec.containers :
        object.spec.template.spec.containers
  validations:
    - expression: "variables.containers.all(c, has(c.resources) && has(c.resources.limits) && has(c.resources.limits.memory))"
      message: "every container must declare resources.limits.memory"
      reason: Invalid
    - expression: "variables.containers.all(c, !c.image.endsWith(':latest') && c.image.contains('@sha256:'))"
      message: "images must be pinned by digest, never :latest"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: require-limits-prod
spec:
  policyName: require-limits
  validationActions: ["Deny", "Audit"]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: production
`,
      },
    ],
  },
  {
    id: "cka-kubelet",
    track: "cka",
    title: "Kubelet & the Pod Lifecycle",
    subtitle: "SyncPod, CRI sandboxes, CNI ADD, CSI mounts, probes and graceful termination",
    icon: "workflow",
    keywords: "kubelet pod lifecycle cri cni csi pause sandbox init container probes liveness readiness startup termination grace preStop sigterm pleg static pod",
    theory: {
      diagram: "podLifecycle",
      intro: [
        "The kubelet is the node agent that turns a PodSpec into running processes. It watches the API server for pods with spec.nodeName equal to its own, plus static pods from /etc/kubernetes/manifests and any configured HTTP source. For each pod it runs SyncPod: ensure volumes are attached and mounted (CSI), ensure the sandbox exists (CRI RunPodSandbox, which triggers CNI ADD), run init containers sequentially, then start app containers, then run probes and report status back to the API.",
        "The Pod Lifecycle Event Generator (PLEG) polls the runtime (or subscribes to CRI events in newer versions) to detect container state changes; 'PLEG is not healthy' in kubelet logs means the runtime is unresponsive and the node will go NotReady.",
      ],
      sections: [
        {
          h: "Volumes before containers",
          p: "The kubelet's volume manager reconciles desiredStateOfWorld vs actualStateOfWorld. For CSI drivers with attach semantics, the attach-detach controller creates a VolumeAttachment, the CSI controller plugin calls ControllerPublishVolume, then the node plugin does NodeStageVolume (format + global mount under /var/lib/kubelet/plugins/kubernetes.io/csi/…/globalmount) and NodePublishVolume (bind mount into /var/lib/kubelet/pods/<uid>/volumes/…). Secrets and ConfigMaps are projected as tmpfs with atomic symlink swaps (..data), which is why files update in place but subPath mounts never refresh.",
        },
        {
          h: "Sandbox, CNI and the pod IP",
          p: "RunPodSandbox creates the pause container and its network namespace, then the runtime execs the CNI plugin chain from /etc/cni/net.d (the first lexically sorted .conflist wins) with CNI_COMMAND=ADD. The plugin creates a veth pair, assigns an IP from IPAM, sets routes, and returns a JSON result the kubelet writes to pod.status.podIP. If no CNI config exists the node reports 'network plugin is not ready: cni config uninitialized' and stays NotReady; if IPAM is exhausted pods sit in ContainerCreating with 'failed to allocate for range'.",
        },
        {
          h: "Init, sidecar and app containers",
          p: "Init containers run one at a time to completion; failure restarts the pod (subject to restartPolicy). Native sidecars (v1.29+) are init containers with restartPolicy: Always — they start before app containers, stay running, and are terminated after the app containers, solving the log-shipper and service-mesh ordering problem. App containers start in spec order but without waiting for readiness; use startupProbe to hold liveness checks for slow starters.",
        },
        {
          h: "Probes and termination",
          p: "Startup probe gates liveness/readiness until success; readiness controls EndpointSlice membership (traffic); liveness triggers container restart with exponential back-off (10 s → 5 min, CrashLoopBackOff). On deletion the kubelet runs preStop hooks and sends SIGTERM to PID 1 concurrently with the endpoint removal — so a preStop sleep of 5–10 s is the standard trick to let kube-proxy/ingress drain before the process stops listening. After terminationGracePeriodSeconds (default 30) the kubelet sends SIGKILL. Pods stuck Terminating usually have a finalizer or an unresponsive runtime; the node being gone requires a manual `kubectl delete --force --grace-period=0`.",
        },
      ],
      keyPoints: [
        "Order: volumes → sandbox+CNI → init containers → sidecars → app containers → probes.",
        "First .conflist in /etc/cni/net.d wins; missing config = NotReady node.",
        "subPath mounts of ConfigMaps/Secrets never update; whole-volume projections do.",
        "Readiness = traffic, liveness = restart, startup = grace for slow boot.",
        "preStop sleep 5-10s + SIGTERM handling = zero-downtime rollouts.",
        "'PLEG is not healthy' ⇒ runtime hung; check containerd, disk I/O, inode exhaustion.",
      ],
    },
    lab: {
      objective: "Follow one pod from scheduling to Ready through kubelet logs, CRI calls, CNI results and CSI mounts, then break CNI and observe the failure mode.",
      steps: [
        {
          title: "Trace kubelet SyncPod for a newly created pod",
          cmd: "kubectl run life --image=nginx:1.27 -o jsonpath='{.metadata.uid}{\"\\n\"}' && sudo journalctl -u kubelet --since '30s ago' -o cat | grep -E 'SyncPod|RunPodSandbox|Started container|life' | head -6",
          output: "3f9c2a1b-7d8e-4c5a-b1d2-e3f4a5b6c7d8\n\"SyncPod\" pod=\"default/life\"\n\"RunPodSandbox from runtime service\" pod=\"default/life\"\n\"Pod sandbox status\" ... podIP=\"10.244.2.19\"\n\"Pulled image\" image=\"docker.io/library/nginx:1.27\" pod=\"default/life\"\n\"Started container\" containerID=\"containerd://a8c1...\" pod=\"default/life\" containerName=\"life\"",
          note: "Raise verbosity with `--v=4` in /var/lib/kubelet/kubeadm-flags.env to see every CRI call.",
        },
        {
          title: "Inspect the CNI configuration the kubelet will use and a live CNI result",
          cmd: "ls /etc/cni/net.d/ && sudo jq '.plugins[].type' /etc/cni/net.d/10-calico.conflist && sudo cat /var/lib/cni/results/cni-loopback-* 2>/dev/null | head -1; sudo crictl inspectp $(sudo crictl pods --name life -q) | jq '.info.cniResult.Interfaces | keys'",
          output: "10-calico.conflist  calico-kubeconfig\n\"calico\"\n\"bandwidth\"\n\"portmap\"\n[\"cali1a2b3c4d5e6\", \"eth0\", \"lo\"]",
          note: "cniResult in the sandbox status is the JSON the plugin returned to the runtime — proof the network namespace was wired.",
        },
        {
          title: "Map the pod's volumes to kubelet mount paths",
          cmd: "UID=$(kubectl get pod life -o jsonpath='{.metadata.uid}') && sudo ls /var/lib/kubelet/pods/$UID/volumes/ && sudo findmnt -R /var/lib/kubelet/pods/$UID | head -4",
          output: "kubernetes.io~projected\nTARGET                                                                                          SOURCE   FSTYPE OPTIONS\n/var/lib/kubelet/pods/3f9c2a1b-.../volumes/kubernetes.io~projected/kube-api-access-x7k2p          tmpfs    tmpfs  rw,relatime,size=8143220k",
          note: "The projected SA token volume is a tmpfs; the token file is rotated hourly (bound token, 1h TTL) via the ..data symlink swap.",
        },
        {
          title: "Break CNI and observe ContainerCreating",
          cmd: "sudo mv /etc/cni/net.d/10-calico.conflist /root/ && kubectl run nocni --image=busybox:1.36 -- sleep 3600 && sleep 15 && kubectl describe pod nocni | grep -A2 'Warning' | head -3; sudo mv /root/10-calico.conflist /etc/cni/net.d/",
          output: "pod/nocni created\n  Warning  FailedCreatePodSandBox  8s   kubelet  Failed to create pod sandbox: rpc error: code = Unknown desc = failed to setup network for sandbox \"e1f2...\": plugin type=\"calico\" failed (add): no configuration found in /etc/cni/net.d",
          note: "The sandbox is created, CNI ADD fails, the sandbox is torn down and retried with back-off. Restoring the file fixes it with no restart.",
        },
        {
          title: "Prove graceful termination timing with preStop + SIGTERM",
          cmd: "kubectl apply -f graceful-pod.yaml && kubectl wait --for=condition=Ready pod/graceful && time kubectl delete pod graceful && kubectl get events --field-selector involvedObject.name=graceful | grep -i kill",
          output: "pod/graceful created\npod/graceful condition met\npod \"graceful\" deleted\nreal    0m8.41s\n5s   Normal   Killing   pod/graceful   Stopping container app",
          note: "8 s = 5 s preStop sleep + ~3 s app drain. If you see exactly terminationGracePeriodSeconds, PID 1 is ignoring SIGTERM.",
        },
        {
          title: "Diagnose a pod stuck in Terminating",
          cmd: "kubectl get pod stuck -o jsonpath='{.metadata.finalizers}{\"\\n\"}{.metadata.deletionTimestamp}{\"\\n\"}' && kubectl patch pod stuck -p '{\"metadata\":{\"finalizers\":null}}' --type=merge",
          output: "[\"example.com/cleanup-hook\"]\n2026-09-20T15:20:03Z\npod/stuck patched",
          note: "A finalizer set by a dead controller blocks deletion forever. Removing it is safe only when you know the controller's cleanup is not needed.",
        },
      ],
      success: [
        "kubelet journal shows SyncPod → RunPodSandbox → Started container for your pod",
        "crictl inspectp shows a cniResult with an eth0 interface and IP",
        "You can find the pod's volumes under /var/lib/kubelet/pods/<uid>/volumes",
        "Removing the CNI conflist yields FailedCreatePodSandBox; restoring it self-heals",
        "kubectl delete of the graceful pod completes in ~preStop+drain seconds, not 30s",
      ],
    },
    blueprints: [
      {
        title: "Pod with startup/readiness/liveness probes, preStop drain, native sidecar and init container",
        lang: "yaml",
        code: `apiVersion: v1
kind: Pod
metadata:
  name: graceful
  namespace: default
  labels: { app: graceful }
spec:
  terminationGracePeriodSeconds: 45     # must exceed preStop + app drain time
  initContainers:
    # Classic init: run to completion before anything else starts.
    - name: migrate
      image: ghcr.io/example/api@sha256:5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c
      command: ["/nodejs/bin/node", "dist/migrate.js"]
      env:
        - name: DATABASE_URL
          valueFrom: { secretKeyRef: { name: api-db, key: url } }
      resources:
        requests: { cpu: 100m, memory: 128Mi }
        limits: { cpu: 500m, memory: 256Mi }
    # Native sidecar (v1.29+): restartPolicy Always makes it start before and stop after app containers.
    - name: log-shipper
      image: docker.io/fluent/fluent-bit@sha256:0a3f1c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b
      restartPolicy: Always
      args: ["-c", "/fluent-bit/etc/fluent-bit.conf"]
      volumeMounts:
        - { name: app-logs, mountPath: /var/log/app, readOnly: true }
        - { name: fb-config, mountPath: /fluent-bit/etc }
      resources:
        requests: { cpu: 50m, memory: 64Mi }
        limits: { cpu: 200m, memory: 128Mi }
  containers:
    - name: app
      image: ghcr.io/example/api@sha256:5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c
      ports: [{ name: http, containerPort: 8080 }]
      env:
        - name: POD_IP
          valueFrom: { fieldRef: { fieldPath: status.podIP } }
        - name: NODE_NAME
          valueFrom: { fieldRef: { fieldPath: spec.nodeName } }
        - name: MEM_LIMIT
          valueFrom: { resourceFieldRef: { resource: limits.memory } }
      # Hold liveness/readiness until the app has booted (up to 30 x 5s = 150s).
      startupProbe:
        httpGet: { path: /healthz, port: http }
        periodSeconds: 5
        failureThreshold: 30
      # Readiness gates traffic: fails → removed from EndpointSlice, no restart.
      readinessProbe:
        httpGet: { path: /ready, port: http }
        periodSeconds: 5
        failureThreshold: 2
        successThreshold: 1
      # Liveness restarts the container on a deadlock; keep it cheap and independent of downstreams.
      livenessProbe:
        httpGet: { path: /healthz, port: http }
        periodSeconds: 10
        timeoutSeconds: 2
        failureThreshold: 3
      lifecycle:
        # Runs concurrently with SIGTERM delivery; sleeping lets endpoint removal propagate to proxies.
        preStop:
          sleep: { seconds: 5 }        # v1.30+; older: exec: { command: ["sleep", "5"] }
      resources:
        requests: { cpu: 250m, memory: 256Mi }
        limits: { cpu: "1", memory: 256Mi }
      volumeMounts:
        - { name: app-logs, mountPath: /var/log/app }
        - { name: config, mountPath: /app/config, readOnly: true }   # whole-volume mount → live updates
  volumes:
    - name: app-logs
      emptyDir: { sizeLimit: 500Mi }
    - name: config
      configMap: { name: api-config }
    - name: fb-config
      configMap: { name: fluent-bit-config }
`,
      },
      {
        title: "StorageClass (WaitForFirstConsumer, expansion) + CSI-backed PVC + VolumeSnapshot",
        lang: "yaml",
        code: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "false"
provisioner: ebs.csi.aws.com            # pd.csi.storage.gke.io | disk.csi.azure.com | csi.vsphere.vmware.com
parameters:
  type: gp3
  iops: "6000"
  throughput: "250"
  encrypted: "true"
  csi.storage.k8s.io/fstype: xfs
reclaimPolicy: Retain                   # Delete for dev; Retain in prod so a PVC delete never destroys data
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer # PV created in the zone where the pod is scheduled
mountOptions:
  - noatime
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-postgres-0
  namespace: db
spec:
  accessModes: ["ReadWriteOnce"]
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 200Gi
---
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: ebs-snap
driver: ebs.csi.aws.com
deletionPolicy: Retain
---
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: postgres-0-pre-upgrade
  namespace: db
spec:
  volumeSnapshotClassName: ebs-snap
  source:
    persistentVolumeClaimName: data-postgres-0
`,
      },
    ],
  },
  {
    id: "cka-networking",
    track: "cka",
    title: "Cluster Networking Deep-Dive",
    subtitle: "Pod-to-Pod, Pod-to-Service, cross-node routing, CNI encapsulation and eBPF vs iptables",
    icon: "network",
    keywords: "networking cni cilium calico flannel vxlan bgp ebpf iptables ipvs nftables kube-proxy service clusterip nodeport loadbalancer endpointslice coredns dns ndots mtu",
    theory: {
      diagram: "cniPacket",
      intro: [
        "The Kubernetes network model has three rules: every pod gets a unique cluster-wide IP, every pod can reach every other pod without NAT, and agents on a node can reach all pods on that node. The CNI plugin decides how: an overlay (VXLAN/Geneve/WireGuard) that tunnels pod traffic inside node-to-node packets, or native routing (BGP with Calico, direct routes with Cilium) where the underlay knows the pod CIDRs.",
        "Services are not processes. A ClusterIP is a virtual IP that exists only as DNAT rules on every node — programmed by kube-proxy (iptables, IPVS or nftables mode) or by Cilium's eBPF datapath, which intercepts connect() at the socket layer so the ClusterIP never appears on the wire.",
      ],
      sections: [
        {
          h: "Pod-to-Pod on the same node and across nodes",
          p: "Same node: pod eth0 → veth on the host → bridge (cni0/cbr0) or, with Calico/Cilium, a host route per pod (no bridge) → the peer veth. Cross node with VXLAN: the host routing table sends 10.244.2.0/24 via the vxlan device; the kernel wraps the inner frame in UDP/8472 with the destination node's IP; the receiving node decapsulates and delivers. This costs 50 bytes of MTU and CPU for encap; native routing removes both but needs L2 adjacency or BGP peering with the top-of-rack switches (calico-node runs BIRD; Cilium can peer via GoBGP).",
        },
        {
          h: "Services: iptables vs IPVS vs nftables vs eBPF",
          p: "iptables mode programs KUBE-SERVICES → KUBE-SVC-xxx → KUBE-SEP-xxx chains with random probability matching; rule count grows O(services × endpoints) and every sync rewrites the whole table — sync times of seconds on 5k-service clusters. IPVS uses a kernel hash table (O(1) lookup) with rr/lc/sh schedulers, still relying on iptables for masquerade. nftables mode (GA in v1.33) uses maps/verdict maps for scalable rules. Cilium's eBPF replaces kube-proxy entirely: service lookup is a BPF map hit at the socket (cgroup) hook for pod-originated traffic and at XDP/TC for external traffic, with DSR and Maglev consistent hashing available.",
        },
        {
          h: "externalTrafficPolicy, NodePort, LoadBalancer and DNS",
          p: "NodePort opens the port on every node's IP; LoadBalancer adds a cloud LB whose targets are the NodePorts (or pod IPs directly with NLB IP-target mode / Cilium LB-IPAM). externalTrafficPolicy: Local preserves client IPs and avoids the extra hop but only routes to nodes with local endpoints (healthCheckNodePort tells the LB which). CoreDNS serves <svc>.<ns>.svc.cluster.local from EndpointSlices; pods get ndots:5 in resolv.conf, which turns 'api.example.com' into five failed cluster-domain lookups before the real one — set ndots:2 or use FQDNs with trailing dots for external hosts. NodeLocal DNSCache avoids conntrack races on UDP DNS.",
        },
        {
          h: "Debugging methodology",
          p: "Work up the stack: is the pod IP reachable from its own node (ip route get)? From another node (VXLAN port open? MTU?) Is the Service's EndpointSlice populated (selector labels, readiness)? Does DNAT exist (iptables-save | grep KUBE-SVC-<hash> or cilium service list)? Does DNS resolve (nslookup from a netshoot pod)? Is a NetworkPolicy dropping it (cilium monitor --type drop, calico policy audit)? Conntrack table full (nf_conntrack: table full, dropping packet in dmesg)?",
        },
      ],
      keyPoints: [
        "Flat pod network, no NAT pod-to-pod; ClusterIPs are DNAT rules, not interfaces.",
        "VXLAN = 50 B overhead → pod MTU 1450 on a 1500 underlay; mismatched MTU = mysterious hangs.",
        "iptables O(n) chains → IPVS/nftables hash tables → eBPF socket-level LB.",
        "externalTrafficPolicy: Local preserves source IP; Cluster adds a SNAT hop.",
        "ndots:5 causes 5 extra DNS queries for external names — use FQDN with trailing dot.",
        "EndpointSlice empty? Check selector labels and readiness before blaming the network.",
      ],
    },
    lab: {
      objective: "Trace a packet from a pod to a Service on another node, inspect the DNAT rules, measure encapsulation overhead and compare with a Cilium eBPF datapath.",
      steps: [
        {
          title: "Deploy a two-replica backend and a debugging pod on different nodes",
          cmd: "kubectl create deployment api --image=ghcr.io/nginx/nginx-unprivileged:1.27 --replicas=2 --port=8080 && kubectl expose deployment api --port=80 --target-port=8080 && kubectl run netshoot --image=nicolaka/netshoot:v0.13 --overrides='{\"spec\":{\"nodeName\":\"worker1\"}}' -- sleep infinity && kubectl get pods -o wide -l 'app in (api,netshoot)' && kubectl get endpointslices -l kubernetes.io/service-name=api",
          output: "NAME                   READY   STATUS    NODE      IP\napi-7d9c8b6f5-2xk9p    1/1     Running   worker1   10.244.1.12\napi-7d9c8b6f5-m4q7r    1/1     Running   worker2   10.244.2.7\nnetshoot               1/1     Running   worker1   10.244.1.20\nNAME        ADDRESSTYPE   PORTS   ENDPOINTS                 AGE\napi-p8x2k   IPv4          8080    10.244.1.12,10.244.2.7    12s",
          note: "EndpointSlice populated means selectors and readiness are fine; anything failing now is datapath or DNS.",
        },
        {
          title: "Resolve the Service and inspect ndots behaviour",
          cmd: "kubectl exec netshoot -- sh -c 'cat /etc/resolv.conf; dig +short api.default.svc.cluster.local; dig +search +short api'",
          output: "search default.svc.cluster.local svc.cluster.local cluster.local\nnameserver 10.96.0.10\noptions ndots:5\n10.96.0.20\n10.96.0.20",
          note: "A short name works only via search domains. `dig +trace api.example.com` shows 3 NXDOMAIN cluster lookups first because of ndots:5.",
        },
        {
          title: "Find the DNAT rules kube-proxy programmed for this ClusterIP",
          cmd: "ssh worker1 'sudo iptables-save -t nat | grep -E \"KUBE-SVC-|KUBE-SEP-\" | grep -A3 \"default/api\" | head -6'",
          output: "-A KUBE-SERVICES -d 10.96.0.20/32 -p tcp -m comment --comment \"default/api cluster IP\" -m tcp --dport 80 -j KUBE-SVC-KEHZQ3TVJ5NNC2N4\n-A KUBE-SVC-KEHZQ3TVJ5NNC2N4 -m comment --comment \"default/api -> 10.244.1.12:8080\" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-XN7TL3Q4M2K5R6P9\n-A KUBE-SVC-KEHZQ3TVJ5NNC2N4 -m comment --comment \"default/api -> 10.244.2.7:8080\" -j KUBE-SEP-A1B2C3D4E5F6G7H8\n-A KUBE-SEP-A1B2C3D4E5F6G7H8 -p tcp -m tcp -j DNAT --to-destination 10.244.2.7:8080",
          note: "Random probability 0.5 then fall-through implements equal-weight balancing. In IPVS mode use `ipvsadm -Ln | grep -A2 10.96.0.20` instead.",
        },
        {
          title: "Capture the encapsulated packet on the node while curling across nodes",
          cmd: "ssh worker1 'sudo timeout 5 tcpdump -ni eth0 udp port 8472 -c 2 -vv' & kubectl exec netshoot -- curl -s -o /dev/null -w '%{http_code}\\n' http://10.244.2.7:8080/; wait",
          output: "200\n15:31:02.118 IP (tos 0x0, ttl 64, id 1, offset 0, flags [none], proto UDP (17), length 124)\n    10.0.1.11.47521 > 10.0.1.12.8472: VXLAN, flags [I] (0x08), vni 1\nIP 10.244.1.20.51234 > 10.244.2.7.8080: Flags [S], seq 1041, win 64860, options [mss 1410,...]",
          note: "mss 1410 = MTU 1450 - 40. If the pod's MTU were 1500 you would see fragmentation or PMTU black holes on large responses.",
        },
        {
          title: "Verify conntrack recorded the DNAT so replies are un-NATed",
          cmd: "kubectl exec netshoot -- curl -s -o /dev/null http://10.96.0.20/ && ssh worker1 'sudo conntrack -L -d 10.96.0.20 2>/dev/null | head -2; sudo sysctl net.netfilter.nf_conntrack_count net.netfilter.nf_conntrack_max'",
          output: "tcp 6 117 TIME_WAIT src=10.244.1.20 dst=10.96.0.20 sport=51240 dport=80 src=10.244.2.7 dst=10.244.1.20 sport=8080 dport=51240 [ASSURED] mark=0 use=1\nnet.netfilter.nf_conntrack_count = 1842\nnet.netfilter.nf_conntrack_max = 262144",
          note: "The reply tuple (src=10.244.2.7 dst=10.244.1.20) is how the kernel reverses DNAT. A full table drops new flows — raise nf_conntrack_max via kube-proxy conntrack.maxPerCore.",
        },
        {
          title: "Compare with Cilium's eBPF service map (on a Cilium cluster)",
          cmd: "kubectl -n kube-system exec ds/cilium -- cilium service list | grep -A1 10.96.0.20 && kubectl -n kube-system exec ds/cilium -- cilium status --brief && kubectl -n kube-system exec ds/cilium -- cilium bpf lb list | head -3",
          output: "12   10.96.0.20:80    ClusterIP   1 => 10.244.1.12:8080 (active)\n                                  2 => 10.244.2.7:8080 (active)\nOK\nSERVICE ADDRESS     BACKEND ADDRESS (REVNAT_ID) (SLOT)\n10.96.0.20:80       0.0.0.0:0 (12) (0) [ClusterIP, non-routable]\n                    10.244.1.12:8080 (12) (1)",
          note: "No iptables chains: the BPF map at the cgroup connect hook rewrites the destination before the packet is even built. `cilium monitor --type drop` is the policy debugger.",
        },
      ],
      success: [
        "EndpointSlice lists both pod IPs; DNS resolves the Service to its ClusterIP",
        "iptables-save shows KUBE-SVC → KUBE-SEP DNAT chains (or ipvsadm/cilium equivalents)",
        "tcpdump on UDP 8472 shows VXLAN encapsulation with inner pod IPs",
        "conntrack has the DNAT entry with the reversed reply tuple",
        "You can explain why MSS is 1410 on a VXLAN overlay",
      ],
    },
    blueprints: [
      {
        title: "Service variants: ClusterIP, headless, NodePort/LoadBalancer with Local policy, ExternalName",
        lang: "yaml",
        code: `apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: prod
  labels: { app: api }
spec:
  type: ClusterIP
  selector: { app: api }
  ports:
    - name: http
      port: 80
      targetPort: http          # named container port survives port renumbering
      protocol: TCP
  sessionAffinity: None
  ipFamilyPolicy: PreferDualStack
---
# Headless: DNS returns pod IPs directly (StatefulSets, client-side LB, gRPC)
apiVersion: v1
kind: Service
metadata:
  name: postgres-hl
  namespace: db
spec:
  clusterIP: None
  selector: { app: postgres }
  publishNotReadyAddresses: true   # needed so peers can discover each other during bootstrap
  ports:
    - { name: pg, port: 5432 }
---
apiVersion: v1
kind: Service
metadata:
  name: api-public
  namespace: prod
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: external
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip     # LB → pod IP, skips NodePort hop
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
spec:
  type: LoadBalancer
  selector: { app: api }
  externalTrafficPolicy: Local     # preserve client source IP; LB health-checks healthCheckNodePort
  loadBalancerSourceRanges:
    - 203.0.113.0/24
  ports:
    - { name: https, port: 443, targetPort: http }
---
apiVersion: v1
kind: Service
metadata:
  name: legacy-db
  namespace: prod
spec:
  type: ExternalName
  externalName: db-primary.rds.example.internal   # CNAME only, no proxying, no ports needed
`,
      },
      {
        title: "CoreDNS Corefile tuned for production (cache, autopath, stub domains, metrics)",
        lang: "yaml",
        code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s               # keep answering during shutdown so rollouts do not drop queries
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        autopath @kubernetes          # server-side search-path expansion: kills ndots:5 query storms
        prometheus :9153
        forward . /etc/resolv.conf {
            max_concurrent 1000
            policy sequential
        }
        cache 30 {
            success 9984 30
            denial 9984 5
            prefetch 10 60s 10%
        }
        loop
        reload
        loadbalance
    }
    # Stub domain: send corp DNS to on-prem resolvers
    corp.example.internal:53 {
        errors
        cache 30
        forward . 10.10.0.53 10.10.0.54
    }
`,
      },
    ],
  },
  {
    id: "cka-workloads",
    track: "cka",
    title: "Advanced Workloads & Storage",
    subtitle: "Deployments with topology spread, StatefulSets with PVCs, multi-container patterns",
    icon: "layers",
    keywords: "deployment rollout topologySpreadConstraints anti-affinity statefulset volumeClaimTemplates pvc storageclass sidecar ambassador adapter pdb hpa daemonset job cronjob",
    theory: {
      diagram: "workloadTopology",
      intro: [
        "Workload controllers encode operational intent. A Deployment owns ReplicaSets and performs rolling updates; a StatefulSet gives each replica a stable ordinal identity, DNS name and PersistentVolumeClaim; a DaemonSet places one pod per (matching) node; Jobs and CronJobs run to completion. The scheduler places pods, but the manifest author is responsible for telling it how to spread replicas across failure domains.",
        "Placement primitives layer on each other: nodeSelector/nodeAffinity restrict where a pod may run; podAntiAffinity keeps replicas apart; topologySpreadConstraints bound the imbalance across zones or nodes; taints and tolerations keep general workloads off special nodes; PriorityClasses decide who gets preempted; PodDisruptionBudgets protect availability during voluntary disruptions such as node drains.",
      ],
      sections: [
        {
          h: "Deployment rollout mechanics",
          p: "Changing pod.template creates a new ReplicaSet (hash label) and the controller scales new up and old down under maxSurge (extra pods allowed) and maxUnavailable (missing pods allowed). minReadySeconds delays counting a pod as available; progressDeadlineSeconds marks the rollout failed (condition Progressing=False, reason ProgressDeadlineExceeded) without rolling back automatically — rollback is `kubectl rollout undo`. revisionHistoryLimit keeps old ReplicaSets for undo. Recreate strategy stops everything first — use only for singleton locks.",
        },
        {
          h: "Topology spread vs anti-affinity",
          p: "requiredDuringScheduling podAntiAffinity with topologyKey kubernetes.io/hostname is absolute: 4 replicas on 3 nodes leaves one Pending. topologySpreadConstraints express the same intent with tolerance: maxSkew 1 across zones with whenUnsatisfiable DoNotSchedule, and ScheduleAnyway across hostnames as a soft preference. minDomains forces spreading even when zones currently have no matching pods; matchLabelKeys (pod-template-hash) scopes the calculation to the current rollout so old and new ReplicaSets do not distort the skew.",
        },
        {
          h: "StatefulSets and storage",
          p: "Pods are created in order (0,1,2) and deleted in reverse unless podManagementPolicy: Parallel. Each ordinal gets a PVC from volumeClaimTemplates named <template>-<sts>-<ordinal>; the PVC survives pod deletion and even StatefulSet deletion unless persistentVolumeClaimRetentionPolicy says otherwise. The headless Service provides <pod>.<svc>.<ns>.svc.cluster.local. With WaitForFirstConsumer storage classes, the PV is created in the pod's zone — and pins the pod to that zone forever, which is why zone-spread of StatefulSets must be decided before first scheduling. Rolling updates honour partition for canary ordinals.",
        },
        {
          h: "Multi-container patterns",
          p: "Sidecar: adds capability to the main container (log shipper, proxy, cert reloader) sharing volumes and network namespace. Ambassador: a local proxy on localhost that the app talks to, hiding service discovery, TLS and retries (Envoy, cloud-sql-proxy). Adapter: transforms output into a standard format (an exporter converting app metrics to Prometheus). All share the pod IP; they communicate over localhost and emptyDir. Use native sidecars (init + restartPolicy: Always) for ordering guarantees.",
        },
      ],
      keyPoints: [
        "New template → new ReplicaSet; maxSurge/maxUnavailable pace the swap; undo rolls back.",
        "topologySpreadConstraints (maxSkew) > hard anti-affinity for zone HA without Pending pods.",
        "StatefulSet PVCs are per-ordinal and outlive pods; WaitForFirstConsumer pins PV zone.",
        "PDB minAvailable/maxUnavailable gates drains; a PDB with 0 allowed disruptions blocks upgrades.",
        "Ambassador = localhost proxy; Adapter = output normaliser; Sidecar = capability add-on.",
        "HPA needs resource requests; VPA and HPA on the same metric conflict.",
      ],
    },
    lab: {
      objective: "Roll out a zone-spread Deployment, break and fix a rollout, run a StatefulSet with per-ordinal storage and perform a partitioned canary update, then drain a node against a PDB.",
      steps: [
        {
          title: "Apply the spread Deployment and confirm distribution",
          cmd: "kubectl apply -f web-deployment.yaml && kubectl rollout status deploy/web --timeout=120s && kubectl get pods -l app=web -o custom-columns=POD:.metadata.name,NODE:.spec.nodeName,ZONE:.metadata.labels.zone --sort-by=.spec.nodeName",
          output: "deployment.apps/web created\ndeployment \"web\" successfully rolled out\nPOD                    NODE      ZONE\nweb-5f6d7c8b9-2k9xp    node-a1   <none>\nweb-5f6d7c8b9-7m4qr    node-a2   <none>\nweb-5f6d7c8b9-9p2lt    node-b1   <none>\nweb-5f6d7c8b9-c4v8n    node-b2   <none>\nweb-5f6d7c8b9-h6t3w    node-c1   <none>\nweb-5f6d7c8b9-x1r5z    node-c2   <none>",
          note: "6 replicas, 3 zones, 6 nodes: maxSkew 1 on zone and hostname anti-affinity put exactly one pod per node.",
        },
        {
          title: "Trigger a bad rollout and watch progressDeadline fire",
          cmd: "kubectl set image deploy/web web=ghcr.io/example/web:does-not-exist && sleep 70 && kubectl rollout status deploy/web --timeout=5s; kubectl get deploy web -o jsonpath='{.status.conditions[?(@.type==\"Progressing\")].reason}{\"\\n\"}'",
          output: "deployment.apps/web image updated\nWaiting for deployment \"web\" rollout to finish: 1 out of 6 new replicas have been updated...\nerror: timed out waiting for the condition\nProgressDeadlineExceeded",
          note: "maxUnavailable 0 + maxSurge 1 meant only one pod was affected — old pods kept serving. Roll back with the next step.",
        },
        {
          title: "Roll back and inspect revision history",
          cmd: "kubectl rollout undo deploy/web && kubectl rollout history deploy/web && kubectl get rs -l app=web -o custom-columns=RS:.metadata.name,DESIRED:.spec.replicas,HASH:.metadata.labels.pod-template-hash",
          output: "deployment.apps/web rolled back\nREVISION  CHANGE-CAUSE\n2         <none>\n3         <none>\nRS                DESIRED  HASH\nweb-5f6d7c8b9     6        5f6d7c8b9\nweb-7b8c9d0e1     0        7b8c9d0e1",
          note: "Undo reuses the old ReplicaSet (revision 1 becomes 3). Annotate with kubernetes.io/change-cause to make history readable.",
        },
        {
          title: "Deploy the StatefulSet and verify per-ordinal PVCs and DNS",
          cmd: "kubectl apply -f postgres-statefulset.yaml && kubectl -n db rollout status sts/postgres && kubectl -n db get pvc && kubectl -n db exec postgres-0 -- getent hosts postgres-1.postgres-hl.db.svc.cluster.local",
          output: "statefulset.apps/postgres created\npartitioned roll out complete: 3 new pods have been updated...\nNAME               STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE\ndata-postgres-0    Bound    pvc-1a2b   200Gi      RWO            fast-ssd       2m\ndata-postgres-1    Bound    pvc-3c4d   200Gi      RWO            fast-ssd       90s\ndata-postgres-2    Bound    pvc-5e6f   200Gi      RWO            fast-ssd       60s\n10.244.2.31   postgres-1.postgres-hl.db.svc.cluster.local",
          note: "Ordinals came up sequentially; each has its own PVC bound in its own zone.",
        },
        {
          title: "Canary a StatefulSet update with partition",
          cmd: "kubectl -n db patch sts postgres -p '{\"spec\":{\"updateStrategy\":{\"rollingUpdate\":{\"partition\":2}}}}' && kubectl -n db set image sts/postgres postgres=postgres:16.4-alpine && sleep 30 && kubectl -n db get pods -l app=postgres -o custom-columns=POD:.metadata.name,IMAGE:.spec.containers[0].image",
          output: "statefulset.apps/postgres patched\nstatefulset.apps/postgres image updated\nPOD          IMAGE\npostgres-0   postgres:16.3-alpine\npostgres-1   postgres:16.3-alpine\npostgres-2   postgres:16.4-alpine",
          note: "Only ordinals ≥ partition update. Lower the partition to 0 to complete, or revert the image to abort with zero impact on 0 and 1.",
        },
        {
          title: "Drain a node and hit the PodDisruptionBudget",
          cmd: "kubectl apply -f web-pdb.yaml && kubectl scale deploy/web --replicas=3 && kubectl drain node-a1 --ignore-daemonsets --delete-emptydir-data --timeout=30s; kubectl get pdb web",
          output: "poddisruptionbudget.policy/web created\ndeployment.apps/web scaled\nevicting pod default/web-5f6d7c8b9-2k9xp\nerror when evicting pods/\"web-5f6d7c8b9-2k9xp\" -n \"default\" (will retry after 5s): Cannot evict pod as it would violate the pod's disruption budget.\nNAME   MIN AVAILABLE   MAX UNAVAILABLE   ALLOWED DISRUPTIONS   AGE\nweb    N/A             1                 0                     40s",
          note: "ALLOWED DISRUPTIONS 0 because only 2 of 3 replicas were Ready at that moment — the PDB waited for the rollout to fully stabilise. `kubectl uncordon node-a1` when done.",
        },
      ],
      success: [
        "Pods spread one-per-node across three zones",
        "A bad image rollout is contained by maxUnavailable 0 and reported as ProgressDeadlineExceeded",
        "rollout undo restores the previous ReplicaSet",
        "StatefulSet PVCs are named <template>-<name>-<ordinal> and each ordinal resolves via the headless Service",
        "partition=2 updates only postgres-2",
        "drain is blocked while the PDB has 0 allowed disruptions",
      ],
    },
    blueprints: [
      {
        title: "Production Deployment — zone/host spread, anti-affinity, PDB, HPA, rollout tuning",
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: default
  labels: { app: web, tier: frontend }
  annotations:
    kubernetes.io/change-cause: "web 2.3.1 — enable http/2"
spec:
  replicas: 6
  revisionHistoryLimit: 5
  minReadySeconds: 10                 # a pod must be Ready 10s before counting toward availability
  progressDeadlineSeconds: 300
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0               # never drop below desired capacity during a rollout
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web, tier: frontend }
    spec:
      priorityClassName: production-critical
      serviceAccountName: web
      automountServiceAccountToken: false
      topologySpreadConstraints:
        # Hard: zones may differ by at most 1 pod; minDomains ensures 3 zones are used even when empty.
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          minDomains: 3
          labelSelector: { matchLabels: { app: web } }
          matchLabelKeys: ["pod-template-hash"]     # evaluate spread per-ReplicaSet during rollouts
        # Soft: prefer spreading across nodes but do not block scheduling.
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: ScheduleAnyway
          labelSelector: { matchLabels: { app: web } }
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                topologyKey: kubernetes.io/hostname
                labelSelector: { matchLabels: { app: web } }
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - { key: kubernetes.io/arch, operator: In, values: ["amd64", "arm64"] }
                  - { key: node.kubernetes.io/instance-type, operator: NotIn, values: ["t3.micro"] }
      tolerations:
        - { key: workload, operator: Equal, value: frontend, effect: NoSchedule }
      securityContext:
        runAsNonRoot: true
        runAsUser: 65532
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: web
          image: ghcr.io/example/web@sha256:1f2e3d4c5b6a79880716253443526170f9e8d7c6b5a4938271605f4e3d2c1b0a
          ports: [{ name: http, containerPort: 8080 }]
          resources:
            requests: { cpu: 200m, memory: 256Mi }
            limits: { memory: 256Mi }          # no CPU limit: avoid CFS throttling for latency-sensitive tier
          readinessProbe: { httpGet: { path: /ready, port: http }, periodSeconds: 5 }
          livenessProbe: { httpGet: { path: /healthz, port: http }, periodSeconds: 10 }
          lifecycle: { preStop: { sleep: { seconds: 5 } } }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          volumeMounts: [{ name: tmp, mountPath: /tmp }]
      volumes:
        - name: tmp
          emptyDir: { sizeLimit: 64Mi }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: web
spec:
  maxUnavailable: 1
  selector: { matchLabels: { app: web } }
  unhealthyPodEvictionPolicy: AlwaysAllow     # do not let CrashLooping pods block drains
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: web }
  minReplicas: 6
  maxReplicas: 30
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 65 } }
    - type: Pods
      pods:
        metric: { name: http_requests_per_second }
        target: { type: AverageValue, averageValue: "150" }
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies: [{ type: Percent, value: 100, periodSeconds: 60 }]
    scaleDown:
      stabilizationWindowSeconds: 300
      policies: [{ type: Pods, value: 2, periodSeconds: 60 }]
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: production-critical
value: 1000000
globalDefault: false
preemptionPolicy: PreemptLowerPriority
description: "Customer-facing services; may preempt batch workloads."
`,
      },
      {
        title: "StatefulSet with volumeClaimTemplates, headless Service, ambassador + adapter sidecars",
        lang: "yaml",
        code: `apiVersion: v1
kind: Service
metadata:
  name: postgres-hl
  namespace: db
spec:
  clusterIP: None
  selector: { app: postgres }
  ports: [{ name: pg, port: 5432 }]
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: db
spec:
  serviceName: postgres-hl
  replicas: 3
  podManagementPolicy: OrderedReady
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0                       # raise to canary only high ordinals
  persistentVolumeClaimRetentionPolicy:
    whenDeleted: Retain
    whenScaled: Retain
  selector:
    matchLabels: { app: postgres }
  template:
    metadata:
      labels: { app: postgres }
    spec:
      terminationGracePeriodSeconds: 60
      securityContext:
        fsGroup: 999
        fsGroupChangePolicy: OnRootMismatch
        runAsUser: 999
        runAsNonRoot: true
        seccompProfile: { type: RuntimeDefault }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector: { matchLabels: { app: postgres } }
      containers:
        - name: postgres
          image: postgres:16.3-alpine
          ports: [{ name: pg, containerPort: 5432 }]
          env:
            - { name: PGDATA, value: /var/lib/postgresql/data/pgdata }
            - name: POSTGRES_PASSWORD
              valueFrom: { secretKeyRef: { name: postgres-auth, key: password } }
            - name: POD_NAME
              valueFrom: { fieldRef: { fieldPath: metadata.name } }
          resources:
            requests: { cpu: "1", memory: 2Gi }
            limits: { cpu: "2", memory: 2Gi }
          readinessProbe:
            exec: { command: ["pg_isready", "-U", "postgres"] }
            periodSeconds: 5
          livenessProbe:
            exec: { command: ["pg_isready", "-U", "postgres"] }
            periodSeconds: 20
          volumeMounts:
            - { name: data, mountPath: /var/lib/postgresql/data }
          securityContext:
            allowPrivilegeEscalation: false
            capabilities: { drop: ["ALL"] }
        # ADAPTER pattern: exposes Postgres internals as Prometheus metrics on :9187
        - name: exporter
          image: quay.io/prometheuscommunity/postgres-exporter:v0.15.0
          ports: [{ name: metrics, containerPort: 9187 }]
          env:
            - { name: DATA_SOURCE_URI, value: "localhost:5432/postgres?sslmode=disable" }
            - name: DATA_SOURCE_USER
              value: postgres
            - name: DATA_SOURCE_PASS
              valueFrom: { secretKeyRef: { name: postgres-auth, key: password } }
          resources:
            requests: { cpu: 20m, memory: 32Mi }
            limits: { cpu: 100m, memory: 64Mi }
        # AMBASSADOR pattern: apps in the pod talk to localhost:6432 and pgbouncer handles pooling/TLS upstream
        - name: pgbouncer
          image: docker.io/bitnami/pgbouncer:1.23.1
          ports: [{ name: pool, containerPort: 6432 }]
          env:
            - { name: POSTGRESQL_HOST, value: "127.0.0.1" }
            - { name: PGBOUNCER_POOL_MODE, value: transaction }
            - { name: PGBOUNCER_MAX_CLIENT_CONN, value: "2000" }
          resources:
            requests: { cpu: 50m, memory: 64Mi }
            limits: { cpu: 200m, memory: 128Mi }
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: fast-ssd
        resources:
          requests: { storage: 200Gi }
`,
      },
    ],
  },
  {
    id: "cka-troubleshooting",
    track: "cka",
    title: "Real-World Troubleshooting Scenarios",
    subtitle: "Node pressure, broken CoreDNS, expired certificates, dead kubelets and stuck rollouts",
    icon: "wrench",
    keywords: "troubleshooting node notready disk pressure memory pressure eviction coredns dns failure certificate expired kubeadm certs renew kubelet crash static pod apiserver down etcd restore",
    theory: {
      diagram: "troubleshootingFlow",
      intro: [
        "Troubleshooting is a search problem: narrow from symptom to subsystem using the cheapest observations first. `kubectl get pods -A`, `kubectl get nodes`, `kubectl get events -A --sort-by=.lastTimestamp` and `kubectl describe` answer most questions before you ever SSH. When the API itself is down, the order flips: SSH to a control-plane node, check the kubelet, read static-pod container logs with crictl, and inspect certificates and etcd health.",
        "The scenarios below are the ones that recur in production and on the CKA exam: a node under resource pressure, cluster DNS silently broken, control-plane certificates expiring at the one-year mark, a kubelet that will not start, and a kube-apiserver static pod with a typo in its manifest.",
      ],
      sections: [
        {
          h: "Scenario 1 — Node under pressure",
          p: "Symptoms: node condition MemoryPressure/DiskPressure=True, pods Evicted with 'The node was low on resource: ephemeral-storage', new pods not scheduled due to the node.kubernetes.io/disk-pressure taint. Root causes: container logs filling /var/log/pods (no containerLogMaxSize), image cache growth, emptyDir abuse, a pod without limits leaking memory. Diagnose with `kubectl describe node` (Conditions, Allocated resources), `df -h /var/lib/containerd /var/log`, `du -xsh /var/lib/kubelet/pods/* | sort -h | tail`, `crictl imagefsinfo`. Fix: `crictl rmi --prune`, journald vacuum, set eviction thresholds and log rotation in KubeletConfiguration, add limits and ephemeral-storage requests, then confirm the taint clears.",
        },
        {
          h: "Scenario 2 — Broken CoreDNS",
          p: "Symptoms: applications log 'no such host' or i/o timeout for .svc names; `nslookup kubernetes.default` from a pod fails; external names may or may not resolve. Diagnose: `kubectl -n kube-system get pods -l k8s-app=kube-dns` (CrashLoopBackOff often means a Corefile syntax error or the `loop` plugin detected a forwarding loop to itself because the node's resolv.conf points at 127.0.0.53/systemd-resolved), `kubectl -n kube-system logs deploy/coredns`, check the kube-dns Service has endpoints, check a NetworkPolicy is not blocking UDP/TCP 53 to kube-system, verify the kubelet's clusterDNS matches the Service IP. Fix: correct the Corefile ConfigMap, set kubelet resolvConf to /run/systemd/resolve/resolv.conf, allow egress to DNS in policies, and restart CoreDNS.",
        },
        {
          h: "Scenario 3 — Expired control-plane certificates",
          p: "Symptoms: `kubectl` returns 'x509: certificate has expired or is not yet valid'; kubelet logs show TLS handshake errors; the cluster keeps running but nothing can be changed. kubeadm issues one-year certs; they auto-renew only when you run `kubeadm upgrade`. Diagnose with `kubeadm certs check-expiration` and `openssl x509 -noout -dates -in /etc/kubernetes/pki/apiserver.crt`. Fix: `kubeadm certs renew all` on every control-plane node, restart the static pods (move manifests out and back, or `crictl stopp`), copy the new admin.conf to ~/.kube/config, and if kubelet client certs also expired (rotateCertificates false) regenerate kubelet.conf with `kubeadm kubeconfig user` or re-bootstrap via a token.",
        },
        {
          h: "Scenario 4 — Kubelet or API server will not start",
          p: "Kubelet: `systemctl status kubelet` → `journalctl -u kubelet -f`. Common causes: wrong cgroup driver ('failed to run Kubelet: misconfiguration: kubelet cgroup driver: cgroupfs is different from docker cgroup driver: systemd'), swap enabled (failSwapOn), missing /var/lib/kubelet/config.yaml, a bad flag in /var/lib/kubelet/kubeadm-flags.env, a stale node cert, or containerd down. API server: the kubelet runs it from /etc/kubernetes/manifests/kube-apiserver.yaml; `crictl ps -a | grep apiserver` then `crictl logs <id>` shows flag typos ('unknown flag') or etcd connection refused; validate the YAML, check hostPath volumes exist, and check etcd first.",
        },
      ],
      keyPoints: [
        "Cheapest signal first: get nodes/pods/events → describe → logs → SSH → crictl/journalctl.",
        "DiskPressure: /var/log/pods and image cache are the usual culprits; set log rotation + GC.",
        "CoreDNS CrashLoop + 'loop' plugin = resolv.conf forwarding loop (systemd-resolved).",
        "kubeadm certs check-expiration / renew all; then restart static pods and refresh admin.conf.",
        "Kubelet won't start: cgroup driver, swap, config path, cert expiry, runtime socket.",
        "API server down: crictl logs the static pod; fix the manifest file, not the API.",
      ],
    },
    lab: {
      objective: "Reproduce and fix each of the four scenarios on a kubeadm cluster with exact commands and expected observations.",
      steps: [
        {
          title: "Node pressure — simulate a log flood and watch eviction",
          cmd: "kubectl run flood --image=busybox:1.36 --overrides='{\"spec\":{\"nodeName\":\"worker2\"}}' -- sh -c 'yes $(head -c 2000 /dev/zero | tr \"\\0\" x) > /dev/null & while true; do head -c 200M /dev/urandom > /tmp/f$RANDOM; sleep 1; done' && sleep 90 && kubectl describe node worker2 | grep -E 'DiskPressure|Taints' && kubectl get pods -o wide --field-selector spec.nodeName=worker2 | grep -E 'Evicted|flood'",
          output: "pod/flood created\n  DiskPressure     True   KubeletHasDiskPressure   kubelet has disk pressure\nTaints:             node.kubernetes.io/disk-pressure:NoSchedule\nflood   0/1   Evicted   0   2m   <none>   worker2",
          note: "The pod filled the container's writable layer (nodefs). The kubelet evicted it (largest usage above request first), tainted the node, and will clear the taint after evictionPressureTransitionPeriod once disk recovers.",
        },
        {
          title: "Node pressure — find and reclaim space",
          cmd: "ssh worker2 'df -h /var/lib/containerd /var/log; sudo du -xsh /var/lib/kubelet/pods/* 2>/dev/null | sort -h | tail -3; sudo crictl rmi --prune | tail -1; sudo journalctl --vacuum-size=200M | tail -1'",
          output: "Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p1   80G   72G  8.0G  90% /\n/dev/nvme0n1p1   80G   72G  8.0G  90% /\n1.2G  /var/lib/kubelet/pods/4a1b...\n3.9G  /var/lib/kubelet/pods/9c2d...\n12G   /var/lib/kubelet/pods/3f9c...   ← flood pod emptyDir/overlay\nDeleted: sha256:8b1c... (14 images pruned)\nVacuuming done, freed 1.8G of archived journals from /var/log/journal",
          note: "After deleting the offending pod, `kubectl get node worker2 -o jsonpath='{.spec.taints}'` should return empty within ~5 minutes.",
        },
        {
          title: "Broken CoreDNS — inject a Corefile error and diagnose",
          cmd: "kubectl -n kube-system get cm coredns -o yaml | sed 's/forward \\. \\/etc\\/resolv.conf/forward . 127.0.0.1/' | kubectl apply -f - && kubectl -n kube-system rollout restart deploy/coredns && sleep 25 && kubectl -n kube-system get pods -l k8s-app=kube-dns && kubectl -n kube-system logs deploy/coredns --tail=3",
          output: "configmap/coredns configured\ndeployment.apps/coredns restarted\nNAME                       READY   STATUS             RESTARTS   AGE\ncoredns-7c65d6cfc9-4hq2s   0/1     CrashLoopBackOff   3          25s\ncoredns-7c65d6cfc9-x2k9p   0/1     CrashLoopBackOff   3          25s\n[FATAL] plugin/loop: Loop (127.0.0.1:53 -> :53) detected for zone \".\", see https://coredns.io/plugins/loop#troubleshooting. Query: \"HINFO 1234567890.1234567890.\"",
          note: "The loop plugin caught CoreDNS forwarding to itself — identical to the systemd-resolved 127.0.0.53 case on Ubuntu nodes.",
        },
        {
          title: "Broken CoreDNS — fix and validate from a pod",
          cmd: "kubectl -n kube-system get cm coredns -o yaml | sed 's/forward \\. 127.0.0.1/forward . \\/etc\\/resolv.conf/' | kubectl apply -f - && kubectl -n kube-system rollout restart deploy/coredns && kubectl -n kube-system rollout status deploy/coredns && kubectl run dnstest --rm -it --restart=Never --image=busybox:1.36 -- nslookup kubernetes.default.svc.cluster.local",
          output: "configmap/coredns configured\ndeployment \"coredns\" successfully rolled out\nServer:    10.96.0.10\nAddress 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local\nName:      kubernetes.default.svc.cluster.local\nAddress 1: 10.96.0.1 kubernetes.default.svc.cluster.local",
          note: "Also confirm `kubectl -n kube-system get ep kube-dns` shows endpoints and that the kubelet's clusterDNS (grep clusterDNS /var/lib/kubelet/config.yaml) equals 10.96.0.10.",
        },
        {
          title: "Expired certificates — detect and renew",
          cmd: "sudo kubeadm certs check-expiration | head -8 && sudo kubeadm certs renew all && sudo mv /etc/kubernetes/manifests/*.yaml /root/manifests/ && sleep 20 && sudo mv /root/manifests/*.yaml /etc/kubernetes/manifests/ && sudo cp /etc/kubernetes/admin.conf ~/.kube/config && kubectl get nodes",
          output: "CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED\nadmin.conf                 Sep 19, 2026 09:12 UTC   <invalid>       ca                      no\napiserver                  Sep 19, 2026 09:12 UTC   <invalid>       ca                      no\napiserver-etcd-client      Sep 19, 2026 09:12 UTC   <invalid>       ca                      no\napiserver-kubelet-client   Sep 19, 2026 09:12 UTC   <invalid>       ca                      no\n[renew] Reading configuration from the cluster...\ncertificate embedded in the kubeconfig file for the admin to use and for kubeadm itself renewed\ncertificate for serving the Kubernetes API renewed\nNAME      STATUS   ROLES           AGE    VERSION\ncp1       Ready    control-plane   366d   v1.31.2",
          note: "Moving the manifests out and back forces the kubelet to recreate the static pods with the new certs. The CA itself (10 years) is not renewed by this command.",
        },
        {
          title: "Kubelet down — misconfigured cgroup driver",
          cmd: "sudo sed -i 's/cgroupDriver: systemd/cgroupDriver: cgroupfs/' /var/lib/kubelet/config.yaml && sudo systemctl restart kubelet && sleep 5 && sudo journalctl -u kubelet --since '10s ago' -o cat | grep -iE 'cgroup|failed' | head -2; sudo sed -i 's/cgroupDriver: cgroupfs/cgroupDriver: systemd/' /var/lib/kubelet/config.yaml && sudo systemctl restart kubelet && sleep 10 && kubectl get node $(hostname) -o jsonpath='{.status.conditions[?(@.type==\"Ready\")].status}{\"\\n\"}'",
          output: "\"Failed to start ContainerManager\" err=\"failed to initialize top level QOS containers: root container [kubepods] doesn't exist\"\nTrue",
          note: "The cgroup driver of kubelet and containerd must match. Other frequent kubelet killers: swap on (`swapoff -a`), a typo in kubeadm-flags.env, or /etc/kubernetes/kubelet.conf pointing at the wrong API endpoint.",
        },
        {
          title: "API server static pod broken by a manifest typo",
          cmd: "sudo sed -i 's/--authorization-mode=Node,RBAC/--authorization-modes=Node,RBAC/' /etc/kubernetes/manifests/kube-apiserver.yaml && sleep 30 && kubectl get nodes 2>&1 | head -1; sudo crictl ps -a --name kube-apiserver -q | head -1 | xargs sudo crictl logs 2>&1 | tail -1; sudo sed -i 's/--authorization-modes=/--authorization-mode=/' /etc/kubernetes/manifests/kube-apiserver.yaml && sleep 30 && kubectl get nodes | head -2",
          output: "The connection to the server 10.0.0.10:6443 was refused - did you specify the right host or port?\nError: unknown flag: --authorization-modes\nNAME   STATUS   ROLES           AGE    VERSION\ncp1    Ready    control-plane   366d   v1.31.2",
          note: "The kubelet re-reads manifests every 20s (fileCheckFrequency). crictl logs on the exited container is the only place the error is visible when the API is down.",
        },
      ],
      success: [
        "A node reports DiskPressure, evicts the offender and clears its taint after cleanup",
        "CoreDNS loop error is reproduced, understood and fixed; nslookup succeeds from a pod",
        "kubeadm certs check-expiration shows renewed dates and kubectl works with the new admin.conf",
        "A cgroup driver mismatch is recognised from the kubelet journal and reverted",
        "An API server flag typo is found with crictl logs and fixed by editing the static manifest",
      ],
    },
    blueprints: [
      {
        title: "Ephemeral debug container, node debug pod and a netshoot DaemonSet for on-demand diagnostics",
        lang: "yaml",
        code: `# Ephemeral container into a distroless pod (shares process namespace with target container):
#   kubectl debug -it api-7d9c8b6f5-2xk9p --image=nicolaka/netshoot:v0.13 --target=api -- bash
# Node-level debug pod (host namespaces + root FS at /host):
#   kubectl debug node/worker2 -it --image=ubuntu:24.04 -- chroot /host bash
# Copy of a crashing pod with a shell instead of the app:
#   kubectl debug api-7d9c8b6f5-2xk9p -it --copy-to=api-debug --container=api -- sh
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-tools
  namespace: ops
spec:
  selector:
    matchLabels: { app: node-tools }
  template:
    metadata:
      labels: { app: node-tools }
    spec:
      hostNetwork: true
      hostPID: true
      tolerations:
        - operator: Exists           # run everywhere, including tainted/pressure nodes
      priorityClassName: system-node-critical
      containers:
        - name: tools
          image: nicolaka/netshoot:v0.13
          command: ["sleep", "infinity"]
          securityContext:
            privileged: true          # ops-only namespace, RBAC-gated; never in workload namespaces
          volumeMounts:
            - { name: host, mountPath: /host, readOnly: true }
            - { name: containerd, mountPath: /run/containerd/containerd.sock }
          resources:
            requests: { cpu: 10m, memory: 32Mi }
            limits: { cpu: 500m, memory: 256Mi }
      volumes:
        - name: host
          hostPath: { path: / }
        - name: containerd
          hostPath: { path: /run/containerd/containerd.sock, type: Socket }
`,
      },
      {
        title: "etcd disaster-recovery runbook as an executable script",
        lang: "bash",
        code: `#!/usr/bin/env bash
# etcd-restore.sh — restore a kubeadm stacked-etcd control plane from a snapshot.
# Usage: sudo ./etcd-restore.sh /var/backups/etcd-2026-09-20.db
set -euo pipefail
SNAP="\${1:?snapshot path required}"
DATA_DIR=/var/lib/etcd
RESTORE_DIR=/var/lib/etcd-restore-$(date +%s)
NAME=$(hostname)
PEER_URL="https://$(hostname -I | awk '{print $1}'):2380"
MANIFESTS=/etc/kubernetes/manifests
PARK=/root/manifests-parked

echo "[1/6] Verifying snapshot integrity"
etcdutl snapshot status "$SNAP" -w table

echo "[2/6] Stopping control-plane static pods (kubelet removes them when manifests disappear)"
mkdir -p "$PARK"
mv "$MANIFESTS"/kube-apiserver.yaml "$MANIFESTS"/etcd.yaml "$PARK"/
until ! crictl ps -q --name etcd | grep -q .; do sleep 2; done

echo "[3/6] Restoring snapshot into $RESTORE_DIR"
etcdutl snapshot restore "$SNAP" \\
  --name "$NAME" \\
  --initial-cluster "$NAME=$PEER_URL" \\
  --initial-advertise-peer-urls "$PEER_URL" \\
  --data-dir "$RESTORE_DIR"

echo "[4/6] Swapping data directories"
mv "$DATA_DIR" "$DATA_DIR.broken-$(date +%s)"
mv "$RESTORE_DIR" "$DATA_DIR"
chown -R root:root "$DATA_DIR" && chmod 700 "$DATA_DIR"

echo "[5/6] Restarting etcd and kube-apiserver"
mv "$PARK"/etcd.yaml "$MANIFESTS"/
until crictl ps -q --name etcd | grep -q .; do sleep 2; done
mv "$PARK"/kube-apiserver.yaml "$MANIFESTS"/

echo "[6/6] Waiting for the API"
until kubectl --kubeconfig /etc/kubernetes/admin.conf get --raw /readyz >/dev/null 2>&1; do sleep 3; done
kubectl --kubeconfig /etc/kubernetes/admin.conf get nodes
echo "Restore complete. For multi-member clusters: restore on ONE node, then re-join the others with 'kubeadm join --control-plane'."
`,
      },
    ],
  },
];
/* ====================================================================================
   TRACK 3 DIAGRAMS — Kubernetes Security & Hardening (CKS)
   ==================================================================================== */

/** Security boundaries: defence-in-depth layers and the detection plane. */
function SecurityBoundariesDiagram({ t }) {
  const layers = [
    { y: 60, label: "L1  Edge / Gateway", sub: "TLS termination • WAF • rate limits • Gateway API HTTPRoute", stroke: "#22d3ee", fill: "rgba(8,145,178,0.15)" },
    { y: 120, label: "L2  API Server Admission", sub: "authn → RBAC → PodSecurity(restricted) → Kyverno / Gatekeeper / VAP → audit", stroke: "#a78bfa", fill: "rgba(124,58,237,0.15)" },
    { y: 180, label: "L3  Network Policy (CNI eBPF / iptables)", sub: "default-deny ingress+egress • allow DNS + declared peers • mTLS via mesh", stroke: "#34d399", fill: "rgba(5,150,105,0.15)" },
    { y: 240, label: "L4  Pod Security Context", sub: "non-root • drop ALL caps • RuntimeDefault seccomp • AppArmor • readOnlyRootFilesystem", stroke: "#fbbf24", fill: "rgba(245,158,11,0.15)" },
    { y: 300, label: "L5  Kernel / Runtime", sub: "namespaces • cgroups • LSM • gVisor / Kata • Falco eBPF syscall monitoring", stroke: "#fb7185", fill: "rgba(244,63,94,0.15)" },
  ];
  return (
    <Diagram viewBox="0 0 1000 520" title="Security Boundaries — defence-in-depth layers, what each one verifies, and where detection lives" t={t} height={540}>
      <Node x={40} y={14} w={600} h={34} label="Untrusted input (clients, images, tokens, config)" fill="url(#gRose)" stroke="#fb7185" fontSize={11.5} />
      {layers.map((l, i) => (
        <g key={i}>
          <Edge d={`M 340 ${l.y - 12} L 340 ${l.y}`} color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
          <rect x={40} y={l.y} width={600} height={48} rx={10} fill={l.fill} stroke={l.stroke} strokeWidth="1.4" />
          <text x={54} y={l.y + 20} fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily="ui-sans-serif, system-ui">{l.label}</text>
          <text x={54} y={l.y + 37} fill="#cbd5e1" fontSize="9.5" fontFamily="ui-monospace, monospace">{l.sub}</text>
        </g>
      ))}
      <Zone x={40} y={365} w={600} h={140} label="EACH LAYER ANSWERS ONE QUESTION" stroke="#475569" labelFill="#94a3b8" />
      {[
        ["L2", "Is this identity allowed to create this object, and does the object meet policy?"],
        ["L3", "Is this pod allowed to talk to that peer on that port?"],
        ["L4", "Can this process gain privileges, load modules, or write its root filesystem?"],
        ["L5", "Did the process do something a healthy workload never does?"],
      ].map(([l, q], i) => (
        <g key={i}>
          <text x={54} y={395 + i * 24} fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="ui-monospace, monospace">{l}</text>
          <text x={90} y={395 + i * 24} fill="#e2e8f0" fontSize="9.5" fontFamily="ui-monospace, monospace">{q}</text>
        </g>
      ))}
      <Zone x={660} y={60} w={320} h={445} label="DETECTION & RESPONSE PLANE" stroke="#fbbf24" labelFill="#fde68a" />
      <Node x={675} y={90} w={290} h={54} label="API audit log" sub="RBAC denials • secret reads • pods/exec • RBAC changes" fill="url(#gViolet)" stroke="#a78bfa" fontSize={11} />
      <Node x={675} y={156} w={290} h={54} label="Falco (eBPF probe → syscalls)" sub="shell spawn • sensitive file read • unexpected egress" fill="url(#gRose)" stroke="#fb7185" fontSize={11} />
      <Node x={675} y={222} w={290} h={54} label="Hubble / Calico flow logs" sub="policy verdict DROPPED • 5-tuple • identity" fill="url(#gEmerald)" stroke="#34d399" fontSize={11} />
      <Node x={675} y={288} w={290} h={54} label="Trivy Operator / kube-bench" sub="VulnerabilityReport • ConfigAuditReport • CIS" fill="url(#gCyan)" stroke="#22d3ee" fontSize={11} />
      <Node x={675} y={354} w={290} h={54} label="Falcosidekick → SIEM / PagerDuty" sub="alert → runbook → quarantine label / cordon" fill="url(#gAmber)" stroke="#fbbf24" fontSize={11} />
      <Edge d="M 675 117 C 655 117, 655 144, 640 144" color="#a78bfa" marker="url(#arrowMuted)" animated={false} />
      <Edge d="M 675 183 C 655 183, 655 324, 640 324" color="#fb7185" marker="url(#arrowRose)" animated={false} />
      <Edge d="M 675 249 C 655 249, 655 204, 640 204" color="#34d399" marker="url(#arrowEmerald)" animated={false} />
      <Label x={675} y={435} text="Design rule: assume the application layer fails;" fill="#fde68a" size={10} weight="700" />
      <Label x={675} y={452} text="every lower layer must independently limit impact." fill="#fde68a" size={10} weight="700" />
      <Label x={675} y={480} text="Least privilege × default-deny × detection = small blast radius" fill="#6ee7b7" size={9.5} />
    </Diagram>
  );
}

/** Supply chain: source → build → scan → sign → registry → admission → runtime. */
function SupplyChainDiagram({ t }) {
  const stages = [
    ["Source", "signed commits • CODEOWNERS • SAST", "url(#gSlate)"],
    ["Build", "buildx --sbom --provenance • hermetic", "url(#gCyan)"],
    ["Scan", "trivy image • fail on fixable CRITICAL", "url(#gAmber)"],
    ["Sign", "cosign sign --key / keyless (Fulcio+Rekor)", "url(#gViolet)"],
    ["Registry", "immutable tags • digest refs • private mirror", "url(#gSlate)"],
    ["Admit", "Kyverno verifyImages • Gatekeeper • VAP", "url(#gEmerald)"],
    ["Run", "digest-pinned • Trivy Operator re-scan", "url(#gRose)"],
  ];
  return (
    <Diagram viewBox="0 0 1000 300" title="Software Supply Chain — from commit to admission-verified runtime" t={t} height={320}>
      {stages.map(([l, s, f], i) => (
        <g key={i}>
          <Node x={20 + i * 140} y={50} w={125} h={60} label={l} sub="" fill={f} stroke="#cbd5e1" fontSize={12} />
          <foreignObject x={20 + i * 140} y={118} width={125} height={70}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: "ui-monospace, monospace", fontSize: "8.5px", color: "#cbd5e1", lineHeight: "1.3", textAlign: "center" }}>{s}</div>
          </foreignObject>
          {i < 6 ? <Edge d={`M ${145 + i * 140} 80 L ${160 + i * 140} 80`} /> : null}
        </g>
      ))}
      <Zone x={20} y={195} w={960} h={90} label="ATTESTATIONS TRAVEL WITH THE DIGEST (OCI referrers / .sig .att tags)" stroke="#a78bfa" labelFill="#c4b5fd" />
      <Label x={35} y={230} text="sha256:5c8f…  ← .sig (cosign signature)  ← .att (SLSA provenance, SPDX SBOM, scan result)  ← Rekor transparency-log entry" fill="#e2e8f0" size={10} />
      <Label x={35} y={250} text="Admission verifies: signature by trusted key or identity  +  provenance builder identity  +  scan attestation freshness" fill="#94a3b8" size={9.5} />
      <Label x={35} y={268} text="Mutation: tag → digest rewrite so the running image can never drift from what was verified." fill="#6ee7b7" size={9.5} />
    </Diagram>
  );
}

/** System hardening: the order in which seccomp, capabilities and the LSM evaluate a syscall. */
function SystemHardeningDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 380" title="System Hardening — how seccomp, capabilities and AppArmor gate a syscall before the kernel acts on it" t={t} height={400}>
      <Node x={20} y={40} w={180} h={54} label="app process" sub="open() • mount() • ptrace()" fill="url(#gViolet)" stroke="#a78bfa" />
      <Edge d="M 200 67 L 240 67" label="syscall" lx={220} ly={58} />
      <Node x={240} y={30} w={170} h={74} label="1. seccomp-BPF" sub="RuntimeDefault / Localhost profile" fill="url(#gAmber)" stroke="#fbbf24" />
      <Label x={245} y={122} text="filtered syscall → EPERM" fill="#fde68a" size={9} />
      <Edge d="M 410 67 L 450 67" />
      <Node x={450} y={30} w={170} h={74} label="2. Capabilities" sub="bounding ∩ effective set" fill="url(#gCyan)" stroke="#22d3ee" />
      <Label x={455} y={122} text="missing capability → EPERM" fill="#a5f3fc" size={9} />
      <Edge d="M 620 67 L 660 67" />
      <Node x={660} y={30} w={170} h={74} label="3. LSM: AppArmor / SELinux" sub="path- or label-based MAC" fill="url(#gEmerald)" stroke="#34d399" />
      <Label x={665} y={122} text="profile deny → EACCES" fill="#6ee7b7" size={9} />
      <Edge d="M 830 67 L 870 67" />
      <Node x={870} y={30} w={110} h={74} label="4. Kernel" sub="DAC (uid/mode)" fill="url(#gKernel)" stroke="#818cf8" />

      <Zone x={20} y={150} w={470} h={215} label="POD SPEC MAPPING" stroke="#475569" labelFill="#94a3b8" />
      <Label x={35} y={180} text="securityContext.seccompProfile: {type: RuntimeDefault | Localhost, localhostProfile: profiles/x.json}" fill="#e2e8f0" size={9.5} />
      <Label x={35} y={198} text="securityContext.capabilities: {drop: [ALL], add: [NET_BIND_SERVICE]}" fill="#e2e8f0" size={9.5} />
      <Label x={35} y={216} text="securityContext.appArmorProfile: {type: Localhost, localhostProfile: k8s-nginx}   (v1.30+ field)" fill="#e2e8f0" size={9.5} />
      <Label x={35} y={234} text="securityContext.allowPrivilegeEscalation: false  → no_new_privs" fill="#e2e8f0" size={9.5} />
      <Label x={35} y={252} text="securityContext.runAsNonRoot / runAsUser: 65532 • readOnlyRootFilesystem: true" fill="#e2e8f0" size={9.5} />
      <Label x={35} y={280} text="Node files: /var/lib/kubelet/seccomp/profiles/*.json  •  /etc/apparmor.d/*  (apparmor_parser -r)" fill="#94a3b8" size={9.5} />
      <Label x={35} y={298} text="Verify: grep Seccomp /proc/<pid>/status (2 = filter) • cat /proc/<pid>/attr/current • capsh --decode" fill="#94a3b8" size={9.5} />
      <Label x={35} y={316} text="Discover needed syscalls: Security Profiles Operator recorder, or strace -f -c in a test environment" fill="#94a3b8" size={9.5} />

      <Zone x={510} y={150} w={470} h={215} label="HOST HARDENING (CIS 1.x / 4.x)" stroke="#fb7185" labelFill="#fda4af" />
      <Label x={525} y={180} text="kubelet: anonymous-auth=false • authorization-mode=Webhook • read-only-port=0" fill="#e2e8f0" size={9.5} />
      <Label x={525} y={198} text="protect-kernel-defaults=true • rotate-certificates • serverTLSBootstrap" fill="#e2e8f0" size={9.5} />
      <Label x={525} y={216} text="file perms: /etc/kubernetes/manifests/* 600 root:root • /etc/kubernetes/pki/*.key 600" fill="#e2e8f0" size={9.5} />
      <Label x={525} y={234} text="sysctl: kernel.kptr_restrict=2 • kernel.dmesg_restrict=1 • kernel.yama.ptrace_scope=1" fill="#e2e8f0" size={9.5} />
      <Label x={525} y={252} text="minimal packages, key-only SSH or immutable OS, auditd rules on /etc/kubernetes" fill="#e2e8f0" size={9.5} />
      <Label x={525} y={280} text="kube-bench run --targets node,master  →  remediation text per failed check" fill="#94a3b8" size={9.5} />
      <Label x={525} y={298} text="Immutable node OS (Bottlerocket, Flatcar, Talos) removes SSH and package managers" fill="#94a3b8" size={9.5} />
      <Label x={525} y={316} text="Restrict pod egress to the cloud metadata endpoint with NetworkPolicy; require IMDSv2" fill="#94a3b8" size={9.5} />
    </Diagram>
  );
}

/* ====================================================================================
   TRACK 3 MODULE DATA
   ==================================================================================== */
const TRACK3_MODULES = [
  {
    id: "cks-hardening",
    track: "cks",
    title: "Cluster Hardening: CIS, TLS & API Server",
    subtitle: "kube-bench, TLS bootstrapping, API server and kubelet flags, encryption at rest, upgrades",
    icon: "shieldcheck",
    keywords: "cis benchmark kube-bench tls bootstrap csr certificate rotation anonymous-auth authorization-mode kubelet hardening encryption at rest kubeadm upgrade version skew",
    theory: {
      diagram: "systemHardening",
      intro: [
        "Cluster hardening shrinks the control plane's attack surface to what workloads actually need. The CIS Kubernetes Benchmark encodes this as hundreds of checks across the API server, controller-manager, scheduler, etcd, control-plane files and kubelet; kube-bench automates the audit and prints remediation text for each failure. In practice a handful of flags and file permissions account for most of the risk.",
        "TLS is the backbone: every component authenticates to the API server with a client certificate or a bound ServiceAccount token, and the API server authenticates to kubelets with its own client certificate. Kubelets obtain certificates through TLS bootstrapping — a bootstrap token authorises a CSR that the controller-manager signs — and rotate them automatically before expiry.",
      ],
      sections: [
        {
          h: "API server flags that matter",
          p: "--anonymous-auth=false so unauthenticated requests never reach authorization; --authorization-mode=Node,RBAC (never AlwaysAllow; the Node authorizer restricts each kubelet to its own node's objects); --enable-admission-plugins=NodeRestriction,PodSecurity (NodeRestriction stops a kubelet from modifying other nodes' objects or its own labels); --audit-log-path with a policy file; --encryption-provider-config for secrets at rest; --tls-min-version=VersionTLS12 with a curated cipher list; --profiling=false; --service-account-lookup=true; and --kubelet-certificate-authority so kubelet serving certificates are verified. Each maps to a CIS 1.2.x control.",
        },
        {
          h: "Kubelet hardening",
          p: "The kubelet API on port 10250 can exec into any pod on its node, so it deserves the same rigour as the API server. KubeletConfiguration should set authentication.anonymous.enabled=false, authentication.webhook.enabled=true (delegate token review to the API server), authorization.mode=Webhook (SubjectAccessReview instead of AlwaysAllow), readOnlyPort=0 (closes the unauthenticated 10255 port), protectKernelDefaults=true, rotateCertificates=true and serverTLSBootstrap=true so the serving certificate is signed by the cluster CA. With serverTLSBootstrap enabled, CSRs with signerName kubernetes.io/kubelet-serving must be approved manually or by an approver controller.",
        },
        {
          h: "TLS bootstrapping and certificate lifecycle",
          p: "kubeadm join uses a bootstrap token in the system:bootstrappers group that RBAC allows to create CSRs; the kubelet generates a key, submits a CSR with signerName kubernetes.io/kube-apiserver-client-kubelet, the csrapproving controller approves it, the csrsigning controller signs it with the cluster CA, and the kubelet stores /var/lib/kubelet/pki/kubelet-client-current.pem. kubeadm certificates last one year; the kubelet rotates its client certificate at roughly 80% of lifetime, while control-plane certificates renew on `kubeadm certs renew all` or during an upgrade. Human users get certificates by submitting a CSR with usages client auth, approving it, and building a kubeconfig.",
        },
        {
          h: "Upgrades and version skew",
          p: "Patch releases carry security fixes; stay within the supported N-2 minor window. `kubeadm upgrade plan` then `kubeadm upgrade apply` on the first control-plane node (upgrades static pods and renews certificates), `kubeadm upgrade node` on the others, then per worker: drain, unhold and install the new kubelet/kubeadm/kubectl packages, `kubeadm upgrade node`, restart kubelet, uncordon. The kubelet may be up to three minor versions older than the API server; kube-proxy must match the kubelet; kubectl may be one minor version away.",
        },
      ],
      keyPoints: [
        "kube-bench = CIS audit with remediation text; fix API server, kubelet and file-permission checks first.",
        "API server: anonymous-auth=false, Node,RBAC, NodeRestriction + PodSecurity, audit, encryption, TLS 1.2+.",
        "Kubelet: anonymous off, webhook authn/authz, readOnlyPort 0, rotate + serverTLSBootstrap.",
        "TLS bootstrap = bootstrap token → CSR → approve/sign → kubelet-client-current.pem.",
        "Certificates are one year; kubeadm certs check-expiration / renew all; upgrades also renew.",
        "Version skew: kubelet ≤ 3 minors behind the API server; kube-proxy = kubelet; kubectl ±1.",
      ],
    },
    lab: {
      objective: "Run kube-bench, remediate the highest-impact findings on the API server and kubelet, issue a user certificate via the CSR API and enable encryption at rest.",
      steps: [
        {
          title: "Run kube-bench on the control plane and list failures",
          cmd: "kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/v0.8.0/job-master.yaml && kubectl wait --for=condition=complete job/kube-bench-master --timeout=120s && kubectl logs job/kube-bench-master | grep -E '^\\[FAIL\\]|checks (PASS|FAIL|WARN)' | head -8",
          output: "[FAIL] 1.2.1 Ensure that the --anonymous-auth argument is set to false (Automated)\n[FAIL] 1.2.16 Ensure that the --profiling argument is set to false (Automated)\n[FAIL] 1.2.18 Ensure that the --audit-log-path argument is set (Automated)\n[FAIL] 1.2.28 Ensure that the --encryption-provider-config argument is set as appropriate (Manual)\n52 checks PASS\n4 checks FAIL\n11 checks WARN",
          note: "Each FAIL has a remediation block further down: `kubectl logs job/kube-bench-master | grep -A6 '1.2.1 '`.",
        },
        {
          title: "Remediate API server flags in the static pod manifest and verify the restart",
          cmd: "sudo sed -i '/- kube-apiserver/a\\    - --anonymous-auth=false\\n    - --profiling=false' /etc/kubernetes/manifests/kube-apiserver.yaml && sleep 25 && curl -sk https://127.0.0.1:6443/api -o /dev/null -w '%{http_code}\\n' && sudo crictl ps --name kube-apiserver -o json | jq -r '.containers[0].createdAt'",
          output: "401\n1758384512000000000",
          note: "401 (instead of 403) for an anonymous request confirms anonymous auth is off — there is no system:anonymous identity to authorize. A new createdAt shows the kubelet recreated the static pod.",
        },
        {
          title: "Harden the kubelet and confirm the unauthenticated port is closed",
          cmd: "sudo sed -i 's/readOnlyPort: 10255/readOnlyPort: 0/; s/mode: AlwaysAllow/mode: Webhook/' /var/lib/kubelet/config.yaml && sudo systemctl restart kubelet && sleep 5 && curl -s -o /dev/null -w '10255 → %{http_code}\\n' http://127.0.0.1:10255/pods; curl -sk -o /dev/null -w '10250 → %{http_code}\\n' https://127.0.0.1:10250/pods",
          output: "10255 → 000\n10250 → 401",
          note: "000 means connection refused (port closed); 401 on 10250 means TLS is up and anonymous access is denied.",
        },
        {
          title: "Issue a client certificate for a developer through the CSR API",
          cmd: "openssl req -new -newkey rsa:2048 -nodes -keyout dev.key -out dev.csr -subj '/CN=dana/O=developers' 2>/dev/null && cat <<EOF | kubectl apply -f -\napiVersion: certificates.k8s.io/v1\nkind: CertificateSigningRequest\nmetadata:\n  name: dana\nspec:\n  request: $(base64 -w0 dev.csr)\n  signerName: kubernetes.io/kube-apiserver-client\n  expirationSeconds: 7776000\n  usages: [\"client auth\"]\nEOF\nkubectl certificate approve dana && kubectl get csr dana -o jsonpath='{.status.certificate}' | base64 -d > dev.crt && openssl x509 -in dev.crt -noout -subject -enddate",
          output: "certificatesigningrequest.certificates.k8s.io/dana created\ncertificatesigningrequest.certificates.k8s.io/dana approved\nsubject=CN = dana, O = developers\nnotAfter=Dec 19 15:40:11 2026 GMT",
          note: "Build the kubeconfig with `kubectl config set-credentials dana --client-certificate=dev.crt --client-key=dev.key --embed-certs`, then bind RBAC to user dana or group developers.",
        },
        {
          title: "Approve pending kubelet serving CSRs after enabling serverTLSBootstrap",
          cmd: "kubectl get csr -o custom-columns=NAME:.metadata.name,SIGNER:.spec.signerName,REQUESTOR:.spec.username,COND:.status.conditions[0].type | grep kubelet-serving && kubectl get csr -o name | xargs -r kubectl certificate approve",
          output: "csr-8kq2m   kubernetes.io/kubelet-serving   system:node:worker1   <none>\ncsr-p9x4t   kubernetes.io/kubelet-serving   system:node:worker2   <none>\ncertificatesigningrequest.certificates.k8s.io/csr-8kq2m approved\ncertificatesigningrequest.certificates.k8s.io/csr-p9x4t approved",
          note: "Until approved, `kubectl logs` fails with 'certificate signed by unknown authority' because the API server verifies kubelet serving certificates against --kubelet-certificate-authority.",
        },
        {
          title: "Enable encryption at rest and rewrite existing secrets",
          cmd: "kubectl get secrets --all-namespaces -o json | kubectl replace -f - >/dev/null && sudo etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key get /registry/secrets/default/lab-secret | head -c 40 | strings",
          output: "k8s:enc:aescbc:v1:key1:",
          note: "Run this after adding --encryption-provider-config and its hostPath volume to kube-apiserver.yaml (see the blueprint in Control Plane Internals). The k8s:enc prefix proves the rewrite stored the object encrypted; keep identity last so older objects remain readable until rewritten.",
        },
      ],
      success: [
        "kube-bench FAIL count for section 1.2 drops after manifest edits",
        "Anonymous requests to 6443 return 401; kubelet 10255 is closed and 10250 requires auth",
        "A user CSR is approved and yields a certificate with the requested CN/O",
        "Kubelet serving CSRs are approved and kubectl logs works",
        "Raw etcd values for secrets begin with k8s:enc:",
      ],
    },
    blueprints: [
      {
        title: "Audit Policy — CIS-aligned, low-noise, full capture of security-relevant events",
        lang: "yaml",
        code: `apiVersion: audit.k8s.io/v1
kind: Policy
# Rules are evaluated top-down; first match wins. Order: noise suppression → high-value → default.
omitStages: ["RequestReceived"]
rules:
  # 1. Suppress health/metrics noise from system components
  - level: None
    users: ["system:kube-proxy", "system:apiserver", "system:kube-controller-manager", "system:kube-scheduler"]
    verbs: ["get", "list", "watch"]
    resources:
      - group: ""
        resources: ["endpoints", "services", "services/status", "configmaps", "nodes", "nodes/status", "pods", "pods/status"]
      - group: "coordination.k8s.io"
        resources: ["leases"]
  - level: None
    nonResourceURLs: ["/healthz*", "/readyz*", "/livez*", "/version", "/metrics", "/openapi*", "/api", "/apis"]

  # 2. Secrets, tokens, certificates: metadata only (never log the payload) but every verb
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets", "serviceaccounts/token"]
      - group: "certificates.k8s.io"
        resources: ["certificatesigningrequests", "certificatesigningrequests/approval"]
      - group: "authentication.k8s.io"
        resources: ["tokenreviews"]

  # 3. Full request + response for privilege changes and workload mutations
  - level: RequestResponse
    verbs: ["create", "update", "patch", "delete", "deletecollection"]
    resources:
      - group: "rbac.authorization.k8s.io"
      - group: ""
        resources: ["pods", "pods/exec", "pods/attach", "pods/portforward", "pods/ephemeralcontainers", "serviceaccounts", "namespaces"]
      - group: "apps"
      - group: "batch"
      - group: "admissionregistration.k8s.io"
      - group: "policy"
      - group: "networking.k8s.io"

  # 4. Node objects and kubelet-originated writes at Request level
  - level: Request
    userGroups: ["system:nodes"]
    verbs: ["create", "update", "patch", "delete"]

  # 5. Everything else: Request level for writes, Metadata for reads
  - level: Request
    verbs: ["create", "update", "patch", "delete", "deletecollection"]
  - level: Metadata
    omitStages: ["RequestReceived", "ResponseStarted"]
`,
      },
      {
        title: "Hardened KubeletConfiguration + kube-bench CronJob for continuous CIS auditing",
        lang: "yaml",
        code: `apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
# /var/lib/kubelet/config.yaml — CIS section 4.2
authentication:
  anonymous:
    enabled: false
  webhook:
    enabled: true
    cacheTTL: 2m
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 5m
    cacheUnauthorizedTTL: 30s
readOnlyPort: 0
protectKernelDefaults: true
makeIPTablesUtilChains: true
eventRecordQPS: 5
rotateCertificates: true
serverTLSBootstrap: true
tlsMinVersion: VersionTLS12
tlsCipherSuites:
  - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
streamingConnectionIdleTimeout: 4h
seccompDefault: true                    # every pod gets RuntimeDefault unless it opts out
podPidsLimit: 4096
cgroupDriver: systemd
---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: kube-bench
  namespace: security
spec:
  schedule: "0 3 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      ttlSecondsAfterFinished: 86400
      template:
        spec:
          hostPID: true                 # needed to read process flags of static pods (security namespace only)
          restartPolicy: Never
          nodeSelector:
            node-role.kubernetes.io/control-plane: ""
          tolerations:
            - key: node-role.kubernetes.io/control-plane
              operator: Exists
              effect: NoSchedule
          containers:
            - name: kube-bench
              image: docker.io/aquasec/kube-bench:v0.8.0
              args: ["run", "--targets", "master,node,etcd,policies", "--json", "--outputfile", "/reports/kube-bench.json"]
              securityContext:
                readOnlyRootFilesystem: true
              volumeMounts:
                - { name: var-lib-kubelet, mountPath: /var/lib/kubelet, readOnly: true }
                - { name: etc-systemd, mountPath: /etc/systemd, readOnly: true }
                - { name: etc-kubernetes, mountPath: /etc/kubernetes, readOnly: true }
                - { name: reports, mountPath: /reports }
              resources:
                requests: { cpu: 50m, memory: 64Mi }
                limits: { cpu: 500m, memory: 256Mi }
          volumes:
            - { name: var-lib-kubelet, hostPath: { path: /var/lib/kubelet } }
            - { name: etc-systemd, hostPath: { path: /etc/systemd } }
            - { name: etc-kubernetes, hostPath: { path: /etc/kubernetes } }
            - { name: reports, persistentVolumeClaim: { claimName: security-reports } }
`,
      },
    ],
  },
  {
    id: "cks-system",
    track: "cks",
    title: "System Hardening: AppArmor, Seccomp & Capabilities",
    subtitle: "Mandatory access control, syscall filtering and least-privilege kernel permissions",
    icon: "lock",
    keywords: "apparmor seccomp capabilities syscall filter profile runtimedefault localhost security profiles operator capsh no_new_privs host os hardening",
    theory: {
      diagram: "systemHardening",
      intro: [
        "Namespaces isolate what a process sees; these three mechanisms restrict what it can do. Capabilities partition root's power into discrete privileges; seccomp-BPF filters the syscall ABI; AppArmor (or SELinux) adds mandatory access control over files, network and capabilities on top of ordinary permissions. A syscall must pass all three, in the order shown in the diagram, before the kernel acts on it.",
        "CKS expects fluency with the pod spec fields (securityContext.capabilities, seccompProfile, appArmorProfile), the node-side artefacts (JSON seccomp profiles under the kubelet root, AppArmor profiles loaded with apparmor_parser) and the verification commands that prove enforcement inside a running container.",
      ],
      sections: [
        {
          h: "Linux capabilities in practice",
          p: "The runtime's default bounding set (about 14 capabilities) includes more than most services need. The restricted Pod Security Standard requires drop: [ALL] and permits only NET_BIND_SERVICE to be added back. allowPrivilegeEscalation: false sets no_new_privs so setuid binaries and file capabilities cannot regain dropped privileges. Inspect with `grep Cap /proc/<pid>/status` and decode with `capsh --decode`. A non-root user has no effective capabilities after execve unless the binary carries file capabilities or ambient capabilities are set.",
        },
        {
          h: "Seccomp profiles",
          p: "RuntimeDefault applies containerd's default profile, an allowlist of roughly 300 syscalls that excludes the ones a normal application never needs. Localhost profiles are JSON files relative to /var/lib/kubelet/seccomp/ with a defaultAction and explicit syscall lists; SCMP_ACT_LOG records would-be violations to the audit log without blocking, which is ideal for building a profile iteratively. The Security Profiles Operator can record profiles from running workloads (ProfileRecording) and distribute them as SeccompProfile objects to every node. The kubelet's seccompDefault: true makes RuntimeDefault the default for every pod that does not specify a profile.",
        },
        {
          h: "AppArmor",
          p: "AppArmor profiles are path-based MAC rules loaded into the kernel with apparmor_parser; `aa-status` lists loaded profiles and their mode (enforce or complain). Since v1.30 the field securityContext.appArmorProfile {type: RuntimeDefault | Localhost | Unconfined, localhostProfile: name} replaces the container.apparmor.security.beta.kubernetes.io/<container> annotation. The profile must already be loaded on the node where the pod is scheduled, otherwise the pod is rejected with 'AppArmor profile not found'. Verify from inside the container with `cat /proc/1/attr/current`, and read denials from the kernel log with `journalctl -k | grep apparmor`.",
        },
        {
          h: "Host OS hardening",
          p: "Minimise the node: no unnecessary packages or services, key-only SSH or no SSH at all (immutable images such as Bottlerocket, Flatcar or Talos), automatic kernel patching or node image rotation, auditd rules on /etc/kubernetes and the kubelet configuration, sysctl hardening (kernel.kptr_restrict, kernel.dmesg_restrict, kernel.yama.ptrace_scope) and restricted access to the container runtime socket, which is equivalent to root. Restrict pod egress to the cloud metadata endpoint with NetworkPolicy and require IMDSv2 so instance credentials are not exposed to workloads.",
        },
      ],
      keyPoints: [
        "Syscall path: seccomp → capabilities → LSM → DAC. All must allow.",
        "drop: [ALL], add only NET_BIND_SERVICE; allowPrivilegeEscalation: false; runAsNonRoot.",
        "Seccomp Localhost profiles live under /var/lib/kubelet/seccomp/; SCMP_ACT_LOG to record.",
        "AppArmor profile must be loaded on the node first; verify with /proc/1/attr/current.",
        "kubelet seccompDefault: true = RuntimeDefault for everything by default.",
        "Protect the runtime socket and metadata endpoint; prefer an immutable node OS.",
      ],
    },
    lab: {
      objective: "Write and enforce a custom seccomp profile and an AppArmor profile, verify each is active with benign checks, and audit capability sets of running pods cluster-wide.",
      steps: [
        {
          title: "Install a custom seccomp profile on the node and run a pod with it",
          cmd: "sudo mkdir -p /var/lib/kubelet/seccomp/profiles && sudo tee /var/lib/kubelet/seccomp/profiles/no-chmod.json >/dev/null <<'EOF'\n{\"defaultAction\":\"SCMP_ACT_ALLOW\",\"architectures\":[\"SCMP_ARCH_X86_64\",\"SCMP_ARCH_AARCH64\"],\"syscalls\":[{\"names\":[\"chmod\",\"fchmod\",\"fchmodat\",\"fchmodat2\"],\"action\":\"SCMP_ACT_ERRNO\",\"errnoRet\":1}]}\nEOF\nkubectl apply -f seccomp-pod.yaml && kubectl wait --for=condition=Ready pod/seccomp-demo && kubectl exec seccomp-demo -- sh -c 'touch /tmp/f && chmod 700 /tmp/f; echo exit=$?; grep Seccomp /proc/1/status'",
          output: "pod/seccomp-demo created\npod/seccomp-demo condition met\nchmod: /tmp/f: Operation not permitted\nexit=1\nSeccomp:\t2",
          note: "Seccomp mode 2 = filter active. The chmod call was rejected by the filter before any kernel permission check ran.",
        },
        {
          title: "Record which syscalls an app actually uses before writing a deny-by-default profile",
          cmd: "cat <<EOF | kubectl apply -f -\napiVersion: security-profiles-operator.x-k8s.io/v1alpha1\nkind: ProfileRecording\nmetadata: { name: rec-web, namespace: default }\nspec:\n  kind: SeccompProfile\n  recorder: bpf\n  podSelector: { matchLabels: { app: web } }\nEOF\nkubectl rollout restart deploy/web && sleep 60 && kubectl delete profilerecording rec-web && kubectl get seccompprofile -o custom-columns=NAME:.metadata.name,STATUS:.status.status",
          output: "profilerecording.security-profiles-operator.x-k8s.io/rec-web created\ndeployment.apps/web restarted\nprofilerecording.security-profiles-operator.x-k8s.io \"rec-web\" deleted\nNAME                    STATUS\nrec-web-web-5f6d7c8b9   Installed",
          note: "Requires the Security Profiles Operator. The resulting SeccompProfile is distributed to every node and referenced as operator/default/rec-web-web-5f6d7c8b9.json.",
        },
        {
          title: "Load an AppArmor profile and enforce it on nginx",
          cmd: "sudo apparmor_parser -r /etc/apparmor.d/k8s-nginx-deny-write && sudo aa-status | grep k8s-nginx && kubectl apply -f apparmor-pod.yaml && kubectl wait --for=condition=Ready pod/aa-demo && kubectl exec aa-demo -- sh -c 'cat /proc/1/attr/current; touch /etc/x; echo exit=$?'",
          output: "   k8s-nginx-deny-write\npod/aa-demo created\npod/aa-demo condition met\nk8s-nginx-deny-write (enforce)\ntouch: /etc/x: Permission denied\nexit=1",
          note: "The profile text is in the blueprint below. On the node, `journalctl -k | grep apparmor` shows the DENIED record with profile and path.",
        },
        {
          title: "Verify no_new_privs and capability sets of every container on a node",
          cmd: "for c in $(sudo crictl ps -q); do pid=$(sudo crictl inspect $c | jq .info.pid); name=$(sudo crictl inspect $c | jq -r .status.metadata.name); printf '%-24s NNP=%s CapEff=%s\\n' $name $(grep NoNewPrivs /proc/$pid/status | awk '{print $2}') $(grep CapEff /proc/$pid/status | awk '{print $2}'); done | sort | head -6",
          output: "aa-demo                  NNP=1 CapEff=0000000000000400\ncalico-node              NNP=0 CapEff=000001ffffffffff\ncoredns                  NNP=1 CapEff=0000000000002000\nkube-proxy               NNP=0 CapEff=000001ffffffffff\nseccomp-demo             NNP=1 CapEff=0000000000000000\nweb                      NNP=1 CapEff=0000000000000000",
          note: "0x400 = CAP_NET_BIND_SERVICE only. System daemons in kube-system legitimately run with broad capabilities; keep that namespace isolated with RBAC and PSA exemptions.",
        },
        {
          title: "Find pods cluster-wide that fall outside the restricted profile",
          cmd: "kubectl get pods -A -o json | jq -r '.items[] | select((.spec.containers[].securityContext.privileged==true) or (.spec.volumes[]?.hostPath!=null) or ((.spec.containers[].securityContext.capabilities.add // []) | length > 0)) | \"\\(.metadata.namespace)/\\(.metadata.name)\"' | sort -u",
          output: "kube-system/calico-node-8x2kq\nkube-system/calico-node-p4m9r\nkube-system/kube-proxy-lm4t8\nkube-system/kube-proxy-z7c3n\nops/node-tools-2kq9x\nops/node-tools-h8v1p",
          note: "Everything listed should be a known infrastructure component. Anything in an application namespace is a finding to fix.",
        },
      ],
      success: [
        "chmod inside the seccomp pod fails and Seccomp mode reads 2",
        "A recorded SeccompProfile exists with the app's real syscall list",
        "/proc/1/attr/current shows the AppArmor profile in enforce mode and writes to /etc fail",
        "Application containers show NNP=1 and CapEff 0 (or only NET_BIND_SERVICE)",
        "The privileged-pod audit lists only infrastructure namespaces",
      ],
    },
    blueprints: [
      {
        title: "Pods using Localhost seccomp, Localhost AppArmor and the restricted capability set",
        lang: "yaml",
        code: `apiVersion: v1
kind: Pod
metadata:
  name: seccomp-demo
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 65532
    seccompProfile:
      type: Localhost
      localhostProfile: profiles/no-chmod.json      # relative to /var/lib/kubelet/seccomp on the node
  containers:
    - name: app
      image: busybox:1.36
      command: ["sleep", "3600"]
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities: { drop: ["ALL"] }
      volumeMounts: [{ name: tmp, mountPath: /tmp }]
  volumes:
    - { name: tmp, emptyDir: {} }
---
apiVersion: v1
kind: Pod
metadata:
  name: aa-demo
spec:
  nodeSelector:
    apparmor.example.com/k8s-nginx-deny-write: "loaded"   # label nodes where the profile is loaded
  securityContext:
    runAsNonRoot: true
    runAsUser: 101                                          # nginx-unprivileged uid
    seccompProfile: { type: RuntimeDefault }
  containers:
    - name: nginx
      image: ghcr.io/nginx/nginx-unprivileged:1.27
      ports: [{ containerPort: 8080 }]
      securityContext:
        appArmorProfile:                                    # v1.30+ (annotation form for older clusters below)
          type: Localhost
          localhostProfile: k8s-nginx-deny-write
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
          add: ["NET_BIND_SERVICE"]
      volumeMounts:
        - { name: cache, mountPath: /var/cache/nginx }
        - { name: run, mountPath: /var/run }
  volumes:
    - { name: cache, emptyDir: {} }
    - { name: run, emptyDir: {} }
# Pre-1.30 equivalent annotation on the pod:
#   container.apparmor.security.beta.kubernetes.io/nginx: localhost/k8s-nginx-deny-write
`,
      },
      {
        title: "AppArmor profile + DaemonSet that loads profiles from a ConfigMap and labels nodes",
        lang: "yaml",
        code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: apparmor-profiles
  namespace: security
data:
  k8s-nginx-deny-write: |
    #include <tunables/global>
    profile k8s-nginx-deny-write flags=(attach_disconnected) {
      #include <abstractions/base>
      file,
      network inet tcp,
      network inet6 tcp,
      deny /etc/** w,
      deny /usr/** w,
      deny /bin/** w,
      deny /proc/sys/** w,
      deny mount,
      capability net_bind_service,
      deny capability sys_admin,
    }
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: apparmor-loader
  namespace: security
spec:
  selector: { matchLabels: { app: apparmor-loader } }
  template:
    metadata:
      labels: { app: apparmor-loader }
    spec:
      serviceAccountName: apparmor-loader        # RBAC: patch nodes (labels) only
      tolerations: [{ operator: Exists }]
      initContainers:
        - name: load
          image: ubuntu:24.04
          command:
            - /bin/sh
            - -c
            - |
              set -e
              apt-get update -qq && apt-get install -y -qq apparmor >/dev/null
              for f in /profiles/*; do
                cp "$f" /host-apparmor/
                apparmor_parser -r "/host-apparmor/$(basename "$f")"
                echo "loaded $(basename "$f")"
              done
          securityContext:
            privileged: true                    # loading kernel policy requires it; security namespace only
          volumeMounts:
            - { name: profiles, mountPath: /profiles }
            - { name: host-apparmor, mountPath: /host-apparmor }
            - { name: sys-kernel-security, mountPath: /sys/kernel/security }
      containers:
        - name: label
          image: bitnami/kubectl:1.31
          env:
            - name: NODE
              valueFrom: { fieldRef: { fieldPath: spec.nodeName } }
          command:
            - /bin/sh
            - -c
            - kubectl label node "$NODE" apparmor.example.com/k8s-nginx-deny-write=loaded --overwrite && sleep infinity
          securityContext:
            runAsNonRoot: true
            runAsUser: 1001
            allowPrivilegeEscalation: false
            capabilities: { drop: ["ALL"] }
          resources:
            requests: { cpu: 10m, memory: 32Mi }
            limits: { cpu: 100m, memory: 64Mi }
      volumes:
        - { name: profiles, configMap: { name: apparmor-profiles } }
        - { name: host-apparmor, hostPath: { path: /etc/apparmor.d } }
        - { name: sys-kernel-security, hostPath: { path: /sys/kernel/security } }
`,
      },
    ],
  },
  {
    id: "cks-supply-chain",
    track: "cks",
    title: "Supply Chain Security: Cosign, Trivy & Policy",
    subtitle: "Image signing, vulnerability scanning, SBOMs and admission-time enforcement with Kyverno / Gatekeeper",
    icon: "package",
    keywords: "supply chain cosign sigstore sign verify trivy grype sbom slsa provenance kyverno gatekeeper opa rego imagepolicywebhook admission registry digest",
    theory: {
      diagram: "supplyChain",
      intro: [
        "A cluster is only as trustworthy as the images it runs. Supply-chain security binds the artefact running in production to the source and build that produced it, and gates admission on that binding. Sigstore's Cosign signs image digests (with a key pair, or keyless via an OIDC identity from CI logged in the Rekor transparency log); Trivy and Grype scan layers for known CVEs and misconfigurations; SBOMs and SLSA provenance attestations record what went in and who built it.",
        "Enforcement happens at admission: Kyverno's verifyImages rule or Gatekeeper's Rego constraints reject unsigned or unapproved images and rewrite tags to digests. The legacy ImagePolicyWebhook admission plugin still appears on the CKS exam: the API server posts an ImageReview to an external webhook and honours its allow or deny.",
      ],
      sections: [
        {
          h: "Signing and verification with Cosign",
          p: "cosign sign --key cosign.key <image@digest> pushes a signature as an OCI artefact tagged sha256-<digest>.sig next to the image. Keyless signing obtains a short-lived certificate from Fulcio bound to the CI job's OIDC identity and records it in Rekor, so verification checks certificate identity and issuer instead of a static key. cosign verify --key cosign.pub, or --certificate-identity-regexp with --certificate-oidc-issuer, must succeed before deployment. Attestations (cosign attest --predicate sbom.spdx.json --type spdxjson) attach SBOMs and scan results to the same digest.",
        },
        {
          h: "Scanning strategy",
          p: "Scan at three points: in CI (fail the build on fixable CRITICAL findings: trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed), in the registry (continuous rescans as new CVEs publish) and in the cluster (Trivy Operator producing VulnerabilityReport, ConfigAuditReport and RbacAssessmentReport objects). Scan Dockerfiles, manifests and Helm charts as well (trivy config ./deploy). Use a .trivyignore with an expiry date and justification for accepted risks, never blanket ignores.",
        },
        {
          h: "Policy engines: Kyverno vs Gatekeeper",
          p: "Kyverno policies are Kubernetes YAML: validate (deny or audit), mutate (add labels, inject digests), generate (create a default NetworkPolicy in every namespace) and verifyImages (Cosign or Notary signature and attestation checks with digest mutation). Gatekeeper uses ConstraintTemplates written in Rego with Constraints binding them to kinds, plus audit of existing resources. Both run as webhooks with failurePolicy Fail; exclude kube-system and set sensible timeouts so a webhook outage cannot lock the cluster. The native ValidatingAdmissionPolicy (CEL) handles simple rules without any webhook.",
        },
        {
          h: "Registry hygiene and image references",
          p: "Use a private registry with immutable tags, pull-through caches for upstream images and an organisational allowlist of registries. Reference images by digest in manifests — tags are mutable — and set imagePullPolicy: Always when tags are unavoidable. Scope registry pull credentials to namespace-level imagePullSecrets bound to ServiceAccounts and rotate them. Sign base images and rebuild dependents on every base image update with Renovate or Dependabot.",
        },
      ],
      keyPoints: [
        "Sign the digest, not the tag; verify identity + issuer for keyless, or the public key.",
        "Scan in CI (gate), in the registry (continuous) and in the cluster (Trivy Operator).",
        "Kyverno verifyImages: signature + attestation + tag→digest mutation in one rule.",
        "Gatekeeper = Rego ConstraintTemplates + Constraints + audit.",
        "ImagePolicyWebhook = --admission-control-config-file → kubeconfig → external ImageReview endpoint.",
        "Allowlist registries; immutable tags; digest references; namespace-scoped pull secrets.",
      ],
    },
    lab: {
      objective: "Sign an image with Cosign, verify it, attach an SBOM attestation, scan it with Trivy and enforce signature + registry policy at admission with Kyverno.",
      steps: [
        {
          title: "Generate a key pair and sign the image by digest",
          cmd: "COSIGN_PASSWORD='' cosign generate-key-pair && DIGEST=$(crane digest ghcr.io/example/api:1.4.2) && COSIGN_PASSWORD='' cosign sign --key cosign.key --yes ghcr.io/example/api@$DIGEST && crane ls ghcr.io/example/api | grep sha256-",
          output: "Private key written to cosign.key\nPublic key written to cosign.pub\nPushing signature to: ghcr.io/example/api\nsha256-5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c.sig",
          note: "The signature is a separate registry artefact tagged after the digest, so any client can verify it without extra infrastructure.",
        },
        {
          title: "Verify the signature and attach an SBOM attestation",
          cmd: "cosign verify --key cosign.pub ghcr.io/example/api@$DIGEST | jq '.[0].critical.identity.\"docker-reference\", .[0].critical.type' && syft ghcr.io/example/api@$DIGEST -o spdx-json > sbom.spdx.json && COSIGN_PASSWORD='' cosign attest --key cosign.key --yes --type spdxjson --predicate sbom.spdx.json ghcr.io/example/api@$DIGEST && cosign verify-attestation --key cosign.pub --type spdxjson ghcr.io/example/api@$DIGEST | jq -r '.payloadType'",
          output: "\"ghcr.io/example/api\"\n\"cosign container image signature\"\nUsing payload from: sbom.spdx.json\napplication/vnd.in-toto+json",
          note: "The attestation is a signed in-toto statement; Kyverno can require it and evaluate its contents with a condition.",
        },
        {
          title: "Scan the image and gate on fixable HIGH/CRITICAL findings",
          cmd: "trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 --format table ghcr.io/example/api@$DIGEST; echo exit=$?",
          output: "ghcr.io/example/api (debian 12.7)\nTotal: 1 (HIGH: 1, CRITICAL: 0)\n┌───────────┬────────────────┬──────────┬────────┬───────────────────┬─────────────────┐\n│ Library   │ Vulnerability  │ Severity │ Status │ Installed Version │ Fixed Version   │\n├───────────┼────────────────┼──────────┼────────┼───────────────────┼─────────────────┤\n│ libexpat1 │ CVE-2024-45490 │ HIGH     │ fixed  │ 2.5.0-1           │ 2.5.0-1+deb12u1 │\n└───────────┴────────────────┴──────────┴────────┴───────────────────┴─────────────────┘\nexit=1",
          note: "Non-zero exit fails the pipeline. Fix by rebuilding on the updated base digest rather than adding an ignore.",
        },
        {
          title: "Install Kyverno and apply the signature + registry policies",
          cmd: "helm upgrade --install kyverno kyverno/kyverno -n kyverno --create-namespace --version 3.3.4 --set admissionController.replicas=3 >/dev/null && kubectl create secret generic cosign-pub -n kyverno --from-file=cosign.pub && kubectl apply -f kyverno-supply-chain.yaml && kubectl get clusterpolicy",
          output: "NAME                     ADMISSION   BACKGROUND   READY   AGE   MESSAGE\nrestrict-registries      true        true         True    5s    Ready\nverify-image-signature   true        true         True    5s    Ready",
          note: "ADMISSION true = enforced on create/update; BACKGROUND true = existing resources get PolicyReports so you can find violations before enforcing.",
        },
        {
          title: "Confirm enforcement: unapproved registry rejected, signed image mutated to digest",
          cmd: "kubectl -n prod run unapproved --image=docker.io/library/nginx:1.27 2>&1 | tail -1; kubectl -n prod run good --image=ghcr.io/example/api:1.4.2 && kubectl -n prod get pod good -o jsonpath='{.spec.containers[0].image}{\"\\n\"}'",
          output: "resource Pod/prod/unapproved was blocked due to the following policies: restrict-registries: validate-registries: 'images must come from ghcr.io/example/ or registry.example.com/'\npod/good created\nghcr.io/example/api@sha256:5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c",
          note: "The tag was replaced with the verified digest, so the pod can never silently run a different image than the one whose signature was checked.",
        },
        {
          title: "Legacy ImagePolicyWebhook wiring (exam task)",
          cmd: "sudo cat /etc/kubernetes/admission/config.yaml && grep -E 'ImagePolicyWebhook|admission-control-config-file' /etc/kubernetes/manifests/kube-apiserver.yaml",
          output: "apiVersion: apiserver.config.k8s.io/v1\nkind: AdmissionConfiguration\nplugins:\n  - name: ImagePolicyWebhook\n    configuration:\n      imagePolicy:\n        kubeConfigFile: /etc/kubernetes/admission/imagepolicy.kubeconfig\n        allowTTL: 50\n        denyTTL: 50\n        retryBackoff: 500\n        defaultAllow: false\n    - --enable-admission-plugins=NodeRestriction,PodSecurity,ImagePolicyWebhook\n    - --admission-control-config-file=/etc/kubernetes/admission/config.yaml",
          note: "defaultAllow: false means pods are denied if the webhook is unreachable — the secure failure mode. The kubeconfig's server field points at the webhook's image-review endpoint.",
        },
      ],
      success: [
        "cosign verify succeeds against the public key and shows the signed reference",
        "An SBOM attestation is attached and verifiable",
        "trivy exits 1 on fixable HIGH/CRITICAL findings",
        "Kyverno rejects images from unapproved registries and unsigned images",
        "Admitted pods have their image tag rewritten to the verified digest",
      ],
    },
    blueprints: [
      {
        title: "Kyverno ClusterPolicies — registry allowlist, Cosign verification with SBOM attestation, digest mutation",
        lang: "yaml",
        code: `apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: restrict-registries
spec:
  validationFailureAction: Enforce
  background: true
  rules:
    - name: validate-registries
      match:
        any:
          - resources:
              kinds: ["Pod"]
              namespaces: ["prod", "staging"]
      validate:
        message: "images must come from ghcr.io/example/ or registry.example.com/"
        foreach:
          - list: "request.object.spec.[containers, initContainers, ephemeralContainers][]"
            deny:
              conditions:
                all:
                  - key: "{{ element.image }}"
                    operator: AnyNotIn
                    value: ["ghcr.io/example/*", "registry.example.com/*"]
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
spec:
  validationFailureAction: Enforce
  webhookTimeoutSeconds: 30
  background: false
  rules:
    - name: verify-cosign-signature-and-sbom
      match:
        any:
          - resources:
              kinds: ["Pod"]
              namespaces: ["prod", "staging"]
      verifyImages:
        - imageReferences: ["ghcr.io/example/*"]
          mutateDigest: true            # rewrite tag → digest after verification
          verifyDigest: true
          required: true
          failureAction: Enforce
          attestors:
            - count: 1
              entries:
                # Option A: static public key stored in a Secret
                - keys:
                    secret:
                      name: cosign-pub
                      namespace: kyverno
                    rekor:
                      url: https://rekor.sigstore.dev
                # Option B: keyless — CI identity issued by GitHub OIDC
                - keyless:
                    subject: "https://github.com/example/api/.github/workflows/release.yml@refs/tags/*"
                    issuer: "https://token.actions.githubusercontent.com"
                    rekor:
                      url: https://rekor.sigstore.dev
          attestations:
            - type: https://spdx.dev/Document
              attestors:
                - entries:
                    - keys:
                        secret:
                          name: cosign-pub
                          namespace: kyverno
              conditions:
                - all:
                    - key: "{{ spdxVersion }}"
                      operator: Equals
                      value: "SPDX-2.3"
---
# Generate a default-deny NetworkPolicy in every new namespace automatically
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: default-deny-per-namespace
spec:
  generateExisting: true
  rules:
    - name: generate-default-deny
      match:
        any:
          - resources:
              kinds: ["Namespace"]
      exclude:
        any:
          - resources:
              namespaces: ["kube-system", "kube-public", "kube-node-lease", "kyverno"]
      generate:
        apiVersion: networking.k8s.io/v1
        kind: NetworkPolicy
        name: default-deny-all
        namespace: "{{ request.object.metadata.name }}"
        synchronize: true
        data:
          spec:
            podSelector: {}
            policyTypes: ["Ingress", "Egress"]
`,
      },
      {
        title: "Gatekeeper ConstraintTemplate (Rego) requiring digest references, plus a keyless-signing release workflow",
        lang: "yaml",
        code: `apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequireddigest
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredDigest
      validation:
        openAPIV3Schema:
          type: object
          properties:
            exemptImages:
              type: array
              items: { type: string }
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequireddigest

        containers[c] { c := input.review.object.spec.containers[_] }
        containers[c] { c := input.review.object.spec.initContainers[_] }

        exempt(image) {
          some i
          prefix := input.parameters.exemptImages[i]
          startswith(image, prefix)
        }

        violation[{"msg": msg}] {
          c := containers[_]
          not exempt(c.image)
          endswith(c.image, ":latest")
          msg := sprintf("container %v uses :latest tag", [c.name])
        }

        violation[{"msg": msg}] {
          c := containers[_]
          not exempt(c.image)
          not contains(c.image, "@sha256:")
          msg := sprintf("container %v image %v must be referenced by digest", [c.name, c.image])
        }
---
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredDigest
metadata:
  name: require-digest-prod
spec:
  enforcementAction: deny
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
    namespaces: ["prod"]
  parameters:
    exemptImages: ["registry.k8s.io/pause"]
---
# .github/workflows/release.yml (keyless signing with GitHub OIDC)
# name: release
# on: { push: { tags: ["v*"] } }
# permissions: { contents: read, packages: write, id-token: write }
# jobs:
#   build:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: docker/setup-buildx-action@v3
#       - uses: docker/login-action@v3
#         with: { registry: ghcr.io, username: \${{ github.actor }}, password: \${{ secrets.GITHUB_TOKEN }} }
#       - id: build
#         uses: docker/build-push-action@v6
#         with:
#           push: true
#           target: runtime
#           tags: ghcr.io/example/api:\${{ github.ref_name }}
#           sbom: true
#           provenance: mode=max
#       - uses: sigstore/cosign-installer@v3
#       - run: cosign sign --yes ghcr.io/example/api@\${{ steps.build.outputs.digest }}
#       - uses: aquasecurity/trivy-action@0.28.0
#         with:
#           image-ref: ghcr.io/example/api@\${{ steps.build.outputs.digest }}
#           severity: CRITICAL,HIGH
#           ignore-unfixed: true
#           exit-code: "1"
`,
      },
    ],
  },
  {
    id: "cks-rbac-netpol",
    track: "cks",
    title: "RBAC, Pod Security Standards & NetworkPolicy",
    subtitle: "Least-privilege identities, restricted profile enforcement and micro-segmentation",
    icon: "fingerprint",
    keywords: "rbac role rolebinding clusterrole serviceaccount least privilege pod security admission restricted baseline networkpolicy default deny egress ingress cilium micro-segmentation",
    theory: {
      diagram: "securityBoundaries",
      intro: [
        "Three controls define the blast radius of any single workload: what its identity may call (RBAC), what its pod may do on the node (Pod Security Standards) and who it may talk to (NetworkPolicy). Each is deny-by-default in principle but permissive by default in practice — every namespace ships with no NetworkPolicies, PSA in warn-only mode and ServiceAccounts that automount tokens.",
        "The goal state: every workload has its own ServiceAccount with a Role granting exactly the verbs it needs (usually none), automountServiceAccountToken false unless the app calls the API, namespaces labelled pod-security.kubernetes.io/enforce=restricted, and a default-deny NetworkPolicy in each namespace with explicit allow rules for DNS and declared peers.",
      ],
      sections: [
        {
          h: "RBAC model and review checklist",
          p: "Role/ClusterRole list rules (apiGroups, resources, verbs, optional resourceNames); RoleBinding/ClusterRoleBinding attach them to subjects (User, Group, ServiceAccount). A RoleBinding may reference a ClusterRole to grant it within one namespace. Grants to review carefully: wildcard verbs or resources, the escalate, bind and impersonate verbs, create on pods, pods/exec, list on secrets, create on serviceaccounts/token, and any membership in system:masters, which bypasses RBAC entirely and cannot be revoked short of rotating the CA. Audit with `kubectl auth can-i --list --as=system:serviceaccount:ns:sa` and tools such as rbac-tool or kubectl-who-can.",
        },
        {
          h: "Pod Security Admission",
          p: "The built-in PodSecurity admission plugin enforces three profiles per namespace via labels: privileged (no restrictions), baseline (no privileged containers, hostPath, host namespaces, dangerous capabilities or unsafe sysctls) and restricted (baseline plus runAsNonRoot, drop ALL capabilities, seccomp RuntimeDefault or Localhost, allowPrivilegeEscalation false and only safe volume types). Modes enforce (reject), audit (annotate the audit log) and warn (kubectl warning) can each pin a version such as v1.31. Roll out safely by labelling audit and warn first, fixing violations, then enforcing. An AdmissionConfiguration file sets cluster-wide defaults and exemptions for usernames, runtime classes and namespaces.",
        },
        {
          h: "NetworkPolicy semantics",
          p: "Policies are additive allowlists: a pod selected by any policy with policyTypes Ingress only accepts traffic matching some ingress rule, while unselected pods accept everything. An empty podSelector selects all pods in the namespace; policyTypes [Ingress, Egress] with no rules is default-deny both ways. Peers are podSelector (same namespace), namespaceSelector, both together (AND) or ipBlock with except. Egress default-deny must still allow DNS to CoreDNS in kube-system. Policies are enforced by the CNI — with a CNI that lacks policy support they silently do nothing. Cilium and Calico add cluster-wide policies, FQDN egress rules, L7 rules and identity-based mTLS.",
        },
        {
          h: "ServiceAccount tokens",
          p: "Since 1.24 no long-lived Secret is created for a ServiceAccount; pods receive a bound, projected token (audience kube-apiserver, one-hour TTL, rotated by the kubelet, invalid once the pod is deleted). Disable automountServiceAccountToken on both the ServiceAccount and the pod unless needed. For external systems use the TokenRequest API (`kubectl create token sa --duration=10m`) rather than legacy secrets, and use cloud workload identity (IRSA, GKE Workload Identity, Azure Workload Identity) so pods never hold static cloud keys.",
        },
      ],
      keyPoints: [
        "Avoid wildcards, escalate/bind/impersonate, pods/exec and secrets:list for application identities.",
        "system:masters bypasses RBAC and cannot be revoked — never issue certificates with that group.",
        "PSA labels: enforce/audit/warn × privileged/baseline/restricted per namespace, with pinned versions.",
        "NetworkPolicy = allowlist; default-deny needs an explicit DNS egress rule.",
        "Policies only work with a policy-capable CNI (Calico, Cilium, Antrea, Weave).",
        "automountServiceAccountToken: false; bound tokens; TokenRequest for short-lived credentials.",
      ],
    },
    lab: {
      objective: "Audit and reduce RBAC grants, roll out restricted PSA on a namespace, apply default-deny plus scoped NetworkPolicies and verify each with concrete tests.",
      steps: [
        {
          title: "Review what each ServiceAccount in a namespace is allowed to do",
          cmd: "for sa in $(kubectl get sa -n prod -o name | cut -d/ -f2); do printf '%-20s ' $sa; kubectl auth can-i --list --as=system:serviceaccount:prod:$sa 2>/dev/null | awk 'NR>1 && ($3 ~ /\\*/ || $1 ~ /secrets|pods\\/exec/) {print $1\" \"$3}' | tr '\\n' ';'; echo; done",
          output: "default              \nweb                  \nbatch-runner         *.* [] [] [*];secrets [] [] [get list];pods/exec [] [] [create];",
          note: "batch-runner is bound to cluster-admin. Find the binding with `kubectl get clusterrolebinding -o json | jq '.items[] | select(.subjects[]?.name==\"batch-runner\") | .metadata.name'`.",
        },
        {
          title: "Replace it with a least-privilege Role and verify",
          cmd: "kubectl delete clusterrolebinding batch-runner-admin && kubectl apply -f rbac-least-priv.yaml && kubectl auth can-i create jobs -n prod --as=system:serviceaccount:prod:batch-runner && kubectl auth can-i list secrets -n prod --as=system:serviceaccount:prod:batch-runner; kubectl auth can-i create pods -n kube-system --as=system:serviceaccount:prod:batch-runner",
          output: "clusterrolebinding.rbac.authorization.k8s.io \"batch-runner-admin\" deleted\nrole.rbac.authorization.k8s.io/batch-runner created\nrolebinding.rbac.authorization.k8s.io/batch-runner created\nyes\nno\nno",
          note: "Yes to the needed verb, no to secrets, no outside the namespace — the acceptance test for every ServiceAccount you touch.",
        },
        {
          title: "Roll out restricted PSA in audit/warn mode and surface violations",
          cmd: "kubectl label ns prod pod-security.kubernetes.io/audit=restricted pod-security.kubernetes.io/warn=restricted --overwrite && kubectl -n prod get pods -o name | head -1 | xargs -I{} kubectl -n prod get {} -o yaml | kubectl apply --dry-run=server -f - 2>&1 | grep -i warning",
          output: "namespace/prod labeled\nWarning: would violate PodSecurity \"restricted:latest\": allowPrivilegeEscalation != false (container \"legacy\" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container \"legacy\" must set securityContext.capabilities.drop=[\"ALL\"]), runAsNonRoot != true (pod or container \"legacy\" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container \"legacy\" must set securityContext.seccompProfile.type to \"RuntimeDefault\" or \"Localhost\")",
          note: "Every violation names the exact field to fix. Fix the workloads, then switch on the enforce label.",
        },
        {
          title: "Enforce restricted and confirm a non-compliant pod is rejected",
          cmd: "kubectl label ns prod pod-security.kubernetes.io/enforce=restricted pod-security.kubernetes.io/enforce-version=v1.31 --overwrite && kubectl -n prod run legacy-test --image=busybox:1.36 -- sleep 1 2>&1 | head -1",
          output: "namespace/prod labeled\nError from server (Forbidden): pods \"legacy-test\" is forbidden: violates PodSecurity \"restricted:v1.31\": allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile ...",
          note: "Pinning enforce-version prevents a future cluster upgrade from changing the profile's rules under you.",
        },
        {
          title: "Apply default-deny + DNS egress and test connectivity before/after",
          cmd: "kubectl apply -f netpol-prod.yaml && sleep 3 && kubectl -n prod exec deploy/web -- sh -c 'wget -qO- --timeout=2 http://api.prod.svc/healthz; echo api=$?; wget -qO- --timeout=2 http://postgres-hl.db.svc:5432; echo db=$?; nslookup kubernetes.default >/dev/null; echo dns=$?'",
          output: "networkpolicy.networking.k8s.io/default-deny-all created\nnetworkpolicy.networking.k8s.io/allow-dns-egress created\nnetworkpolicy.networking.k8s.io/web-egress created\nnetworkpolicy.networking.k8s.io/api-ingress created\nok\napi=0\nwget: download timed out\ndb=1\ndns=0",
          note: "web → api works (declared), web → db times out (undeclared), DNS still resolves (explicit egress rule). Timeouts rather than resets are the signature of a policy DROP.",
        },
        {
          title: "See the policy verdict in the CNI (Cilium Hubble)",
          cmd: "hubble observe --namespace prod --verdict DROPPED --last 2 -o compact",
          output: "Sep 20 16:12:04.118: prod/web-5f6d7c8b9-2k9xp:44120 (ID:21874) <> db/postgres-0:5432 (ID:30011) Policy denied DROPPED (TCP Flags: SYN)\nSep 20 16:12:05.121: prod/web-5f6d7c8b9-2k9xp:44120 (ID:21874) <> db/postgres-0:5432 (ID:30011) Policy denied DROPPED (TCP Flags: SYN)",
          note: "Flow logs with verdicts turn 'it hangs' into 'policy dropped SYN from A to B'. On Calico, enable flow logs or use `calicoctl` policy tracing.",
        },
      ],
      success: [
        "No application ServiceAccount has wildcard verbs, secrets:list or pods/exec",
        "can-i returns yes only for the verbs the workload needs and no outside its namespace",
        "PSA warn output lists concrete fields; enforce rejects a non-compliant pod",
        "After default-deny, only declared flows succeed and DNS still works",
        "CNI flow logs show DROPPED verdicts for undeclared traffic",
      ],
    },
    blueprints: [
      {
        title: "Least-privilege RBAC — namespaced Role, aggregated read-only ClusterRole, SA with automount disabled, PSA defaults",
        lang: "yaml",
        code: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: batch-runner
  namespace: prod
automountServiceAccountToken: false          # pods opt in explicitly when they need the API
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: batch-runner
  namespace: prod
rules:
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["configmaps"]
    resourceNames: ["batch-config"]           # scope to one object, not all configmaps
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: batch-runner
  namespace: prod
subjects:
  - kind: ServiceAccount
    name: batch-runner
    namespace: prod
roleRef:
  kind: Role
  name: batch-runner
  apiGroup: rbac.authorization.k8s.io
---
# Aggregated ClusterRole: any ClusterRole labelled rbac.example.com/aggregate-to-viewer=true is merged in.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: platform-viewer
aggregationRule:
  clusterRoleSelectors:
    - matchLabels:
        rbac.example.com/aggregate-to-viewer: "true"
rules: []                                     # populated by the controller
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: platform-viewer-core
  labels:
    rbac.example.com/aggregate-to-viewer: "true"
rules:
  - apiGroups: ["", "apps", "batch", "networking.k8s.io", "policy"]
    resources: ["pods", "pods/log", "services", "endpoints", "deployments", "replicasets", "statefulsets", "daemonsets", "jobs", "cronjobs", "networkpolicies", "poddisruptionbudgets", "events", "configmaps"]
    verbs: ["get", "list", "watch"]           # deliberately no secrets, no exec, no portforward
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: developers-platform-viewer
subjects:
  - kind: Group
    name: developers                          # from OIDC groups claim or certificate O=
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: platform-viewer
  apiGroup: rbac.authorization.k8s.io
---
# Cluster-wide PSA defaults with exemptions (passed via --admission-control-config-file)
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: PodSecurity
    configuration:
      apiVersion: pod-security.admission.config.k8s.io/v1
      kind: PodSecurityConfiguration
      defaults:
        enforce: baseline
        enforce-version: latest
        audit: restricted
        audit-version: latest
        warn: restricted
        warn-version: latest
      exemptions:
        usernames: []
        runtimeClasses: []
        namespaces: ["kube-system", "calico-system", "ops"]
`,
      },
      {
        title: "Micro-segmented NetworkPolicies — default deny, DNS egress, tiered allow rules, Cilium L7/FQDN",
        lang: "yaml",
        code: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: prod
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: prod
spec:
  podSelector: {}
  policyTypes: ["Egress"]
  egress:
    - to:
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: kube-system }
          podSelector:
            matchLabels: { k8s-app: kube-dns }
      ports:
        - { protocol: UDP, port: 53 }
        - { protocol: TCP, port: 53 }
---
# web may call api (same namespace) and the public internet on 443, but not private ranges or the metadata endpoint.
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-egress
  namespace: prod
spec:
  podSelector:
    matchLabels: { app: web }
  policyTypes: ["Egress"]
  egress:
    - to:
        - podSelector:
            matchLabels: { app: api }
      ports: [{ protocol: TCP, port: 8080 }]
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 169.254.169.254/32       # cloud metadata endpoint
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports: [{ protocol: TCP, port: 443 }]
---
# api accepts ingress only from web and the gateway namespace; egress only to the db namespace on 5432.
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-ingress
  namespace: prod
spec:
  podSelector:
    matchLabels: { app: api }
  policyTypes: ["Ingress", "Egress"]
  ingress:
    - from:
        - podSelector:
            matchLabels: { app: web }
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: gateway-system }
          podSelector:
            matchLabels: { gateway.networking.k8s.io/gateway-name: public }
      ports: [{ protocol: TCP, port: 8080 }]
    - from:
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: monitoring }
      ports: [{ protocol: TCP, port: 9090 }]     # metrics scrape
  egress:
    - to:
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: db }
          podSelector:
            matchLabels: { app: postgres }
      ports: [{ protocol: TCP, port: 5432 }]
---
# Cilium extensions: cluster-wide metadata-endpoint restriction, FQDN egress and L7 rules
apiVersion: cilium.io/v2
kind: CiliumClusterwideNetworkPolicy
metadata:
  name: restrict-metadata-endpoint
spec:
  endpointSelector: {}
  egressDeny:
    - toCIDR: ["169.254.169.254/32"]
---
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: api-l7
  namespace: prod
spec:
  endpointSelector:
    matchLabels: { app: api }
  egress:
    - toFQDNs:
        - matchName: api.stripe.com
      toPorts:
        - ports: [{ port: "443", protocol: TCP }]
  ingress:
    - fromEndpoints:
        - matchLabels: { app: web }
      toPorts:
        - ports: [{ port: "8080", protocol: TCP }]
          rules:
            http:
              - method: GET
                path: "/v1/.*"
              - method: POST
                path: "/v1/orders"
`,
      },
    ],
  },
  {
    id: "cks-runtime",
    track: "cks",
    title: "Runtime Security: Audit Logs & Falco",
    subtitle: "Observing the control plane and the kernel so policy violations are visible in flight",
    icon: "radar",
    keywords: "falco runtime security syscall ebpf audit log audit policy detection alert falcosidekick incident response monitoring",
    theory: {
      diagram: "securityBoundaries",
      intro: [
        "Preventive controls need a detection layer that confirms they are working and notices when something slips past. Two data sources cover the two surfaces: the API server audit log records every request against the control plane (who did what, from where, allowed or denied), and Falco observes kernel syscalls from every container to flag behaviour a healthy workload never exhibits — an interactive shell in a distroless container, reads of sensitive files, binaries written below /usr, unexpected outbound connections.",
        "CKS tests both: writing an audit policy and locating events in the log, and reading, writing and troubleshooting Falco rules — rule file locations, priorities, output formats and how to find which pod produced an event.",
      ],
      sections: [
        {
          h: "Audit log anatomy and useful queries",
          p: "Each event has a stage (RequestReceived, ResponseStarted, ResponseComplete, Panic), a level (None, Metadata, Request, RequestResponse), user (username, groups), sourceIPs, userAgent, verb, objectRef (namespace, resource, name, subresource), responseStatus.code and annotations such as authorization.k8s.io/decision and pod-security.kubernetes.io/audit-violations. Everyday queries: all 403s grouped by user, who read a given Secret, every pods/exec, every RBAC change, requests from unexpected source IPs. Ship the log to a SIEM with the webhook backend and keep the file backend for forensics.",
        },
        {
          h: "Falco architecture",
          p: "Falco runs as a DaemonSet with a kernel driver — the modern eBPF probe (CO-RE, no kernel headers) or the legacy kernel module — that streams syscall events to user space, where they are enriched with container and Kubernetes metadata (container.id, k8s.ns.name, k8s.pod.name) and evaluated against rules. Rules use a condition language over event fields (evt.type, proc.name, fd.name, container.image.repository, user.name), reference lists and macros, and emit an output string at a priority from EMERGENCY to DEBUG. Rule files load in order: /etc/falco/falco_rules.yaml (upstream), falco_rules.local.yaml (your additions and overrides) and rules.d/. Falcosidekick fans alerts out to Slack, PagerDuty or webhooks.",
        },
        {
          h: "Writing and tuning rules",
          p: "Start from upstream rules and tune with exceptions rather than disabling: redefine a rule with the same name and `override: {condition: append}` to add exclusions. Use macros for repeated conditions and lists for image allowlists. Tag rules for SIEM mapping. Validate a rule by performing the benign action it describes — for example opening a shell with kubectl exec into a test pod — and reading the event from `kubectl logs -n falco ds/falco`. The option json_output=true makes events machine-readable with enrichment in output_fields.",
        },
        {
          h: "Response loop",
          p: "Alert → triage (which pod, image, node and ServiceAccount) → contain (apply a quarantine label matched by a deny-all NetworkPolicy, cordon the node, revoke the identity's bindings, rotate any secrets it could read) → collect evidence (pod YAML, crictl inspect, copies of /var/log/pods) → eradicate (delete the pod, roll the deployment to a patched digest) → learn (add an admission policy so the same gap is closed at L2 next time). Containment can be automated with Falco Talon or a Kyverno policy keyed on the quarantine label.",
        },
      ],
      keyPoints: [
        "Audit log = who did what to the control plane; Falco = what a process did on the node.",
        "Audit levels: None < Metadata < Request < RequestResponse; omit RequestReceived.",
        "Falco: eBPF probe → enriched syscalls → rules (conditions, macros, lists) → outputs → Falcosidekick.",
        "Custom rules go in falco_rules.local.yaml; override with append rather than disabling.",
        "High-value rules: shell in container, sensitive file read, write below /usr, unexpected egress.",
        "Contain first (quarantine label, cordon, revoke), then collect, then eradicate.",
      ],
    },
    lab: {
      objective: "Enable audit logging with a policy, query it for specific events, install Falco, validate a custom rule with a benign kubectl exec, and wire alerts to a quarantine workflow.",
      steps: [
        {
          title: "Enable auditing on the API server and confirm events flow",
          cmd: "sudo mkdir -p /etc/kubernetes/audit /var/log/kubernetes/audit && sudo cp audit-policy.yaml /etc/kubernetes/audit/policy.yaml && sleep 30 && sudo tail -1 /var/log/kubernetes/audit/audit.log | jq '{stage, verb, user: .user.username, res: .objectRef.resource, code: .responseStatus.code}'",
          output: "{\n  \"stage\": \"ResponseComplete\",\n  \"verb\": \"get\",\n  \"user\": \"system:serviceaccount:kube-system:generic-garbage-collector\",\n  \"res\": \"namespaces\",\n  \"code\": 200\n}",
          note: "Add --audit-policy-file, --audit-log-path, --audit-log-maxage/maxbackup/maxsize and the two hostPath volumes to kube-apiserver.yaml first (see Control Plane Internals). If the log stays empty, check crictl logs of the API server for a policy parse error.",
        },
        {
          title: "Query the audit log for denials, secret reads and exec sessions",
          cmd: "sudo jq -c 'select(.responseStatus.code==403) | [.user.username, .verb, .objectRef.resource]' /var/log/kubernetes/audit/audit.log | sort | uniq -c | sort -rn | head -3; sudo jq -c 'select(.objectRef.resource==\"secrets\" and .verb==\"get\") | [.user.username, .objectRef.namespace, .objectRef.name]' /var/log/kubernetes/audit/audit.log | tail -2; sudo jq -c 'select(.objectRef.subresource==\"exec\") | [.user.username, .objectRef.namespace, .objectRef.name, .sourceIPs[0]]' /var/log/kubernetes/audit/audit.log | tail -2",
          output: "     14 [\"system:serviceaccount:prod:batch-runner\",\"list\",\"secrets\"]\n      3 [\"dana\",\"create\",\"pods\"]\n[\"system:serviceaccount:kube-system:cert-manager\",\"prod\",\"api-tls\"]\n[\"kubernetes-admin\",\"default\",\"lab-secret\"]\n[\"kubernetes-admin\",\"default\",\"life\",\"10.0.0.50\"]",
          note: "Repeated 403s from a ServiceAccount usually mean an application is polling for permissions it never had — a misconfiguration signal, or something worth a closer look.",
        },
        {
          title: "Install Falco with the modern eBPF driver and Falcosidekick",
          cmd: "helm repo add falcosecurity https://falcosecurity.github.io/charts >/dev/null && helm upgrade --install falco falcosecurity/falco -n falco --create-namespace --set driver.kind=modern_ebpf --set tty=true --set falcosidekick.enabled=true --set falcosidekick.webui.enabled=true -f falco-values.yaml >/dev/null && kubectl -n falco rollout status ds/falco && kubectl -n falco logs ds/falco --tail=3 | grep -E 'Loading rules|Starting'",
          output: "daemon set \"falco\" successfully rolled out\nLoading rules from file /etc/falco/falco_rules.yaml\nLoading rules from file /etc/falco/rules.d/custom-rules.yaml\nStarting health webserver with threadiness 4, listening on 0.0.0.0:8765",
          note: "modern_ebpf needs kernel 5.8+ with BTF. Older kernels use driver.kind=kmod or the classic ebpf probe.",
        },
        {
          title: "Validate the shell-detection rule with a benign kubectl exec",
          cmd: "kubectl -n prod exec deploy/api -- /bin/sh -c 'echo hello' ; sleep 2; kubectl -n falco logs ds/falco --tail=50 | grep -E 'Terminal shell|Shell in' | tail -1",
          output: "hello\n16:40:11.207: Notice A shell was spawned in a container with an attached terminal (evt_type=execve user=root user_uid=0 user_loginuid=-1 process=sh proc_exepath=/bin/busybox parent=runc command=sh -c echo hello terminal=34816 exe_flags=EXE_WRITABLE container_id=61e0c2ab9d4f container_image=ghcr.io/example/api container_image_tag=1.4.2 container_name=api k8s_ns=prod k8s_pod_name=api-7d9c8b6f5-2xk9p)",
          note: "The enrichment fields (k8s_ns, k8s_pod_name, container_image) are what an on-call engineer needs to act. In production images without a shell this event should never occur.",
        },
        {
          title: "Add a custom rule and confirm it loads without errors",
          cmd: "kubectl -n falco get cm falco-rules -o yaml | grep -c 'Write below /usr in prod' ; kubectl -n falco rollout restart ds/falco && kubectl -n falco rollout status ds/falco && kubectl -n falco logs ds/falco --tail=200 | grep -iE 'rules.d/custom|error|warning' | head -3",
          output: "1\ndaemon set \"falco\" successfully rolled out\nLoading rules from file /etc/falco/rules.d/custom-rules.yaml",
          note: "A syntax error in a rule prints 'Rules file ... could not be loaded' and Falco exits — CrashLoopBackOff on the DaemonSet is the tell. Validate offline with `falco --dry-run -r custom-rules.yaml`.",
        },
        {
          title: "Wire an alert to an automatic quarantine label",
          cmd: "kubectl apply -f quarantine-netpol.yaml && kubectl -n falco get cm falcosidekick -o jsonpath='{.data.config\\.yaml}' | grep -A3 webhook && kubectl -n prod label pod api-7d9c8b6f5-2xk9p security.example.com/quarantine=true && kubectl -n prod exec api-7d9c8b6f5-2xk9p -- wget -qO- --timeout=2 http://web.prod.svc:8080/ ; echo exit=$?",
          output: "networkpolicy.networking.k8s.io/quarantine created\nwebhook:\n  address: http://falco-talon.falco.svc:2803/\n  minimumpriority: warning\nwget: download timed out\nexit=1",
          note: "The quarantine NetworkPolicy selects the label and allows no traffic; Falco Talon (or a small webhook) applies the label on matching events so containment happens in seconds.",
        },
      ],
      success: [
        "Audit events are written and can be queried by status code, resource and subresource",
        "Falco DaemonSet is running with the eBPF driver and loads custom rules",
        "A kubectl exec into a test pod produces a shell-spawn event with pod and image metadata",
        "A custom rule loads without errors after restart",
        "Labelling a pod with the quarantine label immediately cuts its network access",
      ],
    },
    blueprints: [
      {
        title: "Falco custom rules (rules.d/custom-rules.yaml) — overrides, macros, lists and production-oriented detections",
        lang: "yaml",
        code: `# Loaded via Helm values: customRules: { custom-rules.yaml: |- ... }
- list: prod_image_allowlist
  items: ["ghcr.io/example", "registry.example.com"]

- macro: prod_namespace
  condition: (k8s.ns.name startswith "prod")

- macro: allowed_writers_below_usr
  condition: (proc.name in (apt, apt-get, dpkg, yum, dnf, rpm, pip, npm) and container.image.repository startswith "registry.example.com/ci")

# 1. Tighten the upstream shell rule to only fire in production namespaces (append to the condition).
- rule: Terminal shell in container
  condition: and prod_namespace
  override:
    condition: append

# 2. Detect binaries or libraries written below /usr in production workloads.
- rule: Write below /usr in prod
  desc: A process in a production container wrote to /usr, which should be immutable at runtime.
  condition: >
    evt.type in (open, openat, openat2, creat) and evt.is_open_write=true
    and fd.name startswith /usr and container and prod_namespace
    and not allowed_writers_below_usr
  output: >
    File written below /usr in production container
    (user=%user.name command=%proc.cmdline file=%fd.name
    image=%container.image.repository:%container.image.tag
    pod=%k8s.pod.name ns=%k8s.ns.name node=%k8s.node.name)
  priority: ERROR
  tags: [filesystem, integrity, prod]

# 3. Detect reads of the projected ServiceAccount token by anything other than the app binary.
- rule: Unexpected read of service account token
  desc: A process other than the application read the projected SA token.
  condition: >
    evt.type in (open, openat, openat2) and evt.is_open_read=true
    and fd.name endswith "/serviceaccount/token" and container and prod_namespace
    and not proc.name in (node, java, python3, server, api)
  output: >
    Service account token read by unexpected process
    (process=%proc.name parent=%proc.pname cmdline=%proc.cmdline
    pod=%k8s.pod.name ns=%k8s.ns.name image=%container.image.repository)
  priority: WARNING
  tags: [credentials, prod]

# 4. Detect outbound connections from database pods, which should only accept connections.
- rule: Outbound connection from database pod
  desc: Database workloads should not initiate outbound connections except to their replicas.
  condition: >
    evt.type in (connect) and evt.dir=< and fd.typechar=4 and fd.sip != "127.0.0.1"
    and container and k8s.ns.name = "db"
    and not (fd.sport in (5432) or fd.sip startswith "10.244.")
  output: >
    Outbound connection from database pod
    (connection=%fd.name process=%proc.name pod=%k8s.pod.name ns=%k8s.ns.name)
  priority: WARNING
  tags: [network, db]

# 5. Detect containers started from images outside the allowlist (uses container events).
- rule: Container from unapproved registry
  desc: A container started from an image not in the production allowlist.
  condition: >
    container.duration <= 5000000000 and evt.type = container and prod_namespace
    and not container.image.repository startswith prod_image_allowlist
  output: >
    Container started from unapproved registry
    (image=%container.image.repository pod=%k8s.pod.name ns=%k8s.ns.name)
  priority: NOTICE
  tags: [supply-chain, prod]
`,
      },
      {
        title: "Falco Helm values + quarantine NetworkPolicy + Falco Talon response rule",
        lang: "yaml",
        code: `# falco-values.yaml
driver:
  kind: modern_ebpf
tty: true
falco:
  json_output: true
  json_include_output_property: true
  json_include_tags_property: true
  priority: notice
  log_level: info
  rules_file:
    - /etc/falco/falco_rules.yaml
    - /etc/falco/falco_rules.local.yaml
    - /etc/falco/rules.d
  http_output:
    enabled: true
    url: http://falco-falcosidekick.falco.svc:2801
  metrics:
    enabled: true
    interval: 1h
falcosidekick:
  enabled: true
  config:
    slack:
      webhookurl: ""                       # set via a Secret in production
      minimumpriority: warning
    webhook:
      address: http://falco-talon.falco.svc:2803/
      minimumpriority: warning
collectors:
  kubernetes:
    enabled: true                          # k8s-metacollector for pod/namespace enrichment
resources:
  requests: { cpu: 100m, memory: 512Mi }
  limits: { cpu: "1", memory: 1Gi }
tolerations:
  - operator: Exists
---
# quarantine-netpol.yaml — any pod carrying the label loses all connectivity immediately.
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: quarantine
  namespace: prod
spec:
  podSelector:
    matchLabels:
      security.example.com/quarantine: "true"
  policyTypes: ["Ingress", "Egress"]
---
# Falco Talon rule: label the pod on a shell-spawn event so the NetworkPolicy above isolates it.
apiVersion: talon.falco.org/v1
kind: Rule
metadata:
  name: quarantine-shell-in-prod
spec:
  match:
    rules:
      - Terminal shell in container
    priority: ">=Notice"
    output_fields:
      - k8s.ns.name:prod
  actions:
    - action: label-pod
      actionner: kubernetes:label
      parameters:
        labels:
          security.example.com/quarantine: "true"
    - action: notify-slack
      actionner: slack
      parameters:
        channel: "#security-alerts"
`,
      },
    ],
  },
];
/* ====================================================================================
   TRACK 4 DIAGRAMS — Beyond the Certifications (Day-2 Operations)
   ==================================================================================== */

/** GitOps + observability highway: commit → ArgoCD → registry → Gateway API → telemetry. */
function GitOpsHighwayDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 560" title="GitOps & Observability Highway — commit → sync → deploy → route → telemetry" t={t} height={580}>
      {/* Row 1: delivery */}
      <Node x={20} y={40} w={150} h={60} label="Git (main)" sub="apps/api/values.yaml" fill="url(#gSlate)" stroke="#94a3b8" />
      <Node x={200} y={40} w={150} h={60} label="CI pipeline" sub="build • scan • sign • bump tag" fill="url(#gCyan)" />
      <Node x={380} y={40} w={170} h={60} label="OCI Registry" sub="api@sha256 + .sig + .att" fill="url(#gViolet)" stroke="#a78bfa" />
      <Node x={580} y={40} w={170} h={60} label="ArgoCD" sub="Application: prod-api" fill="url(#gEmerald)" stroke="#34d399" />
      <Node x={780} y={40} w={200} h={60} label="Cluster (prod-east)" sub="Deployment • HTTPRoute • PDB" fill="url(#gAmber)" stroke="#fbbf24" />
      <Edge d="M 170 70 L 200 70" label="push" lx={185} ly={62} />
      <Edge d="M 350 70 L 380 70" label="push image" lx={365} ly={62} />
      <Edge d="M 350 85 C 360 130, 560 130, 580 100" color="#34d399" marker="url(#arrowEmerald)" label="PR: image tag bump (image-updater)" lx={460} ly={126} />
      <Edge d="M 95 100 C 95 150, 600 160, 640 100" color="#94a3b8" marker="url(#arrowMuted)" label="poll/webhook 3m" lx={330} ly={162} />
      <Edge d="M 750 70 L 780 70" label="kubectl apply (SSA)" lx={765} ly={62} />
      <Edge d="M 550 70 C 560 20, 760 20, 800 40" color="#a78bfa" marker="url(#arrowMuted)" label="pull by digest (verified by Kyverno)" lx={680} ly={20} />

      {/* Reconciliation loop */}
      <Zone x={580} y={120} w={170} h={110} label="RECONCILE LOOP" stroke="#34d399" fill="rgba(5,150,105,0.08)" labelFill="#6ee7b7" dashed={false} />
      <Label x={592} y={150} text="desired = render(Git)" fill="#e2e8f0" size={9.5} />
      <Label x={592} y={166} text="live = k8s API cache" fill="#e2e8f0" size={9.5} />
      <Label x={592} y={182} text="diff → OutOfSync" fill="#fbbf24" size={9.5} />
      <Label x={592} y={198} text="sync → apply → Healthy" fill="#6ee7b7" size={9.5} />
      <Label x={592} y={214} text="selfHeal • prune • waves" fill="#94a3b8" size={9.5} />

      {/* Row 2: traffic */}
      <Zone x={20} y={250} w={960} h={130} label="TRAFFIC PATH (Gateway API)" stroke="#0891b2" fill="rgba(8,145,178,0.06)" labelFill="#22d3ee" />
      <Node x={40} y={285} w={130} h={54} label="Client" sub="https://api.example.com" fill="url(#gSlate)" />
      <Node x={200} y={285} w={150} h={54} label="Gateway: public" sub="GatewayClass envoy • TLS" fill="url(#gCyan)" />
      <Node x={380} y={285} w={170} h={54} label="HTTPRoute: api" sub="weights 90/10 canary" fill="url(#gCyan)" />
      <Node x={580} y={285} w={150} h={54} label="Service api-stable" sub="EndpointSlice ×6" fill="url(#gEmerald)" stroke="#34d399" />
      <Node x={760} y={285} w={150} h={54} label="Service api-canary" sub="EndpointSlice ×1" fill="url(#gAmber)" stroke="#fbbf24" />
      <Edge d="M 170 312 L 200 312" />
      <Edge d="M 350 312 L 380 312" />
      <Edge d="M 550 305 L 580 305" label="90%" lx={565} ly={298} />
      <Edge d="M 550 320 C 600 350, 720 350, 760 325" color="#fbbf24" marker="url(#arrowAmber)" label="10%" lx={650} ly={358} />
      <Edge d="M 850 100 L 850 285" color="#fbbf24" marker="url(#arrowAmber)" animated={false} />

      {/* Row 3: telemetry */}
      <Zone x={20} y={400} w={960} h={145} label="TELEMETRY (pull metrics, push traces, tail logs)" stroke="#7c3aed" fill="rgba(124,58,237,0.06)" labelFill="#c4b5fd" />
      <Node x={40} y={435} w={170} h={54} label="Prometheus" sub="scrape /metrics 30s • PromQL" fill="url(#gRose)" stroke="#fb7185" />
      <Node x={240} y={435} w={170} h={54} label="OTel Collector" sub="OTLP gRPC 4317 • tail sampling" fill="url(#gViolet)" stroke="#a78bfa" />
      <Node x={440} y={435} w={170} h={54} label="Tempo / Jaeger" sub="traces by trace_id" fill="url(#gViolet)" stroke="#a78bfa" />
      <Node x={640} y={435} w={150} h={54} label="Loki" sub={'logs {ns="prod"}'} fill="url(#gSlate)" />
      <Node x={820} y={435} w={150} h={54} label="Grafana" sub="dashboards • alerts" fill="url(#gAmber)" stroke="#fbbf24" />
      <Edge d="M 640 339 C 640 380, 140 380, 125 435" color="#fb7185" marker="url(#arrowRose)" label="GET /metrics (pull)" lx={330} ly={395} labelFill="#fda4af" />
      <Edge d="M 660 339 C 660 390, 340 390, 325 435" color="#a78bfa" marker="url(#arrowMuted)" label="OTLP spans (push)" lx={520} ly={412} labelFill="#c4b5fd" />
      <Edge d="M 680 339 C 690 400, 700 410, 715 435" color="#94a3b8" marker="url(#arrowMuted)" label="stdout → /var/log/pods → agent" lx={780} ly={412} />
      <Edge d="M 410 462 L 440 462" color="#a78bfa" marker="url(#arrowMuted)" />
      <Edge d="M 210 462 C 230 520, 800 520, 820 480" color="#fb7185" marker="url(#arrowRose)" />
      <Edge d="M 610 462 C 630 510, 800 510, 820 470" color="#a78bfa" marker="url(#arrowMuted)" />
      <Edge d="M 790 462 L 820 462" color="#94a3b8" marker="url(#arrowMuted)" />
      <Label x={40} y={520} text="Correlation key: trace_id in logs (JSON field) + exemplars on histograms → click from a latency spike to the exact trace" fill="#94a3b8" size={9.5} />
      <Label x={40} y={536} text="Argo Rollouts / Flagger read Prometheus success-rate & p99 to promote or roll back the canary automatically" fill="#6ee7b7" size={9.5} />
    </Diagram>
  );
}

/** Prometheus scrape architecture + OTel pipeline. */
function ObservabilityDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 420" title="Observability Internals — Prometheus discovery/scrape, OpenTelemetry pipeline, span anatomy" t={t} height={440}>
      <Zone x={20} y={20} w={470} h={380} label="PROMETHEUS (pull model)" stroke="#fb7185" labelFill="#fda4af" />
      <Node x={40} y={50} w={200} h={46} label="kubernetes_sd_configs" sub="role: pod | endpoints | node" fill="#4c0519" stroke="#fb7185" />
      <Node x={260} y={50} w={210} h={46} label="ServiceMonitor / PodMonitor" sub="prometheus-operator CRDs" fill="#4c0519" stroke="#fb7185" />
      <Node x={40} y={110} w={430} h={40} label="relabel_configs: keep __meta_kubernetes_pod_annotation_prometheus_io_scrape=true" fill="#1e293b" stroke="#64748b" fontSize={10} />
      <Node x={40} y={165} w={200} h={46} label="scrape loop (30s)" sub="GET /metrics • text exposition" fill="url(#gRose)" stroke="#fb7185" />
      <Node x={260} y={165} w={210} h={46} label="TSDB (2h head → blocks)" sub="WAL • compaction • retention 15d" fill="url(#gRose)" stroke="#fb7185" />
      <Node x={40} y={225} w={200} h={46} label="Alertmanager" sub="group • inhibit • route → PagerDuty" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={260} y={225} w={210} h={46} label="remote_write → Mimir/Thanos" sub="long-term, multi-cluster, HA dedup" fill="#1e293b" stroke="#64748b" />
      <Edge d="M 140 96 L 140 110" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 365 96 L 365 110" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 255 150 L 255 165" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 240 188 L 260 188" color="#fb7185" marker="url(#arrowRose)" />
      <Edge d="M 365 211 L 365 225" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Edge d="M 140 211 L 140 225" animated={false} marker="url(#arrowMuted)" color="#94a3b8" />
      <Label x={40} y={300} text="Metric types: counter (rate()), gauge, histogram (_bucket, histogram_quantile), summary" fill="#e2e8f0" size={9.5} />
      <Label x={40} y={318} text="Golden signals: latency p99, traffic rps, errors 5xx ratio, saturation (CPU throttle, queue depth)" fill="#e2e8f0" size={9.5} />
      <Label x={40} y={336} text="Cardinality budget: never label by user_id / request_id; series ≈ metrics × label combos" fill="#fbbf24" size={9.5} />
      <Label x={40} y={354} text="kube-state-metrics (object state) + node-exporter (host) + cAdvisor (containers, via kubelet)" fill="#94a3b8" size={9.5} />
      <Label x={40} y={372} text="Recording rules precompute expensive queries: job:http_requests:rate5m" fill="#94a3b8" size={9.5} />

      <Zone x={510} y={20} w={470} h={380} label="OPENTELEMETRY (push model)" stroke="#a78bfa" labelFill="#c4b5fd" />
      <Node x={530} y={50} w={200} h={46} label="app SDK / auto-instr." sub="traces • metrics • logs" fill="url(#gViolet)" stroke="#a78bfa" />
      <Node x={750} y={50} w={210} h={46} label="OTel Operator" sub="Instrumentation CRD injects agent" fill="url(#gViolet)" stroke="#a78bfa" />
      <Node x={530} y={115} w={430} h={110} label="" fill="#1e1b4b" stroke="#818cf8" />
      <Label x={545} y={135} text="Collector pipeline (DaemonSet agent → Deployment gateway)" fill="#c4b5fd" size={10} weight="700" />
      <Label x={545} y={155} text="receivers: otlp(4317/4318), prometheus, filelog, k8s_events" fill="#e2e8f0" size={9.5} />
      <Label x={545} y={172} text="processors: k8sattributes, memory_limiter, batch, tail_sampling, resource" fill="#e2e8f0" size={9.5} />
      <Label x={545} y={189} text="exporters: otlp → Tempo, prometheusremotewrite → Mimir, loki" fill="#e2e8f0" size={9.5} />
      <Label x={545} y={206} text="connectors: spanmetrics (RED metrics derived from spans)" fill="#e2e8f0" size={9.5} />
      <Edge d="M 630 96 L 630 115" color="#a78bfa" marker="url(#arrowMuted)" />
      <Edge d="M 855 96 L 855 115" color="#a78bfa" marker="url(#arrowMuted)" />
      {/* Span anatomy */}
      <Label x={530} y={255} text="TRACE 4bf92f3577b34da6a3ce929d0e0e4736" fill="#c4b5fd" size={10} weight="700" />
      {[
        ["GET /checkout  (gateway)", 0, 400, "#0e7490"],
        ["api.CreateOrder", 30, 340, "#6d28d9"],
        ["SELECT orders  (pg)", 60, 90, "#047857"],
        ["POST payments.stripe.com", 170, 170, "#b45309"],
        ["cache.set", 350, 20, "#047857"],
      ].map(([l, off, w, c], i) => (
        <g key={i}>
          <rect x={530 + off} y={268 + i * 22} width={w} height={16} rx={3} fill={c} stroke="#cbd5e1" strokeWidth="0.6" />
          <text x={534 + off} y={280 + i * 22} fill="#f8fafc" fontSize="9" fontFamily="ui-monospace, monospace">{l}</text>
        </g>
      ))}
      <Label x={530} y={392} text="span = {trace_id, span_id, parent_id, name, start, duration, attributes, status}  •  W3C traceparent header propagates context" fill="#94a3b8" size={9} />
    </Diagram>
  );
}

/** Istio sidecar vs ambient architecture. */
function ServiceMeshDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 420" title="Service Mesh — Istio sidecar (per-pod Envoy) vs ambient (ztunnel + waypoint)" t={t} height={440}>
      <Zone x={20} y={20} w={470} h={380} label="SIDECAR MODE" stroke="#0891b2" labelFill="#22d3ee" />
      <Zone x={40} y={50} w={200} h={150} label="pod web" stroke="#7c3aed" fill="rgba(124,58,237,0.08)" labelFill="#c4b5fd" dashed={false} />
      <Node x={55} y={80} w={80} h={40} label="app" sub=":8080" fill="url(#gViolet)" />
      <Node x={150} y={80} w={80} h={40} label="envoy" sub="istio-proxy" fill="url(#gCyan)" />
      <Label x={55} y={145} text="iptables REDIRECT 15001/15006" fill="#94a3b8" size={8.5} />
      <Label x={55} y={160} text="init: istio-init (NET_ADMIN) or CNI" fill="#94a3b8" size={8.5} />
      <Label x={55} y={175} text="+ ~50-100 MB RAM per pod" fill="#fbbf24" size={8.5} />
      <Zone x={270} y={50} w={200} h={150} label="pod api" stroke="#059669" fill="rgba(5,150,105,0.08)" labelFill="#6ee7b7" dashed={false} />
      <Node x={285} y={80} w={80} h={40} label="envoy" sub="istio-proxy" fill="url(#gCyan)" />
      <Node x={380} y={80} w={80} h={40} label="app" sub=":8080" fill="url(#gEmerald)" />
      <Edge d="M 135 100 L 150 100" color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
      <Edge d="M 230 100 L 285 100" label="mTLS (SPIFFE)" lx={257} ly={92} />
      <Edge d="M 365 100 L 380 100" color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
      <Node x={40} y={220} w={430} h={44} label="istiod (control plane)" sub="xDS push: listeners, routes, clusters, endpoints, secrets (certs from CA)" fill="url(#gSlate)" stroke="#94a3b8" />
      <Edge d="M 190 220 L 190 120" color="#94a3b8" marker="url(#arrowMuted)" animated={false} dash="3 3" />
      <Edge d="M 325 220 L 325 120" color="#94a3b8" marker="url(#arrowMuted)" animated={false} dash="3 3" />
      <Label x={40} y={290} text="L7 everywhere: retries, timeouts, circuit breaking, fault injection, header routing, telemetry" fill="#e2e8f0" size={9.5} />
      <Label x={40} y={308} text="Cost: restart pods to upgrade proxies; CPU/RAM per pod; init container needs NET_ADMIN" fill="#fbbf24" size={9.5} />
      <Label x={40} y={326} text="APIs: VirtualService, DestinationRule, PeerAuthentication, AuthorizationPolicy, Sidecar" fill="#94a3b8" size={9.5} />
      <Label x={40} y={344} text="Debug: istioctl proxy-status • istioctl proxy-config routes <pod> • istioctl analyze" fill="#94a3b8" size={9.5} />

      <Zone x={510} y={20} w={470} h={380} label="AMBIENT MODE (sidecar-less)" stroke="#a78bfa" labelFill="#c4b5fd" />
      <Zone x={530} y={50} w={430} h={130} label="node worker1" stroke="#475569" labelFill="#94a3b8" />
      <Node x={545} y={80} w={90} h={40} label="pod web" sub="no sidecar" fill="url(#gViolet)" />
      <Node x={660} y={80} w={90} h={40} label="pod api" sub="no sidecar" fill="url(#gEmerald)" />
      <Node x={790} y={80} w={150} h={40} label="ztunnel (DaemonSet)" sub="Rust L4 proxy • HBONE" fill="url(#gCyan)" />
      <Edge d="M 635 100 C 650 130, 780 130, 790 110" label="redirect via CNI (in-pod netns)" lx={700} ly={150} />
      <Edge d="M 750 100 C 770 60, 790 60, 800 80" color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
      <Node x={530} y={200} w={200} h={50} label="waypoint proxy (Envoy)" sub="per-namespace/service L7, optional" fill="url(#gAmber)" stroke="#fbbf24" />
      <Node x={750} y={200} w={210} h={50} label="istiod" sub="xDS → ztunnel + waypoints" fill="url(#gSlate)" stroke="#94a3b8" />
      <Edge d="M 865 120 C 865 160, 640 160, 630 200" color="#fbbf24" marker="url(#arrowAmber)" label="L7 policy needed? → hop via waypoint (HBONE :15008)" lx={760} ly={185} />
      <Label x={530} y={280} text="L4 by default: mTLS, identity, L4 authz, TCP telemetry with zero pod changes" fill="#e2e8f0" size={9.5} />
      <Label x={530} y={298} text="L7 opt-in: label ns istio.io/use-waypoint → HTTP routing, retries, authz on headers" fill="#e2e8f0" size={9.5} />
      <Label x={530} y={316} text="Upgrade ztunnel/waypoints without restarting app pods; ~90% less memory than sidecars" fill="#6ee7b7" size={9.5} />
      <Label x={530} y={334} text="Gateway API is the native config surface (HTTPRoute for waypoints)" fill="#94a3b8" size={9.5} />
      <Label x={530} y={352} text="Debug: istioctl ztunnel-config workloads • istioctl waypoint status" fill="#94a3b8" size={9.5} />
    </Diagram>
  );
}

/** Gateway API vs Ingress object model. */
function GatewayApiDiagram({ t }) {
  return (
    <Diagram viewBox="0 0 1000 400" title="Gateway API vs Ingress — role-oriented object model and traffic splitting" t={t} height={420}>
      <Zone x={20} y={20} w={300} h={360} label="INGRESS (legacy)" stroke="#94a3b8" labelFill="#94a3b8" />
      <Node x={40} y={50} w={260} h={50} label="Ingress" sub="host + path → Service (one object does all)" fill="url(#gSlate)" stroke="#94a3b8" />
      <Node x={40} y={115} w={260} h={44} label="IngressClass → controller" sub="nginx • traefik • haproxy" fill="#1e293b" stroke="#64748b" />
      <Label x={40} y={190} text="✗ annotations for everything (nginx.ingress.kubernetes.io/*)" fill="#fda4af" size={9.5} />
      <Label x={40} y={208} text="✗ no portable traffic splitting, header matching, TCP/UDP" fill="#fda4af" size={9.5} />
      <Label x={40} y={226} text="✗ infra + app config in one namespace-scoped object" fill="#fda4af" size={9.5} />
      <Label x={40} y={244} text="✓ ubiquitous, simple for host/path → service" fill="#6ee7b7" size={9.5} />
      <Label x={40} y={280} text="Migration: ingress2gateway CLI converts" fill="#94a3b8" size={9.5} />
      <Label x={40} y={296} text="Ingress + annotations → HTTPRoute" fill="#94a3b8" size={9.5} />

      <Zone x={340} y={20} w={640} h={360} label="GATEWAY API (GA v1: GatewayClass, Gateway, HTTPRoute, GRPCRoute)" stroke="#0891b2" labelFill="#22d3ee" />
      <Node x={360} y={50} w={280} h={50} label="GatewayClass: envoy" sub="cluster-scoped • owned by infra provider" fill="url(#gSlate)" stroke="#94a3b8" />
      <Node x={360} y={115} w={280} h={60} label="Gateway: public (ns gateway-system)" sub="listeners: https:443 TLS cert • allowedRoutes: ns selector" fill="url(#gCyan)" />
      <Node x={360} y={190} w={280} h={60} label="HTTPRoute: api (ns prod)" sub="parentRefs → public • hostnames • rules" fill="url(#gEmerald)" stroke="#34d399" />
      <Edge d="M 500 100 L 500 115" color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
      <Edge d="M 500 175 L 500 190" color="#94a3b8" marker="url(#arrowMuted)" animated={false} label="attach (ReferenceGrant for x-ns)" lx={640} ly={186} />
      <Label x={360} y={280} text="Roles: infra provider (GatewayClass) → cluster operator (Gateway) → app dev (HTTPRoute)" fill="#e2e8f0" size={9.5} />
      <Label x={360} y={298} text="Matching: path (Exact/PathPrefix/Regex), headers, query, method • filters: rewrite, redirect, mirror, header mod" fill="#e2e8f0" size={9.5} />
      <Label x={360} y={316} text="backendRefs weights → canary; ReferenceGrant authorises cross-namespace refs; policies via *Policy attachment" fill="#e2e8f0" size={9.5} />
      <Label x={360} y={334} text="Implementations: Envoy Gateway, Cilium, Istio, NGINX Gateway Fabric, Kong, Traefik, cloud LBs" fill="#94a3b8" size={9.5} />
      <Label x={360} y={352} text="Status conditions on Route (Accepted, ResolvedRefs) tell you exactly why traffic is not flowing" fill="#94a3b8" size={9.5} />
      {/* traffic split */}
      <Node x={680} y={115} w={130} h={40} label="api-stable" sub="weight 90" fill="url(#gEmerald)" stroke="#34d399" fontSize={11} />
      <Node x={830} y={115} w={130} h={40} label="api-canary" sub="weight 10" fill="url(#gAmber)" stroke="#fbbf24" fontSize={11} />
      <Node x={680} y={175} w={280} h={40} label="header x-canary: always → api-canary (100)" fill="#1e293b" stroke="#64748b" fontSize={10} />
      <Node x={680} y={225} w={280} h={40} label="requestMirror → api-shadow (fire-and-forget)" fill="#1e293b" stroke="#64748b" fontSize={10} />
      <Edge d="M 640 210 C 660 210, 660 135, 680 135" color="#34d399" marker="url(#arrowEmerald)" />
      <Edge d="M 640 220 C 660 220, 800 140, 830 135" color="#fbbf24" marker="url(#arrowAmber)" />
      <Edge d="M 640 230 L 680 195" color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
      <Edge d="M 640 240 L 680 245" color="#94a3b8" marker="url(#arrowMuted)" animated={false} />
    </Diagram>
  );
}

/* ====================================================================================
   TRACK 4 MODULE DATA
   ==================================================================================== */
const TRACK4_MODULES = [
  {
    id: "beyond-gitops",
    track: "beyond",
    title: "GitOps with ArgoCD & Flux",
    subtitle: "Declarative delivery, the reconciliation loop, app-of-apps, progressive sync and drift control",
    icon: "gitbranch",
    keywords: "gitops argocd flux reconciliation sync drift self-heal prune app-of-apps applicationset kustomization helmrelease image updater sync waves hooks",
    theory: {
      diagram: "gitopsHighway",
      intro: [
        "GitOps inverts deployment: instead of CI pushing manifests into the cluster, an in-cluster controller pulls the desired state from Git and continuously reconciles the live state toward it. Git becomes the audit log, the rollback mechanism (revert a commit) and the access boundary (nobody needs cluster-admin to deploy). ArgoCD and Flux are the two CNCF-graduated implementations; both follow the same loop the diagram shows: fetch → render (Helm/Kustomize/plain) → diff against the live cache → apply → report health.",
        "The consequences are operational: drift caused by kubectl edits is either reported (OutOfSync) or reverted (selfHeal), deleted manifests are pruned from the cluster, and every environment is a directory or branch whose history explains exactly what ran when.",
      ],
      sections: [
        {
          h: "ArgoCD architecture and the sync loop",
          p: "argocd-repo-server clones repositories and renders manifests (Helm template, Kustomize build, plugins) into plain YAML, cached by commit SHA. argocd-application-controller watches Application CRs, compares rendered desired state with the live cluster (via informer caches, using a three-way diff with the last-applied annotation or server-side apply managed fields), sets sync status (Synced/OutOfSync) and health (Healthy/Progressing/Degraded per resource type with Lua health checks), and executes syncs: sync waves (argocd.argoproj.io/sync-wave) order resources, hooks (PreSync, Sync, PostSync, SyncFail) run Jobs such as migrations, and prune deletes resources no longer in Git. argocd-server exposes the UI/API with SSO and RBAC via AppProjects.",
        },
        {
          h: "Flux model",
          p: "Flux composes small controllers: source-controller fetches GitRepository, OCIRepository, HelmRepository and Bucket sources into artefacts; kustomize-controller applies Kustomization objects (path + interval + prune + health checks + dependsOn); helm-controller reconciles HelmRelease objects (values from ConfigMaps/Secrets, remediation with rollback and retries); image-reflector/automation controllers scan registries and commit tag updates back to Git. Everything is a CRD, so Flux is itself managed by Flux (bootstrap). Flux is lighter and more composable; ArgoCD has the richer UI and multi-tenant UX.",
        },
        {
          h: "Repository structure and environments",
          p: "Separate application source repos from deployment config repos so image builds do not trigger config commits in the same history. In the config repo use a base plus per-environment overlays (Kustomize) or per-environment values files (Helm). Promote by PR from staging to prod directories, never by branch merges that carry unrelated changes. App-of-apps (an Application that points at a directory of Applications) or ApplicationSets (generators: list, cluster, git directory, pull request, matrix) scale to hundreds of services and clusters. Secrets stay out of Git via Sealed Secrets, SOPS with age/KMS, or External Secrets Operator referencing a vault.",
        },
        {
          h: "Progressive delivery",
          p: "Argo Rollouts replaces Deployment with a Rollout CR supporting canary steps (setWeight, pause, analysis) and blue-green (preview service, promotion), integrated with Gateway API, Istio, NGINX and service meshes for traffic shaping, and with Prometheus/Datadog analysis templates that automatically abort on error-rate or latency regressions. Flagger does the same for Flux. Combine with GitOps: the desired image lands via Git, the rollout controller decides how fast it reaches users.",
        },
      ],
      keyPoints: [
        "Pull, not push: the controller reconciles Git → cluster; Git is the audit log and rollback.",
        "ArgoCD: repo-server renders, application-controller diffs/syncs, AppProject scopes tenants.",
        "selfHeal reverts drift; prune deletes removed manifests; waves + hooks order syncs.",
        "Flux: GitRepository/OCIRepository → Kustomization/HelmRelease; image automation commits tags.",
        "Separate app repos from config repos; promote by PR between environment directories.",
        "Argo Rollouts / Flagger add canary + analysis on top of GitOps-delivered manifests.",
      ],
    },
    lab: {
      objective: "Install ArgoCD, deploy an application from Git with automated sync, observe drift correction and pruning, add a PreSync migration hook, and run a canary with Argo Rollouts.",
      steps: [
        {
          title: "Install ArgoCD and log in with the CLI",
          cmd: "kubectl create namespace argocd && kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.13.1/manifests/install.yaml >/dev/null && kubectl -n argocd rollout status deploy/argocd-server && argocd login --core && argocd version --short",
          output: "namespace/argocd created\ndeployment \"argocd-server\" successfully rolled out\nContext 'kubernetes' updated\nargocd: v2.13.1+af54ef8\nargocd-server: v2.13.1+af54ef8",
          note: "--core talks to the API server directly using your kubeconfig, no port-forward or admin password needed for lab work.",
        },
        {
          title: "Create the Application with automated sync, prune and self-heal",
          cmd: "kubectl apply -f argocd-application.yaml && sleep 20 && argocd app get prod-api --output json | jq '{sync: .status.sync.status, health: .status.health.status, rev: .status.sync.revision[0:7], resources: (.status.resources | length)}'",
          output: "application.argoproj.io/prod-api created\n{\n  \"sync\": \"Synced\",\n  \"health\": \"Healthy\",\n  \"rev\": \"a1b2c3d\",\n  \"resources\": 6\n}",
          note: "Synced means desired == live; Healthy means every resource passed its health check (Deployment available, Service has endpoints, etc.).",
        },
        {
          title: "Introduce drift with kubectl and watch self-heal revert it",
          cmd: "kubectl -n prod scale deploy/api --replicas=1 && sleep 8 && kubectl -n prod get deploy api -o jsonpath='{.spec.replicas}{\"\\n\"}' && argocd app history prod-api | tail -2",
          output: "deployment.apps/api scaled\n6\nID  DATE                           REVISION\n3   2026-09-20 17:02:11 +0000 UTC  a1b2c3d (self-heal)",
          note: "The controller detected OutOfSync within seconds and re-applied replicas: 6 from Git. Manual scaling is not possible with selfHeal on — which is the point.",
        },
        {
          title: "Delete a manifest in Git and confirm pruning",
          cmd: "git -C ~/deploy-config rm apps/api/pdb.yaml && git -C ~/deploy-config commit -qm 'remove pdb' && git -C ~/deploy-config push -q && argocd app sync prod-api --prune >/dev/null && kubectl -n prod get pdb api 2>&1 | tail -1",
          output: "Error from server (NotFound): poddisruptionbudgets.policy \"api\" not found",
          note: "Without prune: true the PDB would remain as an orphan and the app would show OutOfSync forever.",
        },
        {
          title: "Add a PreSync migration hook and observe ordering",
          cmd: "git -C ~/deploy-config add apps/api/migrate-job.yaml && git -C ~/deploy-config commit -qm 'add migration hook' && git -C ~/deploy-config push -q && argocd app sync prod-api >/dev/null && argocd app get prod-api --show-operation | grep -E 'Hook|migrate|Phase' | head -4",
          output: "Phase:             Succeeded\nHook: PreSync  batch/Job prod/api-migrate-7f3a  Succeeded  job completed (1/1)\n           Sync  apps/Deployment prod/api  Synced  deployment updated",
          note: "The Job ran to completion before the Deployment changed; hook-delete-policy HookSucceeded removed it afterwards.",
        },
        {
          title: "Run a canary with Argo Rollouts and Gateway API traffic shifting",
          cmd: "kubectl apply -f argo-rollout.yaml && kubectl argo rollouts set image api api=ghcr.io/example/api:1.5.0 -n prod && sleep 30 && kubectl argo rollouts get rollout api -n prod --no-color | grep -E 'Status|Step|SetWeight|canary|stable' | head -6 && kubectl -n prod get httproute api -o jsonpath='{.spec.rules[0].backendRefs[*].weight}{\"\\n\"}'",
          output: "Status:          ॥ Paused\nStep:            1/6\nStrategy:        Canary\n  Step:          1/6\n  SetWeight:     10\n  ActualWeight:  10\n90 10",
          note: "The controller edited the HTTPRoute weights to 90/10 and paused. `kubectl argo rollouts promote api -n prod` continues; the AnalysisTemplate aborts automatically if success rate drops.",
        },
      ],
      success: [
        "argocd app get shows Synced/Healthy after creation",
        "A manual scale is reverted within the reconciliation interval",
        "A manifest removed from Git is pruned from the cluster",
        "A PreSync Job completes before the Deployment is updated",
        "Argo Rollouts shifts Gateway API weights to 90/10 and pauses for analysis",
      ],
    },
    blueprints: [
      {
        title: "ArgoCD AppProject + Application (Helm, automated sync, waves, hook Job) + ApplicationSet",
        lang: "yaml",
        code: `apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: prod
  namespace: argocd
spec:
  description: Production workloads
  sourceRepos:
    - https://github.com/example/deploy-config.git
    - oci://registry.example.com/charts
  destinations:
    - namespace: "prod"
      server: https://kubernetes.default.svc
  clusterResourceWhitelist: []                 # no cluster-scoped objects from app teams
  namespaceResourceBlacklist:
    - { group: "", kind: ResourceQuota }
    - { group: "", kind: LimitRange }
    - { group: networking.k8s.io, kind: NetworkPolicy }   # owned by the platform team
  roles:
    - name: deployer
      policies:
        - p, proj:prod:deployer, applications, sync, prod/*, allow
      groups: ["sre-oncall"]
  syncWindows:
    - kind: deny
      schedule: "0 22 * * 5"                   # no Friday 22:00 deploys
      duration: 10h
      applications: ["*"]
---
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: prod-api
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io   # cascade delete resources when the app is deleted
spec:
  project: prod
  source:
    repoURL: https://github.com/example/deploy-config.git
    targetRevision: main
    path: apps/api
    helm:
      releaseName: api
      valueFiles:
        - values.yaml
        - values-prod.yaml
      parameters:
        - name: image.tag
          value: "1.4.2"                       # updated by CI or argocd-image-updater
  destination:
    server: https://kubernetes.default.svc
    namespace: prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=false
      - ServerSideApply=true
      - ApplyOutOfSyncOnly=true
      - PrunePropagationPolicy=foreground
      - RespectIgnoreDifferences=true
    retry:
      limit: 5
      backoff: { duration: 5s, factor: 2, maxDuration: 3m }
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jqPathExpressions:
        - .spec.replicas                       # HPA owns replicas
  revisionHistoryLimit: 10
---
# PreSync hook rendered by the chart (templates/migrate-job.yaml)
apiVersion: batch/v1
kind: Job
metadata:
  name: api-migrate
  namespace: prod
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
    argocd.argoproj.io/sync-wave: "-1"
spec:
  backoffLimit: 2
  ttlSecondsAfterFinished: 600
  template:
    spec:
      restartPolicy: Never
      serviceAccountName: api-migrate
      containers:
        - name: migrate
          image: ghcr.io/example/api@sha256:5c8f7f2b8b0a4a0dfb3c4d1b1a8d7e2c6f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c
          command: ["/nodejs/bin/node", "dist/migrate.js"]
          envFrom: [{ secretRef: { name: api-db } }]
---
# ApplicationSet: one Application per cluster × environment directory
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: api-fleet
  namespace: argocd
spec:
  goTemplate: true
  generators:
    - matrix:
        generators:
          - clusters:
              selector:
                matchLabels: { tier: prod }
          - git:
              repoURL: https://github.com/example/deploy-config.git
              revision: main
              directories:
                - path: envs/prod/*
  template:
    metadata:
      name: "api-{{ .name }}-{{ .path.basename }}"
    spec:
      project: prod
      source:
        repoURL: https://github.com/example/deploy-config.git
        targetRevision: main
        path: "{{ .path.path }}"
      destination:
        server: "{{ .server }}"
        namespace: prod
      syncPolicy:
        automated: { prune: true, selfHeal: true }
`,
      },
      {
        title: "Flux equivalents (GitRepository, Kustomization, HelmRelease, ImagePolicy) + Argo Rollout canary with analysis",
        lang: "yaml",
        code: `apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: deploy-config
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/example/deploy-config.git
  ref: { branch: main }
  secretRef: { name: github-token }
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: prod-platform
  namespace: flux-system
spec:
  interval: 10m
  path: ./envs/prod/platform
  prune: true
  wait: true
  timeout: 5m
  sourceRef: { kind: GitRepository, name: deploy-config }
  healthChecks:
    - { apiVersion: apps/v1, kind: Deployment, name: envoy-gateway, namespace: gateway-system }
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: api
  namespace: prod
spec:
  interval: 5m
  dependsOn:
    - { name: prod-platform, namespace: flux-system }
  chart:
    spec:
      chart: ./charts/api
      sourceRef: { kind: GitRepository, name: deploy-config, namespace: flux-system }
  valuesFrom:
    - { kind: ConfigMap, name: api-values-prod }
  install:
    remediation: { retries: 3 }
  upgrade:
    remediation: { retries: 3, remediateLastFailure: true }
    cleanupOnFail: true
  rollback: { cleanupOnFail: true }
  driftDetection: { mode: enabled }
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: api
  namespace: flux-system
spec:
  imageRepositoryRef: { name: api }
  policy:
    semver: { range: ">=1.4.0 <2.0.0" }
---
# Argo Rollouts canary with Prometheus analysis and Gateway API traffic routing
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: api
  namespace: prod
spec:
  replicas: 6
  selector: { matchLabels: { app: api } }
  strategy:
    canary:
      canaryService: api-canary
      stableService: api-stable
      trafficRouting:
        plugins:
          argoproj-labs/gatewayAPI:
            httpRoute: api
            namespace: prod
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis:
            templates: [{ templateName: success-rate }]
            args: [{ name: service, value: api-canary }]
        - setWeight: 30
        - pause: { duration: 10m }
        - setWeight: 60
        - pause: { duration: 10m }
      abortScaleDownDelaySeconds: 30
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: ghcr.io/example/api:1.4.2
          ports: [{ containerPort: 8080 }]
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
  namespace: prod
spec:
  args: [{ name: service }]
  metrics:
    - name: success-rate
      interval: 1m
      count: 5
      successCondition: result[0] >= 0.99
      failureLimit: 1
      provider:
        prometheus:
          address: http://prometheus-k8s.monitoring.svc:9090
          query: |
            sum(rate(http_requests_total{service="{{args.service}}",code!~"5.."}[2m]))
            /
            sum(rate(http_requests_total{service="{{args.service}}"}[2m]))
`,
      },
    ],
  },
  {
    id: "beyond-observability",
    track: "beyond",
    title: "Enterprise Observability",
    subtitle: "Prometheus scraping architecture, Grafana dashboards, OpenTelemetry traces and log correlation",
    icon: "activity",
    keywords: "prometheus grafana opentelemetry otel collector tracing spans loki tempo metrics servicemonitor alertmanager slo golden signals cardinality exemplars",
    theory: {
      diagram: "observability",
      intro: [
        "Observability is the ability to ask new questions of a system without shipping new code. The three signal types answer different questions: metrics (cheap, aggregated, alertable — what is the error rate?), traces (per-request causal structure — why is this request slow?) and logs (arbitrary detail — what exactly happened?). The modern stack unifies them with shared resource attributes (service.name, k8s.pod.name) and correlation keys (trace_id) so you can pivot from a dashboard spike to a trace to the log lines it produced.",
        "Prometheus pulls metrics on a schedule from discovered targets; OpenTelemetry pushes traces (and optionally metrics and logs) through a Collector pipeline; log agents tail container stdout from /var/log/pods. Grafana queries all three backends side by side.",
      ],
      sections: [
        {
          h: "Prometheus on Kubernetes",
          p: "kubernetes_sd_configs discover pods, endpoints, services, nodes and ingresses from the API and expose their metadata as __meta_kubernetes_* labels; relabel_configs decide what to keep and how to name it. The Prometheus Operator turns this into CRDs: ServiceMonitor/PodMonitor select targets by label, PrometheusRule holds recording and alerting rules, and the Prometheus CR manages sharding, retention and remote_write. Standard exporters: kube-state-metrics (object state: deployment replicas, pod phase), node-exporter (host CPU/mem/disk/net), cAdvisor via the kubelet (container CPU throttling, memory working set). Long-term storage and multi-cluster queries come from Thanos or Mimir receiving remote_write.",
        },
        {
          h: "PromQL and alerting essentials",
          p: "rate(counter[5m]) for per-second rates; histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m]))) for latency percentiles; sum by (pod) (container_memory_working_set_bytes) / on(pod) group_left kube_pod_container_resource_limits for memory headroom; rate(container_cpu_cfs_throttled_periods_total[5m]) / rate(container_cpu_cfs_periods_total[5m]) for throttling. Alert on symptoms (SLO burn rate: error budget consumed too fast over 1h and 6h windows) rather than causes (CPU high). Alertmanager groups by alertname/namespace, inhibits downstream alerts when an upstream fires, and routes by severity to PagerDuty or Slack.",
        },
        {
          h: "OpenTelemetry pipeline",
          p: "Applications emit spans via SDKs or auto-instrumentation (the OTel Operator's Instrumentation CRD injects Java/Node/Python/.NET agents by annotation). Spans carry trace_id, span_id, parent_span_id, name, timestamps, attributes and status; context propagates over HTTP via the W3C traceparent header and over gRPC metadata. The Collector runs as a DaemonSet agent (k8sattributes enrichment, memory_limiter, batch) forwarding to a gateway Deployment (tail_sampling keeps all error/slow traces and 5% of the rest, spanmetrics connector derives RED metrics per endpoint) which exports to Tempo/Jaeger (traces), Mimir (metrics) and Loki (logs).",
        },
        {
          h: "Logs and correlation",
          p: "Write JSON logs to stdout with service, level, message and trace_id fields; the kubelet writes them to /var/log/pods/<ns>_<pod>_<uid>/<container>/0.log with rotation per containerLogMaxSize. Fluent Bit, Promtail, Vector or the OTel filelog receiver tail those files, attach Kubernetes metadata and ship to Loki or Elasticsearch. In Grafana, derived fields turn trace_id into a link to Tempo; exemplars on Prometheus histograms link a latency bucket sample to the trace that produced it; Tempo's service graph and metrics generator close the loop back to metrics.",
        },
      ],
      keyPoints: [
        "Metrics = pull (Prometheus), traces = push (OTLP), logs = tail (/var/log/pods).",
        "ServiceMonitor/PodMonitor + PrometheusRule via the Prometheus Operator; remote_write to Mimir/Thanos.",
        "Alert on SLO burn rate (symptoms), not on CPU (causes); group and inhibit in Alertmanager.",
        "Cardinality is the cost driver: no unbounded labels; recording rules for expensive queries.",
        "OTel Collector: receivers → processors (k8sattributes, batch, tail_sampling) → exporters.",
        "Correlate with trace_id in logs, exemplars on histograms and shared resource attributes.",
      ],
    },
    lab: {
      objective: "Deploy the Prometheus Operator stack, scrape an application with a ServiceMonitor, write an SLO burn-rate alert, deploy the OTel Collector with tail sampling and follow one request from metric to trace to log.",
      steps: [
        {
          title: "Install kube-prometheus-stack and confirm targets are discovered",
          cmd: "helm upgrade --install kps prometheus-community/kube-prometheus-stack -n monitoring --create-namespace --version 65.5.1 -f kps-values.yaml >/dev/null && kubectl -n monitoring rollout status sts/prometheus-kps-kube-prometheus-stack-prometheus && kubectl -n monitoring exec sts/prometheus-kps-kube-prometheus-stack-prometheus -c prometheus -- wget -qO- http://localhost:9090/api/v1/targets | jq '[.data.activeTargets[] | select(.health==\"up\") | .labels.job] | group_by(.) | map({job: .[0], n: length})'",
          output: "[{\"job\":\"apiserver\",\"n\":3},{\"job\":\"coredns\",\"n\":2},{\"job\":\"kube-state-metrics\",\"n\":1},{\"job\":\"kubelet\",\"n\":6},{\"job\":\"node-exporter\",\"n\":6}]",
          note: "kubelet appears three times per node (kubelet, cAdvisor, probes). If node-exporter targets are down, check hostNetwork tolerations and NetworkPolicy to the monitoring namespace.",
        },
        {
          title: "Scrape the application via a ServiceMonitor and query its RED metrics",
          cmd: "kubectl apply -f servicemonitor-api.yaml && sleep 45 && kubectl -n monitoring exec sts/prometheus-kps-kube-prometheus-stack-prometheus -c prometheus -- wget -qO- 'http://localhost:9090/api/v1/query?query=sum(rate(http_requests_total{namespace=\"prod\",service=\"api\"}[2m]))by(code)' | jq -r '.data.result[] | \"\\(.metric.code) \\(.value[1])\"'",
          output: "200 148.23\n404 0.61\n500 0.42",
          note: "The Service needs a named port matching the ServiceMonitor endpoint and the label the selector expects (release: kps unless serviceMonitorSelectorNilUsesHelmValues is false).",
        },
        {
          title: "Add an SLO burn-rate alert and confirm it loads",
          cmd: "kubectl apply -f prometheusrule-slo.yaml && sleep 30 && kubectl -n monitoring exec sts/prometheus-kps-kube-prometheus-stack-prometheus -c prometheus -- wget -qO- http://localhost:9090/api/v1/rules | jq -r '.data.groups[] | select(.name==\"api-slo\") | .rules[] | \"\\(.name) \\(.health) \\(.state // \"recording\")\"'",
          output: "api:sli_error_ratio:rate5m ok recording\napi:sli_error_ratio:rate1h ok recording\napi:sli_error_ratio:rate6h ok recording\nAPIErrorBudgetBurn ok inactive",
          note: "Multi-window burn-rate (1h and 6h at 14.4× and 6×) pages only when the budget is really being consumed, avoiding flapping on brief blips.",
        },
        {
          title: "Deploy the OTel Collector (agent + gateway) with tail sampling",
          cmd: "helm upgrade --install otel open-telemetry/opentelemetry-collector -n observability --create-namespace --version 0.108.0 -f otel-values.yaml >/dev/null && kubectl -n observability rollout status ds/otel-opentelemetry-collector-agent && kubectl -n observability logs ds/otel-opentelemetry-collector-agent --tail=200 | grep -E 'Everything is ready|tail_sampling' | head -2",
          output: "daemon set \"otel-opentelemetry-collector-agent\" successfully rolled out\ninfo    service@v0.108.0/service.go:221    Everything is ready. Begin running and processing data.\ninfo    tailsamplingprocessor@v0.108.0/processor.go:137    Building sampling policy    {\"policy\": \"errors-and-slow\"}",
          note: "Agents push to the gateway Deployment; only the gateway runs tail_sampling, because a trace's spans must all land on the same instance to be judged together (use a load-balancing exporter with routing_key: traceID when scaling gateways).",
        },
        {
          title: "Auto-instrument the API with the OTel Operator and verify spans arrive",
          cmd: "kubectl -n prod annotate deploy/api instrumentation.opentelemetry.io/inject-nodejs=observability/default --overwrite && kubectl -n prod rollout status deploy/api && kubectl -n prod exec deploy/web -- wget -qO- http://api:8080/v1/orders/123 >/dev/null && sleep 10 && kubectl -n observability exec deploy/tempo -- wget -qO- 'http://localhost:3200/api/search?tags=service.name%3Dapi&limit=1' | jq '.traces[0] | {traceID, rootTraceName, durationMs}'",
          output: "deployment.apps/api annotated\ndeployment \"api\" successfully rolled out\n{\n  \"traceID\": \"4bf92f3577b34da6a3ce929d0e0e4736\",\n  \"rootTraceName\": \"GET /v1/orders/:id\",\n  \"durationMs\": 42\n}",
          note: "The operator injected an init container that copies the Node agent and set NODE_OPTIONS to require it — zero code change.",
        },
        {
          title: "Pivot from the trace to its logs in Loki",
          cmd: "kubectl -n observability exec deploy/loki -- wget -qO- --header 'X-Scope-OrgID: 1' 'http://localhost:3100/loki/api/v1/query_range?query={namespace=\"prod\",app=\"api\"}|json|trace_id=\"4bf92f3577b34da6a3ce929d0e0e4736\"&limit=3' | jq -r '.data.result[].values[][1]' | head -3",
          output: "{\"level\":\"info\",\"msg\":\"order lookup\",\"order_id\":\"123\",\"trace_id\":\"4bf92f3577b34da6a3ce929d0e0e4736\",\"span_id\":\"00f067aa0ba902b7\",\"duration_ms\":38}\n{\"level\":\"info\",\"msg\":\"db query\",\"rows\":1,\"trace_id\":\"4bf92f3577b34da6a3ce929d0e0e4736\",\"span_id\":\"b7ad6b7169203331\"}\n{\"level\":\"info\",\"msg\":\"request complete\",\"status\":200,\"trace_id\":\"4bf92f3577b34da6a3ce929d0e0e4736\"}",
          note: "In Grafana the same pivot is one click: a derived field on the Loki data source turns trace_id into a Tempo link, and Tempo's 'logs for this span' button runs this query.",
        },
      ],
      success: [
        "Prometheus shows kubelet, node-exporter, kube-state-metrics and the app as up targets",
        "RED metrics for the application are queryable by status code",
        "The SLO rule group loads with recording rules and an inactive alert",
        "OTel agent and gateway are running; the gateway reports its tail-sampling policy",
        "A request produces a trace in Tempo and correlated log lines in Loki via trace_id",
      ],
    },
    blueprints: [
      {
        title: "ServiceMonitor + PrometheusRule (SLO burn-rate) + Alertmanager routing",
        lang: "yaml",
        code: `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api
  namespace: prod
  labels:
    release: kps                      # must match Prometheus.spec.serviceMonitorSelector
spec:
  selector:
    matchLabels: { app: api }
  namespaceSelector:
    matchNames: ["prod"]
  endpoints:
    - port: http                      # named Service port
      path: /metrics
      interval: 30s
      scrapeTimeout: 10s
      honorLabels: false
      relabelings:
        - sourceLabels: [__meta_kubernetes_pod_label_app_kubernetes_io_version]
          targetLabel: version
      metricRelabelings:
        - sourceLabels: [__name__]
          regex: "go_gc_.*|process_.*"     # drop noisy runtime series
          action: drop
---
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: api-slo
  namespace: prod
  labels: { release: kps }
spec:
  groups:
    - name: api-slo
      interval: 30s
      rules:
        # SLI: ratio of failed requests (5xx) — recorded at three windows for burn-rate math.
        - record: api:sli_error_ratio:rate5m
          expr: |
            sum(rate(http_requests_total{namespace="prod",service="api",code=~"5.."}[5m]))
            / sum(rate(http_requests_total{namespace="prod",service="api"}[5m]))
        - record: api:sli_error_ratio:rate1h
          expr: |
            sum(rate(http_requests_total{namespace="prod",service="api",code=~"5.."}[1h]))
            / sum(rate(http_requests_total{namespace="prod",service="api"}[1h]))
        - record: api:sli_error_ratio:rate6h
          expr: |
            sum(rate(http_requests_total{namespace="prod",service="api",code=~"5.."}[6h]))
            / sum(rate(http_requests_total{namespace="prod",service="api"}[6h]))
        # SLO 99.9% → error budget 0.001. Page when burning 14.4x over 1h AND 6h (Google SRE workbook).
        - alert: APIErrorBudgetBurn
          expr: |
            (api:sli_error_ratio:rate1h > (14.4 * 0.001) and api:sli_error_ratio:rate5m > (14.4 * 0.001))
            or
            (api:sli_error_ratio:rate6h > (6 * 0.001) and api:sli_error_ratio:rate1h > (6 * 0.001))
          for: 2m
          labels:
            severity: page
            team: api
          annotations:
            summary: "API error budget burning fast ({{ $value | humanizePercentage }} errors)"
            runbook_url: https://runbooks.example.com/api/error-budget-burn
        - alert: APILatencyP99High
          expr: |
            histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket{namespace="prod",service="api"}[5m]))) > 0.5
          for: 10m
          labels: { severity: ticket, team: api }
          annotations:
            summary: "p99 latency above 500ms for 10m"
        - alert: CPUThrottlingHigh
          expr: |
            sum by (namespace, pod, container) (rate(container_cpu_cfs_throttled_periods_total{namespace="prod"}[5m]))
            / sum by (namespace, pod, container) (rate(container_cpu_cfs_periods_total{namespace="prod"}[5m])) > 0.25
          for: 15m
          labels: { severity: ticket }
          annotations:
            summary: "{{ $labels.container }} in {{ $labels.pod }} throttled > 25% of periods"
---
apiVersion: monitoring.coreos.com/v1alpha1
kind: AlertmanagerConfig
metadata:
  name: api-routing
  namespace: prod
spec:
  route:
    groupBy: ["alertname", "namespace"]
    groupWait: 30s
    groupInterval: 5m
    repeatInterval: 4h
    receiver: slack-api
    routes:
      - matchers: [{ name: severity, value: page }]
        receiver: pagerduty-api
        continue: true
  inhibitRules:
    - sourceMatch: [{ name: alertname, value: APIErrorBudgetBurn }]
      targetMatch: [{ name: alertname, value: APILatencyP99High }]
      equal: ["namespace"]
  receivers:
    - name: pagerduty-api
      pagerdutyConfigs:
        - routingKey: { name: pagerduty, key: api-routing-key }
          severity: critical
    - name: slack-api
      slackConfigs:
        - apiURL: { name: slack, key: webhook }
          channel: "#api-alerts"
          title: '{{ .CommonAnnotations.summary }}'
`,
      },
      {
        title: "OpenTelemetry Collector (agent + gateway with tail sampling and spanmetrics) + Instrumentation CRD",
        lang: "yaml",
        code: `# otel-values.yaml (open-telemetry/opentelemetry-collector chart) — gateway mode shown; agent uses the same receivers
mode: deployment
replicaCount: 2
image:
  repository: otel/opentelemetry-collector-contrib
presets:
  kubernetesAttributes: { enabled: true, extractAllPodLabels: true }
  kubernetesEvents: { enabled: true }
config:
  receivers:
    otlp:
      protocols:
        grpc: { endpoint: 0.0.0.0:4317 }
        http: { endpoint: 0.0.0.0:4318 }
    prometheus:
      config:
        scrape_configs:
          - job_name: otel-collector
            scrape_interval: 30s
            static_configs: [{ targets: ["localhost:8888"] }]
  processors:
    memory_limiter: { check_interval: 1s, limit_percentage: 80, spike_limit_percentage: 20 }
    k8sattributes:
      extract:
        metadata: [k8s.namespace.name, k8s.pod.name, k8s.deployment.name, k8s.node.name]
    resource:
      attributes:
        - { key: deployment.environment, value: prod, action: upsert }
    tail_sampling:
      decision_wait: 10s
      num_traces: 100000
      policies:
        - { name: errors, type: status_code, status_code: { status_codes: [ERROR] } }
        - { name: slow, type: latency, latency: { threshold_ms: 500 } }
        - { name: baseline, type: probabilistic, probabilistic: { sampling_percentage: 5 } }
    batch: { timeout: 5s, send_batch_size: 8192 }
  connectors:
    spanmetrics:
      histogram:
        explicit: { buckets: [5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 1s, 2.5s, 5s] }
      dimensions: [{ name: http.method }, { name: http.route }]
      exemplars: { enabled: true }
  exporters:
    otlp/tempo:
      endpoint: tempo.observability.svc:4317
      tls: { insecure: true }
    prometheusremotewrite:
      endpoint: http://mimir.observability.svc:9009/api/v1/push
      resource_to_telemetry_conversion: { enabled: true }
    loki:
      endpoint: http://loki.observability.svc:3100/loki/api/v1/push
  service:
    telemetry:
      metrics: { address: 0.0.0.0:8888 }
    pipelines:
      traces:
        receivers: [otlp]
        processors: [memory_limiter, k8sattributes, resource, tail_sampling, batch]
        exporters: [otlp/tempo, spanmetrics]
      metrics:
        receivers: [otlp, prometheus, spanmetrics]
        processors: [memory_limiter, k8sattributes, resource, batch]
        exporters: [prometheusremotewrite]
      logs:
        receivers: [otlp]
        processors: [memory_limiter, k8sattributes, resource, batch]
        exporters: [loki]
resources:
  requests: { cpu: 200m, memory: 512Mi }
  limits: { cpu: "1", memory: 1Gi }
---
# OTel Operator auto-instrumentation: annotate a Deployment with
#   instrumentation.opentelemetry.io/inject-nodejs: "observability/default"
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: default
  namespace: observability
spec:
  exporter:
    endpoint: http://otel-opentelemetry-collector-agent.observability.svc:4317
  propagators: [tracecontext, baggage]
  sampler:
    type: parentbased_always_on          # sample everything at the SDK; the gateway tail-samples
  resource:
    addK8sUIDAttributes: true
  nodejs:
    env:
      - { name: OTEL_NODE_RESOURCE_DETECTORS, value: "env,host,os,container" }
      - { name: OTEL_LOGS_EXPORTER, value: otlp }
  java:
    env:
      - { name: OTEL_INSTRUMENTATION_JDBC_ENABLED, value: "true" }
  python:
    env:
      - { name: OTEL_PYTHON_LOG_CORRELATION, value: "true" }
`,
      },
    ],
  },
  {
    id: "beyond-service-mesh",
    track: "beyond",
    title: "Service Mesh: Istio Ambient vs Sidecar",
    subtitle: "Envoy data plane, mTLS identity, traffic policy and the sidecar-less ztunnel/waypoint model",
    icon: "workflow",
    keywords: "service mesh istio envoy sidecar ambient ztunnel waypoint mtls spiffe peerauthentication authorizationpolicy virtualservice destinationrule circuit breaker retry timeout linkerd",
    theory: {
      diagram: "serviceMesh",
      intro: [
        "A service mesh moves cross-cutting network concerns — mutual TLS, identity-based authorization, retries, timeouts, circuit breaking, traffic splitting and uniform telemetry — out of application code into the platform. Istio implements this with Envoy proxies programmed by istiod through xDS; Linkerd uses a purpose-built Rust micro-proxy. Both give every workload a SPIFFE identity (spiffe://cluster.local/ns/prod/sa/api) derived from its ServiceAccount, so authorization policies are about identities, not IP addresses.",
        "The sidecar model injects an Envoy container into every pod and redirects its traffic with iptables; ambient mode removes the sidecar, handling L4 (mTLS, identity, TCP authz) in a per-node ztunnel and routing through an optional per-namespace waypoint Envoy only when L7 policy is required.",
      ],
      sections: [
        {
          h: "Sidecar data path",
          p: "istio-init (or the Istio CNI plugin, which avoids NET_ADMIN in the pod) installs iptables rules redirecting inbound to 15006 and outbound to 15001. Envoy terminates and originates mTLS using certificates istiod's CA issues via the SDS API (rotated every 24 h by default), applies VirtualService routes and DestinationRule policies (subsets, load balancing, outlier detection, connection pools), enforces AuthorizationPolicy, and emits metrics (istio_requests_total), access logs and spans. The cost: memory and CPU per pod, proxy upgrades that require pod restarts, and startup ordering issues (holdApplicationUntilProxyStarts).",
        },
        {
          h: "Ambient data path",
          p: "The Istio CNI plugin redirects pod traffic inside the pod's own network namespace to the node-local ztunnel (a Rust proxy) over an in-pod socket; ztunnel encapsulates in HBONE (HTTP/2 CONNECT over mTLS on port 15008) to the destination node's ztunnel, which delivers to the target pod. Identity, mTLS and L4 AuthorizationPolicy (source principal, namespace, port) work with no pod changes. For L7 features, a namespace or service is labelled istio.io/use-waypoint; ztunnel then forwards through a waypoint Envoy Deployment where HTTPRoute, retries, header-based authz and L7 telemetry apply. Waypoints scale independently and share nothing with application pods.",
        },
        {
          h: "Traffic and security policy APIs",
          p: "PeerAuthentication sets mTLS mode (STRICT in prod, PERMISSIVE during migration) per mesh, namespace or workload. AuthorizationPolicy allows or denies by source principals/namespaces, destination ports, HTTP methods/paths and JWT claims (with RequestAuthentication for end-user tokens). VirtualService (or Gateway API HTTPRoute in ambient) defines routing, weights, retries (attempts, perTryTimeout, retryOn) and fault injection; DestinationRule defines subsets and resilience (outlierDetection ejects unhealthy endpoints, connectionPool bounds concurrency — the circuit breaker). Sidecar resources limit which services a proxy learns about, cutting memory and xDS churn on large meshes.",
        },
        {
          h: "Choosing and operating a mesh",
          p: "Adopt a mesh when you need mTLS everywhere, identity-based authz or fine-grained traffic control across many services; a Gateway plus NetworkPolicy may be enough otherwise. Start with ambient for the lowest operational cost, sidecars where per-pod L7 isolation or unsupported protocols demand it. Operate it like any control plane: canary upgrades with revisions (istioctl install --revision), watch proxy-status for stale xDS, keep istiod HA, monitor certificate rotation and set resource requests on proxies.",
        },
      ],
      keyPoints: [
        "Identity = SPIFFE ID from the ServiceAccount; authz is about principals, not IPs.",
        "Sidecar: per-pod Envoy, iptables redirect, L7 everywhere, higher cost and restarts.",
        "Ambient: ztunnel (L4, per node) + optional waypoint (L7, per ns/service), HBONE on 15008.",
        "PeerAuthentication STRICT + AuthorizationPolicy = zero-trust east-west.",
        "DestinationRule outlierDetection + connectionPool = circuit breaking; VirtualService = retries/timeouts/splits.",
        "Debug with istioctl proxy-status, proxy-config, analyze, ztunnel-config.",
      ],
    },
    lab: {
      objective: "Install Istio in ambient mode, enrol a namespace, enforce STRICT mTLS and an identity-based authorization policy, add a waypoint for L7 policy and inspect the data path.",
      steps: [
        {
          title: "Install Istio ambient with Gateway API CRDs",
          cmd: "kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/standard-install.yaml >/dev/null && istioctl install --set profile=ambient --set values.global.platform=none -y && kubectl -n istio-system get pods -o custom-columns=NAME:.metadata.name,READY:.status.containerStatuses[0].ready | grep -E 'istiod|ztunnel|istio-cni'",
          output: "✔ Istio core installed\n✔ Istiod installed\n✔ CNI installed\n✔ Ztunnel installed\n✔ Installation complete\nistio-cni-node-8k2qp   true\nistiod-7c9d8f6b5-x1m2n true\nztunnel-4h7pl          true",
          note: "No sidecar injector webhook is involved: application pods are unchanged.",
        },
        {
          title: "Enrol the prod namespace and verify mTLS between existing pods",
          cmd: "kubectl label ns prod istio.io/dataplane-mode=ambient && sleep 5 && kubectl -n prod exec deploy/web -- wget -qO- http://api:8080/healthz && istioctl ztunnel-config workloads -n prod | head -4",
          output: "namespace/prod labeled\nok\nNAMESPACE POD NAME                 ADDRESS      NODE     WAYPOINT PROTOCOL\nprod      api-7d9c8b6f5-2xk9p      10.244.1.12  worker1  None     HBONE\nprod      api-7d9c8b6f5-m4q7r      10.244.2.7   worker2  None     HBONE\nprod      web-5f6d7c8b9-2k9xp      10.244.1.20  worker1  None     HBONE",
          note: "PROTOCOL HBONE means the traffic is now tunnelled over mTLS by ztunnel — without restarting a single pod.",
        },
        {
          title: "Enforce STRICT mTLS and confirm plaintext from outside the mesh is rejected",
          cmd: "kubectl apply -f peerauth-strict.yaml && kubectl run -n default plain --rm -it --restart=Never --image=busybox:1.36 -- wget -qO- --timeout=3 http://api.prod.svc:8080/healthz 2>&1 | tail -1",
          output: "peerauthentication.security.istio.io/default created\nwget: error getting response: Connection reset by peer",
          note: "A pod in a non-mesh namespace has no identity, so ztunnel on the destination node rejects the connection under STRICT.",
        },
        {
          title: "Apply an identity-based AuthorizationPolicy (L4) and test allow/deny",
          cmd: "kubectl apply -f authz-api-l4.yaml && kubectl -n prod exec deploy/web -- wget -qO- --timeout=3 http://api:8080/healthz; echo web=$?; kubectl -n prod run other --rm -it --restart=Never --image=busybox:1.36 -- wget -qO- --timeout=3 http://api:8080/healthz 2>&1 | tail -1",
          output: "authorizationpolicy.security.istio.io/api-allow-web created\nok\nweb=0\nwget: error getting response: Connection reset by peer",
          note: "Same namespace, same NetworkPolicy — the only difference is the ServiceAccount principal. That is identity-based zero trust.",
        },
        {
          title: "Deploy a waypoint and enforce an L7 rule (only GET on /v1/*)",
          cmd: "istioctl waypoint apply -n prod --enroll-namespace && kubectl apply -f authz-api-l7.yaml && sleep 5 && kubectl -n prod exec deploy/web -- wget -qO- --timeout=3 http://api:8080/v1/orders/1 >/dev/null; echo get=$?; kubectl -n prod exec deploy/web -- wget -qO- --timeout=3 --post-data='{}' http://api:8080/v1/admin 2>&1 | tail -1",
          output: "✅ waypoint prod/waypoint applied\n✅ waypoint prod/waypoint enrolled\nauthorizationpolicy.security.istio.io/api-l7 created\nget=0\nwget: server returned error: HTTP/1.1 403 Forbidden",
          note: "An RBAC 403 from Envoy — the waypoint — rather than a TCP reset, because L7 policy is evaluated on the parsed HTTP request.",
        },
        {
          title: "Inspect the data path and policy state",
          cmd: "istioctl ztunnel-config workloads -n prod | grep api | head -1 && istioctl proxy-config listeners deploy/waypoint -n prod | head -3 && istioctl analyze -n prod",
          output: "prod  api-7d9c8b6f5-2xk9p  10.244.1.12  worker1  waypoint  HBONE\nADDRESS PORT  MATCH                        DESTINATION\n0.0.0.0 15008 ALL                          Inline Route: /*\n0.0.0.0 15088 ALL                          Non-HTTP\n✔ No validation issues found when analyzing namespace: prod.",
          note: "WAYPOINT column now names the waypoint; proxy-config on the waypoint shows the HBONE listener. `istioctl analyze` catches misconfigurations before they page you.",
        },
      ],
      success: [
        "Ambient control plane, CNI and ztunnel are Ready without touching app pods",
        "Workloads in the enrolled namespace show protocol HBONE",
        "STRICT mTLS rejects plaintext from outside the mesh",
        "L4 AuthorizationPolicy allows web's identity and denies others",
        "A waypoint enforces method/path rules with HTTP 403",
      ],
    },
    blueprints: [
      {
        title: "Istio ambient security policies — STRICT mTLS, L4 and L7 AuthorizationPolicy, JWT end-user auth",
        lang: "yaml",
        code: `apiVersion: security.istio.io/v1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system            # mesh-wide default
spec:
  mtls:
    mode: STRICT
---
# L4: only the web ServiceAccount may reach api on 8080 (enforced by ztunnel)
apiVersion: security.istio.io/v1
kind: AuthorizationPolicy
metadata:
  name: api-allow-web
  namespace: prod
spec:
  selector:
    matchLabels: { app: api }
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/prod/sa/web"]
      to:
        - operation:
            ports: ["8080"]
    - from:
        - source:
            namespaces: ["monitoring"]
      to:
        - operation:
            ports: ["9090"]
---
# L7: bound to the waypoint; method/path rules and JWT claims
apiVersion: security.istio.io/v1
kind: AuthorizationPolicy
metadata:
  name: api-l7
  namespace: prod
spec:
  targetRefs:
    - kind: Gateway
      group: gateway.networking.k8s.io
      name: waypoint
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/prod/sa/web"]
      to:
        - operation:
            methods: ["GET"]
            paths: ["/v1/*", "/healthz"]
    - from:
        - source:
            requestPrincipals: ["https://auth.example.com/*"]   # requires RequestAuthentication below
      to:
        - operation:
            methods: ["POST"]
            paths: ["/v1/orders"]
      when:
        - key: request.auth.claims[scope]
          values: ["orders:write"]
---
apiVersion: security.istio.io/v1
kind: RequestAuthentication
metadata:
  name: api-jwt
  namespace: prod
spec:
  targetRefs:
    - kind: Gateway
      group: gateway.networking.k8s.io
      name: waypoint
  jwtRules:
    - issuer: https://auth.example.com/
      jwksUri: https://auth.example.com/.well-known/jwks.json
      forwardOriginalToken: true
`,
      },
      {
        title: "Sidecar-mode traffic policy — VirtualService retries/timeouts/canary, DestinationRule circuit breaking, Sidecar scoping",
        lang: "yaml",
        code: `apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: api
  namespace: prod
spec:
  hosts: ["api.prod.svc.cluster.local"]
  http:
    # Header-based routing for internal testers
    - match:
        - headers:
            x-canary: { exact: "always" }
      route:
        - destination: { host: api.prod.svc.cluster.local, subset: canary }
    # Weighted canary with retries and timeouts
    - route:
        - destination: { host: api.prod.svc.cluster.local, subset: stable }
          weight: 90
        - destination: { host: api.prod.svc.cluster.local, subset: canary }
          weight: 10
      timeout: 3s
      retries:
        attempts: 3
        perTryTimeout: 1s
        retryOn: "5xx,reset,connect-failure,retriable-4xx"
        retryRemoteLocalities: true
      fault:                                   # remove in prod; shown for chaos testing
        delay:
          percentage: { value: 0.1 }
          fixedDelay: 2s
---
apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: api
  namespace: prod
spec:
  host: api.prod.svc.cluster.local
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
    loadBalancer:
      simple: LEAST_REQUEST
      localityLbSetting:
        enabled: true
        failover:
          - { from: us-east-1, to: us-east-2 }
    connectionPool:                            # circuit breaker thresholds
      tcp:
        maxConnections: 200
        connectTimeout: 500ms
      http:
        http2MaxRequests: 1000
        maxRequestsPerConnection: 100
        maxRetries: 3
        idleTimeout: 60s
    outlierDetection:                          # eject unhealthy endpoints
      consecutive5xxErrors: 5
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 30
  subsets:
    - name: stable
      labels: { version: v1 }
    - name: canary
      labels: { version: v2 }
---
# Limit what the api sidecar learns about → smaller Envoy config, faster xDS
apiVersion: networking.istio.io/v1
kind: Sidecar
metadata:
  name: api
  namespace: prod
spec:
  workloadSelector:
    labels: { app: api }
  egress:
    - hosts:
        - "prod/*"
        - "db/postgres-hl.db.svc.cluster.local"
        - "istio-system/*"
  outboundTrafficPolicy:
    mode: REGISTRY_ONLY                        # block egress to unknown hosts (use ServiceEntry to allow)
---
apiVersion: networking.istio.io/v1
kind: ServiceEntry
metadata:
  name: stripe
  namespace: prod
spec:
  hosts: ["api.stripe.com"]
  location: MESH_EXTERNAL
  resolution: DNS
  ports:
    - { number: 443, name: https, protocol: TLS }
`,
      },
    ],
  },
  {
    id: "beyond-gateway-api",
    track: "beyond",
    title: "Gateway API vs Ingress",
    subtitle: "Role-oriented routing, traffic splitting, TLS, cross-namespace references and policy attachment",
    icon: "route",
    keywords: "gateway api ingress httproute grpcroute gatewayclass referencegrant tls canary traffic split envoy gateway cilium nginx gateway fabric backendtlspolicy",
    theory: {
      diagram: "gatewayApi",
      intro: [
        "Ingress solved host/path routing in 2015 and then stalled: everything else (rewrites, timeouts, canaries, header matching, TCP) became controller-specific annotations. Gateway API is its successor — a set of GA CRDs (GatewayClass, Gateway, HTTPRoute, GRPCRoute, ReferenceGrant; TCPRoute/UDPRoute/TLSRoute experimental) with a role-oriented design: infrastructure providers define GatewayClasses, cluster operators deploy Gateways (listeners, TLS, which namespaces may attach), and application teams own HTTPRoutes in their namespaces.",
        "Because the semantics are in the spec rather than annotations, the same HTTPRoute works on Envoy Gateway, Cilium, Istio, NGINX Gateway Fabric, Kong, Traefik or a cloud load balancer, and status conditions on every object explain precisely why a route is or is not serving traffic.",
      ],
      sections: [
        {
          h: "Object model and attachment",
          p: "A Gateway references a GatewayClass and declares listeners (name, port, protocol, hostname, TLS certificateRefs) plus allowedRoutes (from: Same | All | Selector with a namespace label selector). An HTTPRoute lists parentRefs (the Gateway and optionally a listener sectionName), hostnames, and rules with matches (path Exact/PathPrefix/RegularExpression, headers, queryParams, method), filters (RequestHeaderModifier, ResponseHeaderModifier, RequestRedirect, URLRewrite, RequestMirror, ExtensionRef) and backendRefs with weights. Cross-namespace references — a Route to a Service in another namespace, or a Gateway to a TLS Secret elsewhere — require a ReferenceGrant in the target namespace, making trust explicit.",
        },
        {
          h: "Traffic splitting, mirroring and headers",
          p: "backendRefs weights implement canary and blue-green without controller-specific annotations; a header match routes internal testers to the canary regardless of weight; RequestMirror copies traffic to a shadow backend for testing with production load. Argo Rollouts and Flagger manipulate these weights directly. Timeouts (rules[].timeouts.request/backendRequest) and retry configuration are in the spec (retry is GA in v1.2 for some implementations), replacing dozens of vendor annotations.",
        },
        {
          h: "TLS and policies",
          p: "Listener TLS mode Terminate uses certificateRefs (cert-manager can issue them via the Gateway's annotation); Passthrough hands the TLS stream to the backend with TLSRoute by SNI. BackendTLSPolicy configures TLS from the gateway to backends (re-encryption) with CA validation. Policy attachment (targetRefs) is how vendors add rate limiting, authentication, timeouts and observability without forking the core API — Envoy Gateway's SecurityPolicy and BackendTrafficPolicy, Cilium's CiliumEnvoyConfig, Istio's AuthorizationPolicy targeting a Gateway.",
        },
        {
          h: "Migration and operations",
          p: "The ingress2gateway tool converts Ingress objects (including common nginx, GCE and Istio annotations) into Gateway API resources. Run both side by side, move hostnames one at a time, and compare status conditions (Accepted, ResolvedRefs, Programmed) to validate. Operationally, keep Gateways in a dedicated namespace owned by platform, use allowedRoutes selectors to onboard app namespaces by label, and expose Gateway metrics (Envoy stats) to Prometheus.",
        },
      ],
      keyPoints: [
        "GatewayClass (provider) → Gateway (operator, listeners + TLS) → HTTPRoute (app team).",
        "Cross-namespace refs need ReferenceGrant in the target namespace.",
        "Weights, header matches, mirroring, rewrites and redirects are in the spec, not annotations.",
        "TLS: Terminate with certificateRefs, Passthrough with TLSRoute, BackendTLSPolicy for re-encrypt.",
        "Status conditions (Accepted/ResolvedRefs/Programmed) explain routing failures.",
        "ingress2gateway converts existing Ingress; run both during migration.",
      ],
    },
    lab: {
      objective: "Install Envoy Gateway, publish a shared Gateway with TLS, attach an HTTPRoute from an app namespace, split traffic between stable and canary, mirror requests, and diagnose a rejected cross-namespace reference.",
      steps: [
        {
          title: "Install Envoy Gateway and create the GatewayClass",
          cmd: "helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.2.1 -n envoy-gateway-system --create-namespace >/dev/null && kubectl wait --timeout=3m -n envoy-gateway-system deploy/envoy-gateway --for=condition=Available && kubectl apply -f gatewayclass.yaml && kubectl get gatewayclass envoy -o jsonpath='{.status.conditions[?(@.type==\"Accepted\")].status}{\"\\n\"}'",
          output: "deployment.apps/envoy-gateway condition met\ngatewayclass.gateway.networking.k8s.io/envoy created\nTrue",
          note: "GatewayClass Accepted=True means the controller named in controllerName claimed it.",
        },
        {
          title: "Deploy the shared Gateway with a TLS listener and check it is Programmed",
          cmd: "kubectl apply -f gateway-public.yaml && sleep 20 && kubectl -n gateway-system get gateway public -o custom-columns=NAME:.metadata.name,ADDRESS:.status.addresses[0].value,PROGRAMMED:.status.conditions[?\\(@.type==\\\"Programmed\\\"\\)].status && kubectl -n gateway-system get gateway public -o jsonpath='{.status.listeners[*].name}{\"\\n\"}'",
          output: "gateway.gateway.networking.k8s.io/public created\nNAME     ADDRESS        PROGRAMMED\npublic   203.0.113.10   True\nhttp https",
          note: "The controller created an Envoy Deployment + LoadBalancer Service for this Gateway. attachedRoutes per listener appears in status once routes attach.",
        },
        {
          title: "Attach an HTTPRoute from the prod namespace and verify end to end",
          cmd: "kubectl apply -f httproute-api.yaml && sleep 5 && kubectl -n prod get httproute api -o jsonpath='{.status.parents[0].conditions[?(@.type==\"Accepted\")].status} {.status.parents[0].conditions[?(@.type==\"ResolvedRefs\")].status}{\"\\n\"}' && curl -s -o /dev/null -w '%{http_code}\\n' --resolve api.example.com:443:203.0.113.10 https://api.example.com/healthz",
          output: "httproute.gateway.networking.k8s.io/api created\nTrue True\n200",
          note: "Accepted=True: the Gateway's allowedRoutes let this namespace attach. ResolvedRefs=True: every backendRef exists and is permitted.",
        },
        {
          title: "Split traffic 90/10 and observe distribution",
          cmd: "kubectl -n prod patch httproute api --type=json -p='[{\"op\":\"replace\",\"path\":\"/spec/rules/0/backendRefs\",\"value\":[{\"name\":\"api-stable\",\"port\":80,\"weight\":90},{\"name\":\"api-canary\",\"port\":80,\"weight\":10}]}]' && for i in $(seq 1 100); do curl -s --resolve api.example.com:443:203.0.113.10 https://api.example.com/version; echo; done | sort | uniq -c",
          output: "httproute.gateway.networking.k8s.io/api patched\n     91 1.4.2\n      9 1.5.0",
          note: "Weighted routing without a mesh — the same object Argo Rollouts edits during a progressive rollout.",
        },
        {
          title: "Trigger a ResolvedRefs failure with a cross-namespace backend, then fix with ReferenceGrant",
          cmd: "kubectl -n prod patch httproute api --type=json -p='[{\"op\":\"add\",\"path\":\"/spec/rules/0/backendRefs/-\",\"value\":{\"name\":\"legacy\",\"namespace\":\"legacy\",\"port\":80,\"weight\":0}}]' && sleep 3 && kubectl -n prod get httproute api -o jsonpath='{.status.parents[0].conditions[?(@.type==\"ResolvedRefs\")].reason}{\"\\n\"}' && kubectl apply -f referencegrant-legacy.yaml && sleep 3 && kubectl -n prod get httproute api -o jsonpath='{.status.parents[0].conditions[?(@.type==\"ResolvedRefs\")].status}{\"\\n\"}'",
          output: "httproute.gateway.networking.k8s.io/api patched\nRefNotPermitted\nreferencegrant.gateway.networking.k8s.io/allow-prod-routes created\nTrue",
          note: "RefNotPermitted is the exact reason string; the ReferenceGrant lives in the *target* namespace, expressing that namespace's consent.",
        },
        {
          title: "Mirror production traffic to a shadow deployment",
          cmd: "kubectl -n prod patch httproute api --type=json -p='[{\"op\":\"add\",\"path\":\"/spec/rules/0/filters\",\"value\":[{\"type\":\"RequestMirror\",\"requestMirror\":{\"backendRef\":{\"name\":\"api-shadow\",\"port\":80}}}]}]' && for i in $(seq 1 20); do curl -s -o /dev/null --resolve api.example.com:443:203.0.113.10 https://api.example.com/v1/orders/1; done; kubectl -n prod logs deploy/api-shadow --tail=1",
          output: "httproute.gateway.networking.k8s.io/api patched\n{\"level\":\"info\",\"msg\":\"request complete\",\"path\":\"/v1/orders/1\",\"status\":200,\"mirrored\":true}",
          note: "Mirrored responses are discarded by the gateway; clients only see the primary backend. Ideal for testing a rewrite with real traffic shapes.",
        },
      ],
      success: [
        "GatewayClass Accepted and Gateway Programmed with an external address",
        "HTTPRoute shows Accepted=True and ResolvedRefs=True and serves HTTPS",
        "A 90/10 weight split is reflected in the response distribution",
        "A cross-namespace backendRef fails with RefNotPermitted until a ReferenceGrant exists",
        "Mirrored requests appear in the shadow backend's logs",
      ],
    },
    blueprints: [
      {
        title: "GatewayClass, shared Gateway with TLS via cert-manager, HTTPRoute with canary/mirror/rewrite, ReferenceGrant",
        lang: "yaml",
        code: `apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: envoy
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: public
  namespace: gateway-system
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod     # cert-manager issues certificateRefs Secrets
spec:
  gatewayClassName: envoy
  listeners:
    - name: http
      port: 80
      protocol: HTTP
      allowedRoutes:
        namespaces: { from: Same }                         # only the redirect route below
    - name: https
      port: 443
      protocol: HTTPS
      hostname: "*.example.com"
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: wildcard-example-com-tls
      allowedRoutes:
        namespaces:
          from: Selector
          selector:
            matchLabels:
              gateway.example.com/public: "true"           # app namespaces opt in by label
        kinds:
          - { kind: HTTPRoute }
          - { kind: GRPCRoute }
---
# HTTP → HTTPS redirect owned by the platform team
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: https-redirect
  namespace: gateway-system
spec:
  parentRefs:
    - { name: public, sectionName: http }
  rules:
    - filters:
        - type: RequestRedirect
          requestRedirect: { scheme: https, statusCode: 301 }
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api
  namespace: prod
spec:
  parentRefs:
    - name: public
      namespace: gateway-system
      sectionName: https
  hostnames: ["api.example.com"]
  rules:
    # Internal testers: header forces canary
    - matches:
        - headers: [{ name: x-canary, value: always }]
      backendRefs:
        - { name: api-canary, port: 80 }
    # Legacy path rewrite + mirror to shadow
    - matches:
        - path: { type: PathPrefix, value: /legacy/v0 }
      filters:
        - type: URLRewrite
          urlRewrite:
            path: { type: ReplacePrefixMatch, replacePrefixMatch: /v1 }
        - type: RequestMirror
          requestMirror:
            backendRef: { name: api-shadow, port: 80 }
      backendRefs:
        - { name: api-stable, port: 80 }
    # Default: weighted canary with timeouts and security headers
    - matches:
        - path: { type: PathPrefix, value: / }
      filters:
        - type: ResponseHeaderModifier
          responseHeaderModifier:
            set:
              - { name: Strict-Transport-Security, value: "max-age=31536000; includeSubDomains" }
            remove: ["Server"]
      timeouts:
        request: 10s
        backendRequest: 5s
      backendRefs:
        - { name: api-stable, port: 80, weight: 90 }
        - { name: api-canary, port: 80, weight: 10 }
---
# Allow HTTPRoutes in prod to reference Services in the legacy namespace
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-prod-routes
  namespace: legacy
spec:
  from:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
      namespace: prod
  to:
    - group: ""
      kind: Service
---
# Re-encrypt to a backend that serves its own TLS
apiVersion: gateway.networking.k8s.io/v1alpha3
kind: BackendTLSPolicy
metadata:
  name: api-canary-tls
  namespace: prod
spec:
  targetRefs:
    - { group: "", kind: Service, name: api-canary }
  validation:
    caCertificateRefs:
      - { group: "", kind: ConfigMap, name: internal-ca }
    hostname: api-canary.prod.svc.cluster.local
`,
      },
      {
        title: "GRPCRoute + Envoy Gateway policy attachment (rate limit, JWT, timeouts) + equivalent legacy Ingress for comparison",
        lang: "yaml",
        code: `apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: orders-grpc
  namespace: prod
spec:
  parentRefs:
    - { name: public, namespace: gateway-system, sectionName: https }
  hostnames: ["grpc.example.com"]
  rules:
    - matches:
        - method: { service: orders.v1.OrderService, method: GetOrder }
      backendRefs:
        - { name: orders, port: 9000 }
    - matches:
        - method: { service: orders.v1.OrderService }
      backendRefs:
        - { name: orders, port: 9000 }
---
# Envoy Gateway extension policies attached to the route
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: SecurityPolicy
metadata:
  name: api-jwt
  namespace: prod
spec:
  targetRefs:
    - { group: gateway.networking.k8s.io, kind: HTTPRoute, name: api }
  jwt:
    providers:
      - name: auth0
        issuer: https://auth.example.com/
        remoteJWKS:
          uri: https://auth.example.com/.well-known/jwks.json
        claimToHeaders:
          - { claim: sub, header: x-user-id }
  cors:
    allowOrigins: ["https://app.example.com"]
    allowMethods: ["GET", "POST"]
    allowHeaders: ["authorization", "content-type"]
---
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: BackendTrafficPolicy
metadata:
  name: api-traffic
  namespace: prod
spec:
  targetRefs:
    - { group: gateway.networking.k8s.io, kind: HTTPRoute, name: api }
  rateLimit:
    type: Global
    global:
      rules:
        - clientSelectors:
            - headers: [{ name: x-user-id, type: Distinct }]
          limit: { requests: 100, unit: Minute }
  retry:
    numRetries: 2
    retryOn:
      httpStatusCodes: [502, 503, 504]
      triggers: [connect-failure, retriable-status-codes]
    perRetry:
      timeout: 1s
      backOff: { baseInterval: 100ms, maxInterval: 1s }
  circuitBreaker:
    maxConnections: 1024
    maxPendingRequests: 256
    maxParallelRequests: 512
  healthCheck:
    active:
      type: HTTP
      interval: 5s
      unhealthyThreshold: 3
      http: { path: /healthz, expectedStatuses: [{ start: 200, end: 299 }] }
---
# The legacy way: same intent spread across nginx annotations (for migration reference)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-legacy
  namespace: prod
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "5"
    nginx.ingress.kubernetes.io/limit-rpm: "100"
    nginx.ingress.kubernetes.io/mirror-target: "http://api-shadow.prod.svc/$request_uri"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["api.example.com"]
      secretName: api-example-com-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: api-canary, port: { number: 80 } }
`,
      },
    ],
  },
  {
    id: "beyond-helm",
    track: "beyond",
    title: "Production Helm Charts",
    subtitle: "Deep templating, conditionals, helpers, subcharts, values schemas, hooks and release management",
    icon: "package",
    keywords: "helm chart template values schema subchart dependency helpers tpl include toYaml conditional range hooks test lint oci registry rollback",
    theory: {
      diagram: "gitopsHighway",
      intro: [
        "Helm is the package manager for Kubernetes: a chart is a versioned directory of Go templates plus a values.yaml that renders into manifests, and a release is an installed instance of a chart with a history of revisions stored as Secrets in the release namespace. Helm 3 removed Tiller — the client talks to the API directly with your kubeconfig — and added OCI registries for chart storage, a JSON schema for values validation, and library charts.",
        "Production charts are less about clever templates and more about contracts: a documented values.yaml with a strict schema, sane secure defaults (non-root, probes, resources, PDB), conditional features that are off unless explicitly enabled, and stable output so GitOps diffs stay small.",
      ],
      sections: [
        {
          h: "Template toolkit",
          p: "Go templates with Sprig functions: {{ .Values.x | default \"y\" }}, {{ include \"chart.fullname\" . }} (named templates from _helpers.tpl, preferred over template because include returns a string you can pipe to indent/nindent), {{ toYaml .Values.resources | nindent 12 }} to splice structured values, {{- if .Values.ingress.enabled }} conditionals, {{ range $k, $v := .Values.env }} loops, {{ tpl .Values.template . }} to render values that contain templates, required \"message\" .Values.x to fail fast, and {{ .Release.Name }}, {{ .Chart.Version }}, {{ .Capabilities.APIVersions.Has \"gateway.networking.k8s.io/v1\" }} for context. Whitespace control ({{- and -}}) is what keeps rendered YAML valid.",
        },
        {
          h: "Dependencies, subcharts and global values",
          p: "Chart.yaml dependencies (name, version range, repository or OCI ref, condition, alias, import-values) are resolved by helm dependency update into charts/ with Chart.lock. Parent values override subchart values under the subchart's key (postgresql.auth.password); global values are visible to all. condition: postgresql.enabled toggles the whole subchart. Prefer library charts (type: library) for shared helpers across an organisation's charts, and umbrella charts for composing an application stack — but keep umbrella charts thin, as they complicate independent upgrades.",
        },
        {
          h: "Validation, hooks and tests",
          p: "values.schema.json enforces types, enums, required keys and patterns at install time; helm lint and helm template --debug catch rendering errors; ct (chart-testing) runs lint and install tests in CI. Hooks (helm.sh/hook: pre-install, pre-upgrade, post-upgrade, pre-delete, test) with hook-weight and hook-delete-policy run Jobs for migrations and cleanup; note hooks are not managed as part of the release (they are not rolled back). helm test runs pods annotated helm.sh/hook: test against the live release. Annotate CRDs carefully: the crds/ directory installs once and is never upgraded by Helm — manage CRD upgrades separately or via a dedicated chart.",
        },
        {
          h: "Release operations",
          p: "helm upgrade --install --atomic --wait --timeout 10m makes a failed upgrade roll back automatically; --history-max bounds release secrets; helm diff (plugin) previews changes; helm rollback <release> <revision> restores a prior manifest set. Store charts in an OCI registry (helm push chart.tgz oci://registry.example.com/charts) and sign them with cosign or helm provenance. With ArgoCD/Flux, Helm becomes the rendering engine and the GitOps controller owns the lifecycle — do not mix `helm upgrade` by hand with GitOps-managed releases.",
        },
      ],
      keyPoints: [
        "include + nindent for helpers; toYaml for structured values; required for fail-fast.",
        "values.schema.json is the contract; secure defaults on; optional features off.",
        "Dependencies with condition/alias; global values; library charts for shared helpers.",
        "Hooks are not part of the release — idempotent Jobs with delete policies.",
        "crds/ installs once; plan CRD upgrades separately.",
        "upgrade --install --atomic --wait; OCI registries; never hand-upgrade GitOps releases.",
      ],
    },
    lab: {
      objective: "Scaffold a production chart, add helpers, conditionals, a values schema and a subchart, validate with lint/template/test, package to an OCI registry and perform an atomic upgrade with rollback.",
      steps: [
        {
          title: "Scaffold and lint the chart",
          cmd: "helm create api && rm -rf api/templates/tests api/templates/hpa.yaml && cp -r chart-src/* api/ && helm lint api --strict",
          output: "==> Linting api\n[INFO] Chart.yaml: icon is recommended\n\n1 chart(s) linted, 0 chart(s) failed",
          note: "--strict turns warnings into failures. Add the icon URL to Chart.yaml to silence the INFO.",
        },
        {
          title: "Render with production values and inspect conditional output",
          cmd: "helm template api ./api -f api/values-prod.yaml --set gateway.enabled=true --set postgresql.enabled=false | grep -E '^kind:|^  name:' | paste - - | sort | uniq -c",
          output: "      1 kind: ConfigMap\t  name: api-config\n      1 kind: Deployment\t  name: api\n      1 kind: HTTPRoute\t  name: api\n      1 kind: PodDisruptionBudget\t  name: api\n      1 kind: Service\t  name: api\n      1 kind: ServiceAccount\t  name: api\n      1 kind: ServiceMonitor\t  name: api",
          note: "No PostgreSQL objects because the subchart condition is false; HTTPRoute appears because gateway.enabled is true. helm template never touches the cluster.",
        },
        {
          title: "Validate values against the JSON schema",
          cmd: "helm template api ./api --set replicaCount=abc 2>&1 | tail -3; helm template api ./api --set image.tag=latest 2>&1 | tail -2",
          output: "Error: values don't meet the specifications of the schema(s) in the following chart(s):\napi:\n- replicaCount: Invalid type. Expected: integer, given: string\nError: values don't meet the specifications of the schema(s) in the following chart(s):\napi:\n- image.tag: Does not match pattern '^(?!latest$).+'",
          note: "Schema violations fail before anything is rendered — the fastest possible feedback for consumers of your chart.",
        },
        {
          title: "Resolve dependencies and install with the PostgreSQL subchart",
          cmd: "helm dependency update ./api && helm upgrade --install api ./api -n prod --create-namespace -f api/values-prod.yaml --set postgresql.enabled=true --atomic --wait --timeout 5m && helm -n prod list && helm -n prod test api",
          output: "Saving 1 charts\nDownloading postgresql from repo oci://registry-1.docker.io/bitnamicharts\nRelease \"api\" does not exist. Installing it now.\nNAME  NAMESPACE  REVISION  STATUS    CHART       APP VERSION\napi   prod       1         deployed  api-1.4.2   1.4.2\nNAME: api\nTEST SUITE:     api-test-connection\nLast Started:   Sat Sep 20 17:41:02 2026\nPhase:          Succeeded",
          note: "--atomic + --wait: if any resource fails to become ready within the timeout, the release is rolled back automatically.",
        },
        {
          title: "Push the chart to an OCI registry and upgrade from it",
          cmd: "helm package ./api --version 1.4.3 --app-version 1.4.3 && helm push api-1.4.3.tgz oci://registry.example.com/charts && helm upgrade api oci://registry.example.com/charts/api --version 1.4.3 -n prod -f api/values-prod.yaml --atomic --wait && helm -n prod history api",
          output: "Successfully packaged chart and saved it to: api-1.4.3.tgz\nPushed: registry.example.com/charts/api:1.4.3\nDigest: sha256:3e7a...\nRelease \"api\" has been upgraded. Happy Helming!\nREVISION  UPDATED                   STATUS      CHART      APP VERSION  DESCRIPTION\n1         Sat Sep 20 17:40:11 2026  superseded  api-1.4.2  1.4.2        Install complete\n2         Sat Sep 20 17:43:30 2026  deployed    api-1.4.3  1.4.3        Upgrade complete",
          note: "OCI charts are content-addressed and can be signed with cosign exactly like images.",
        },
        {
          title: "Simulate a bad upgrade and confirm automatic rollback",
          cmd: "helm upgrade api oci://registry.example.com/charts/api --version 1.4.3 -n prod -f api/values-prod.yaml --set image.tag=1.4.3-broken --atomic --wait --timeout 2m 2>&1 | tail -2; helm -n prod history api | tail -2",
          output: "Error: UPGRADE FAILED: release api failed, and has been rolled back due to atomic being set: timed out waiting for the condition\n3         Sat Sep 20 17:46:02 2026  failed      api-1.4.3  1.4.3        Upgrade \"api\" failed: timed out waiting for the condition\n4         Sat Sep 20 17:48:05 2026  deployed    api-1.4.3  1.4.3        Rollback to 2",
          note: "Revision 4 is a rollback to 2's manifests. Without --atomic the release would sit in 'failed' with the broken pods running.",
        },
      ],
      success: [
        "helm lint --strict passes",
        "helm template shows objects toggled by conditionals and subchart flags",
        "Schema violations are rejected before rendering",
        "Install with --atomic --wait succeeds and helm test passes",
        "The chart is pushed to OCI and upgraded from it",
        "A failing upgrade rolls back automatically and history records it",
      ],
    },
    blueprints: [
      {
        title: "Chart.yaml + values.yaml + values.schema.json + _helpers.tpl",
        lang: "yaml",
        code: `# Chart.yaml
apiVersion: v2
name: api
description: Example API service
type: application
version: 1.4.2
appVersion: "1.4.2"
kubeVersion: ">=1.28.0-0"
icon: https://example.com/icons/api.svg
maintainers:
  - { name: Platform Team, email: platform@example.com }
dependencies:
  - name: postgresql
    version: "16.x.x"
    repository: oci://registry-1.docker.io/bitnamicharts
    condition: postgresql.enabled
  - name: common
    version: "2.x.x"
    repository: oci://registry-1.docker.io/bitnamicharts
annotations:
  artifacthub.io/changes: |
    - kind: added
      description: Gateway API HTTPRoute support
---
# values.yaml
replicaCount: 3
image:
  repository: ghcr.io/example/api
  tag: ""                        # defaults to .Chart.AppVersion
  digest: ""                     # takes precedence over tag when set
  pullPolicy: IfNotPresent
imagePullSecrets: []
nameOverride: ""
fullnameOverride: ""
serviceAccount:
  create: true
  automount: false
  annotations: {}
podAnnotations: {}
podSecurityContext:
  runAsNonRoot: true
  runAsUser: 65532
  seccompProfile: { type: RuntimeDefault }
securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities: { drop: ["ALL"] }
service:
  type: ClusterIP
  port: 80
  targetPort: http
ingress:
  enabled: false
  className: nginx
  annotations: {}
  hosts: []
  tls: []
gateway:
  enabled: false
  parentRef: { name: public, namespace: gateway-system, sectionName: https }
  hostnames: []
  canary:
    enabled: false
    weight: 10
resources:
  requests: { cpu: 250m, memory: 256Mi }
  limits: { memory: 256Mi }
autoscaling:
  enabled: false
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 65
pdb:
  enabled: true
  maxUnavailable: 1
topologySpread:
  enabled: true
  maxSkew: 1
env: {}                          # map of NAME: value
envFrom: []                      # list of {secretRef|configMapRef}
config: {}                       # rendered into a ConfigMap as config.yaml
probes:
  liveness: { path: /healthz, periodSeconds: 10 }
  readiness: { path: /ready, periodSeconds: 5 }
  startup: { path: /healthz, periodSeconds: 5, failureThreshold: 30 }
metrics:
  enabled: true
  serviceMonitor:
    enabled: false
    labels: {}
    interval: 30s
postgresql:
  enabled: false
  auth: { database: api, username: api, existingSecret: api-db }
nodeSelector: {}
tolerations: []
affinity: {}
---
# values.schema.json
# {
#   "$schema": "https://json-schema.org/draft/2020-12/schema",
#   "type": "object",
#   "required": ["image", "replicaCount"],
#   "properties": {
#     "replicaCount": { "type": "integer", "minimum": 1 },
#     "image": {
#       "type": "object",
#       "required": ["repository"],
#       "properties": {
#         "repository": { "type": "string", "pattern": "^(ghcr\\\\.io/example|registry\\\\.example\\\\.com)/" },
#         "tag": { "type": "string", "pattern": "^(?!latest$).+" },
#         "digest": { "type": "string", "pattern": "^(sha256:[a-f0-9]{64})?$" },
#         "pullPolicy": { "enum": ["IfNotPresent", "Always", "Never"] }
#       }
#     },
#     "service": { "properties": { "type": { "enum": ["ClusterIP", "NodePort", "LoadBalancer"] } } },
#     "resources": { "required": ["requests", "limits"] },
#     "gateway": {
#       "properties": {
#         "canary": { "properties": { "weight": { "type": "integer", "minimum": 0, "maximum": 100 } } }
#       }
#     }
#   }
# }
---
# templates/_helpers.tpl
# {{- define "api.name" -}}
# {{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
# {{- end }}
#
# {{- define "api.fullname" -}}
# {{- if .Values.fullnameOverride }}
# {{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
# {{- else }}
# {{- $name := default .Chart.Name .Values.nameOverride }}
# {{- if contains $name .Release.Name }}
# {{- .Release.Name | trunc 63 | trimSuffix "-" }}
# {{- else }}
# {{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
# {{- end }}
# {{- end }}
# {{- end }}
#
# {{- define "api.labels" -}}
# helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
# {{ include "api.selectorLabels" . }}
# app.kubernetes.io/version: {{ .Values.image.tag | default .Chart.AppVersion | quote }}
# app.kubernetes.io/managed-by: {{ .Release.Service }}
# {{- end }}
#
# {{- define "api.selectorLabels" -}}
# app.kubernetes.io/name: {{ include "api.name" . }}
# app.kubernetes.io/instance: {{ .Release.Name }}
# {{- end }}
#
# {{- define "api.image" -}}
# {{- if .Values.image.digest }}
# {{- printf "%s@%s" .Values.image.repository .Values.image.digest }}
# {{- else }}
# {{- printf "%s:%s" .Values.image.repository (.Values.image.tag | default .Chart.AppVersion) }}
# {{- end }}
# {{- end }}
#
# {{- define "api.serviceAccountName" -}}
# {{- if .Values.serviceAccount.create }}{{ default (include "api.fullname" .) .Values.serviceAccount.name }}{{ else }}{{ default "default" .Values.serviceAccount.name }}{{ end }}
# {{- end }}
`,
      },
      {
        title: "templates/deployment.yaml, httproute.yaml, pdb.yaml, configmap.yaml, migration hook and test",
        lang: "yaml",
        code: `# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "api.fullname" . }}
  labels:
    {{- include "api.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  selector:
    matchLabels:
      {{- include "api.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
        {{- with .Values.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        {{- include "api.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "api.serviceAccountName" . }}
      automountServiceAccountToken: {{ .Values.serviceAccount.automount }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      {{- if .Values.topologySpread.enabled }}
      topologySpreadConstraints:
        - maxSkew: {{ .Values.topologySpread.maxSkew }}
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              {{- include "api.selectorLabels" . | nindent 14 }}
          matchLabelKeys: ["pod-template-hash"]
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              {{- include "api.selectorLabels" . | nindent 14 }}
      {{- end }}
      containers:
        - name: {{ .Chart.Name }}
          image: {{ include "api.image" . | quote }}
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          ports:
            - { name: http, containerPort: 8080, protocol: TCP }
            {{- if .Values.metrics.enabled }}
            - { name: metrics, containerPort: 9090, protocol: TCP }
            {{- end }}
          env:
            - name: POD_NAME
              valueFrom: { fieldRef: { fieldPath: metadata.name } }
            {{- range $k, $v := .Values.env }}
            - name: {{ $k }}
              value: {{ tpl (toString $v) $ | quote }}
            {{- end }}
            {{- if .Values.postgresql.enabled }}
            - name: DATABASE_HOST
              value: {{ printf "%s-postgresql" .Release.Name }}
            {{- end }}
          {{- with .Values.envFrom }}
          envFrom:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          startupProbe:
            httpGet: { path: {{ .Values.probes.startup.path }}, port: http }
            periodSeconds: {{ .Values.probes.startup.periodSeconds }}
            failureThreshold: {{ .Values.probes.startup.failureThreshold }}
          livenessProbe:
            httpGet: { path: {{ .Values.probes.liveness.path }}, port: http }
            periodSeconds: {{ .Values.probes.liveness.periodSeconds }}
          readinessProbe:
            httpGet: { path: {{ .Values.probes.readiness.path }}, port: http }
            periodSeconds: {{ .Values.probes.readiness.periodSeconds }}
          lifecycle:
            preStop: { sleep: { seconds: 5 } }
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          volumeMounts:
            - { name: config, mountPath: /app/config, readOnly: true }
            - { name: tmp, mountPath: /tmp }
      volumes:
        - name: config
          configMap: { name: {{ include "api.fullname" . }}-config }
        - name: tmp
          emptyDir: { sizeLimit: 64Mi }
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
---
# templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "api.fullname" . }}-config
  labels:
    {{- include "api.labels" . | nindent 4 }}
data:
  config.yaml: |
    {{- toYaml .Values.config | nindent 4 }}
---
# templates/httproute.yaml
{{- if .Values.gateway.enabled }}
{{- if not (.Capabilities.APIVersions.Has "gateway.networking.k8s.io/v1") }}
{{- fail "gateway.enabled requires Gateway API v1 CRDs to be installed" }}
{{- end }}
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: {{ include "api.fullname" . }}
  labels:
    {{- include "api.labels" . | nindent 4 }}
spec:
  parentRefs:
    - name: {{ .Values.gateway.parentRef.name }}
      namespace: {{ .Values.gateway.parentRef.namespace }}
      sectionName: {{ .Values.gateway.parentRef.sectionName }}
  hostnames:
    {{- range .Values.gateway.hostnames }}
    - {{ . | quote }}
    {{- end }}
  rules:
    - matches:
        - path: { type: PathPrefix, value: / }
      backendRefs:
        - name: {{ include "api.fullname" . }}
          port: {{ .Values.service.port }}
          {{- if .Values.gateway.canary.enabled }}
          weight: {{ sub 100 .Values.gateway.canary.weight }}
        - name: {{ include "api.fullname" . }}-canary
          port: {{ .Values.service.port }}
          weight: {{ .Values.gateway.canary.weight }}
          {{- end }}
{{- end }}
---
# templates/pdb.yaml
{{- if and .Values.pdb.enabled (gt (int .Values.replicaCount) 1) }}
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "api.fullname" . }}
  labels:
    {{- include "api.labels" . | nindent 4 }}
spec:
  maxUnavailable: {{ .Values.pdb.maxUnavailable }}
  selector:
    matchLabels:
      {{- include "api.selectorLabels" . | nindent 6 }}
{{- end }}
---
# templates/migrate-job.yaml (pre-upgrade hook)
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "api.fullname" . }}-migrate-{{ .Release.Revision }}
  annotations:
    helm.sh/hook: pre-install,pre-upgrade
    helm.sh/hook-weight: "-5"
    helm.sh/hook-delete-policy: before-hook-creation,hook-succeeded
spec:
  backoffLimit: 2
  template:
    spec:
      restartPolicy: Never
      serviceAccountName: {{ include "api.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: migrate
          image: {{ include "api.image" . | quote }}
          command: ["/nodejs/bin/node", "dist/migrate.js"]
          {{- with .Values.envFrom }}
          envFrom:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
---
# templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: {{ include "api.fullname" . }}-test-connection
  annotations:
    helm.sh/hook: test
    helm.sh/hook-delete-policy: hook-succeeded
spec:
  restartPolicy: Never
  securityContext:
    runAsNonRoot: true
    runAsUser: 65532
    seccompProfile: { type: RuntimeDefault }
  containers:
    - name: wget
      image: busybox:1.36
      command: ["wget", "-qO-", "--timeout=5", "http://{{ include "api.fullname" . }}:{{ .Values.service.port }}/healthz"]
      securityContext:
        allowPrivilegeEscalation: false
        capabilities: { drop: ["ALL"] }
`,
      },
    ],
  },
];
/* ====================================================================================
   INTERACTIVE ARCHITECTURE PLAYGROUND
   ==================================================================================== */
const PLAYGROUND_COMPONENTS = {
  apiserver: {
    name: "kube-apiserver",
    role: "Control plane • static pod",
    summary: "Single entry point for the cluster API. Authenticates, authorizes, runs admission, validates and persists to etcd. Stateless and horizontally scalable behind a load balancer.",
    flags: [
      "--anonymous-auth=false",
      "--authorization-mode=Node,RBAC",
      "--enable-admission-plugins=NodeRestriction,PodSecurity",
      "--audit-policy-file=/etc/kubernetes/audit/policy.yaml",
      "--audit-log-path=/var/log/kubernetes/audit/audit.log",
      "--encryption-provider-config=/etc/kubernetes/enc/encryption.yaml",
      "--tls-min-version=VersionTLS12",
      "--kubelet-certificate-authority=/etc/kubernetes/pki/ca.crt",
      "--service-account-issuer=https://kubernetes.default.svc.cluster.local",
      "--profiling=false",
    ],
    logs: [
      "/etc/kubernetes/manifests/kube-apiserver.yaml (static pod spec)",
      "/var/log/pods/kube-system_kube-apiserver-<node>_<uid>/kube-apiserver/0.log",
      "/var/log/kubernetes/audit/audit.log",
      "crictl ps -a --name kube-apiserver  →  crictl logs <id>",
    ],
    verify: [
      "kubectl get --raw /readyz?verbose",
      "kubectl get --raw /livez?verbose",
      "curl -sk https://127.0.0.1:6443/version",
      "kubectl -n kube-system get pod -l component=kube-apiserver -o wide",
      "openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -dates",
    ],
    ports: "6443/TCP (HTTPS)",
  },
  etcd: {
    name: "etcd",
    role: "Control plane • Raft key-value store",
    summary: "The only stateful control-plane component. Stores every API object under /registry. Requires quorum (majority) to accept writes; fsync latency dominates performance.",
    flags: [
      "--listen-client-urls=https://127.0.0.1:2379,https://10.0.0.11:2379",
      "--listen-peer-urls=https://10.0.0.11:2380",
      "--client-cert-auth=true",
      "--peer-client-cert-auth=true",
      "--auto-tls=false  --peer-auto-tls=false",
      "--data-dir=/var/lib/etcd",
      "--quota-backend-bytes=8589934592",
      "--auto-compaction-retention=1h",
      "--snapshot-count=10000",
    ],
    logs: [
      "/etc/kubernetes/manifests/etcd.yaml",
      "/var/log/pods/kube-system_etcd-<node>_<uid>/etcd/0.log",
      "/var/lib/etcd/member/wal/ (write-ahead log)",
      "/var/lib/etcd/member/snap/db (bbolt DB)",
    ],
    verify: [
      "ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key endpoint health --cluster",
      "etcdctl ... endpoint status -w table",
      "etcdctl ... alarm list",
      "etcdctl ... snapshot save /var/backups/etcd.db",
      "etcdctl ... check perf",
    ],
    ports: "2379/TCP client • 2380/TCP peer • 2381 metrics",
  },
  scheduler: {
    name: "kube-scheduler",
    role: "Control plane • placement",
    summary: "Watches for Pods with no nodeName, runs Filter and Score plugins, then binds the pod to the best node. Leader-elected; only one instance is active.",
    flags: [
      "--config=/etc/kubernetes/scheduler-config.yaml (KubeSchedulerConfiguration)",
      "--bind-address=127.0.0.1",
      "--leader-elect=true",
      "--profiling=false",
      "--authentication-kubeconfig=/etc/kubernetes/scheduler.conf",
      "--authorization-kubeconfig=/etc/kubernetes/scheduler.conf",
      "-v=2 (raise to 4 for per-plugin scoring)",
    ],
    logs: [
      "/etc/kubernetes/manifests/kube-scheduler.yaml",
      "/var/log/pods/kube-system_kube-scheduler-<node>_<uid>/kube-scheduler/0.log",
      "kubectl -n kube-system logs -l component=kube-scheduler",
    ],
    verify: [
      "kubectl -n kube-system get lease kube-scheduler -o yaml",
      "kubectl get events -A --field-selector reason=FailedScheduling",
      "kubectl describe pod <pending-pod> | sed -n '/Events/,$p'",
      "kubectl get --raw /apis/metrics.k8s.io/v1beta1/nodes",
    ],
    ports: "10259/TCP (HTTPS metrics/healthz)",
  },
  controller: {
    name: "kube-controller-manager",
    role: "Control plane • reconciliation loops",
    summary: "Runs the built-in controllers (Deployment, ReplicaSet, Node lifecycle, Endpoints/EndpointSlice, ServiceAccount, CSR signing, GC, PV binding). Leader-elected.",
    flags: [
      "--controllers=*,bootstrapsigner,tokencleaner",
      "--cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt",
      "--cluster-signing-key-file=/etc/kubernetes/pki/ca.key",
      "--cluster-signing-duration=8760h",
      "--use-service-account-credentials=true",
      "--node-monitor-grace-period=40s",
      "--terminated-pod-gc-threshold=1000",
      "--bind-address=127.0.0.1",
      "--profiling=false",
    ],
    logs: [
      "/etc/kubernetes/manifests/kube-controller-manager.yaml",
      "/var/log/pods/kube-system_kube-controller-manager-<node>_<uid>/kube-controller-manager/0.log",
    ],
    verify: [
      "kubectl -n kube-system get lease kube-controller-manager",
      "kubectl get csr (pending CSRs mean the signer is not running)",
      "kubectl get nodes (NotReady after 40s grace → node lifecycle controller)",
      "kubectl get rs -A (desired vs current mismatch → RS controller)",
    ],
    ports: "10257/TCP (HTTPS metrics/healthz)",
  },
  kubelet: {
    name: "kubelet",
    role: "Node agent • systemd service",
    summary: "Registers the node, watches for pods assigned to it, drives CRI/CNI/CSI, runs probes, reports status, enforces eviction thresholds and serves the node API on 10250.",
    flags: [
      "--config=/var/lib/kubelet/config.yaml",
      "--kubeconfig=/etc/kubernetes/kubelet.conf",
      "--container-runtime-endpoint=unix:///run/containerd/containerd.sock",
      "--pod-infra-container-image=registry.k8s.io/pause:3.10",
      "KubeletConfiguration: authentication.anonymous.enabled=false",
      "KubeletConfiguration: authorization.mode=Webhook",
      "KubeletConfiguration: readOnlyPort=0",
      "KubeletConfiguration: cgroupDriver=systemd",
      "KubeletConfiguration: rotateCertificates=true, serverTLSBootstrap=true",
      "KubeletConfiguration: protectKernelDefaults=true",
    ],
    logs: [
      "journalctl -u kubelet -f",
      "/var/lib/kubelet/kubeadm-flags.env",
      "/var/lib/kubelet/config.yaml",
      "/var/lib/kubelet/pki/kubelet-client-current.pem",
      "/var/lib/kubelet/pods/<uid>/ (volumes, containers, etc-hosts)",
      "/var/log/pods/<ns>_<pod>_<uid>/<container>/0.log",
    ],
    verify: [
      "systemctl status kubelet",
      "kubectl get node <node> -o jsonpath='{.status.conditions}'",
      "kubectl get --raw /api/v1/nodes/<node>/proxy/stats/summary",
      "curl -sk https://127.0.0.1:10250/healthz (expects 401 with anonymous off)",
      "kubectl debug node/<node> -it --image=busybox -- chroot /host journalctl -u kubelet",
    ],
    ports: "10250/TCP API • 10248 healthz (localhost) • 10255 read-only (must be 0)",
  },
  proxy: {
    name: "kube-proxy",
    role: "Node • Service datapath (DaemonSet)",
    summary: "Programs iptables/IPVS/nftables rules on every node so ClusterIP and NodePort traffic is DNAT-ed to healthy endpoints. Replaced entirely by Cilium's eBPF kube-proxy replacement when enabled.",
    flags: [
      "KubeProxyConfiguration: mode=ipvs | iptables | nftables",
      "KubeProxyConfiguration: ipvs.scheduler=rr, ipvs.strictARP=true",
      "KubeProxyConfiguration: clusterCIDR=10.244.0.0/16",
      "KubeProxyConfiguration: conntrack.maxPerCore=32768",
      "KubeProxyConfiguration: metricsBindAddress=0.0.0.0:10249",
      "--hostname-override=<node>",
    ],
    logs: [
      "kubectl -n kube-system logs ds/kube-proxy",
      "kubectl -n kube-system get cm kube-proxy -o yaml",
      "/var/log/pods/kube-system_kube-proxy-<hash>_<uid>/kube-proxy/0.log",
    ],
    verify: [
      "iptables-save -t nat | grep KUBE-SVC | head",
      "ipvsadm -Ln (IPVS mode)",
      "nft list table ip kube-proxy (nftables mode)",
      "curl -s http://127.0.0.1:10249/proxyMode",
      "conntrack -L | wc -l ; sysctl net.netfilter.nf_conntrack_max",
    ],
    ports: "10249 metrics • 10256 healthz",
  },
  runtime: {
    name: "containerd",
    role: "Node • CRI container runtime",
    summary: "Implements the CRI. Pulls images, manages snapshots (overlayfs), creates pod sandboxes and containers through shims and runc, executes CNI plugins for sandbox networking.",
    flags: [
      "/etc/containerd/config.toml: version = 2",
      "[plugins.\"io.containerd.grpc.v1.cri\"] sandbox_image = \"registry.k8s.io/pause:3.10\"",
      "[...containerd.runtimes.runc.options] SystemdCgroup = true",
      "[...cri.registry] config_path = \"/etc/containerd/certs.d\"",
      "[...cri.cni] bin_dir = \"/opt/cni/bin\", conf_dir = \"/etc/cni/net.d\"",
      "runtime handlers: runc • gvisor (runsc) • kata",
    ],
    logs: [
      "journalctl -u containerd -f",
      "/etc/containerd/config.toml",
      "/run/containerd/containerd.sock",
      "/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/",
      "/run/containerd/io.containerd.runtime.v2.task/k8s.io/<id>/config.json",
    ],
    verify: [
      "systemctl status containerd",
      "crictl info | jq .status.conditions",
      "crictl ps -a ; crictl pods ; crictl images",
      "ctr -n k8s.io containers ls ; ctr -n k8s.io tasks ls",
      "crictl imagefsinfo ; crictl stats",
      "runc --root /run/containerd/runc/k8s.io list",
    ],
    ports: "unix socket only",
  },
  cni: {
    name: "CNI plugin",
    role: "Node • pod networking (Cilium / Calico)",
    summary: "Executed by the runtime on sandbox creation to allocate an IP, create the veth pair and program routes. The agent DaemonSet distributes routes/policies and (with eBPF) replaces kube-proxy.",
    flags: [
      "/etc/cni/net.d/10-cilium.conflist (first file lexically wins)",
      "/opt/cni/bin/ (plugin binaries: cilium-cni, calico, bridge, portmap, bandwidth)",
      "Cilium: --kube-proxy-replacement=true, --enable-bpf-masquerade=true, --tunnel-protocol=vxlan|geneve|native",
      "Calico: CALICO_IPV4POOL_IPIP=Never, CALICO_IPV4POOL_VXLAN=Always, FELIX_MTU",
      "MTU: overlay MTU = underlay − 50 (VXLAN)",
    ],
    logs: [
      "kubectl -n kube-system logs ds/cilium -c cilium-agent",
      "kubectl -n calico-system logs ds/calico-node -c calico-node",
      "/var/log/calico/cni/cni.log",
      "/var/run/cilium/cilium.sock",
      "journalctl -u kubelet | grep -i cni",
    ],
    verify: [
      "kubectl -n kube-system exec ds/cilium -- cilium status --verbose",
      "kubectl -n kube-system exec ds/cilium -- cilium endpoint list",
      "calicoctl node status ; calicoctl get ippool -o wide",
      "ip route ; ip -d link show type vxlan",
      "hubble observe --verdict DROPPED --last 20",
    ],
    ports: "VXLAN 8472/UDP • Geneve 6081/UDP • BGP 179/TCP • Hubble 4244",
  },
  coredns: {
    name: "CoreDNS",
    role: "Cluster add-on • DNS (Deployment)",
    summary: "Serves <svc>.<ns>.svc.cluster.local and pod records from EndpointSlices, forwards external queries to upstream resolvers, and caches. The kube-dns Service IP is injected into every pod's resolv.conf.",
    flags: [
      "Corefile plugins: kubernetes, forward, cache, loop, reload, autopath, health, ready, prometheus",
      "kubelet clusterDNS: 10.96.0.10 (must equal the kube-dns Service IP)",
      "kubelet resolvConf: /run/systemd/resolve/resolv.conf (avoid 127.0.0.53 loops)",
      "pod dnsPolicy: ClusterFirst | Default | None (+ dnsConfig ndots)",
    ],
    logs: [
      "kubectl -n kube-system logs deploy/coredns",
      "kubectl -n kube-system get cm coredns -o yaml",
      "enable 'log' plugin in Corefile for query logging",
    ],
    verify: [
      "kubectl -n kube-system get ep kube-dns",
      "kubectl run dnstest --rm -it --image=busybox:1.36 -- nslookup kubernetes.default",
      "kubectl -n kube-system get pods -l k8s-app=kube-dns",
      "dig @10.96.0.10 api.prod.svc.cluster.local +short",
      "curl -s http://<coredns-pod>:9153/metrics | grep coredns_dns_requests_total",
    ],
    ports: "53/UDP+TCP • 9153 metrics • 8080 health • 8181 ready",
  },
};

function ArchitecturePlayground({ t }) {
  const [selected, setSelected] = useState("apiserver");
  const c = PLAYGROUND_COMPONENTS[selected];
  const sel = (id) => () => setSelected(id);
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Diagram viewBox="0 0 900 560" title="Interactive Cluster Topology — click any component" t={t} height={620}>
        <Zone x={20} y={20} w={860} h={230} label="CONTROL PLANE NODE  cp1  •  10.0.0.11" stroke="#7c3aed" fill="rgba(124,58,237,0.06)" labelFill="#c4b5fd" />
        <Node x={40} y={55} w={200} h={64} label="kube-apiserver" sub=":6443 • authn/authz/admission" fill="url(#gCyan)" stroke="#22d3ee" onClick={sel("apiserver")} active={selected === "apiserver"} />
        <Node x={270} y={55} w={180} h={64} label="etcd" sub=":2379 / :2380 • Raft" fill="url(#gViolet)" stroke="#a78bfa" onClick={sel("etcd")} active={selected === "etcd"} />
        <Node x={480} y={55} w={180} h={64} label="kube-scheduler" sub=":10259 • filter/score/bind" fill="url(#gAmber)" stroke="#fbbf24" onClick={sel("scheduler")} active={selected === "scheduler"} />
        <Node x={690} y={55} w={170} h={64} label="controller-manager" sub=":10257 • reconcile loops" fill="url(#gEmerald)" stroke="#34d399" onClick={sel("controller")} active={selected === "controller"} />
        <Edge d="M 240 87 L 270 87" color="#a78bfa" marker="url(#arrowMuted)" />
        <Edge d="M 570 119 C 570 150, 160 150, 140 119" color="#fbbf24" marker="url(#arrowAmber)" label="watch/bind" lx={360} ly={155} />
        <Edge d="M 775 119 C 775 175, 150 175, 140 119" color="#34d399" marker="url(#arrowEmerald)" label="watch/update" lx={460} ly={182} />
        <Node x={40} y={170} w={200} h={54} label="kubelet (cp1)" sub="runs the static pods above" onClick={sel("kubelet")} active={selected === "kubelet"} />
        <Node x={270} y={170} w={180} h={54} label="containerd (cp1)" sub="shim → runc" onClick={sel("runtime")} active={selected === "runtime"} />
        <Node x={480} y={170} w={180} h={54} label="CoreDNS ×2" sub="kube-dns 10.96.0.10" fill="#1e1b4b" stroke="#818cf8" onClick={sel("coredns")} active={selected === "coredns"} />
        <Node x={690} y={170} w={170} h={54} label="kube-proxy (cp1)" sub="DaemonSet" onClick={sel("proxy")} active={selected === "proxy"} />
        <Label x={40} y={242} text="/etc/kubernetes/manifests/*.yaml  →  kubelet  →  static pods  (no scheduler involved)" fill="#94a3b8" size={9.5} />

        {[0, 1].map((n) => {
          const x = 20 + n * 440;
          return (
            <g key={n}>
              <Zone x={x} y={290} w={420} h={250} label={`WORKER NODE  worker${n + 1}  •  10.0.1.${11 + n}`} stroke="#059669" fill="rgba(5,150,105,0.06)" labelFill="#6ee7b7" />
              <Node x={x + 15} y={325} w={190} h={54} label="kubelet" sub=":10250 • CRI/CNI/CSI" fill="url(#gCyan)" onClick={sel("kubelet")} active={selected === "kubelet"} />
              <Node x={x + 220} y={325} w={185} h={54} label="kube-proxy" sub="iptables/IPVS/eBPF" onClick={sel("proxy")} active={selected === "proxy"} />
              <Node x={x + 15} y={392} w={190} h={54} label="containerd" sub="overlayfs • shim • runc" onClick={sel("runtime")} active={selected === "runtime"} />
              <Node x={x + 220} y={392} w={185} h={54} label="CNI agent (cilium/calico)" sub={`pod CIDR 10.244.${n + 1}.0/24`} fill="#022c22" stroke="#34d399" onClick={sel("cni")} active={selected === "cni"} />
              <Node x={x + 15} y={460} w={120} h={50} label="pod: api" sub={`10.244.${n + 1}.12`} fill="#1e1b4b" stroke="#818cf8" fontSize={11} />
              <Node x={x + 150} y={460} w={120} h={50} label="pod: web" sub={`10.244.${n + 1}.20`} fill="#1e1b4b" stroke="#818cf8" fontSize={11} />
              <Node x={x + 285} y={460} w={120} h={50} label="pause ×2" sub="netns anchors" fill="#0f172a" stroke="#475569" fontSize={11} />
              <Edge d={`M ${x + 110} 325 C ${x + 110} 280, 160 260, 140 250`} color="#22d3ee" marker="url(#arrow)" />
            </g>
          );
        })}
        <Edge d="M 900 87 L 860 87" animated={false} color="#94a3b8" marker="url(#arrowMuted)" />
      </Diagram>

      <div className={`flex flex-col gap-3 rounded-2xl border p-4 ${t.card}`}>
        <div>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${t.faint}`}>{c.role}</div>
          <h3 className={`text-xl font-bold ${t.heading}`}>{c.name}</h3>
          <div className="mt-1"><BulletList items={toBullets(c.summary)} t={t} color={t.muted} /></div>
          <div className={`mt-2 inline-block rounded-md border px-2 py-0.5 font-mono text-[11px] ${t.chip}`}>{c.ports}</div>
        </div>
        <PanelSection title="Critical flags & config" icon={<ListChecks size={14} />} items={c.flags} t={t} color="text-amber-300" />
        <PanelSection title="Logs & files" icon={<HardDrive size={14} />} items={c.logs} t={t} color="text-violet-300" />
        <PanelSection title="Verification commands" icon={<Terminal size={14} />} items={c.verify} t={t} color="text-emerald-300" copyable />
      </div>
    </div>
  );
}

function PanelSection({ title, icon, items, t, color, copyable }) {
  return (
    <div className={`rounded-xl border p-3 ${t.panel}`}>
      <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${color}`}>
        {icon} {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start justify-between gap-2 font-mono text-[11.5px] leading-snug">
            <span className="break-all">{it}</span>
            {copyable ? <CopyButton text={it} t={t} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ====================================================================================
   GLOBAL COMMAND MATRIX
   ==================================================================================== */
const COMMANDS = [
  // docker
  { tool: "docker", cat: "Diagnostic", cmd: "docker inspect --format '{{.State.Pid}} {{.HostConfig.SecurityOpt}}' <ctr>", desc: "Host PID and security options of a container" },
  { tool: "docker", cat: "Diagnostic", cmd: "docker history --no-trunc <image>", desc: "Per-layer instruction and size" },
  { tool: "docker", cat: "Diagnostic", cmd: "docker stats --no-stream", desc: "Live CPU/memory/IO per container" },
  { tool: "docker", cat: "Diagnostic", cmd: "docker system df -v", desc: "Disk usage by images, containers, volumes, build cache" },
  { tool: "docker", cat: "Configuration", cmd: "docker buildx build --sbom=true --provenance=mode=max --platform linux/amd64,linux/arm64 -t <ref> --push .", desc: "Multi-arch build with attestations" },
  { tool: "docker", cat: "Configuration", cmd: "docker run --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges --user 65532 <image>", desc: "Run with a hardened profile" },
  { tool: "docker", cat: "Destructive", cmd: "docker system prune -af --volumes", desc: "Remove all unused images, containers, networks and volumes" },
  { tool: "docker", cat: "Destructive", cmd: "docker rm -f $(docker ps -aq)", desc: "Force-remove every container" },
  // crictl
  { tool: "crictl", cat: "Diagnostic", cmd: "crictl ps -a ; crictl pods ; crictl images", desc: "List containers, sandboxes and images via CRI" },
  { tool: "crictl", cat: "Diagnostic", cmd: "crictl inspect <ctr> | jq '.info.pid, .info.runtimeSpec.linux.namespaces'", desc: "Host PID and OCI namespaces of a container" },
  { tool: "crictl", cat: "Diagnostic", cmd: "crictl logs --tail=100 <ctr>", desc: "Container logs without the kubelet" },
  { tool: "crictl", cat: "Diagnostic", cmd: "crictl inspectp <pod> | jq .info.cniResult", desc: "CNI result (IP, interfaces) for a sandbox" },
  { tool: "crictl", cat: "Diagnostic", cmd: "crictl stats ; crictl imagefsinfo", desc: "Resource usage and image filesystem stats" },
  { tool: "crictl", cat: "Configuration", cmd: "crictl config runtime-endpoint unix:///run/containerd/containerd.sock", desc: "Point crictl at the runtime socket" },
  { tool: "crictl", cat: "Destructive", cmd: "crictl rmi --prune", desc: "Delete all unused images" },
  { tool: "crictl", cat: "Destructive", cmd: "crictl stopp <pod> && crictl rmp <pod>", desc: "Stop and remove a pod sandbox (kubelet will recreate if desired)" },
  // kubectl
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl get events -A --sort-by=.lastTimestamp | tail -30", desc: "Most recent cluster events" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl describe node <node> | sed -n '/Conditions/,/Events/p'", desc: "Node conditions, taints, allocated resources" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl get pods -A --field-selector status.phase!=Running,status.phase!=Succeeded", desc: "Every unhealthy pod cluster-wide" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl logs <pod> -c <ctr> --previous", desc: "Logs from the last crashed container instance" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl debug -it <pod> --image=nicolaka/netshoot --target=<ctr>", desc: "Ephemeral debug container sharing the process namespace" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl debug node/<node> -it --image=ubuntu -- chroot /host bash", desc: "Shell on the node through a privileged debug pod" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl auth can-i --list --as=system:serviceaccount:<ns>:<sa>", desc: "Effective permissions of an identity" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl get --raw /readyz?verbose", desc: "API server readiness checks" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl top pods -A --sort-by=memory | head", desc: "Top memory consumers (metrics-server)" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl rollout status deploy/<name> ; kubectl rollout history deploy/<name>", desc: "Rollout progress and revisions" },
  { tool: "kubectl", cat: "Diagnostic", cmd: "kubectl get endpointslices -l kubernetes.io/service-name=<svc>", desc: "Backends of a Service" },
  { tool: "kubectl", cat: "Configuration", cmd: "kubectl apply --server-side --field-manager=gitops -f manifest.yaml", desc: "Server-side apply with a named field manager" },
  { tool: "kubectl", cat: "Configuration", cmd: "kubectl create token <sa> -n <ns> --duration=10m", desc: "Short-lived ServiceAccount token" },
  { tool: "kubectl", cat: "Configuration", cmd: "kubectl label ns <ns> pod-security.kubernetes.io/enforce=restricted", desc: "Enforce the restricted Pod Security Standard" },
  { tool: "kubectl", cat: "Configuration", cmd: "kubectl cordon <node> && kubectl drain <node> --ignore-daemonsets --delete-emptydir-data", desc: "Safely evacuate a node" },
  { tool: "kubectl", cat: "Configuration", cmd: "kubectl certificate approve <csr>", desc: "Approve a CertificateSigningRequest" },
  { tool: "kubectl", cat: "Configuration", cmd: "kubectl patch deploy <name> -p '{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"restartedAt\":\"now\"}}}}}'", desc: "Force a rolling restart (or kubectl rollout restart)" },
  { tool: "kubectl", cat: "Destructive", cmd: "kubectl delete pod <pod> --grace-period=0 --force", desc: "Remove a pod stuck Terminating (node gone)" },
  { tool: "kubectl", cat: "Destructive", cmd: "kubectl rollout undo deploy/<name> --to-revision=<n>", desc: "Roll back to a specific revision" },
  { tool: "kubectl", cat: "Destructive", cmd: "kubectl delete ns <ns>", desc: "Delete a namespace and everything in it" },
  { tool: "kubectl", cat: "Destructive", cmd: "kubectl patch <kind> <name> -p '{\"metadata\":{\"finalizers\":null}}' --type=merge", desc: "Remove blocking finalizers" },
  // kubeadm
  { tool: "kubeadm", cat: "Diagnostic", cmd: "kubeadm certs check-expiration", desc: "Expiry of every control-plane certificate" },
  { tool: "kubeadm", cat: "Diagnostic", cmd: "kubeadm upgrade plan", desc: "Available versions and component skew" },
  { tool: "kubeadm", cat: "Diagnostic", cmd: "kubeadm config print init-defaults", desc: "Default ClusterConfiguration" },
  { tool: "kubeadm", cat: "Configuration", cmd: "kubeadm init --config cluster.yaml --upload-certs", desc: "Bootstrap the first control-plane node" },
  { tool: "kubeadm", cat: "Configuration", cmd: "kubeadm token create --print-join-command", desc: "New bootstrap token + join command" },
  { tool: "kubeadm", cat: "Configuration", cmd: "kubeadm certs renew all", desc: "Renew all control-plane certificates (restart static pods after)" },
  { tool: "kubeadm", cat: "Configuration", cmd: "kubeadm upgrade apply v1.31.2 ; kubeadm upgrade node", desc: "Upgrade first control plane, then other nodes" },
  { tool: "kubeadm", cat: "Destructive", cmd: "kubeadm reset -f && rm -rf /etc/cni/net.d $HOME/.kube", desc: "Tear down a node's cluster state" },
  // etcdctl
  { tool: "etcdctl", cat: "Diagnostic", cmd: "etcdctl endpoint status --cluster -w table", desc: "Leader, DB size, Raft index per member" },
  { tool: "etcdctl", cat: "Diagnostic", cmd: "etcdctl endpoint health --cluster", desc: "Health of every member" },
  { tool: "etcdctl", cat: "Diagnostic", cmd: "etcdctl get /registry --prefix --keys-only | head", desc: "Enumerate stored keys" },
  { tool: "etcdctl", cat: "Diagnostic", cmd: "etcdctl alarm list ; etcdctl check perf", desc: "NOSPACE alarms and disk/latency benchmark" },
  { tool: "etcdctl", cat: "Configuration", cmd: "etcdctl snapshot save /var/backups/etcd-$(date +%F).db", desc: "Consistent backup" },
  { tool: "etcdctl", cat: "Configuration", cmd: "etcdctl compact $(etcdctl endpoint status -w json | jq .[0].Status.header.revision) && etcdctl defrag --cluster", desc: "Compact history and reclaim space" },
  { tool: "etcdctl", cat: "Destructive", cmd: "etcdutl snapshot restore backup.db --data-dir /var/lib/etcd-restore", desc: "Restore a snapshot into a new data dir" },
  { tool: "etcdctl", cat: "Destructive", cmd: "etcdctl member remove <id>", desc: "Remove a dead member from the cluster" },
  // calicoctl / cilium
  { tool: "calicoctl", cat: "Diagnostic", cmd: "calicoctl node status", desc: "BGP peering state" },
  { tool: "calicoctl", cat: "Diagnostic", cmd: "calicoctl get ippool -o wide ; calicoctl ipam show --show-blocks", desc: "IP pools, encapsulation and block allocation" },
  { tool: "calicoctl", cat: "Diagnostic", cmd: "calicoctl get networkpolicy -A -o yaml", desc: "Calico-native policies" },
  { tool: "calicoctl", cat: "Configuration", cmd: "calicoctl patch felixconfiguration default -p '{\"spec\":{\"logSeverityScreen\":\"Debug\"}}'", desc: "Raise Felix log level" },
  { tool: "calicoctl", cat: "Configuration", cmd: "cilium status --verbose ; cilium connectivity test", desc: "Cilium health and end-to-end connectivity suite" },
  { tool: "calicoctl", cat: "Diagnostic", cmd: "hubble observe --namespace <ns> --verdict DROPPED", desc: "Policy drops in real time" },
  // security tools
  { tool: "security", cat: "Diagnostic", cmd: "trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 <image>", desc: "Fail on fixable high/critical CVEs" },
  { tool: "security", cat: "Diagnostic", cmd: "trivy k8s --report summary cluster", desc: "Scan running workloads, RBAC and misconfigs" },
  { tool: "security", cat: "Diagnostic", cmd: "kube-bench run --targets master,node", desc: "CIS benchmark audit with remediation" },
  { tool: "security", cat: "Diagnostic", cmd: "cosign verify --key cosign.pub <image@digest>", desc: "Verify an image signature" },
  { tool: "security", cat: "Diagnostic", cmd: "kubectl -n falco logs ds/falco | grep -E 'Warning|Error'", desc: "Runtime security events" },
  { tool: "security", cat: "Diagnostic", cmd: "grep -E 'CapEff|Seccomp|NoNewPrivs' /proc/<pid>/status ; cat /proc/<pid>/attr/current", desc: "Capabilities, seccomp and AppArmor state of a process" },
  { tool: "security", cat: "Configuration", cmd: "cosign sign --key cosign.key <image@digest>", desc: "Sign an image by digest" },
  { tool: "security", cat: "Configuration", cmd: "apparmor_parser -r /etc/apparmor.d/<profile> && aa-status", desc: "Load an AppArmor profile" },
  { tool: "security", cat: "Configuration", cmd: "syft <image> -o spdx-json > sbom.json && cosign attest --predicate sbom.json --type spdxjson <image@digest>", desc: "Generate and attach an SBOM" },
  { tool: "security", cat: "Configuration", cmd: "kubectl apply -f kyverno-policy.yaml && kubectl get clusterpolicy", desc: "Apply an admission policy" },
];

const TOOLS = ["all", "docker", "crictl", "kubectl", "kubeadm", "etcdctl", "calicoctl", "security"];
const CATS = ["all", "Diagnostic", "Configuration", "Destructive"];

function CommandMatrix({ t }) {
  const [q, setQ] = useState("");
  const [tool, setTool] = useState("all");
  const [cat, setCat] = useState("all");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return COMMANDS.filter((c) => (tool === "all" || c.tool === tool) && (cat === "all" || c.cat === cat) && (!s || c.cmd.toLowerCase().includes(s) || c.desc.toLowerCase().includes(s)));
  }, [q, tool, cat]);
  const catStyle = { Diagnostic: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40", Configuration: "bg-amber-500/15 text-amber-300 border-amber-500/40", Destructive: "bg-rose-500/15 text-rose-300 border-rose-500/40" };
  return (
    <div className="space-y-4">
      <div className={`flex flex-wrap items-center gap-2 rounded-2xl border p-3 ${t.card}`}>
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.faint}`} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search commands or descriptions…" className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 ${t.input}`} />
        </div>
        <div className="flex flex-wrap gap-1">
          {TOOLS.map((x) => (
            <button key={x} onClick={() => setTool(x)} className={`rounded-md border px-2 py-1 text-xs font-medium ${tool === x ? t.tabActive : t.chip}`}>{x}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {CATS.map((x) => (
            <button key={x} onClick={() => setCat(x)} className={`rounded-md border px-2 py-1 text-xs font-medium ${cat === x ? t.tabActive : t.chip}`}>{x}</button>
          ))}
        </div>
      </div>
      <div className={`overflow-hidden rounded-2xl border ${t.card}`}>
        <div className={`grid grid-cols-[90px_110px_1fr_auto] gap-3 border-b px-4 py-2 text-[11px] font-semibold uppercase tracking-wider ${t.codeHeader}`}>
          <span>Tool</span><span>Category</span><span>Command</span><span></span>
        </div>
        {rows.length === 0 ? <div className={`px-4 py-8 text-center text-sm ${t.muted}`}>No commands match.</div> : null}
        {rows.map((c, i) => (
          <div key={i} className={`grid grid-cols-[90px_110px_1fr_auto] items-start gap-3 border-b px-4 py-2.5 last:border-b-0 ${t.divider}`}>
            <span className={`font-mono text-xs font-semibold ${t.accent}`}>{c.tool}</span>
            <span className={`inline-block w-fit rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${catStyle[c.cat]}`}>{c.cat}</span>
            <div>
              <code className="block break-all font-mono text-[12px]">{c.cmd}</code>
              <div className={`mt-0.5 text-xs ${t.muted}`}>{c.desc}</div>
            </div>
            <CopyButton text={c.cmd} t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================================
   REGISTRIES
   ==================================================================================== */
const ALL_MODULES = [...TRACK1_MODULES, ...TRACK2_MODULES, ...TRACK3_MODULES, ...TRACK4_MODULES];

const TRACKS = [
  { id: "docker", name: "Containers & Runtimes", short: "Docker / OCI", icon: Box, color: "text-sky-400" },
  { id: "cka", name: "Kubernetes Core (CKA)", short: "CKA Core", icon: Server, color: "text-violet-400" },
  { id: "cks", name: "Security & Hardening (CKS)", short: "CKS Security", icon: Shield, color: "text-rose-400" },
  { id: "beyond", name: "Beyond the Certifications", short: "Day-2 Ops", icon: Rocket, color: "text-emerald-400" },
];

const ICONS = {
  cpu: Cpu, harddrive: HardDrive, container: Container, package: Package, server: Server, workflow: Workflow,
  network: Network, layers: Layers, wrench: Wrench, shieldcheck: ShieldCheck, lock: Lock, fingerprint: Fingerprint,
  radar: Radar, gitbranch: GitBranch, activity: Activity, route: Route, gauge: Gauge, eye: Eye, database: Database,
};

const DIAGRAMS = {
  linuxHost: LinuxHostDiagram,
  overlayfs: OverlayFSDiagram,
  runtimeStack: RuntimeStackDiagram,
  dockerBuild: DockerBuildDiagram,
  clusterTopology: ClusterTopologyDiagram,
  podLifecycle: PodLifecycleDiagram,
  cniPacket: CNIPacketDiagram,
  workloadTopology: WorkloadTopologyDiagram,
  troubleshootingFlow: TroubleshootingFlowDiagram,
  securityBoundaries: SecurityBoundariesDiagram,
  supplyChain: SupplyChainDiagram,
  systemHardening: SystemHardeningDiagram,
  gitopsHighway: GitOpsHighwayDiagram,
  observability: ObservabilityDiagram,
  serviceMesh: ServiceMeshDiagram,
  gatewayApi: GatewayApiDiagram,
};

const SPECIAL_VIEWS = [
  { id: "playground", title: "Architecture Playground", subtitle: "Click components to inspect flags, logs and checks", icon: LayoutGrid },
  { id: "commands", title: "Command Cheat Sheet", subtitle: "docker • crictl • kubectl • kubeadm • etcdctl • calicoctl • security", icon: Terminal },
];

/* ====================================================================================
   MODULE VIEW — tabbed deep dive
   ==================================================================================== */
const TABS = [
  { id: "theory", label: "Theory & Architecture", icon: BookOpen },
  { id: "lab", label: "Interactive Lab", icon: FlaskConical },
  { id: "blueprints", label: "Production Blueprints", icon: FileCode2 },
];

/** Split a paragraph into sentence-level bullets. Sentence boundaries are a period, question or
 *  exclamation mark followed by whitespace and an upper-case letter, digit, quote or bracket, so
 *  abbreviations like "e.g." and version numbers like "v1.30" or "10.244.1.12" stay intact. */
function toBullets(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(`])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function BulletList({ items, t, size = "text-sm", color }) {
  return (
    <ul className="space-y-1.5">
      {items.map((s, i) => (
        <li key={i} className={`flex items-start gap-2 ${size} leading-relaxed ${color || ""}`}>
          <span className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${t.name === "dark" ? "bg-cyan-400" : "bg-cyan-600"}`} />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

function ModuleView({ mod, t, completed, onToggleComplete, bullets }) {
  const [tab, setTab] = useState("theory");
  const [doneSteps, setDoneSteps] = useState({});
  useEffect(() => { setTab("theory"); setDoneSteps({}); }, [mod.id]);
  const Diag = DIAGRAMS[mod.theory.diagram];
  const Icon = ICONS[mod.icon] || Box;
  const track = TRACKS.find((x) => x.id === mod.track);
  const stepsDone = Object.values(doneSteps).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl border p-5 ${t.card}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`rounded-xl border p-2.5 ${t.accentBg}`}><Icon size={22} /></div>
            <div>
              <div className={`text-[11px] font-semibold uppercase tracking-wider ${track?.color || t.faint}`}>{track?.name}</div>
              <h2 className={`text-2xl font-bold leading-tight ${t.heading}`}>{mod.title}</h2>
              <p className={`mt-1 text-sm ${t.muted}`}>{mod.subtitle}</p>
            </div>
          </div>
          <button onClick={onToggleComplete} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${completed ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : t.chip + " hover:opacity-80"}`}>
            {completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            {completed ? "Completed" : "Mark complete"}
          </button>
        </div>
        <div className={`mt-4 flex flex-wrap gap-1 border-t pt-4 ${t.divider}`}>
          {TABS.map((tb) => {
            const TIcon = tb.icon;
            return (
              <button key={tb.id} onClick={() => setTab(tb.id)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${tab === tb.id ? t.tabActive : t.tabIdle}`}>
                <TIcon size={15} /> {tb.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "theory" ? (
        <div className="space-y-5">
          <div className={`space-y-3 rounded-2xl border p-5 text-[15px] leading-relaxed ${t.card}`}>
            <h3 className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${t.accent}`}><BookOpen size={16} /> Overview</h3>
            {bullets
              ? <BulletList items={mod.theory.intro.flatMap(toBullets)} t={t} size="text-[15px]" />
              : mod.theory.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {Diag ? <Diag t={t} /> : null}
          <div className="grid gap-4 lg:grid-cols-2">
            {mod.theory.sections.map((s, i) => (
              <div key={i} className={`rounded-2xl border p-5 ${t.cardSoft}`}>
                <h3 className={`mb-2 text-base font-semibold ${t.heading}`}>{s.h}</h3>
                {bullets
                  ? <BulletList items={toBullets(s.p)} t={t} color={t.muted} />
                  : <p className={`text-sm leading-relaxed ${t.muted}`}>{s.p}</p>}
              </div>
            ))}
          </div>
          <div className={`rounded-2xl border p-5 ${t.card}`}>
            <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${t.accent}`}><ListChecks size={16} /> Key takeaways</h3>
            <ul className="grid gap-2 md:grid-cols-2">
              {mod.theory.keyPoints.map((k, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-emerald-400" /><span>{k}</span></li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "lab" ? (
        <div className="space-y-4">
          <div className={`rounded-2xl border p-5 ${t.card}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${t.accent}`}><FlaskConical size={16} /> Lab objective</h3>
                {bullets ? <div className="mt-2"><BulletList items={toBullets(mod.lab.objective)} t={t} size="text-[15px]" /></div> : <p className="mt-2 text-[15px] leading-relaxed">{mod.lab.objective}</p>}
              </div>
              <div className={`rounded-lg border px-3 py-2 text-xs font-semibold ${t.chip}`}>{stepsDone} / {mod.lab.steps.length} steps verified</div>
            </div>
            <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${t.progressTrack}`}>
              <div className={`h-full rounded-full transition-all ${t.progressFill}`} style={{ width: `${(stepsDone / mod.lab.steps.length) * 100}%` }} />
            </div>
          </div>
          {mod.lab.steps.map((s, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${t.cardSoft}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${doneSteps[i] ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300" : t.accentBg}`}>{i + 1}</div>
                  <h4 className={`text-base font-semibold ${t.heading}`}>{s.title}</h4>
                </div>
                <button onClick={() => setDoneSteps((d) => ({ ...d, [i]: !d[i] }))} className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${doneSteps[i] ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : t.chip}`}>
                  {doneSteps[i] ? <CheckCircle2 size={13} /> : <Circle size={13} />} {doneSteps[i] ? "Verified" : "Mark verified"}
                </button>
              </div>
              <TerminalBlock cmd={s.cmd} output={s.output} t={t} />
              {s.note ? (
                <div className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${t.panel}`}>
                  <Eye size={15} className={`mt-0.5 shrink-0 ${t.accent}`} />
                  <span className={t.muted}>{s.note}</span>
                </div>
              ) : null}
            </div>
          ))}
          <div className={`rounded-2xl border p-5 ${t.card}`}>
            <h3 className={`mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-400`}><CheckCircle2 size={16} /> Success criteria</h3>
            <ul className="space-y-2">
              {mod.lab.success.map((k, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-emerald-400" /><span>{k}</span></li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "blueprints" ? (
        <div className="space-y-4">
          {mod.blueprints.map((b, i) => <CodeBlock key={i} title={b.title} lang={b.lang} code={b.code} t={t} />)}
        </div>
      ) : null}
    </div>
  );
}

/* ====================================================================================
   SIDEBAR
   ====================================================================================*/
function Sidebar({ t, open, setOpen, query, setQuery, active, setActive, completed, filtered, expanded, setExpanded }) {
  const total = ALL_MODULES.length;
  const done = ALL_MODULES.filter((m) => completed[m.id]).length;
  const pct = Math.round((done / total) * 100);
  return (
    <aside className={`sticky top-0 flex h-screen shrink-0 flex-col border-r transition-all duration-200 ${t.sidebar} ${open ? "w-[300px]" : "w-[64px]"}`}>
      <div className={`flex items-center justify-between gap-2 border-b px-3 py-3 ${t.divider}`}>
        {open ? (
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 p-1.5 text-white"><Layers size={16} /></div>
            <div>
              <div className={`text-sm font-bold leading-tight ${t.heading}`}>Kubernetes (CKA + CKS)</div>
              <div className={`text-[10px] uppercase tracking-wider ${t.faint}`}>Docker • CKA • CKS • Day-2</div>
            </div>
          </div>
        ) : (
          <div className="mx-auto rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 p-1.5 text-white"><Layers size={16} /></div>
        )}
        <button onClick={() => setOpen(!open)} className={`rounded-md p-1.5 ${t.navIdle}`} title={open ? "Collapse sidebar" : "Expand sidebar"}>
          {open ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {open ? (
        <div className={`border-b px-3 py-3 ${t.divider}`}>
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.faint}`} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search modules…" className={`w-full rounded-lg border py-2 pl-9 pr-8 text-sm outline-none focus:ring-2 ${t.input}`} />
            {query ? <button onClick={() => setQuery("")} className={`absolute right-2 top-1/2 -translate-y-1/2 ${t.faint}`}><X size={14} /></button> : null}
          </div>
          <div className="mt-3">
            <div className={`flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider ${t.faint}`}>
              <span>Progress</span><span className={t.accent}>{done}/{total} • {pct}%</span>
            </div>
            <div className={`mt-1.5 h-2 w-full overflow-hidden rounded-full ${t.progressTrack}`}>
              <div className={`h-full rounded-full transition-all ${t.progressFill}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {SPECIAL_VIEWS.map((v) => {
          const VIcon = v.icon;
          const isActive = active === v.id;
          return (
            <button key={v.id} onClick={() => setActive(v.id)} title={v.title} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ${isActive ? t.navActive : t.navIdle}`}>
              <VIcon size={16} className="shrink-0" />
              {open ? <span className="truncate font-medium">{v.title}</span> : null}
            </button>
          );
        })}
        <div className={`my-2 border-t ${t.divider}`} />
        {TRACKS.map((tr) => {
          const mods = filtered.filter((m) => m.track === tr.id);
          if (query && mods.length === 0) return null;
          const TIcon = tr.icon;
          const trDone = ALL_MODULES.filter((m) => m.track === tr.id && completed[m.id]).length;
          const trTotal = ALL_MODULES.filter((m) => m.track === tr.id).length;
          const isExp = expanded[tr.id] !== false || Boolean(query);
          return (
            <div key={tr.id} className="mb-1">
              <button onClick={() => setExpanded((e) => ({ ...e, [tr.id]: !isExp }))} title={tr.name} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${t.navIdle}`}>
                <TIcon size={16} className={`shrink-0 ${tr.color}`} />
                {open ? (
                  <>
                    <span className="flex-1 truncate font-semibold">{tr.name}</span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${t.chip}`}>{trDone}/{trTotal}</span>
                    {isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </>
                ) : null}
              </button>
              {isExp && open ? (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-700/40 pl-2">
                  {mods.map((m) => {
                    const MIcon = ICONS[m.icon] || Box;
                    const isActive = active === m.id;
                    return (
                      <button key={m.id} onClick={() => setActive(m.id)} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition ${isActive ? t.navActive : t.navIdle}`}>
                        {completed[m.id] ? <CheckCircle2 size={14} className="shrink-0 text-emerald-400" /> : <MIcon size={14} className="shrink-0 opacity-70" />}
                        <span className="truncate">{m.title}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {isExp && !open ? (
                <div className="mt-0.5 space-y-0.5">
                  {mods.map((m) => {
                    const MIcon = ICONS[m.icon] || Box;
                    return (
                      <button key={m.id} onClick={() => setActive(m.id)} title={m.title} className={`flex w-full items-center justify-center rounded-md py-1.5 ${active === m.id ? t.navActive : t.navIdle}`}>
                        {completed[m.id] ? <CheckCircle2 size={14} className="text-emerald-400" /> : <MIcon size={14} className="opacity-70" />}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      {open ? (
        <div className={`border-t px-3 py-2 text-[10px] ${t.faint} ${t.divider}`}>
          {ALL_MODULES.length} modules • {Object.keys(DIAGRAMS).length} SVG diagrams • {COMMANDS.length} commands
        </div>
      ) : null}
    </aside>
  );
}

/* ====================================================================================
   ROOT COMPONENT
   ==================================================================================== */
export default function CloudNativeMasteryApp() {
  const [dark, setDark] = useState(true);
  const [bullets, setBullets] = useState(true);   // bullet-list vs prose rendering of theory text
  const t = dark ? THEMES.dark : THEMES.light;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("playground");
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return ALL_MODULES;
    return ALL_MODULES.filter((m) => {
      const hay = [m.title, m.subtitle, m.keywords, ...m.theory.intro, ...m.theory.sections.map((x) => x.h + " " + x.p), ...m.theory.keyPoints, m.lab.objective, ...m.lab.steps.map((x) => x.title), ...m.blueprints.map((x) => x.title)].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [query]);

  const activeModule = ALL_MODULES.find((m) => m.id === active);
  const activeSpecial = SPECIAL_VIEWS.find((v) => v.id === active);
  const toggleComplete = useCallback((id) => setCompleted((c) => ({ ...c, [id]: !c[id] })), []);

  const currentIndex = ALL_MODULES.findIndex((m) => m.id === active);
  const prev = currentIndex > 0 ? ALL_MODULES[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < ALL_MODULES.length - 1 ? ALL_MODULES[currentIndex + 1] : null;

  useEffect(() => {
    const el = document.getElementById("cnm-main");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }, [active]);

  return (
    <div className={`flex min-h-screen font-sans antialiased ${t.app}`}>
      <Sidebar t={t} open={sidebarOpen} setOpen={setSidebarOpen} query={query} setQuery={setQuery} active={active} setActive={setActive} completed={completed} filtered={filtered} expanded={expanded} setExpanded={setExpanded} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`sticky top-0 z-20 flex items-center justify-between gap-3 border-b px-5 py-3 ${t.header}`}>
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`rounded-md p-1.5 lg:hidden ${t.navIdle}`}><Menu size={18} /></button>
            <div className="min-w-0">
              <div className={`truncate text-sm font-semibold ${t.heading}`}>{activeModule ? activeModule.title : activeSpecial ? activeSpecial.title : "Kubernetes (CKA + CKS)"}</div>
              <div className={`truncate text-xs ${t.faint}`}>{activeModule ? activeModule.subtitle : activeSpecial ? activeSpecial.subtitle : ""}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {query ? <span className={`hidden rounded-md border px-2 py-1 text-xs sm:inline ${t.chip}`}>{filtered.length} match{filtered.length === 1 ? "" : "es"}</span> : null}
            <button onClick={() => setBullets(!bullets)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${bullets ? t.tabActive : t.chip} hover:opacity-80`} title="Toggle bullet-list / prose rendering">
              <ListChecks size={15} />
              <span className="hidden sm:inline">{bullets ? "Bullets" : "Prose"}</span>
            </button>
            <button onClick={() => setDark(!dark)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${t.chip} hover:opacity-80`} title="Toggle theme">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
              <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
            </button>
          </div>
        </header>

        <main id="cnm-main" className="flex-1 overflow-y-auto px-5 py-5 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            {active === "playground" ? (
              <div className="space-y-5">
                <div className={`rounded-2xl border p-5 ${t.card}`}>
                  <h2 className={`text-2xl font-bold ${t.heading}`}>Interactive Architecture Playground</h2>
                  <p className={`mt-1 text-sm ${t.muted}`}>A three-node kubeadm topology. Click any component in the diagram to load its critical flags, log and config locations, and the exact verification commands you would run during an incident or an exam task.</p>
                </div>
                <ArchitecturePlayground t={t} />
              </div>
            ) : null}
            {active === "commands" ? (
              <div className="space-y-5">
                <div className={`rounded-2xl border p-5 ${t.card}`}>
                  <h2 className={`text-2xl font-bold ${t.heading}`}>Global Command Cheat Sheet</h2>
                  <p className={`mt-1 text-sm ${t.muted}`}>Searchable matrix across the container and Kubernetes toolchain. Destructive commands are flagged — read them twice before pasting into a production terminal.</p>
                </div>
                <CommandMatrix t={t} />
              </div>
            ) : null}
            {activeModule ? (
              <>
                <ModuleView mod={activeModule} t={t} bullets={bullets} completed={Boolean(completed[activeModule.id])} onToggleComplete={() => toggleComplete(activeModule.id)} />
                <div className={`mt-6 flex items-center justify-between gap-3 border-t pt-4 ${t.divider}`}>
                  {prev ? (
                    <button onClick={() => setActive(prev.id)} className={`inline-flex max-w-[48%] items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${t.chip} hover:opacity-80`}>
                      <ChevronRight size={15} className="rotate-180 shrink-0" /><span className="truncate">{prev.title}</span>
                    </button>
                  ) : <span />}
                  {next ? (
                    <button onClick={() => setActive(next.id)} className={`inline-flex max-w-[48%] items-center gap-2 rounded-lg border px-3 py-2 text-right text-sm ${t.chip} hover:opacity-80`}>
                      <span className="truncate">{next.title}</span><ChevronRight size={15} className="shrink-0" />
                    </button>
                  ) : <span />}
                </div>
              </>
            ) : null}
            {!activeModule && !activeSpecial ? (
              <div className={`rounded-2xl border p-8 text-center ${t.card}`}>
                <AlertTriangle size={28} className="mx-auto text-amber-400" />
                <p className={`mt-3 ${t.muted}`}>Select a module from the sidebar.</p>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
