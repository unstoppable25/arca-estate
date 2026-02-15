import { Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Perfect for browsing properties.",
            features: ["Browse 1000+ listings", "Basic AI support", "Save favorites"],
            button: "Sign up Free",
            href: "/signup"
        },
        {
            name: "Pro Agent",
            price: "$49",
            period: "/mo",
            description: "Boost your property sales.",
            features: ["Unlimited listings", "Verified badge", "Advanced AI analytics", "Priority support"],
            button: "Get Started",
            href: "/signup",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For real estate agencies.",
            features: ["Team management", "Custom integrations", "White-label options", "Dedicated manager"],
            button: "Contact Sales",
            href: "/help"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Simple, Transparent Pricing</h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Choose the plan that's right for your property goals.</p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md ${plan.highlight
                                    ? 'border-blue-600 ring-1 ring-blue-600'
                                    : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                                }`}
                        >
                            {plan.highlight && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                                    Most Popular
                                </span>
                            )}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{plan.price}</span>
                                {plan.period && <span className="text-sm font-semibold text-gray-500">{plan.period}</span>}
                            </div>
                            <ul className="mt-8 space-y-4 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Check className="h-4 w-4 text-blue-600" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={plan.href}
                                className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${plan.highlight
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                    }`}
                            >
                                {plan.button}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
