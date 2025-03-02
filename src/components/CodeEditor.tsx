import { useEffect, useState, useRef } from 'react';
import { useRoomStore } from '@/lib/store';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Helper function to get language class for Prism
const getPrismLanguage = (language: string): string => {
  switch (language) {
    case 'javascript':
      return 'language-javascript';
    case 'typescript':
      return 'language-typescript';
    case 'python':
      return 'language-python';
    case 'html':
      return 'language-markup';
    case 'css':
      return 'language-css';
    default:
      return 'language-javascript';
  }
};

const CodeEditor = () => {
  const { currentRoom, updateCode } = useRoomStore();
  const [code, setCode] = useState(currentRoom?.code || '');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [lastTyped, setLastTyped] = useState(0);
  const SYNC_DELAY = 500; // sync after 500ms of no typing

  // Initialize code from room
  useEffect(() => {
    if (currentRoom) {
      setCode(currentRoom.code);
    }
  }, [currentRoom?.id]);

  // Sync code with room store
  useEffect(() => {
    if (!currentRoom) return;

    // Only sync code if it's different from current room code
    // and if user hasn't typed for SYNC_DELAY ms
    const handler = setTimeout(() => {
      if (code !== currentRoom.code) {
        updateCode(code);
      }
    }, SYNC_DELAY);

    return () => clearTimeout(handler);
  }, [code, currentRoom, updateCode, lastTyped]);

  // Handle code changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setLastTyped(Date.now());
  };

  // Apply syntax highlighting
  useEffect(() => {
    if (editorRef.current) {
      Prism.highlightElement(editorRef.current);
    }
  }, [code, currentRoom?.language]);

  // Run code function
  const runCode = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "There's no code to run",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setOutput('');

    // Create a safe console.log replacement
    const originalConsoleLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args) => {
      originalConsoleLog(...args);
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    try {
      // For JavaScript execution only
      if (currentRoom?.language === 'javascript') {
        // Create a safe execution environment
        const safeEval = new Function('code', `
          try {
            const originalFetch = window.fetch;
            window.fetch = function() { 
              throw new Error('fetch is disabled in code execution for security reasons'); 
            };
            
            const result = eval(code);
            window.fetch = originalFetch;
            return { result, logs };
          } catch (error) {
            window.fetch = originalFetch;
            throw error;
          }
        `);
        
        const { result, logs: executionLogs } = safeEval(code);
        
        if (logs.length > 0) {
          setOutput(`// Console Output:\n${logs.join('\n')}\n\n// Return Value:\n${result !== undefined ? JSON.stringify(result, null, 2) : 'undefined'}`);
        } else {
          setOutput(`// Return Value:\n${result !== undefined ? JSON.stringify(result, null, 2) : 'undefined'}`);
        }
        
        toast({
          title: "Code executed",
          description: "Code ran successfully",
        });
      } else {
        // For non-JS languages, we'll just show a message
        setOutput(`Running ${currentRoom?.language} code is not supported in the browser.\nThis would typically run on a server.`);
      }
    } catch (error: any) {
      console.error('Code execution error:', error);
      setOutput(`// Error:\n${error.message}`);
      toast({
        title: "Execution Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      // Restore the original console.log
      console.log = originalConsoleLog;
      setIsRunning(false);
      
      // Scroll the output into view
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!currentRoom) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Join a room to start coding</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="text-sm font-medium">
          {currentRoom.language.charAt(0).toUpperCase() + currentRoom.language.slice(1)}
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={runCode}
          disabled={isRunning}
        >
          <Play size={14} />
          Run Code
        </Button>
      </div>
      
      <div className="relative flex-1 overflow-auto">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="absolute inset-0 w-full h-full p-4 font-mono text-transparent bg-transparent resize-none caret-white z-10 outline-none"
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
        <pre className="absolute inset-0 w-full h-full p-4 font-mono overflow-auto pointer-events-none">
          <code 
            ref={editorRef} 
            className={getPrismLanguage(currentRoom.language || 'javascript')}
          >
            {code || '// Start coding here'}
          </code>
        </pre>
      </div>
      
      {output && (
        <div className="border-t">
          <div className="px-4 py-2 text-sm font-medium border-b">Output</div>
          <div 
            ref={outputRef} 
            className="h-48 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap bg-muted/50"
          >
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
