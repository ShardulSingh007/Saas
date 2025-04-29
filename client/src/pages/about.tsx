
import React from "react";

export default function About() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About FinanceTools.in</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-6">We're on a mission to simplify financial management for everyone. By combining cutting-edge technology with user-friendly interfaces, we make complex financial tasks accessible and efficient.</p>
          
          <h3 className="text-xl font-semibold mb-3">What Sets Us Apart</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">AI-Powered Solutions</h4>
              <p>Advanced algorithms and machine learning to provide intelligent financial insights.</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">User-Centric Design</h4>
              <p>Intuitive interfaces designed for both beginners and professionals.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Our Tools</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Smart Invoice Generator</li>
            <li>Comprehensive Tax Calculator</li>
            <li>AI-Powered Expense Tracker</li>
            <li>Intelligent Payment Reminder System</li>
          </ul>

          <p className="font-medium">Join thousands of users who trust FinanceTools.in for their financial management needs.</p>
        </div>
      </div>
    </main>
  );
}
