let feedbackStore: any[] = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { type, message, email } = req.body;
    const feedback = { type, message, email, date: new Date().toISOString() };
    feedbackStore.push(feedback);
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    res.status(200).json(feedbackStore);
  } else {
    res.status(405).end();
  }
} 