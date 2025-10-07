import React from "react";
import { Database, Download, ExternalLink, FileSpreadsheet, Sparkles } from "lucide-react";

const Datasets = () => {
  const datasets = [
    {
      name: "BanglaDocQA",
      domain: "Question Answering",
      description:
        "A 120k-sample corpus for Bangla government and financial documents. Designed for retrieval-augmented QA and domain-specific comprehension tasks.",
      size: "1.8 GB",
      year: 2025,
      license: "CC BY-NC 4.0",
      metrics: ["OCR processed", "Paragraph-level QA pairs", "Evaluation splits"],
      links: {
        download: "#",
        paper: "#",
      },
    },
    {
      name: "BanglaMeme Safety Dataset",
      domain: "Vision-Language Safety",
      description:
        "A multimodal dataset with 30k Bangla memes labeled for hate, misinformation, and offensive content. Includes image-text pairs and toxicity scores.",
      size: "3.5 GB",
      year: 2024,
      license: "CC BY-NC-SA 4.0",
      metrics: ["Image-text pairs", "5-class safety labels", "Balanced classes"],
      links: {
        download: "#",
        paper: "#",
      },
    },
    {
      name: "BanglaSentFi",
      domain: "Financial Sentiment Analysis",
      description:
        "Annotated 50k Bangla financial news articles and reports labeled for positive, negative, and neutral sentiment. Used for GraphSent and FinBERT-BN.",
      size: "2.1 GB",
      year: 2023,
      license: "CC BY-SA 4.0",
      metrics: ["Triple sentiment labels", "Industry segmentation", "NER-compatible schema"],
      links: {
        download: "#",
        paper: "#",
      },
    },
    {
      name: "BanglaEmotionSpeech",
      domain: "Speech Emotion Recognition",
      description:
        "4,000+ Bangla speech samples annotated for six emotions (happy, sad, angry, neutral, fear, surprise). Useful for affective computing and ASR fine-tuning.",
      size: "5.2 GB",
      year: 2023,
      license: "CC BY 4.0",
      metrics: ["6 emotion classes", "Balanced gender distribution", "16kHz WAV format"],
      links: {
        download: "#",
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
            Datasets
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-slate-900">
            Open Datasets for Low-Resource AI
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Curated, annotated, and quality-controlled datasets for advancing research in Bangla and other low-resource languages — across text, vision, and speech.
          </p>
        </div>
      </section>

      {/* Datasets Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {datasets.map((ds, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 text-cyan-600 font-medium text-sm">
                  <Database className="h-4 w-4" />
                  {ds.domain}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {ds.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {ds.year} • {ds.size} • {ds.license}
                </p>
                <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                  {ds.description}
                </p>

                <ul className="mt-4 space-y-1 text-sm text-gray-700">
                  {ds.metrics.map((m, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-600" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {ds.links.download && (
                  <a
                    href={ds.links.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Download <Download className="h-4 w-4" />
                  </a>
                )}
                {ds.links.paper && (
                  <a
                    href={ds.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Read Paper <ExternalLink className="h-4 w-4" />
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
          Want to Contribute or Use Our Datasets?
        </h2>
        <p className="text-gray-600 mb-6">
          We welcome collaborations and dataset contributions under open science guidelines.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 mx-auto">
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default Datasets;
