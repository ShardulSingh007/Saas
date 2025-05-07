import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Printer,
  Download,
  Mail,
  Plus,
  Trash2,
  Moon,
  Sun,
  FileText,
  HelpCircle,
  RotateCw,
  DollarSign,
  CreditCard,
  Save,
  Loader2,
  Check,
  Eye
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useCurrency } from "@/hooks/use-currency";
import { CurrencySelector } from "@/components/CurrencySelector";
import jsPDF from 'jspdf';

// Define types
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface BusinessDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  logo?: string;
}

interface ClientDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

interface InvoiceData {
  invoiceNumber: string;
  title: string;
  invoiceDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  currency: string;
  taxRate: number;
  discountRate: number;
  discountType: 'percentage' | 'fixed';
  taxType: 'percentage' | 'fixed';
  status: 'paid' | 'unpaid' | 'partial' | 'draft';
  businessDetails: BusinessDetails;
  clientDetails: ClientDetails;
  paymentLink?: string;
}

// Add new interface for saved invoice
interface SavedInvoice extends InvoiceData {
  id: string;
  createdAt: string;
}

// Currency formatting helper
const formatCurrency = (amount: number, currency: string) => {
  const currencySymbols: {[key: string]: string} = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'CAD': 'CA$',
    'AUD': 'A$',
    'CNY': '¥',
  };

  const symbol = currencySymbols[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
};

// Generate unique ID for invoice items
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Generate random invoice number
const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${date}-${random}`;
};

// Default data
const getDefaultInvoiceData = (): InvoiceData => {
  // Try to get stored currency preference
  let currencyCode = 'USD';
  try {
    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (storedCurrency) {
      const parsedCurrency = JSON.parse(storedCurrency);
      if (parsedCurrency.code) {
        currencyCode = parsedCurrency.code;
      }
    }
  } catch (error) {
    console.error('Error loading currency preference:', error);
  }

  return {
    invoiceNumber: generateInvoiceNumber(),
    title: 'Invoice',
    invoiceDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    items: [], // Start with no items
    notes: '',
    terms: 'Payment due within 14 days of invoice date.',
    currency: currencyCode, // Use the stored currency preference
    taxRate: 0,
    discountRate: 0,
    discountType: 'percentage',
    taxType: 'percentage',
    status: 'draft',
    businessDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      email: ''
    },
    clientDetails: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      email: ''
    }
  };
};

// We're no longer using sample data as per user request
// This is kept as a function signature for compatibility
const getSampleInvoiceData = (): InvoiceData => {
  return getDefaultInvoiceData();
};

// Main component
const InvoiceGenerator: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(getDefaultInvoiceData());
  const [activeTab, setActiveTab] = useState('edit');
  const [showGuide, setShowGuide] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoices');
        if (response.ok) {
          const data = await response.json();
          setInvoices(data);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  // Theme handling
  const { theme, setTheme } = useTheme();

  // Currency handling
  const { currency, formatAmount } = useCurrency();

  // Update invoice currency when global currency changes
  useEffect(() => {
    if (currency.code !== invoiceData.currency) {
      setInvoiceData({
        ...invoiceData,
        currency: currency.code
      });
    }
  }, [currency.code]);

  // Load from local storage on initial render
  useEffect(() => {
    const savedInvoice = localStorage.getItem('savedInvoice');
    if (savedInvoice) {
      try {
        const parsedData = JSON.parse(savedInvoice);
        // Convert string dates back to Date objects
        parsedData.invoiceDate = new Date(parsedData.invoiceDate);
        parsedData.dueDate = new Date(parsedData.dueDate);
        setInvoiceData(parsedData);
      } catch (error) {
        console.error('Error loading saved invoice:', error);
      }
    }
  }, []);

  // Load saved invoices from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('invoiceHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedInvoices(parsed);
      } catch (error) {
        console.error('Error loading saved invoices:', error);
      }
    }
  }, []);

  // Calculations
  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => total + item.amount, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    if (invoiceData.taxType === 'percentage') {
      return subtotal * (invoiceData.taxRate / 100);
    } else {
      return invoiceData.taxRate;
    }
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (invoiceData.discountType === 'percentage') {
      return subtotal * (invoiceData.discountRate / 100);
    } else {
      return invoiceData.discountRate;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + tax - discount;
  };

  // Event handlers
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate amount if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });

    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };

    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem]
    });
  };

  const handleRemoveItem = (id: string) => {
    if (invoiceData.items.length <= 1) return; // Keep at least one item

    const updatedItems = invoiceData.items.filter(item => item.id !== id);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const handleBusinessDetailChange = (field: keyof BusinessDetails, value: string) => {
    setInvoiceData({
      ...invoiceData,
      businessDetails: {
        ...invoiceData.businessDetails,
        [field]: value
      }
    });
  };

  const handleClientDetailChange = (field: keyof ClientDetails, value: string) => {
    setInvoiceData({
      ...invoiceData,
      clientDetails: {
        ...invoiceData.clientDetails,
        [field]: value
      }
    });
  };

  // Save invoice to history
  const saveToHistory = (invoice: InvoiceData) => {
    const savedInvoice: SavedInvoice = {
      ...invoice,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [savedInvoice, ...savedInvoices];
    setSavedInvoices(updatedHistory);
    localStorage.setItem('invoiceHistory', JSON.stringify(updatedHistory));
  };

  // Load invoice from history
  const loadInvoice = (invoice: SavedInvoice) => {
    setInvoiceData(invoice);
    toast({
      title: "Success",
      description: "Invoice loaded successfully",
    });
  };

  // Clear invoice history
  const clearHistory = () => {
    setSavedInvoices([]);
    localStorage.removeItem('invoiceHistory');
  };

  // Modify handleSaveInvoice to save to history
  const handleSaveInvoice = () => {
    saveToHistory(invoiceData);
    toast({
      title: "Success",
      description: "Invoice saved to history",
    });
  };

  // Sample loading functionality removed as per user request
  const handleLoadSample = () => {
    // Functionality disabled
  };

  const handleNewInvoice = () => {
    if (window.confirm('Start a new invoice? This will discard current changes.')) {
      setInvoiceData(getDefaultInvoiceData());
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setInvoiceData({
          ...invoiceData,
          businessDetails: {
            ...invoiceData.businessDetails,
            logo: result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const printInvoice = () => {
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Generate PDF for download or email
  const generatePDF = (): string => {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add business logo if available
    if (invoiceData.businessDetails.logo) {
      try {
        doc.addImage(invoiceData.businessDetails.logo, 'JPEG', 150, 10, 40, 20);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }

    // Add business details
    doc.setFontSize(18);
    doc.text(invoiceData.businessDetails.name, 20, 20);
    doc.setFontSize(10);
    doc.text(invoiceData.businessDetails.address, 20, 25);
    doc.text(`${invoiceData.businessDetails.city}, ${invoiceData.businessDetails.state} ${invoiceData.businessDetails.zipCode}`, 20, 30);
    doc.text(invoiceData.businessDetails.country, 20, 35);
    doc.text(`Phone: ${invoiceData.businessDetails.phone}`, 20, 40);
    doc.text(`Email: ${invoiceData.businessDetails.email}`, 20, 45);

    // Add invoice title and number
    doc.setFontSize(16);
    doc.text(invoiceData.title.toUpperCase(), 20, 60);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 20, 65);
    doc.text(`Date: ${format(invoiceData.invoiceDate, 'MMM dd, yyyy')}`, 20, 70);
    doc.text(`Due Date: ${format(invoiceData.dueDate, 'MMM dd, yyyy')}`, 20, 75);

    // Add client details
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 85);
    doc.text(invoiceData.clientDetails.name, 20, 90);
    doc.text(invoiceData.clientDetails.address, 20, 95);
    doc.text(`${invoiceData.clientDetails.city}, ${invoiceData.clientDetails.state} ${invoiceData.clientDetails.zipCode}`, 20, 100);
    doc.text(invoiceData.clientDetails.country, 20, 105);
    doc.text(`Phone: ${invoiceData.clientDetails.phone}`, 20, 110);
    doc.text(`Email: ${invoiceData.clientDetails.email}`, 20, 115);

    // Add invoice items table
    const tableTop = 125;
    const tableLeft = 20;
    const tableWidth = 170;
    const rowHeight = 10;

    // Table headers
    doc.setFillColor(240, 240, 240);
    doc.rect(tableLeft, tableTop, tableWidth, rowHeight, 'F');
    doc.setFontSize(10);
    doc.text('Item', tableLeft + 3, tableTop + 7);
    doc.text('Qty', tableLeft + 90, tableTop + 7);
    doc.text('Rate', tableLeft + 110, tableTop + 7);
    doc.text('Amount', tableLeft + 140, tableTop + 7);

    // Table rows
    let y = tableTop + rowHeight;
    invoiceData.items.forEach((item, index) => {
      // Add a new page if we're going to run out of space
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.text(item.description, tableLeft + 3, y + 7);
      doc.text(item.quantity.toString(), tableLeft + 90, y + 7);
      doc.text(formatCurrency(item.rate, invoiceData.currency), tableLeft + 110, y + 7);
      doc.text(formatCurrency(item.amount, invoiceData.currency), tableLeft + 140, y + 7);

      y += rowHeight;
    });

    // Add totals
    y += 5;
    doc.text('Subtotal:', tableLeft + 100, y + 7);
    doc.text(formatCurrency(calculateSubtotal(), invoiceData.currency), tableLeft + 140, y + 7);

    if (invoiceData.taxRate > 0) {
      y += rowHeight;
      doc.text(`Tax ${invoiceData.taxType === 'percentage' ? `(${invoiceData.taxRate}%)` : ''}:`, tableLeft + 100, y + 7);
      doc.text(formatCurrency(calculateTax(), invoiceData.currency), tableLeft + 140, y + 7);
    }

    if (invoiceData.discountRate > 0) {
      y += rowHeight;
      doc.text(`Discount ${invoiceData.discountType === 'percentage' ? `(${invoiceData.discountRate}%)` : ''}:`, tableLeft + 100, y + 7);
      doc.text(`-${formatCurrency(calculateDiscount(), invoiceData.currency)}`, tableLeft + 140, y + 7);
    }

    y += rowHeight;
    doc.setFontSize(12);
    doc.text('Total:', tableLeft + 100, y + 7);
    doc.text(formatCurrency(calculateTotal(), invoiceData.currency), tableLeft + 140, y + 7);

    // Add notes and terms
    y += rowHeight * 2;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.text('Notes:', tableLeft, y + 7);
    doc.text(invoiceData.notes, tableLeft, y + 14, { maxWidth: 150 });

    y += rowHeight * 4;
    doc.text('Terms:', tableLeft, y + 7);
    doc.text(invoiceData.terms, tableLeft, y + 14, { maxWidth: 150 });

    // Return as base64 string
    return doc.output('datauristring').split(',')[1];
  };

  // Download the generated PDF
  const downloadInvoice = () => {
    try {
      // Create a new PDF document using the same logic as generatePDF function
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add business logo if available
      if (invoiceData.businessDetails.logo) {
        try {
          doc.addImage(invoiceData.businessDetails.logo, 'JPEG', 150, 10, 40, 20);
        } catch (error) {
          console.error('Error adding logo to PDF:', error);
        }
      }

      // Add business details
      doc.setFontSize(18);
      doc.text(invoiceData.businessDetails.name, 20, 20);
      doc.setFontSize(10);
      doc.text(invoiceData.businessDetails.address, 20, 25);
      doc.text(`${invoiceData.businessDetails.city}, ${invoiceData.businessDetails.state} ${invoiceData.businessDetails.zipCode}`, 20, 30);
      doc.text(invoiceData.businessDetails.country, 20, 35);
      doc.text(`Phone: ${invoiceData.businessDetails.phone}`, 20, 40);
      doc.text(`Email: ${invoiceData.businessDetails.email}`, 20, 45);

      // Add invoice title and number
      doc.setFontSize(16);
      doc.text(invoiceData.title.toUpperCase(), 20, 60);
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 20, 65);
      doc.text(`Date: ${format(invoiceData.invoiceDate, 'MMM dd, yyyy')}`, 20, 70);
      doc.text(`Due Date: ${format(invoiceData.dueDate, 'MMM dd, yyyy')}`, 20, 75);

      // Add client details
      doc.setFontSize(12);
      doc.text('Bill To:', 20, 85);
      doc.text(invoiceData.clientDetails.name, 20, 90);
      doc.text(invoiceData.clientDetails.address, 20, 95);
      doc.text(`${invoiceData.clientDetails.city}, ${invoiceData.clientDetails.state} ${invoiceData.clientDetails.zipCode}`, 20, 100);
      doc.text(invoiceData.clientDetails.country, 20, 105);
      doc.text(`Phone: ${invoiceData.clientDetails.phone}`, 20, 110);
      doc.text(`Email: ${invoiceData.clientDetails.email}`, 20, 115);

      // Add invoice items table
      const tableTop = 125;
      const tableLeft = 20;
      const tableWidth = 170;
      const rowHeight = 10;

      // Table headers
      doc.setFillColor(240, 240, 240);
      doc.rect(tableLeft, tableTop, tableWidth, rowHeight, 'F');
      doc.setFontSize(10);
      doc.text('Item', tableLeft + 3, tableTop + 7);
      doc.text('Qty', tableLeft + 90, tableTop + 7);
      doc.text('Rate', tableLeft + 110, tableTop + 7);
      doc.text('Amount', tableLeft + 140, tableTop + 7);

      // Table rows
      let y = tableTop + rowHeight;
      invoiceData.items.forEach((item) => {
        // Add a new page if we're going to run out of space
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        doc.text(item.description, tableLeft + 3, y + 7);
        doc.text(item.quantity.toString(), tableLeft + 90, y + 7);
        doc.text(formatCurrency(item.rate, invoiceData.currency), tableLeft + 110, y + 7);
        doc.text(formatCurrency(item.amount, invoiceData.currency), tableLeft + 140, y + 7);

        y += rowHeight;
      });

      // Add totals
      y += 5;
      doc.text('Subtotal:', tableLeft + 100, y + 7);
      doc.text(formatCurrency(calculateSubtotal(), invoiceData.currency), tableLeft + 140, y + 7);

      if (invoiceData.taxRate > 0) {
        y += rowHeight;
        doc.text(`Tax ${invoiceData.taxType === 'percentage' ? `(${invoiceData.taxRate}%)` : ''}:`, tableLeft + 100, y + 7);
        doc.text(formatCurrency(calculateTax(), invoiceData.currency), tableLeft + 140, y + 7);
      }

      if (invoiceData.discountRate > 0) {
        y += rowHeight;
        doc.text(`Discount ${invoiceData.discountType === 'percentage' ? `(${invoiceData.discountRate}%)` : ''}:`, tableLeft + 100, y + 7);
        doc.text(`-${formatCurrency(calculateDiscount(), invoiceData.currency)}`, tableLeft + 140, y + 7);
      }

      y += rowHeight;
      doc.setFontSize(12);
      doc.text('Total:', tableLeft + 100, y + 7);
      doc.text(formatCurrency(calculateTotal(), invoiceData.currency), tableLeft + 140, y + 7);

      // Add notes and terms
      y += rowHeight * 2;
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(10);
      doc.text('Notes:', tableLeft, y + 7);
      doc.text(invoiceData.notes, tableLeft, y + 14, { maxWidth: 150 });

      y += rowHeight * 4;
      doc.text('Terms:', tableLeft, y + 7);
      doc.text(invoiceData.terms, tableLeft, y + 14, { maxWidth: 150 });

      // Save the PDF
      doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);

      toast({
        title: 'Success',
        description: 'Invoice PDF downloaded successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Variables for email dialog
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [senderEmail, setSenderEmail] = useState(invoiceData.businessDetails.email);
  const [recipientEmail, setRecipientEmail] = useState(invoiceData.clientDetails.email);
  const [emailSubject, setEmailSubject] = useState(`Invoice #${invoiceData.invoiceNumber} from ${invoiceData.businessDetails.name}`);
  const [emailMessage, setEmailMessage] = useState(`Please find attached Invoice #${invoiceData.invoiceNumber}. Payment is due by ${format(invoiceData.dueDate, 'MMM dd, yyyy')}. Thank you for your business.`);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  // Moving useToast to the component level to avoid React hooks error
  const toastHelper = useToast();
  const toast = toastHelper.toast;

  // Send invoice via email
  const emailInvoice = () => {
    // Update email fields with the latest invoice data
    setSenderEmail(invoiceData.businessDetails.email);
    setRecipientEmail(invoiceData.clientDetails.email);
    setEmailSubject(`Invoice #${invoiceData.invoiceNumber} from ${invoiceData.businessDetails.name}`);
    setEmailMessage(`Please find attached Invoice #${invoiceData.invoiceNumber}. Payment is due by ${format(invoiceData.dueDate, 'MMM dd, yyyy')}. Thank you for your business.`);
    setEmailDialogOpen(true);
  };

  // Handle the actual sending of the email
  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);

      // Generate PDF as base64
      const pdfBase64 = generatePDF();

      // Format the amount for email
      const formattedAmount = formatCurrency(calculateTotal(), invoiceData.currency);

      // Send the invoice
      const response = await apiRequest('POST', '/api/send-invoice', {
        recipientEmail,
        senderEmail,
        invoiceNumber: invoiceData.invoiceNumber,
        invoicePdfBase64: pdfBase64,
        businessName: invoiceData.businessDetails.name,
        amount: formattedAmount,
        dueDate: format(invoiceData.dueDate, 'MMM dd, yyyy')
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      setEmailDialogOpen(false);
      toast({
        title: 'Email Sent',
        description: `Invoice has been emailed to ${recipientEmail}`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoiceData.businessDetails.name || !invoiceData.businessDetails.email) {
      toast({
        title: "Validation Error",
        description: "Business name and email are required",
        variant: "destructive"
      });
      return;
    }

    if (invoiceData.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Add at least one item to the invoice",
        variant: "destructive"
      });
      return;
    }
    // Add your submission logic here.  This is a placeholder.
    console.log("Invoice submitted:", invoiceData);

  };

  const downloadSavedInvoice = (invoice: any) => {
    //Implement download logic here
  };

  const viewInvoice = (invoice: any) => {
    //Implement view logic here
  };

  // Add new component for Invoice History
  const InvoiceHistory: React.FC<{
    invoices: SavedInvoice[];
    onLoadInvoice: (invoice: SavedInvoice) => void;
    onClearHistory: () => void;
  }> = ({ invoices, onLoadInvoice, onClearHistory }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const { toast } = useToast();

    const handleClearHistory = () => {
      if (isConfirming) {
        onClearHistory();
        setIsConfirming(false);
        toast({
          title: "Success",
          description: "Invoice history cleared successfully",
        });
      } else {
        setIsConfirming(true);
        setTimeout(() => setIsConfirming(false), 3000);
      }
    };

    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className={isConfirming ? "bg-destructive text-destructive-foreground" : ""}
          >
            {isConfirming ? (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                Click to Confirm
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear History
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No saved invoices yet
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{invoice.clientDetails.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Invoice #{invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invoice.createdAt), "PPP")}
                    </p>
                    <p className="text-sm font-medium">
                      Total: {formatCurrency(calculateSavedInvoiceTotal(invoice), invoice.currency)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Load
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Helper function to calculate total for a saved invoice
  const calculateSavedInvoiceTotal = (invoice: SavedInvoice) => {
    const subtotal = invoice.items.reduce((total, item) => total + item.amount, 0);
    const tax = invoice.taxType === 'percentage' 
      ? subtotal * (invoice.taxRate / 100)
      : invoice.taxRate;
    const discount = invoice.discountType === 'percentage'
      ? subtotal * (invoice.discountRate / 100)
      : invoice.discountRate;
    return subtotal + tax - discount;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Invoice via Email</DialogTitle>
            <DialogDescription>
              Send this invoice directly to your client via email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sender-email" className="text-right">
                From
              </Label>
              <Input
                id="sender-email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient-email" className="text-right">
                To
              </Label>
              <Input
                id="recipient-email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-subject" className="text-right">
                Subject
              </Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-message" className="text-right">
                Message
              </Label>
              <Textarea
                id="email-message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Smart Invoice Generator</h1>
        <p className="text-xl text-muted-foreground mb-6">Create and send professional invoices in seconds</p>
        <div className="flex justify-center space-x-4">
          <Button
            size="lg"
            className="bg-primary"
            onClick={() => setActiveTab('edit')}
          >
            <FileText className="mr-2 h-5 w-5" />
            Generate Invoice Now
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowGuide(!showGuide)}
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            {showGuide ? 'Hide Guide' : 'Show Guide'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className={`grid ${showGuide ? 'grid-cols-1 lg:grid-cols-4 gap-6' : 'grid-cols-1'}`}>
        {/* User Guide (Sidebar) */}
        {showGuide && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>User Guide</CardTitle>
                <CardDescription>How to use the invoice generator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in your business details, client information, and invoice items. The system will automatically calculate totals.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Business Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your company name, logo, and contact information. This appears at the top of your invoice.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Client Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your client's details for billing purposes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Line Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Add products or services with descriptions, quantities, and rates. Amounts are calculated automatically.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Taxes & Discounts</h3>
                  <p className="text-sm textmuted-foreground">
                    Apply percentage or fixed amount tax and discount rates as needed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Payment Options</h3>
                  <p className="text-sm text-muted-foreground">
                    Add payment links or customize payment terms in the notes section.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Exporting</h3>
                  <p className="text-sm text-muted-foreground">
                    Print, download as PDF, or email the invoice directly to your client.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className={showGuide ? 'lg:col-span-3' : 'col-span-1'}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="edit">Edit Invoice</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleNewInvoice}>
                        <RotateCw className="h-4 w-4 mr-1" />
                        New
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create new invoice</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Sample button removed as per user request */}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleSaveInvoice}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save invoice to browser</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <TabsContent value="edit" className="space-y-6">
              {/* Invoice Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invoice-title">Invoice Title</Label>
                      <Input
                        id="invoice-title"
                        value={invoiceData.title}
                        onChange={(e) => setInvoiceData({...invoiceData, title: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="invoice-number">Invoice Number</Label>
                      <Input
                        id="invoice-number"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <div className="mt-1">
                        <CurrencySelector />
                        <p className="text-xs text-muted-foreground mt-1">
                          The currency selected here will be used for all tools in the application.
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={invoiceData.status}
                        onValueChange={(value: any) => setInvoiceData({...invoiceData, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="partial">Partially Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invoice-date">Invoice Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {invoiceData.invoiceDate ? format(invoiceData.invoiceDate, 'PPP') : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={invoiceData.invoiceDate}
                            onSelect={(date) => date && setInvoiceData({...invoiceData, invoiceDate: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="due-date">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {invoiceData.dueDate ? format(invoiceData.dueDate, 'PPP') : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={invoiceData.dueDate}
                            onSelect={(date) => date && setInvoiceData({...invoiceData, dueDate: date})}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="payment-link">Payment Link (Optional)</Label>
                      <Input
                        id="payment-link"
                        placeholder="https://payment.service.com/link"
                        value={invoiceData.paymentLink || ''}
                        onChange={(e) => setInvoiceData({...invoiceData, paymentLink: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business & Client Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Business Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="business-logo">Logo</Label>
                      <div className="mt-1 mb-3">
                        {logoPreview && (
                          <div className="mb-2">
                            <img
                              src={logoPreview}
                              alt="Business logo"
                              className="max-h-16 max-w-full"
                            />
                          </div>
                        )}
                        <Input
                          id="business-logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        value={invoiceData.businessDetails.name}
                        onChange={(e) => handleBusinessDetailChange('name', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="business-address">Address</Label>
                      <Input
                        id="business-address"
                        value={invoiceData.businessDetails.address}
                        onChange={(e) => handleBusinessDetailChange('address', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="business-city">City</Label>
                        <Input
                          id="business-city"
                          value={invoiceData.businessDetails.city}
                          onChange={(e) => handleBusinessDetailChange('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-state">State</Label>
                        <Input
                          id="business-state"
                          value={invoiceData.businessDetails.state}
                          onChange={(e) => handleBusinessDetailChange('state', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="business-zip">Zip Code</Label>
                        <Input
                          id="business-zip"
                          value={invoiceData.businessDetails.zipCode}
                          onChange={(e) => handleBusinessDetailChange('zipCode', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-country">Country</Label>
                        <Input
                          id="business-country"
                          value={invoiceData.businessDetails.country}
                          onChange={(e) => handleBusinessDetailChange('country', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="business-email">Email</Label>
                      <Input
                        id="business-email"
                        type="email"
                        value={invoiceData.businessDetails.email}
                        onChange={(e) => handleBusinessDetailChange('email', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="business-phone">Phone</Label>
                      <Input
                        id="business-phone"
                        value={invoiceData.businessDetails.phone}
                        onChange={(e) => handleBusinessDetailChange('phone', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Client Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        value={invoiceData.clientDetails.name}
                        onChange={(e) => handleClientDetailChange('name', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="client-address">Address</Label>
                      <Input
                        id="client-address"
                        value={invoiceData.clientDetails.address}
                        onChange={(e) => handleClientDetailChange('address', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="client-city">City</Label>
                        <Input
                          id="client-city"
                          value={invoiceData.clientDetails.city}
                          onChange={(e) => handleClientDetailChange('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-state">State</Label>
                        <Input
                          id="client-state"
                          value={invoiceData.clientDetails.state}
                          onChange={(e) => handleClientDetailChange('state', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="client-zip">Zip Code</Label>
                        <Input
                          id="client-zip"
                          value={invoiceData.clientDetails.zipCode}
                          onChange={(e) => handleClientDetailChange('zipCode', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-country">Country</Label>
                        <Input
                          id="client-country"
                          value={invoiceData.clientDetails.country}
                          onChange={(e) => handleClientDetailChange('country', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="client-email">Email</Label>
                      <Input
                        id="client-email"
                        type="email"
                        value={invoiceData.clientDetails.email}
                        onChange={(e) => handleClientDetailChange('email', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="client-phone">Phone</Label>
                      <Input
                        id="client-phone"
                        value={invoiceData.clientDetails.phone}
                        onChange={(e) => handleClientDetailChange('phone', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-3 font-medium">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Rate</div>
                      <div className="col-span-2">Amount</div>
                    </div>

                    {invoiceData.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-6">
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-1 font-medium">
                          {formatCurrency(item.amount, invoiceData.currency)}
                        </div>
                        <div className="col-span-1 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={invoiceData.items.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tax, Discount & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tax & Discount */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tax & Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="tax-rate">Tax</Label>
                          <div className="flex items-center">
                            <Label htmlFor="tax-type" className="mr-2 text-sm">Type:</Label>
                            <Select
                              value={invoiceData.taxType}
                              onValueChange={(value: any) => setInvoiceData({...invoiceData, taxType: value})}
                            >
                              <SelectTrigger id="tax-type" className="h-8 w-32">
                                <SelectValue placeholder="Tax type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          {invoiceData.taxType === 'percentage' && <span className="mr-2">%</span>}
                          {invoiceData.taxType === 'fixed' &&
                            <span className="mr-2">{currencySymbols[invoiceData.currency] || '$'}</span>
                          }
                          <Input
                            id="tax-rate"
                            type="number"
                            min="0"
                            step={invoiceData.taxType === 'percentage' ? '1' : '0.01'}
                            value={invoiceData.taxRate}
                            onChange={(e) => setInvoiceData({...invoiceData, taxRate: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="discount-rate">Discount</Label>
                          <div className="flex items-center">
                            <Label htmlFor="discount-type" className="mr-2 text-sm">Type:</Label>
                            <Select
                              value={invoiceData.discountType}
                              onValueChange={(value: any) => setInvoiceData({...invoiceData, discountType: value})}
                            >
                              <SelectTrigger id="discount-type" className="h-8 w-32">
                                <SelectValue placeholder="Discount type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          {invoiceData.discountType === 'percentage' && <span className="mr-2">%</span>}
                          {invoiceData.discountType === 'fixed' &&
                            <span className="mr-2">{currencySymbols[invoiceData.currency] || '$'}</span>
                          }
                          <Input
                            id="discount-rate"
                            type="number"
                            min="0"
                            step={invoiceData.discountType === 'percentage' ? '1' : '0.01'}
                            value={invoiceData.discountRate}
                            onChange={(e) => setInvoiceData({...invoiceData, discountRate: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal(), invoiceData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(calculateTax(), invoiceData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-{formatCurrency(calculateDiscount(), invoiceData.currency)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-1 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal(), invoiceData.currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes & Terms */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notes & Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Thank you for your business!"
                        className="h-24"
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="terms">Payment Terms</Label>
                      <Textarea
                        id="terms"
                        placeholder="Payment due within 14 days of invoice date."
                        className="h-24"
                        value={invoiceData.terms}
                        onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="print:block">
              <Card className="print:shadow-none print:border-none">
                <CardContent className="p-8">
                  {/* Invoice Preview */}
                  <div className="space-y-6">
                    {/* Invoice Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        {logoPreview && (
                          <img
                            src={logoPreview}
                            alt="Business logo"
                            className="max-h-20 max-w-[200px] mb-4"
                          />
                        )}
                        <h2 className="text-2xl font-bold">{invoiceData.businessDetails.name}</h2>
                        <div className="text-sm text-muted-foreground">
                          <p>{invoiceData.businessDetails.address}</p>
                          <p>
                            {invoiceData.businessDetails.city}, {invoiceData.businessDetails.state} {invoiceData.businessDetails.zipCode}
                          </p>
                          <p>{invoiceData.businessDetails.country}</p>
                          <p>{invoiceData.businessDetails.phone}</p>
                          <p>{invoiceData.businessDetails.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <h1 className="text-3xl font-bold">{invoiceData.title}</h1>
                        <div className="text-sm text-muted-foreground mt-2">
                          <p><span className="font-medium">Invoice #:</span> {invoiceData.invoiceNumber}</p>
                          <p>
                            <span className="font-medium">Date:</span> {format(invoiceData.invoiceDate, 'PP')}
                          </p>
                          <p>
                            <span className="font-medium">Due Date:</span> {format(invoiceData.dueDate, 'PP')}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoiceData.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoiceData.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              invoiceData.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {invoiceData.status === 'paid' ? 'Paid' :
                                invoiceData.status === 'partial' ? 'Partially Paid' :
                                invoiceData.status === 'unpaid' ? 'Unpaid' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bill To Section */}
                    <div className="mt-8 border-t pt-4">
                      <h3 className="font-medium text-lg">Bill To:</h3>
                      <div className="mt-2">
                        <h4 className="font-bold">{invoiceData.clientDetails.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{invoiceData.clientDetails.address}</p>
                          <p>
                            {invoiceData.clientDetails.city}, {invoiceData.clientDetails.state} {invoiceData.clientDetails.zipCode}
                          </p>
                          <p>{invoiceData.clientDetails.country}</p>
                          <p>{invoiceData.clientDetails.phone}</p>
                          <p>{invoiceData.clientDetails.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mt-8">
                      <div className="rounded-md border overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Item
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Rate
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-border">
                            {invoiceData.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-3 text-sm">
                                  {item.description}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {formatCurrency(item.rate, invoiceData.currency)}
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  {formatCurrency(item.amount, invoiceData.currency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Total Calculation */}
                    <div className="flex justify-end">
                      <div className="w-full max-w-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>{formatCurrency(calculateSubtotal(), invoiceData.currency)}</span>
                          </div>

                          {invoiceData.taxRate > 0 && (
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">
                                Tax {invoiceData.taxType === 'percentage' ? `(${invoiceData.taxRate}%)` : ''}:
                              </span>
                              <span>{formatCurrency(calculateTax(), invoiceData.currency)}</span>
                            </div>
                          )}

                          {invoiceData.discountRate > 0 && (
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">
                                Discount {invoiceData.discountType === 'percentage' ? `(${invoiceData.discountRate}%)` : ''}:
                              </span>
                              <span>-{formatCurrency(calculateDiscount(), invoiceData.currency)}</span>
                            </div>
                          )}

                          <div className="flex justify-between py-2 text-lg font-bold border-t">
                            <span>Total:</span>
                            <span>{formatCurrency(calculateTotal(), invoiceData.currency)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Link */}
                    {invoiceData.paymentLink && (
                      <div className="mt-6 text-center">
                        <a
                          href={invoiceData.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </a>
                      </div>
                    )}

                    {/* Notes & Terms */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Notes:</h3>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {invoiceData.notes}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium">Terms:</h3>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {invoiceData.terms}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-center gap-2 print:hidden">
                <Button onClick={printInvoice} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={downloadInvoice} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={emailInvoice} variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Invoice
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          {/* Invoice History Section */}
          <InvoiceHistory
            invoices={savedInvoices}
            onLoadInvoice={loadInvoice}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;

const currencySymbols: {[key: string]: string} = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'JPY': '¥',
  'CAD': 'CA$',
  'AUD': 'A$',
  'CNY': '¥',
};