import React from 'react';
import { ArrowRight, FlaskConical, Database, Cpu, Lightbulb, FileText, CheckCircle2, Shield, Timer, Sparkles } from 'lucide-react';
import { useEffect } from "react";

const Home = () => {
  const services = [
    {
      icon: FlaskConical,
      title: "AI/ML/NLP R&D",
      desc: "Custom research in multimodal sentiment, document intelligence, moderation, and healthcare AI with publishable rigor.",
      bullets: ["Problem formalization", "SOTA scan & baselines", "Modeling & eval"],
    },
    {
      icon: Database,
      title: "Dataset Creation",
      desc: "Domain-specific corpora and annotation pipelines (Bangla, finance, healthcare, low-resource).",
      bullets: ["Schema & guidelines", "QA & agreement", "Data cards"],
    },
    {
      icon: Cpu,
      title: "Prototype Building",
      desc: "LLM pipelines (RAG/agents), vision-language solutions, graph AI, and recommender PoCs.",
      bullets: ["PoC APIs", "Eval harness", "Deployment roadmap"],
    },
    {
      icon: Lightbulb,
      title: "Innovation Labs",
      desc: "Dedicated pods acting as your external research division with quarterly roadmaps.",
      bullets: ["Pods & sprints", "Security & governance", "IP pipeline"],
    },
    {
      icon: FileText,
      title: "Publications & IP",
      desc: "Whitepapers, academic submissions, and provisional patents from funded R&D.",
      bullets: ["Positioning & ablations", "Writing & artifacts", "IP review"],
    },
  ];

  const cases = [
    {
      tag: "Safety & Security",
      title: "MaskNet: Crime Event Detection",
      result: "97.69% accuracy on Bengali crime dataset",
      blurb: "Dynamic attention + feature masking in Transformer models for real-world analytics.",
    },
    {
      tag: "Media Integrity",
      title: "Vision-Language Meme Classifier",
      result: "Robust harmful-content detection",
      blurb: "OCR + CLIP-style embeddings with safety probes for meme understanding.",
    },
    {
      tag: "Customer Analytics",
      title: "Graph-based Sentiment",
      result: "Improved macro-F1 vs baselines",
      blurb: "Aspect-aware heterogeneous GNN with memory and biaffine attention.",
    },
  ];

  useEffect(() => {
    const canvas = document.getElementById("llm-graph");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);
      
      // Recalculate layout after resize
      updateLayout();
    }

    let layers = [2, 5, 5, 5, 2];
    let nodes = [];
    let connections = [];
    let spacingX, spacingY, maxNodes;

    function updateLayout() {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const nodeRadius = 6;

      maxNodes = Math.max(...layers);

      // Use tighter spacing and minimal padding to fill canvas
      const paddingX = width * 0.08;   // small horizontal margin (~8%)
      const paddingY = height * 0.08;  // small vertical margin (~8%)

      spacingX = (width - paddingX * 2) / (layers.length - 1);
      spacingY = (height - paddingY * 2 - nodeRadius * 2) / (maxNodes - 1);

      nodes = [];
      layers.forEach((count, layerIndex) => {
        // Height occupied by this layer only
        const layerHeight = (count - 1) * spacingY;
        
        // Center offset to vertically center this layer
        const startY = (height - layerHeight) / 2;
        
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: paddingX + spacingX * layerIndex,
            y: startY + i * spacingY,
            layer: layerIndex,
            lit: false,
          });
        }
      });

      connections = [];
      nodes.forEach((n1) => {
        nodes.forEach((n2) => {
          if (n2.layer === n1.layer + 1) {
            connections.push({ from: n1, to: n2, progress: 0 });
          }
        });
      });
    }

    resize();
    window.addEventListener("resize", resize);

    let phase = 0;

    function draw() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.lineWidth = 1;

      // Draw connections
      for (const conn of connections) {
        const { from, to, progress } = conn;
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, "rgba(56,189,248,0.1)");
        grad.addColorStop(progress, "rgba(56,189,248,0.8)");
        grad.addColorStop(1, "rgba(56,189,248,0.1)");
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }

      // Draw nodes with variable intensity
      for (const n of nodes) {
        const glow = n.lit; // Now n.lit is a number between 0 and 1
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 8);
        gradient.addColorStop(0, `rgba(56,189,248,${glow})`);
        gradient.addColorStop(1, "rgba(56,189,248,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function update() {
      phase += 0.01;

      // Light up layers progressively with gradient falloff
      nodes.forEach((n) => {
        const wavePosition = Math.sin(phase - n.layer * 0.8);
        
        // Calculate intensity based on wave position
        if (wavePosition > 0.7) {
          n.lit = 1; // Brightest - current active layer
        } else if (wavePosition > 0.4) {
          n.lit = 0.3; // Dim glow - previous layer fading out
        } else {
          n.lit = 0.1; // Very dim - inactive
        }
      });

      // Animate connection progress
      connections.forEach((c) => {
        const wavePosition = Math.sin(phase - c.from.layer * 0.8);
        c.progress = wavePosition > 0.6 ? (wavePosition - 0.6) / 0.4 : 0;
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Hero Section */}
      <section className="-mt-8 md:-mt-12 lg:-mt-16 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">
              Corporate AI R&D-as-a-Service
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
              Your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                External Research Division
              </span>
              , On Demand
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl">
              We turn cutting-edge AI research into production-ready prototypes: multimodal sentiment, document intelligence, content safety, healthcare AI, and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center gap-2">
                Work With Us <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800/30 transition text-gray-300">
                See Case Studies
              </button>
            </div>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, text: "NDA & IP Safe" },
                { icon: Timer, text: "4–8 Week PoCs" },
                { icon: CheckCircle2, text: "Publishable Rigor" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3 text-sm">
                  <Icon className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-200">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Neural Graph Animation — visible only on large screens */}
          <div className="relative hidden lg:flex items-center justify-center px-4 sm:px-6 md:px-8">
            <div
              className="
                relative w-[120%] sm:w-[130%] md:w-[135%] lg:w-[145%]
                max-w-none overflow-visible flex justify-center items-center
                translate-x-6 sm:translate-x-10 md:translate-x-12
                -translate-y-4 sm:-translate-y-6 md:-translate-y-8
                scale-[1.15] sm:scale-[1.2] md:scale-[1.25]
              "
            >
              <canvas
                id="llm-graph"
                className="rounded-3xl w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/9]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Research Expertise",
              desc: "IEEE/Elsevier/ACM track record across NLP, multimodal, and graph AI.",
            },
            {
              title: "Rapid Prototyping",
              desc: "Idea → Baseline → PoC in weeks with clear metrics and guardrails.",
            },
            {
              title: "Trusted & Secure",
              desc: "NDA-first, IP-safe development with privacy, safety, and governance.",
            }
          ].map((f) => (
            <div key={f.title} className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-medium text-white mb-3">{f.title}</h3>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">What We Do</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-medium text-white">R&D Services</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            End-to-end research, data engines, and deployable prototypes tailored to your business problems.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-900/30 text-cyan-400">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">{s.desc}</p>
              <ul className="space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      {/* <section className="py-16">
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">Who We Serve</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-medium text-white">Industries</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Finance", "Healthcare", "Media", "AgriTech"].map((ind) => (
            <div key={ind} className="rounded-2xl border border-gray-700 bg-gray-800/30 py-8 text-center font-medium hover:shadow-md transition-shadow text-white">
              {ind}
            </div>
          ))}
        </div>
      </section> */}

      {/* Case Studies Section */}
      {/* <section className="py-16">
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">Proof of Value</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-medium text-white">Case Studies</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div key={c.title} className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <span className="text-sm font-medium text-cyan-400">{c.tag}</span>
              <h3 className="text-xl font-medium text-white mt-2 mb-3">{c.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{c.blurb}</p>
              <p className="text-sm text-gray-200">
                <span className="font-medium">Result:</span>{' '}
                <span className="text-emerald-400 font-medium">{c.result}</span>
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* About Section */}
      <section className="py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">About</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-medium text-white">
              From Research to Real-World Impact
            </h2>
            <p className="mt-6 text-gray-300">
              We are researchers and engineers who bridge academic rigor with product pragmatism. Our expertise spans multimodal AI, sentiment/emotion analysis, graph learning, and low-resource NLP.
            </p>
            <ul className="mt-6 space-y-3 text-gray-200">
              {[
                "IEEE/Elsevier/ACM publications",
                "Bangla & Global South focus",
                "Evaluation-first culture",
                "Responsible AI by default"
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-3xl border border-gray-700 bg-gray-800/30 p-8 shadow-lg">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { value: "4–8", label: "Week PoCs" },
                { value: "IP", label: "Papers & Patents" },
                { value: "NDA", label: "Security-first" },
                { value: "SLA", label: "Clear Deliverables" }
              ].map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-gray-800/50">
                  <div className="text-3xl font-medium text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">Contact</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-medium text-white">
              Let's Build Your Next Breakthrough
            </h2>
            <p className="mt-4 text-gray-300">
              Tell us about your problem. We'll scope a fast PoC or set up an Innovation Lab.
            </p>
          </div>
          
          <div className="space-y-6 bg-gray-800/30 border border-gray-700 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your name"
                className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Work email"
                className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
              />
            </div>
            <input
              type="text"
              placeholder="Organization"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
            />
            <textarea
              placeholder="What problem are you trying to solve?"
              rows="5"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
            ></textarea>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">info@deepfoundrylabs.com</span>
              <button
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
              >
                Submit <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;