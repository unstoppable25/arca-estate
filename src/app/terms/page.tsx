export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 dark:bg-black">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Terms of Service</h1>
                <p className="mt-2 text-sm text-gray-500">Last updated: February 2026</p>

                <div className="mt-8 space-y-8 text-gray-600 dark:text-gray-300">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
                        <p className="mt-4">Welcome to Arca Estate. By using our website and services, you agree to follow these terms. Please read them carefully.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. User Conduct</h2>
                        <p className="mt-4">Users must provide accurate information when registering. You are responsible for any activity on your account. Misuse of self-guided tour access codes is strictly prohibited.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Property Listings</h2>
                        <p className="mt-4">Arca Estate acts as a platform for property connections. While we verify listings, users are encouraged to perform their own due diligence before signing any contracts.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Privacy</h2>
                        <p className="mt-4">Your use of the service is also governed by our Privacy Policy, which explains how we collect and protect your data.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
