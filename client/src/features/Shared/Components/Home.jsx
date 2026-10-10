import { Link } from "react-router";
import { Bot, Mail, ShieldCheck, FileText, ArrowUpRight } from "lucide-react";

const features = [
    {
        number: "01",
        icon: "✦",
        title: "AI-powered answers",
        description:
            "Give customers instant answers using information from your business knowledge base instead of making them search through pages.",
    },
    {
        number: "02",
        icon: "▤",
        title: "Your business knowledge",
        description:
            "Build a knowledge base from your business documents and supported content so customers can find relevant information.",
    },
    {
        number: "03",
        icon: "◷",
        title: "Context-aware conversations",
        description:
            "Keep conversations coherent with contextual follow-up questions, so customers don't have to repeat themselves.",
    },
    {
        number: "04",
        icon: "⌘",
        title: "Simple website integration",
        description:
            "Add the chatbot to your website with a lightweight JavaScript widget and your public integration key.",
    },
    {
        number: "05",
        icon: "◎",
        title: "Your brand, your website",
        description:
            "Give visitors a convenient way to get help without sending them away from your website.",
    },
    {
        number: "06",
        icon: "➚",
        title: "Built to grow",
        description:
            "Start with your first knowledge sources and expand your customer support workflow as your business grows.",
    },
];

const steps = [
    {
        number: "01",
        title: "Add your knowledge",
        description:
            "Upload supported documents and add the business information your customers commonly ask about.",
    },
    {
        number: "02",
        title: "Configure your chatbot",
        description:
            "Create your organization credentials and configure which websites are allowed to use your widget.",
    },
    {
        number: "03",
        title: "Integrate and launch",
        description:
            "Add the widget script to your website and let visitors start asking questions.",
    },
];

const plans = [
    {
        name: "Free",
        description: "Explore CusSup and test your chatbot.",
        price: "₹0",
        period: "/ forever",
        highlighted: false,
        features: [
            "Access to the chatbot dashboard",
            "Create a knowledge base",
            "Test your chatbot",
            "Website widget integration",
            "Community support",
        ],
        cta: "Get started free",
        to: "/register",
    },
    {
        name: "Starter",
        description: "For small businesses getting started with AI support.",
        price: "₹999",
        period: "/ month",
        highlighted: true,
        features: [
            "Everything in Free",
            "Higher monthly message allowance",
            "More knowledge sources",
            "Website chatbot deployment",
            "Basic usage insights",
        ],
        cta: "Coming Soon...",
        to: "/register",
    },
    {
        name: "Growth",
        description: "For businesses ready to expand their support.",
        price: "₹2,499",
        period: "/ month",
        highlighted: false,
        features: [
            "Everything in Starter",
            "Higher usage allowance",
            "Expanded knowledge base",
            "Advanced usage insights",
            "Priority support",
        ],
        cta: "Coming Soon...",
        to: "/contact",
    },
];

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-400">
                {eyebrow}
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {title}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                {description}
            </p>
        </div>
    );
}

function ChatPreview() {
    return (
        <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-4xl bg-violet-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-violet-950/10 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-lg text-white">
                            ✦
                        </div>

                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                CusSup
                            </p>

                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                AI customer support
                            </p>
                        </div>
                    </div>

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
                </div>

                <div className="space-y-5 bg-slate-50 p-5 dark:bg-slate-950 sm:p-7">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                        Hi! Welcome to our support chat. How can I help you today?
                    </div>

                    <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-linear-to-br from-indigo-500 to-violet-600 p-4 text-sm leading-6 text-white shadow-lg shadow-violet-500/10">
                        What is your return policy?
                    </div>

                    <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                        You can return eligible items according to the return policy
                        provided by the business. I can help you find the relevant details
                        from our available information.
                    </div>

                    <div className="flex items-center gap-2 px-2 text-xs text-slate-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                        Your business knowledge. Instant answers.
                    </div>
                </div>

                <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-slate-700">
                        <span className="flex-1 px-2 text-sm text-slate-400">
                            Ask a question...
                        </span>

                        <span className="rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white">
                            Send
                        </span>
                    </div>

                    <p className="mt-3 text-center text-[10px] text-slate-400">
                        AI can make mistakes. Verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Home() {
    const currentYear = new Date().getFullYear();
    return (
        <div className="overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* HERO */}
            <section id="home" className="relative isolate">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -right-40 -top-20 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
                    <div className="absolute -left-40 top-48 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-32">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm dark:border-violet-900 dark:bg-slate-900/80 dark:text-violet-300">
                            <span className="h-2 w-2 rounded-full bg-violet-500" />
                            AI-powered customer support
                        </div>

                        <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                            Better customer support.
                            <span className="mt-2 block bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                Powered by your knowledge.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
                            Meet CusSup, an AI customer support chatbot that uses your
                            business information to help customers get answers directly on
                            your website.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Get started free
                                <span aria-hidden="true">→</span>
                            </Link>

                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-700 dark:hover:text-violet-300"
                            >
                                Explore features
                            </a>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <span>✓ Uses your business knowledge</span>
                            <span>✓ Website integration</span>
                            <span>✓ Simple setup</span>
                        </div>
                    </div>

                    <ChatPreview />
                </div>
            </section>

            {/* FEATURES */}
            <section
                id="features"
                className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-28"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="Features"
                        title="Everything you need to get started with AI support"
                        description="Give your customers a convenient support experience with tools designed around your business knowledge."
                    />

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <article
                                key={feature.number}
                                className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-violet-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-900 dark:hover:bg-slate-900"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl font-semibold text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-950 dark:text-violet-300">
                                    {feature.icon}
                                </div>

                                <p className="mt-6 text-xs font-bold tracking-[0.18em] text-violet-600 dark:text-violet-400">
                                    {feature.number}
                                </p>

                                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                                    {feature.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="How it works"
                        title="From setup to support in three steps"
                        description="Start with your business information, configure your widget, and make it available to your website visitors."
                    />

                    <div className="grid gap-8 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <article key={step.number} className="relative">
                                {index !== steps.length - 1 && (
                                    <div className="absolute left-16 top-7 hidden h-px w-[calc(100%-3rem)] bg-linear-to-r from-violet-300 to-transparent md:block" />
                                )}

                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                                    {step.number}
                                </div>

                                <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                                    {step.title}
                                </h3>

                                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
                                    {step.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* INTEGRATION */}
            <section
                id="integration"
                className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40 sm:py-28"
            >
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-400">
                            Website integration
                        </p>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Add AI support to your website.
                            <span className="block text-violet-600 dark:text-violet-400">
                                Without rebuilding it.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                            Connect your website to CusSup using the widget integration.
                            Configure your allowed website origins, copy the integration
                            snippet, and deploy the chatbot alongside your existing website.
                        </p>

                        <ul className="mt-7 space-y-4">
                            {[
                                "Create your organization credentials",
                                "Configure your allowed website origins",
                                "Add the widget script to your website",
                                "Test your chatbot before launch",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                                >
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                        ✓
                                    </span>

                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/dashboard"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 dark:bg-white dark:text-slate-900 dark:hover:bg-violet-200"
                        >
                            Start Integrating
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
                        <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
                            <span className="h-3 w-3 rounded-full bg-red-400" />
                            <span className="h-3 w-3 rounded-full bg-amber-400" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400" />

                            <span className="ml-3 text-xs text-slate-400">
                                website.html
                            </span>
                        </div>

                        <div className="overflow-x-auto p-5 sm:p-7">
                            <pre className="text-xs leading-7 sm:text-sm">
                                <code>
                                    <span className="text-slate-500">
                                        {"<!-- Add CusSup to your website -->"}
                                    </span>
                                    {"\n"}
                                    <span className="text-violet-300">
                                        {"<script"}
                                    </span>
                                    {"\n"}
                                    <span className="text-sky-300">
                                        {"  src="}
                                    </span>
                                    <span className="text-emerald-300">
                                        {'"YOUR_CUSSUP_WIDGET_URL"'}
                                    </span>
                                    {"\n"}
                                    <span className="text-sky-300">
                                        {"  data-public-key="}
                                    </span>
                                    <span className="text-emerald-300">
                                        {'"YOUR_PUBLIC_KEY"'}
                                    </span>
                                    {"\n"}
                                    <span className="text-violet-300">
                                        {"></script>"}
                                    </span>
                                </code>
                            </pre>

                            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
                                <p className="text-xs font-semibold text-slate-300">
                                    Integration tip
                                </p>

                                <p className="mt-2 text-xs leading-6 text-slate-400">
                                    Replace the example URL and key with the actual widget URL
                                    and public key generated by your CusSup dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section
                id="pricing"
                className="py-20 sm:py-28"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                    <SectionHeading
                        eyebrow="Pricing"
                        title="Start small. Grow when you're ready."
                        description="Choose the plan that fits your business. Start by exploring CusSup, then upgrade when your support needs grow."
                    />

                    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <article
                                key={plan.name}
                                className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${plan.highlighted
                                        ? "border-violet-500 bg-white shadow-2xl shadow-violet-500/10 ring-1 ring-violet-500 dark:bg-slate-900"
                                        : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-bold text-white">
                                        MOST POPULAR
                                    </span>
                                )}

                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {plan.name}
                                </h3>

                                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    {plan.description}
                                </p>

                                <div className="mt-7 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                                        {plan.price}
                                    </span>

                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {plan.period}
                                    </span>
                                </div>

                                <Link
                                    to={plan.to}
                                    className={`mt-7 flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition ${plan.highlighted
                                            ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-violet-500/20 hover:opacity-90"
                                            : "border border-slate-300 bg-white text-slate-800 hover:border-violet-400 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-violet-700"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>

                                <div className="my-7 h-px bg-slate-200 dark:bg-slate-800" />

                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    What's included
                                </p>

                                <ul className="mt-5 flex-1 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                                        >
                                            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                                                ✓
                                            </span>

                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>

                    <p className="mt-8 text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
                        Pricing and plan limits are illustrative. Confirm the actual
                        features, usage limits, and billing rules before accepting
                        payments.
                    </p>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-16 text-center shadow-2xl shadow-violet-900/20 sm:px-12 sm:py-20">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />

                    <div className="pointer-events-none absolute -bottom-36 -left-20 h-80 w-80 rounded-full border border-white/10" />

                    <div className="relative mx-auto max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-200">
                            Your next step
                        </p>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Give your customers a better way to get answers.
                        </h2>

                        <p className="mt-5 text-base leading-8 text-violet-100">
                            Set up your knowledge base, configure your chatbot, and bring
                            AI-powered support to your website.
                        </p>

                        <Link
                            to="/register"
                            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
                        >
                            Get started with CusSup
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">

                {/* Main Footer */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20">
                                <Bot size={24} />
                            </span>

                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                CusSup
                                <span className="text-indigo-600 dark:text-indigo-400">
                                    AI
                                </span>
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
                            AI-powered customer support for your business.
                            Build a knowledge base, answer customer questions,
                            and provide support around the clock.
                        </p>

                        <a
                            href="mailto:support@cussup.online"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            <Mail size={16} />
                            Contact Support
                            <ArrowUpRight size={14} />
                        </a>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                            Product
                        </h3>

                        <ul className="mt-5 space-y-3">
                            <li>
                                <a
                                    href="#features"
                                    className="text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    Features
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#integration"
                                    className="text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    Integrations
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#pricing"
                                    className="text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                            Legal & Support
                        </h3>

                        <ul className="mt-5 space-y-3">
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    <ShieldCheck size={16} />
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/terms-and-conditions"
                                    className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    <FileText size={16} />
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    <Mail size={16} />
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 border-t border-slate-200 dark:border-slate-800" />

                {/* Bottom Footer */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                        © {currentYear} CusSup AI. All rights reserved.
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Built to help businesses support their customers better.
                    </p>
                </div>

            </div>
        </footer>
        </div>
    );
}

export default Home;