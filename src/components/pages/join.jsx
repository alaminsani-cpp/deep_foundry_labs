import React from "react";
import { ArrowRight, Users, Briefcase, GraduationCap, Mail } from "lucide-react";

const Join = () => {
  const opportunities = [
    {
      title: "Research Collaborations",
      icon: Users,
      desc: "Partner with us on funded or exploratory AI research across NLP, multimodal learning, and low-resource computing.",
      bullets: [
        "Academic or industry research projects",
        "Co-authored publications",
        "Joint proposals and grants",
      ],
    },
    {
      title: "Engineering & Development",
      icon: Briefcase,
      desc: "Contribute to model implementation, dataset creation, or evaluation pipelines for cutting-edge AI research.",
      bullets: [
        "Full-stack ML development",
        "Data pipelines & benchmarking",
        "Open-source contributions",
      ],
    },
    {
      title: "Internships & Mentorship",
      icon: GraduationCap,
      desc: "Join as a student researcher or developer and gain real-world AI research experience under expert mentorship.",
      bullets: [
        "Structured learning goals",
        "Mentor-guided projects",
        "Publication-oriented outcomes",
      ],
    },
  ];

  return (
    <div className="font-[Manrope] font-medium text-slate-800">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-600 font-medium">
            Join Us
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-slate-900">
            Build the Future of Responsible AI
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            DeepFoundry Labs is a collaborative space for researchers, engineers, and students
            passionate about open and reproducible AI innovation.
          </p>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((o, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 text-cyan-600">
                  <o.icon className="h-6 w-6" />
                  <h3 className="text-lg font-semibold text-gray-900">{o.title}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">{o.desc}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {o.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full"></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call for Interest Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900">
              Expression of Interest
            </h2>
            <p className="mt-3 text-gray-600">
              Tell us a bit about yourself — we’ll reach out if there’s a match with
              current openings or collaborations.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <input
              type="text"
              placeholder="Affiliation / Institution"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option>Area of Interest</option>
              <option>Research Collaboration</option>
              <option>Engineering / Development</option>
              <option>Internship / Mentorship</option>
            </select>

            <textarea
              rows="5"
              placeholder="Tell us about your experience or interest"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            ></textarea>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">contact@deepfoundrylabs.com</span>
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Submit <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-gray-50 border-t mt-12">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
          Collaborate, Learn, and Grow With Us
        </h2>
        <p className="text-gray-600 mb-6">
          Whether you’re an academic, developer, or student — we’re always open to meaningful collaboration.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 mx-auto">
          <Mail className="h-4 w-4" />
          Get in Touch
        </button>
      </section>
    </div>
  );
};

export default Join;
