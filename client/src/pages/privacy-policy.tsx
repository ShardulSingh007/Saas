
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground text-center mb-8">Last Updated: April 2025</p>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
          <p className="mb-6">At FinanceTools.in, we take your privacy seriously and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data while providing you with exceptional financial tools and services.</p>
          
          <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
          <p className="mb-6">We collect and process only essential information required to provide our services:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Account information and preferences</li>
            <li>Usage data to improve our services</li>
            <li>Financial data for calculations and analysis</li>
            <li>Communication records when you contact us</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">How We Protect Your Data</h3>
          <p className="mb-6">Your data security is our priority. We implement industry-standard security measures and regularly update our systems to ensure your information remains protected.</p>

          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <p>For any privacy-related inquiries, please reach out to us at:</p>
          <p className="font-medium">privacy@financetools.in</p>
        </div>
      </div>
    </main>
  );
}
