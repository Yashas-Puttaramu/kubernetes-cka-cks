# Kubernetes (CKA + CKS)

An interactive, single-file React encyclopedia for Docker/OCI internals, the **CKA** and **CKS** curricula, and Day-2 cloud-native operations (GitOps, observability, service mesh, Gateway API, Helm). Every diagram is hand-built SVG; every lab step has a real command with expected output; every blueprint is a complete, valid manifest you can copy straight into a cluster.

> Live demo: `https://<your-username>.github.io/kubernetes-cka-cks/` (after enabling GitHub Pages — see below)

## What's inside

| Track                          | Modules                                                                                                                                                                                     | Diagrams                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Containers & Runtimes**      | Namespaces & cgroups v2 · OverlayFS · containerd / CRI-O / runc · Production Dockerfiles                                                                                                    | Linux host cross-section, OverlayFS copy-on-write, runtime stack, image pipeline                                                  |
| **Kubernetes Core (CKA)**      | Control plane internals · Kubelet & pod lifecycle · Cluster networking · Workloads & storage · Troubleshooting scenarios                                                                    | Cluster topology + API request path, CRI/CNI/CSI lifecycle, VXLAN packet anatomy, scheduler/topology spread, troubleshooting flow |
| **Security & Hardening (CKS)** | CIS / TLS / API server hardening · AppArmor, seccomp & capabilities · Supply chain (Cosign, Trivy, Kyverno, Gatekeeper) · RBAC, PSS & NetworkPolicy · Runtime security (audit logs & Falco) | Security boundaries, supply chain, syscall gating                                                                                 |
| **Beyond the Certifications**  | GitOps (ArgoCD / Flux / Argo Rollouts) · Observability (Prometheus, OpenTelemetry, Loki, Tempo) · Service mesh (Istio ambient vs sidecar) · Gateway API vs Ingress · Production Helm charts | GitOps & telemetry highway, observability internals, mesh architectures, Gateway API object model                                 |

Every module has three tabs:

- **Theory & Architecture** — bullet-point explanations (toggle to prose), the SVG diagram, and key takeaways.
- **Interactive Lab** — step-by-step commands with mock terminal output, notes on what to look for, a per-step "verified" checkbox and success criteria.
- **Production Blueprints** — fully commented YAML / Dockerfile / TOML / HCL / Rego, each with a copy button.

Plus two cross-cutting views:

- **Architecture Playground** — click any component of a three-node kubeadm cluster (API server, etcd, scheduler, controller-manager, kubelet, kube-proxy, containerd, CNI, CoreDNS) to see its critical flags, log/config paths and verification commands.
- **Command Cheat Sheet** — 69 commands across `docker`, `crictl`, `kubectl`, `kubeadm`, `etcdctl`, `calicoctl`/`cilium` and security tooling, filterable by tool, category (Diagnostic / Configuration / Destructive) and free text.

Totals: 19 modules · 16 diagrams · 112 lab steps · 38 blueprints · 69 commands.

## Features

- Global search across titles, keywords, theory text, lab steps and blueprint names
- Progress tracking per track and overall, with "mark complete" on each module
- Dark / light theme toggle (self-contained — no Tailwind `darkMode` config needed)
- Bullets / prose toggle for all explanatory text
- Copy-to-clipboard on every code block, terminal command and verification command
- Collapsible sidebar with per-track counters; prev / next module navigation
- Zero backend — runs entirely in the browser as a static site

## Tech stack

- [React 18+](https://react.dev) (functional components, hooks only)
- [Tailwind CSS](https://tailwindcss.com) for styling
- [lucide-react](https://lucide.dev) for icons
- [Vite](https://vite.dev) for dev server and build

No charting, diagramming or state-management libraries — all visuals are inline SVG.

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/yashas-puttaramu/kubernetes-cka-cks.git
cd kubernetes-cka-cks
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

### Production build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serves dist/ locally to verify
```

## Deploying to GitHub Pages

1. In `vite.config.js` set `base: "/kubernetes-cka-cks/"` (match your repository name).
2. Keep the workflow in `.github/workflows/deploy.yml` (builds on every push to `main` and publishes `dist/`).
3. In the repository settings go to **Pages → Source** and choose **GitHub Actions**.

Vercel and Netlify also detect the Vite project automatically; for those, leave `base` unset.

## Project structure

```
kubernetes-cka-cks/
├── index.html
├── vite.config.js
├── package.json
├── .github/workflows/deploy.yml     # GitHub Pages deployment
└── src/
    ├── main.jsx                     # React entry point
    ├── App.jsx                      # renders <CloudNativeMasteryApp />
    ├── index.css                    # @import "tailwindcss";
    └── CloudNativeMasteryApp.jsx    # the entire application (≈7,000 lines)
```

Inside `CloudNativeMasteryApp.jsx` the code is organised top-down:

1. Theme tokens, clipboard helper, `CodeBlock` / `TerminalBlock`
2. SVG primitives (`Diagram`, `Node`, `Zone`, `Edge`, `Label`) with shared gradients, arrow markers and animations
3. Diagrams and module data for Track 1 → Track 4
4. `ArchitecturePlayground` and its component database
5. `CommandMatrix` and the command list
6. Registries (`ALL_MODULES`, `TRACKS`, `DIAGRAMS`, `ICONS`)
7. `ModuleView`, `Sidebar` and the root `CloudNativeMasteryApp` component

## Customising

- **Add a module** — append an object to the relevant `TRACKx_MODULES` array following the existing shape (`theory`, `lab`, `blueprints`). Reference a diagram key from `DIAGRAMS` or add a new diagram component.
- **Add a command** — push an entry onto `COMMANDS` with `tool`, `cat` and `desc`.
- **Add a playground component** — add a key to `PLAYGROUND_COMPONENTS` and a clickable `<Node onClick={sel("key")}>` in `ArchitecturePlayground`.
- **Default to prose instead of bullets** — change `useState(true)` to `useState(false)` for the `bullets` state in the root component.
- **Persist progress across reloads** — wrap the `completed` state in a `localStorage` read/write; state is intentionally in-memory by default.

## Notes on the security track

The CKS track is written from a defensive point of view: hardening checklists, policy enforcement, and detection tooling. Lab steps verify that controls are active using benign actions (for example a `kubectl exec` to confirm a Falco rule fires) rather than attack walkthroughs.

## License

© 2026 Yashas Puttaramu. All rights reserved. You may view and run this project for personal learning; redistribution or modification requires written permission. Content is provided for learning purposes; always validate commands against your own environment before running them in production.
