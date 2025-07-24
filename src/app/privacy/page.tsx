"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import MainFooter from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <Header>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm cursor-pointer font-medium hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </Header>

        <main className="flex-1 w-full py-12 md:py-24 lg:py-32">
          <section className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight mb-6">🔐 DentaAuto — Privacy Policy</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Effective Date: 2025/01/01
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                We respect your privacy. This Privacy Policy explains what data we collect and how we use it.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Data We Collect</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                <li>Account data: Email, team name, user profile, roles.</li>
                <li>Usage data: Cases, materials, doctors, notes you input.</li>
                <li>Technical data: Device/browser info, login history (via Appwrite).</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not collect any financial data or patient images at this stage.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Data</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use your data to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                <li>Operate and improve the app.</li>
                <li>Provide case management and analytics features.</li>
                <li>Ensure security and compliance.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not sell or rent your data.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Third-Party Services</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use trusted services like:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                <li>Appwrite (backend authentication and database)</li>
                <li>Vercel (hosting infrastructure)</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These services may store metadata required to operate DentaAuto.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Storage and Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your data is stored securely in Appwrite and protected via encrypted connections (SSL). We implement access controls and limit who can see your data.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Still, no system is 100% secure — use DentaAuto at your own risk.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention and Deletion</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You can request data deletion at any time. Deleting your account will remove your data permanently after a short grace period.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use minimal tracking to support login and analytics. No third-party ads or cross-site trackers are used.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update this policy. Continued use of DentaAuto after changes means you agree to the updated version.
              </p>
            </div>
          </section>
        </main>
        <MainFooter />
      </div>
    </>
  );
}