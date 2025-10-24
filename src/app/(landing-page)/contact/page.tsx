"use client";

import { Button } from "@/components/ui";
import Form from "next/form";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen">
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 items-center pt-14 pb-10 content-center">
        {/* column 1 */}
        <section className="max-w-lg mx-auto">
          {/* Intro */}
          <div>
            <h1 className="text-4xl font-bold font-sora">Contact Us</h1>
            <p className="my-5 font-manrope text-base">
              We’d love to hear from you. Whether you have a question, feedback,
              or just want to say hi, our pond is always open.
            </p>
          </div>

          {/* Direct Contact */}
          <div>
            <h3 className="text-lg font-medium mb-2">Prefer direct contact?</h3>
            <p className="flex items-center">
              <span className="block h-5 w-[3px] bg-accent-button rounded-full mr-3" />
              <Mail className="w-5 h-5 shrink-0 mr-1" />

              <Link
                href="mailto:ogbuolilian@gmail.com"
                className="hover:underline font-medium transition-colors duration-200"
              >
                ogbuolilian@gmail.com
              </Link>
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <Link
                href="https://twitter.com/yourtwitterhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <span>X (Twitter)</span>
              </Link>

              <span>•</span>

              <Link
                href="https://linkedin.com/in/yourlinkedin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Form column 2*/}
        <section className="w-full max-w-lg mx-auto bg-white/80 shadow-md rounded-2xl p-10 border border-gray-100">
          <h2 className="text-xl font-medium mb-4">Send a message</h2>

          <Form
            action="/contact"
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                placeholder="Write your message here..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none"
              />
            </div>
            <div className="text-right">
              <Button
                type="submit"
                href="/waitlist"
                size="lg"
                aria-label="Sign up for FocusPond"
                className="relative overflow-hidden font-semibold group"
              >
                <span className="relative z-10">Send Message</span>
                <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </Form>
        </section>
      </div>
    </div>
  );
}
