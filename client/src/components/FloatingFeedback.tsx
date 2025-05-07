import React, { useState } from 'react';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'general', label: 'General Feedback' },
];

const FloatingFeedback: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(FEEDBACK_TYPES[0].value);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!message.trim()) {
      setError('Message is required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, email }),
      });
      if (!res.ok) throw new Error('Failed to send feedback');
      setSubmitted(true);
      setMessage('');
      setEmail('');
      setType(FEEDBACK_TYPES[0].value);
    } catch (err) {
      setError('Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition"
        onClick={() => setOpen(true)}
        aria-label="Open Feedback Form"
      >
        Feedback
      </button>
      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30" onClick={() => setOpen(false)}>
          {/* Modal Drawer */}
          <div
            className="bg-background w-full max-w-sm rounded-t-lg shadow-xl p-6 m-0 mb-0 mr-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Send Feedback</h4>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-xl font-bold">×</button>
            </div>
            {submitted ? (
              <div className="text-green-500 font-medium py-8 text-center">Thanks for your feedback!</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type of Feedback</label>
                  <select
                    className="w-full p-2 border rounded-md bg-muted text-foreground"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    {FEEDBACK_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message <span className="text-destructive">*</span></label>
                  <textarea
                    className="w-full p-2 border rounded-md bg-muted text-foreground min-h-[80px]"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  />
                  {error && <div className="text-xs text-destructive mt-1">{error}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email (optional)</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md bg-muted text-foreground"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary/90 transition flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Slide-up animation */}
      <style>{`
        .animate-slide-up {
          animation: slideUp 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default FloatingFeedback; 