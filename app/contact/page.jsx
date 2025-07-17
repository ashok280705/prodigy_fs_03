"use client";

export default function ContactPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-green-200">
        <h1 className="text-4xl font-bold text-green-700 mb-2 text-center">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          We'd love to hear from you! Fill out the form below and we’ll get back to you as soon as possible.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              required
              className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              required
              className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              placeholder="Your message"
              rows="5"
              required
              className="w-full border border-green-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Or reach us at{" "}
          <a
            href="mailto:support@prodigystore.com"
            className="text-green-600 hover:underline"
          >
            support@prodigystore.com
          </a>
        </div>
      </div>
    </main>
  );
}