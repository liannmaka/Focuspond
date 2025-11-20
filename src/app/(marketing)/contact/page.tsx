"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLinkedin } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";
import Footer from "../_components/Footer";

const ContactForm = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name is too long" }),
  email: z.email({ message: "Please enter a valid email address" }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must not exceed 1000 characters" }),
});

type FormValues = z.infer<typeof ContactForm>;

export default function ContactUsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(ContactForm),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      toast.success(result.message || "Message sent successfully!");
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] pt-14">
      <div className="flex pb-10">
        <div className="grid gap-y-12 lg:grid-cols-2 gap-x-4 lg:gap-12 items-center content-center">
          {/* column 1 */}
          <section className="max-w-lg mx-auto">
            {/* Intro */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-sora lg:text-4xl">Contact Us</h1>
              <p className="my-5 font-manrope text-[15px] text-dark-accent/90">
                We&apos;d love to hear from you. Whether you have a question,
                feedback, or just want to say hi, our pond is always open.
              </p>
            </div>

            {/* Direct Contact */}
            <div>
              <h3 className="font-medium mb-2 text-center font-sora lg:text-left">
                Prefer direct contact?
              </h3>
              <p className="flex items-center justify-center lg:justify-start">
                <span className="block h-5 w-[3px] bg-accent-button rounded-full mr-3" />
                <Mail className="w-5 h-5 shrink-0 mr-1" />
                <a
                  href="mailto:ogbuolilian@gmail.com"
                  className="hover:underline font-medium text-xs transition-colors duration-200 font-sora"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ogbuolilian@gmail.com
                </a>
              </p>
              <div className="mt-4 flex gap-2 text-base items-center justify-center lg:justify-start">
                <a
                  href="https://x.com/filix_lillyann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-[#ff9472] hover:text-[#ff7f50]"
                  aria-label="Twitter"
                >
                  <RiTwitterXFill />
                </a>

                <a
                  href="https://www.linkedin.com/in/ogbuo-chiamaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-[#ff9472] hover:text-[#ff7f50]"
                  aria-label="LinkedIn"
                >
                  <LuLinkedin />
                </a>
              </div>
            </div>
          </section>

          {/* Contact Form column 2*/}
          <section className="w-full max-w-lg mx-auto bg-white/80 shadow-md rounded-2xl p-10 border border-gray-100">
            <h2 className="text-2xl font-medium mb-4 font-sora">
              Let&apos;s get in touch
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="text-xs">
                <label
                  htmlFor="name"
                  className="block mb-1 font-manrope"
                >
                  Name*
                </label>
                <input
                  {...register("name")}
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-300 text-gray-700 px-4 py-2.5 focus:outline-none placeholder:text-xs font-manrope"
                />
                {errors.name && (
                  <p className="text-red-600 text-[10px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="text-xs">
                <label
                  htmlFor="email"
                  className="block mb-1 font-manrope"
                >
                  Email*
                </label>
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                  className="w-full rounded-lg border border-gray-300 text-gray-700 px-4 py-2.5 focus:outline-none placeholder:text-xs font-manrope"
                />
                {errors.email && (
                  <p className="text-red-600 text-[10px] mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="text-xs">
                <label
                  htmlFor="message"
                  className="block mb-1 font-manrope"
                >
                  Message*
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Write your message here..."
                  className="w-full rounded-lg border border-gray-300 text-gray-700 px-4 py-2.5 focus:outline-none resize-none placeholder:text-xs font-manrope"
                />
                <p className="text-[10px] font-manrope">
                  Message must be at least 10 characters
                </p>
                {errors.message && (
                  <p className="text-red-600 text-[10px] mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  aria-label="Submit contact form"
                  disabled={isSubmitting || !isValid}
                  className="cursor-pointer relative overflow-hidden font-semibold group inline-flex items-center justify-center rounded-lg font-sora bg-accent-button text-white shadow-md transition-transform duration-300 hover:-translate-y-0.5 tracking-wider px-4 py-2.5 text-sm disabled:bg-accent-button/70 disabled:cursor-not-allowed min-w-36"
                >
                  {isSubmitting ? "Sending" : "Send message"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
