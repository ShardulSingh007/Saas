import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
  dueDate: string;
  items: InvoiceItem[];
  customer: {
    name: string;
    email: string;
  };
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function AdminInvoiceDetails() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/admin/invoices/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invoice details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice status');
      }

      toast({
        title: "Success",
        description: "Invoice status has been updated successfully.",
      });
      fetchInvoice();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
          <Button onClick={() => navigate('/admin/invoices')}>
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoice Details</h1>
        <div className="space-x-4">
          <Button onClick={() => navigate('/admin/invoices')}>
            Back to Invoices
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
            <CardDescription>Invoice #{invoice.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <p>{invoice.customer.name}</p>
                <p>{invoice.customer.email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Invoice Details</h3>
                <p>Status: {invoice.status}</p>
                <p>Created: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">${item.total.toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 font-bold">
                <p>Total</p>
                <p>${invoice.amount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus('paid')}
            disabled={invoice.status === 'paid'}
          >
            Mark as Paid
          </Button>
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus('overdue')}
            disabled={invoice.status === 'overdue'}
          >
            Mark as Overdue
          </Button>
        </div>
      </div>
    </div>
  );
} 