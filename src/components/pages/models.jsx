import React from "react";
import { Cpu, Database, ExternalLink, Download, Sparkles } from "lucide-react";

const Models = () => {
  const models = [
    {
      name: "BanglaBERT v2",
      type: "Language Model",
      description:
        "A transformer-based masked language model pre-trained on 50GB of Bangla text including Common Crawl, news, and Wikipedia.",
      metrics: ["85.6% F1 (NER)", "92.3% Accuracy (Sentiment)"],
      size: "355M parameters",
      links: {
        hf: "#",
        paper: "#",
      },
    },
    {
      name: "VisionMix",
      type: "Multimodal Model",
      description:
        "Lightweight vision-language encoder fine-tuned on Bangla meme and caption datasets for multimodal understanding.",
      metrics: ["93.1% Accuracy (Meme Safety)", "Zero-shot support"],
      size: "280M parameters",
      links: {
        hf: "#",
        paper: "#",
      },
    },
    {
      name: "GraphSent",
      type: "Graph Neural Network",
      description:
        "Aspect-based sentiment model combining textual embeddings and graph-based node relations to model dependency and context.",
      metrics: ["+4.2% macro-F1 vs baselines"],
      size: "220M parameters",
      links: {
        hf: "#",
        paper: "#",
      },
    },
    {
      name: "DocQA",
      type: "Question Answering",
      description:
        "Retriever-reader architecture fine-tuned on Bangla government and financial document QA datasets with RAG capabilities.",
      metrics: ["78.4% EM", "83.9% F1 (DocQA)"],
      size: "410M parameters",
      links: {
        hf: "#",
        paper: "#",
      },
    },
  ];

  return (
    <div className="font-[Manrope] font-medium text-slate-800">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-600 font-medium">
            Models
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-slate-900">
            Open & Reproducible AI for Bangla
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Foundation and fine-tuned models for low-resource NLP, vision-language tasks,
            and domain-specific R&D — built for transparency and impact.
          </p>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 text-cyan-600 font-medium text-sm">
                  <Cpu className="h-4 w-4" />
                  {model.type}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {model.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{model.size}</p>
                <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                  {model.description}
                </p>

                <ul className="mt-4 space-y-1 text-sm text-gray-700">
                  {model.metrics.map((m, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-600" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {model.links.hf && (
                  <a
                    href={model.links.hf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Hugging Face <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {model.links.paper && (
                  <a
                    href={model.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Read Paper <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center bg-gray-50 border-t mt-12">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
          Want to Use or Fine-Tune Our Models?
        </h2>
        <p className="text-gray-600 mb-6">
          We provide API access, evaluation harnesses, and collaboration for academic or
          industry use.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 mx-auto">
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default Models;
