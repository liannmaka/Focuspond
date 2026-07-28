"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLinkedin } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";
import Footer from "../_components/Footer";
import { Button, Input, Textarea, Label, FieldError } from "@/components/ui";

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
              <p className="my-5 font-manrope text-[15px] text-ink-muted">
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
                <span className="block h-5 w-[3px] bg-accent rounded-full mr-3" />
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
                  className="transition-colors text-accent-text hover:text-accent"
                  aria-label="Twitter"
                >
                  <RiTwitterXFill />
                </a>

                <a
                  href="https://www.linkedin.com/in/ogbuo-chiamaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-accent-text hover:text-accent"
                  aria-label="LinkedIn"
                >
                  <LuLinkedin />
                </a>
              </div>
            </div>
          </section>

          {/* Contact Form column 2*/}
          <section className="w-full max-w-lg mx-auto bg-surface-raised shadow-e2 rounded-2xl p-10 border border-line">
            <h2 className="text-2xl font-medium mb-4 font-sora">
              Let&apos;s get in touch
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div>
                <Label htmlFor="name">Name*</Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  required
                  placeholder="Your name"
                  invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <FieldError id="name-error">{errors.name.message}</FieldError>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email*</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  required
                  placeholder="Your email"
                  invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <FieldError id="email-error">
                    {errors.email.message}
                  </FieldError>
                )}
              </div>

              <div>
                <Label htmlFor="message">Message*</Label>
                <Textarea
                  {...register("message")}
                  id="message"
                  rows={4}
                  required
                  placeholder="Write your message here..."
                  invalid={!!errors.message}
                  aria-describedby="message-hint"
                />
                <p
                  id="message-hint"
                  className="mt-1 font-manrope text-xs text-ink-subtle"
                >
                  Message must be at least 10 characters
                </p>
                {errors.message && (
                  <FieldError>{errors.message.message}</FieldError>
                )}
              </div>
              <div className="text-right">
                <Button
                  type="submit"
                  ariaLabel="Submit contact form"
                  disabled={isSubmitting || !isValid}
                  loading={isSubmitting}
                  size="sm"
                  className="min-w-36 tracking-wider"
                >
                  {isSubmitting ? "Sending" : "Send message"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
