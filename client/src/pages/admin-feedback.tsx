import React, { useEffect, useState } from "react";

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
      {loading ? (
        <div>Loading...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-gray-500">No feedback submitted yet.</div>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb, i) => (
            <li key={i} className="border rounded p-4 bg-muted">
              <div className="text-sm text-gray-500 mb-1">{new Date(fb.date).toLocaleString()}</div>
              <div className="font-semibold">{fb.type}</div>
              <div className="mb-2">{fb.message}</div>
              {fb.email && <div className="text-xs text-gray-400">Email: {fb.email}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFeedback; 