"use client";
import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import MainFooter from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <Header>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="cursor-pointer font-semibold hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </Header>

        <main className="flex-1 w-full py-12 md:py-24 lg:py-32">
          <section className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight mb-6">DentaAuto — Terms of Use</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Effective Date: 2025/01/01
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Welcome to DentaAuto, a digital case management platform for dental labs. By creating an account or using our services, you agree to the following Terms of Use.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Who Can Use DentaAuto</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You must:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                <li>Be at least 18 years old.</li>
                <li>Use DentaAuto on behalf of a dental lab or business.</li>
                <li>Provide accurate information during registration.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We reserve the right to suspend or delete accounts that violate these terms or misuse the platform.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Account Responsibilities</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                <li>Keeping your login credentials safe.</li>
                <li>Managing your team&apos;s activity within your account.</li>
                <li>Ensuring no one in your team misuses the system (e.g., uploading harmful files, abusing access, etc.)</li>
              </ul>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Usage Limitations</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You may not:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                <li>Reverse-engineer, copy, or resell any part of DentaAuto.</li>
                <li>Use the service for unlawful purposes.</li>
                <li>Upload offensive, false, or harmful data.</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may suspend access if we detect abusive or excessive usage.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Availability and Changes</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                DentaAuto is offered as-is. While we aim for high uptime, we may modify or remove features without notice. Downtime, bugs, or data loss are possible — especially during early development.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Ownership</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You retain ownership of the case and patient data you input. However, by using DentaAuto, you grant us permission to store, process, and display this data for you and your team.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We do not sell your data.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Termination</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We reserve the right to terminate or restrict your access at any time, especially in cases of abuse, inactivity, or violation of these terms.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Disclaimers</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                DentaAuto is not a medical device and should not be used for diagnosis or treatment planning. It is a productivity tool for dental labs.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use is at your own risk. We disclaim all warranties to the extent permitted by law.
              </p>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These terms are governed by the laws of Egypt. Any disputes will be resolved under local jurisdiction.
              </p>
            </div>
          </section>
        </main>
        <MainFooter />
      </div>
    </>
  );
}