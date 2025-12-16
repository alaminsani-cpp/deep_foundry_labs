import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is DeepFoundry Labs?",
      answer:
        "DeepFoundry Labs is an applied AI R&D organization that builds prototypes, datasets, and publishable research for partners across industries such as healthcare, finance, and media.",
    },
    {
      question: "Can I collaborate on a research project?",
      answer:
        "Yes. We regularly collaborate with academic labs, startups, and enterprises. You can propose a research topic or join one of our existing R&D programs.",
    },
    {
      question: "Do you release your datasets and models publicly?",
      answer:
        "Some datasets and models are open-access under research-friendly licenses, while others are under partner NDAs. Visit our Datasets and Models sections for availability.",
    },
    {
      question: "What’s the typical duration of a PoC or research sprint?",
      answer:
        "Our Proof-of-Concept projects usually take 4–8 weeks, depending on problem complexity, data readiness, and evaluation scope.",
    },
    {
      question: "How do you handle intellectual property (IP)?",
      answer:
        "We operate under NDA-first agreements where all outputs, data, and IP rights remain with the client unless otherwise negotiated.",
    },
    {
      question: "What domains do you specialize in?",
      answer:
        "We specialize in multimodal learning, NLP, graph AI, content safety, document intelligence, and healthcare analytics — with strong experience in low-resource languages.",
    },
    {
      question: "Can students or researchers join DeepFoundry Labs?",
      answer:
        "Absolutely. We have a Join page where you can apply for research internships, remote collaborations, and open lab positions.",
    },
    {
      question: "Do you publish academic papers?",
      answer:
        "Yes. Our work has appeared in IEEE, Elsevier, and ACM venues. We also co-author with partners when projects yield novel findings.",
    },
  ];

  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">
            FAQ
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Answers to the most common questions about our research model, collaboration,
            and open resources.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 bg-gray-800/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-lg font-medium text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-cyan-400 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-20 bg-gray-800/30 border-t border-gray-700 text-center">
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-300 mb-8">
          If you didn't find your answer here, feel free to reach out to us directly.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default FAQ;