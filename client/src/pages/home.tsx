import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CheckCircle, ShieldCheck, Users, Star, FileText, DollarSign, PieChart, Bell, Sparkles, Bot } from "lucide-react";
import { RotatingTestimonials } from "@/components/RotatingTestimonials";

const testimonials = [
  {
    name: "Alex Kim",
    pic: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "FinancePilot made my freelance taxes and invoicing effortless. The AI tips are a game changer!",
    rating: 5,
  },
  {
    name: "Priya Singh",
    pic: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "I love the reminders and expense tracking. I finally feel in control of my money.",
    rating: 5,
  },
  {
    name: "James Lee",
    pic: "https://randomuser.me/api/portraits/men/65.jpg",
    quote: "The multi-country tax calculator is perfect for digital nomads like me.",
    rating: 4,
  },
];

const faqs = [
  {
    q: "Is my financial data secure?",
    a: "Absolutely. We use bank-level encryption and never share your data without consent.",
  },
  {
    q: "Which countries are supported?",
    a: "We support tax calculations and currency for 30+ countries, with more added regularly.",
  },
  {
    q: "Can I connect my bank or accounting software?",
    a: "Yes! Integrations with major banks and platforms like QuickBooks and Xero are available on Pro.",
  },
  {
    q: "How does the AI assistant work?",
    a: "Our AI Buddy analyzes your spending and gives you actionable, personalized tips.",
  },
];

const features = [
  {
    icon: <PieChart className="h-7 w-7 text-indigo-500" />, title: "Tax Calculator", desc: "Multi-country, deductions, and credits."
  },
  {
    icon: <FileText className="h-7 w-7 text-teal-500" />, title: "Invoice Generator", desc: "Customizable with payment links."
  },
  {
    icon: <DollarSign className="h-7 w-7 text-blue-500" />, title: "Expense Tracker", desc: "AI-powered categorization."
  },
  {
    icon: <Bell className="h-7 w-7 text-purple-500" />, title: "Payment Reminders", desc: "Smart alerts + auto scheduling."
  },
];

const pricing = [
  {
    plan: "Free",
    price: "$0/mo",
    features: [
      "Tax calculator (1 country)",
      "Basic invoice generator",
      "Expense tracking (manual)",
      "Payment reminders (3/month)",
      "Email support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    plan: "Pro",
    price: "$12/mo",
    features: [
      "All Free features",
      "Multi-country tax calculator",
      "Unlimited invoices",
      "AI-powered expense tracking",
      "Unlimited payment reminders",
      "Bank & accounting integrations",
      "Priority support",
    ],
    cta: "Start 14-day Trial",
    highlight: true,
  },
];

const Home: React.FC = () => {
  const [monthly, setMonthly] = React.useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>FinancePilot | Your Smart Financial Companion</title>
        <meta name="description" content="All-in-one suite to calculate taxes, track expenses, and stay on top of bills. Try FinancePilot free!" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#312e81] text-white py-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-teal-400 to-transparent" />
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Your Smart Financial Companion Starts Here</h1>
        <p className={`text-lg md:text-2xl mb-8 max-w-2xl mx-auto text-slate-200 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>All-in-one suite to calculate taxes, track expenses, and stay on top of bills.</p>
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Link to="/signup"><Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg">Get Started Free</Button></Link>
        </div>

        {/* Rotating Testimonials */}
        <div className="w-full flex flex-col items-center mt-8">
          <h2 className="text-xl font-bold mb-4">What Our Users Say</h2>
          <RotatingTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4 bg-background dark:bg-[#18181b]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Modern Finance</h2>
          <p className="text-lg text-muted-foreground">From taxes to reminders, FinancePilot has you covered.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <Card key={i} className="flex flex-col items-center p-6 bg-white dark:bg-[#232336] shadow-md hover:shadow-xl transition-shadow border-0">
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-[#232336] dark:via-[#18181b] dark:to-[#232336]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center">
            <Users className="h-10 w-10 text-indigo-500 mb-2" />
            <span className="font-semibold">1. Sign up</span>
            <span className="text-muted-foreground text-sm">Create your free account</span>
          </div>
          <div className="h-10 w-10 flex items-center justify-center text-2xl text-indigo-400">→</div>
          <div className="flex flex-col items-center">
            <FileText className="h-10 w-10 text-teal-500 mb-2" />
            <span className="font-semibold">2. Add data</span>
            <span className="text-muted-foreground text-sm">Import or enter your finances</span>
          </div>
          <div className="h-10 w-10 flex items-center justify-center text-2xl text-indigo-400">→</div>
          <div className="flex flex-col items-center">
            <Sparkles className="h-10 w-10 text-blue-500 mb-2" />
            <span className="font-semibold">3. Automate finances</span>
            <span className="text-muted-foreground text-sm">Let AI handle the rest</span>
          </div>
        </div>
      </section>

      {/* AI Buddy Section */}
      <section className="py-16 px-4 bg-background dark:bg-[#18181b]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2"><Bot className="h-7 w-7 text-indigo-500" /> Meet Your AI Finance Buddy</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get personalized tips, budgeting insights, and smart reminders from your AI assistant. FinancePilot learns your habits and helps you save more, stress less.</p>
        </div>
        <div className="flex justify-center">
          <img src="/ai-buddy.png" alt="AI Finance Buddy" className="w-48 h-48 rounded-full shadow-lg border-4 border-indigo-200 dark:border-indigo-700 bg-white dark:bg-[#232336] object-cover" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-[#232336] dark:via-[#18181b] dark:to-[#232336]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {testimonials.map((t, i) => (
            <Card key={i} className="flex flex-col items-center p-6 bg-white dark:bg-[#232336] shadow-md hover:shadow-xl transition-shadow border-0 max-w-sm mx-auto">
              <img src={t.pic} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-2 border-indigo-400 object-cover" />
              <div className="flex mb-2">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 text-yellow-400" />)}
              </div>
              <p className="text-base mb-2">"{t.quote}"</p>
              <span className="font-semibold text-indigo-600 dark:text-indigo-300">{t.name}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 bg-background dark:bg-[#18181b]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-muted-foreground">Billed</span>
            <button
              className={`px-3 py-1 rounded-full font-medium border ${monthly ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-[#232336] text-indigo-500'} transition`}
              onClick={() => setMonthly(true)}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1 rounded-full font-medium border ${!monthly ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-[#232336] text-indigo-500'} transition`}
              onClick={() => setMonthly(false)}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {pricing.map((p, i) => (
            <Card key={i} className={`flex-1 flex flex-col p-8 items-center bg-white dark:bg-[#232336] shadow-md border-0 ${p.highlight ? 'ring-2 ring-indigo-400 scale-105 z-10' : ''}`}>
              <h3 className="text-xl font-bold mb-2">{p.plan}</h3>
              <div className="text-3xl font-extrabold mb-4">{p.price}</div>
              <ul className="mb-6 space-y-2 text-left">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-base"><CheckCircle className="h-4 w-4 text-green-400" /> {f}</li>
                ))}
              </ul>
              <Button size="lg" className={p.highlight ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg" : ""}>{p.cta}</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-[#232336] dark:via-[#18181b] dark:to-[#232336]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter/Reminder */}
      <section className="py-16 px-4 bg-background dark:bg-[#18181b]">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get updates when new features launch!</h2>
          <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Input type="email" placeholder="Your email address" className="max-w-xs" required />
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">Notify Me</Button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Start taking control of your money today.</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup"><Button size="lg" className="bg-white text-indigo-700 font-bold">Create Free Account</Button></Link>
          <Link to="/invoice-generator"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">View Tools</Button></Link>
        </div>
      </section>
    </>
  );
};

export default Home;
