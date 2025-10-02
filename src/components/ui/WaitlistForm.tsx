"use client";

import { useFormStatus } from "react-dom";
import Form from "next/form";

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (<button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="cursor-pointer bg-accent-button px-4 py-2.5 rounded-full m-2 text-white relative overflow-hidden font-medium group ring-4 ring-base-background shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
        {
            pending ? (<>
                <div>
                    I will design this myself
                </div>
            </>) : (<><span className="relative z-10">Join Waitlist</span>
                <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /></>)
        }

    </button>);
};

const WaitlistForm = () => {
    return (
        <Form action="/waitlist" className="max-w-xs mx-auto">
            <div className="text-xs flex w-full rounded-full overflow-hidden border border-light-background/40 bg-white/80 font-sora">
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="flex-1 px-4 py-3 bg-transparent text-gray-700 focus:outline-none"
                />
                <SubmitButton />
            </div>
        </Form>
    );
};

export default WaitlistForm;