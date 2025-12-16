import React from "react";
import { Mail, MapPin, Phone, ArrowRight, Linkedin, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <div className="font-[Manrope] font-medium text-gray-100 bg-gradient-to-b from-[#02081a] to-[#0a1025] min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs tracking-widest uppercase text-cyan-400 font-medium">
            Contact
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white">
            Let's Build the Next Breakthrough
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Whether you're a researcher, partner, or organization — we'd love to hear from you.  
            Reach out to collaborate, request datasets or models, or discuss new initiatives.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <Mail className="h-6 w-6 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Email</h3>
            <p className="text-gray-300 mt-2">contact@deepfoundrylabs.com</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <MapPin className="h-6 w-6 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Location</h3>
            <p className="text-gray-300 mt-2">Dhaka, Bangladesh</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <Phone className="h-6 w-6 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Phone</h3>
            <p className="text-gray-300 mt-2">+880 1794-301225</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto bg-gray-800/30 border border-gray-700 rounded-2xl p-8 shadow-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-white">
              Send Us a Message
            </h2>
            <p className="mt-3 text-gray-300">
              Fill out the form below and we'll respond within a few business days.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
              />
            </div>

            <input
              type="text"
              placeholder="Organization / Institution"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
            />

            <textarea
              rows="5"
              placeholder="Your message..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
            ></textarea>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">info@deepfoundrylabs.com</span>
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
              >
                Send Message <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 text-center bg-gray-800/30 border-t border-gray-700 mt-12">
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
          Stay Connected
        </h2>
        <p className="text-gray-300 mb-8">
          Follow us for research updates, dataset releases, and model benchmarks.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="#"
            className="p-3 rounded-full border border-gray-600 hover:bg-gray-700/50 transition"
          >
            <Linkedin className="h-5 w-5 text-gray-300 hover:text-white" />
          </a>
          <a
            href="#"
            className="p-3 rounded-full border border-gray-600 hover:bg-gray-700/50 transition"
          >
            <Twitter className="h-5 w-5 text-gray-300 hover:text-white" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;