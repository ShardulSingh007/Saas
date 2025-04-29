import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';

let anthropicInstance: Anthropic | null = null;

export function getAnthropic() {
  if (!anthropicInstance) {
    // Only create the anthropic instance if the API key is available
    if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
      anthropicInstance = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      });
    }
  }
  return anthropicInstance;
}

export async function generateFinancialAdvice(
  question: string,
  expenseData: any
): Promise<string> {
  const anthropic = getAnthropic();
  
  if (!anthropic) {
    return "Sorry, I'm unable to provide personalized advice at the moment. Please make sure an API key is set.";
  }

  try {
    const expenseSummary = summarizeExpenses(expenseData);
    
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      temperature: 0.7,
      system: `You are Finny, a friendly and helpful AI Finance Buddy. 
      You provide practical and personalized financial advice based on the user's expense data.
      Keep your responses encouraging, upbeat, and easy to understand.
      Personalize your advice based on the expense summary provided.
      Use simple language and avoid being overly technical.
      Aim to provide 2-3 actionable suggestions in each response.
      Be conversational and use emojis occasionally to seem friendly.`,
      messages: [
        {
          role: 'user',
          content: `Here's my question: "${question}"\n\nHere's a summary of my recent expenses:\n${expenseSummary}`,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('AI response error:', error);
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
}

function summarizeExpenses(expenseData: any): string {
  if (!expenseData || !expenseData.expenses || expenseData.expenses.length === 0) {
    return "No expense data provided.";
  }

  const { expenses, categoryTotals, monthlyTotal } = expenseData;
  
  let summary = `Monthly total: $${monthlyTotal.toFixed(2)}\n\n`;
  
  summary += "Top expense categories:\n";
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 3);
  
  sortedCategories.forEach(([category, amount]: [string, any]) => {
    const percentage = (amount / monthlyTotal) * 100;
    summary += `- ${category}: $${amount.toFixed(2)} (${percentage.toFixed(1)}%)\n`;
  });
  
  summary += "\nRecent transactions:\n";
  expenses.slice(0, 5).forEach((expense: any) => {
    summary += `- $${expense.amount.toFixed(2)} for ${expense.description} (${expense.category})\n`;
  });
  
  return summary;
}