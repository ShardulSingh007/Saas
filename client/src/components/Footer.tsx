import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-100 dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm">
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Quick Links</h3>
        <ul className="space-y-1">
          <li><Link to="/invoice-generator" className="hover:underline">Invoice Generator</Link></li>
          <li><Link to="/tax-calculator" className="hover:underline">Tax Calculator</Link></li>
          <li><Link to="/expense-tracker" className="hover:underline">Expense Tracker (AI)</Link></li>
          <li><Link to="/payment-reminder" className="hover:underline">Payment Reminder (AI)</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Legal</h3>
        <ul className="space-y-1">
          <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
          <li><Link to="/disclaimer" className="hover:underline">Disclaimer</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Company</h3>
        <ul className="space-y-1">
          <li><Link to="/about" className="hover:underline">About Us</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
        </ul>
      </div>
    </div>
    <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800">
      &copy; {new Date().getFullYear()} FinancePilot. All rights reserved.
    </div>
  </footer>
);

export default Footer;