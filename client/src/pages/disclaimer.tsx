
import React from "react";

export default function Disclaimer() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Disclaimer</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground text-center mb-8">Last Updated: April 2025</p>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Important Notice</h2>
          <p className="mb-6">The information and tools provided on FinanceTools.in are for educational and convenience purposes only. While we strive for accuracy, we cannot guarantee that all information is completely error-free or suitable for your specific situation.</p>
          
          <h3 className="text-xl font-semibold mb-3">No Financial Advice</h3>
          <p className="mb-6">Our calculators and tools are meant to assist in your financial planning but should not be considered as professional financial, tax, or legal advice. Always consult with qualified professionals for your specific circumstances.</p>

          <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
          <p className="mb-6">FinanceTools.in and its operators shall not be liable for any damages or losses resulting from the use of our services or reliance on the information provided.</p>

          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">By using our services, you acknowledge and accept these limitations and disclaimers.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
