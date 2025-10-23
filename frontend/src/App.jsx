import { useState, useCallback } from 'react';
import Markdown from 'react-markdown';
import axios from 'axios';
import { RefreshCcw, Loader2 } from 'lucide-react';

const editorStyle = {
  fontFamily: '"Fira Code", "Fira Mono", monospace',
  fontSize: 14,
  minHeight: '100%',
  padding: '16px',
  lineHeight: '1.5',
  tabSize: 4,
  resize: 'none',
  backgroundColor: '#1f2937',
  color: '#f3f4f6',
  border: 'none',
  outline: 'none',
};

const App = () => {
  const [code, setCode] = useState(
    `function calculateFibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}`
  );
  const [review, setReview] = useState(
    `## Welcome to the AI Code Reviewer

Enter your code on the left and click **Review Code** to get instant feedback on complexity, best practices, and potential bugs.

The review will appear here.
`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reviewCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://ai-code-reviewer-60yh.onrender.com/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch review. Please check the server connection (https://ai-code-reviewer-60yh.onrender.com).');
      setReview('## Error\n\nFailed to fetch review. Check your network connection and server status.');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 font-sans flex flex-col">
      <header className="mb-6 p-4 border-b border-gray-700">
        <h1 className="text-3xl font-extrabold text-indigo-400 tracking-tight">
          AI Code Reviewer
        </h1>
        <p className="text-sm text-gray-400 mt-1">Instant, AI-powered code reviews.</p>
      </header>

      <main className="flex flex-1 flex-col md:flex-row gap-6">
        <div className="md:flex-1 flex flex-col min-h-[40vh] md:min-h-full">
          <h2 className="text-xl font-semibold mb-3 text-gray-200">
            1. Code Input
          </h2>
          <div className="flex-1 rounded-xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={editorStyle}
              className="w-full h-full block"
              placeholder="Paste your code here..."
            />
            <button
              onClick={reviewCode}
              disabled={isLoading}
              className={`
                absolute bottom-4 right-4 z-10
                flex items-center space-x-2
                px-6 py-3 rounded-full
                font-bold text-sm tracking-wider
                transition-all duration-300 ease-in-out
                shadow-lg hover:shadow-xl
                ${isLoading 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white transform hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Reviewing...' : 'Review Code'}</span>
            </button>
          </div>
        </div>

        <div className="md:flex-1 flex flex-col min-h-[40vh] md:min-h-full">
          <h2 className="text-xl font-semibold mb-3 text-gray-200">
            2. AI Review Result
          </h2>
          <div className="flex-1 p-6 overflow-y-auto rounded-xl shadow-2xl bg-gray-800 border border-gray-700 prose prose-invert max-w-none">
            {error && (
              <div className="p-4 bg-red-800 text-red-100 rounded-lg mb-4">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            <Markdown>{review}</Markdown>
          </div>
        </div>
      </main>
      <a href="https://github.com/kanishk-276" target="_blank" rel="noopener noreferrer">
        <h1 className='text-white/20 ml-[85%] hover:text-white/50'>github/kanishk-276</h1>
      </a>
    </div>
  );
};

export default App;
