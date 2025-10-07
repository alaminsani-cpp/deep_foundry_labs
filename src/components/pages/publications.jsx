import React from "react";
import { FileText, ExternalLink, Code } from "lucide-react";

const Publications = () => {
  const papers = [
    {
      title: "MaskNet: Context-Aware Transformer for Crime Event Detection in Bangla",
      authors: "Rahman, A., Sani, A., et al.",
      venue: "IEEE Access, 2024",
      abstract:
        "Introduces a multimodal Transformer architecture combining attention masking and text-image fusion for event detection in low-resource languages.",
      links: {
        paper: "#",
        code: "#",
      },
    },
    {
      title: "GraphSent: Aspect-Based Sentiment Graph Neural Network for Finance Text",
      authors: "Sani, A., Hasan, T., et al.",
      venue: "Elsevier Expert Systems with Applications, 2023",
      abstract:
        "Presents a heterogeneous GNN integrating sentiment lexicons and aspect embeddings to improve F1 scores on financial news datasets.",
      links: {
        paper: "#",
        code: "#",
      },
    },
    {
      title: "MemeCLIP: Vision-Language Model for Harmful Content Detection",
      authors: "Chowdhury, N., Sani, A., et al.",
      venue: "ACM Multimedia Asia, 2023",
      abstract:
        "Proposes a lightweight CLIP-based meme classification model for detecting misinformation and hate speech with vision-text alignment.",
      links: {
        paper: "#",
        code: "#",
      },
    },
    {
      title: "BanglaDocQA: Low-Resource Question Answering Dataset for Government Documents",
      authors: "Khan, R., Sani, A., et al.",
      venue: "arXiv Preprint, 2025",
      abstract:
        "Creates a domain-specific QA dataset for Bangla documents and benchmarks existing transformer models for retrieval-based QA.",
      links: {
        paper: "#",
        code: "#",
      },
    },
  ];

  return (
    <div className="font-[Manrope] font-medium text-slate-800">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-600 font-medium">
            Publications
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-slate-900">
            Research That Pushes Boundaries
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Peer-reviewed research, datasets, and open-source contributions that advance AI in Bangla and low-resource settings.
          </p>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {papers.map((paper, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 text-cyan-600 font-medium text-sm">
                  <FileText className="h-4 w-4" />
                  {paper.venue}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {paper.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{paper.authors}</p>
                <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                  {paper.abstract}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {paper.links.paper && (
                  <a
                    href={paper.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Read Paper <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {paper.links.code && (
                  <a
                    href={paper.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    View Code <Code className="h-4 w-4" />
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
          Want to Collaborate on Research?
        </h2>
        <p className="text-gray-600 mb-6">
          We actively co-author, mentor, and publish with academic and industry partners.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 mx-auto">
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default Publications;
