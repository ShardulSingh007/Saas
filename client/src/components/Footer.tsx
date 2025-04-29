import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/invoice-generator">
                  <a className="text-muted-foreground hover:text-primary transition">Invoice Generator</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-primary transition">Tax Calculator</a>
                </Link>
              </li>
              <li>
                <Link href="/expense-tracker">
                  <a className="text-muted-foreground hover:text-primary transition">Expense Tracker (AI)</a>
                </Link>
              </li>
              <li>
                <Link href="/payment-reminder">
                  <a className="text-muted-foreground hover:text-primary transition">Payment Reminder (AI)</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">LEGAL</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy">
                  <a className="text-muted-foreground hover:text-primary transition">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-primary transition">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer">
                  <a className="text-muted-foreground hover:text-primary transition">Disclaimer</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">COMPANY</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-primary transition">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-primary transition">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t border-border">
          © {new Date().getFullYear()} Finance Tools.IN All rights reserved.
        </div>
      </div>
    </footer>
  );
}