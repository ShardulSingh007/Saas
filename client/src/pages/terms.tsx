
import React from "react";

export default function Terms() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground text-center mb-8">Last Updated: April 2025</p>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Welcome to FinanceTools.in</h2>
          <p className="mb-6">By accessing or using our services, you agree to comply with and be bound by these Terms of Service. Please read them carefully before proceeding.</p>
          
          <h3 className="text-xl font-semibold mb-3">Service Usage</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>You must be at least 18 years old to use our services</li>
            <li>Provide accurate and complete information when using our tools</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use our services in compliance with applicable laws and regulations</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Intellectual Property</h3>
          <p className="mb-6">All content, features, and functionality of FinanceTools.in are owned by us and protected by international copyright laws.</p>

          <h3 className="text-xl font-semibold mb-3">Updates to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any changes.</p>
        </div>
      </div>
    </main>
  );
}
