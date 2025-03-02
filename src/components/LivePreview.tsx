
import { useRoomStore } from '@/lib/store';
import { useEffect, useRef, useState } from 'react';

const LivePreview = () => {
  const { currentRoom } = useRoomStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!currentRoom) return;
    
    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      
      setIsLoading(true);
      
      // Create a document with the current code
      let previewContent = '';
      
      switch (currentRoom.language) {
        case 'html':
          previewContent = currentRoom.code;
          break;
        case 'css':
          previewContent = `
            <html>
              <head>
                <style>${currentRoom.code}</style>
              </head>
              <body>
                <div class="preview-container">This is a CSS preview. Add HTML elements in your CSS to see the styles.</div>
              </body>
            </html>
          `;
          break;
        case 'javascript':
          previewContent = `
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  #output { background: #f1f1f1; padding: 10px; border-radius: 4px; }
                </style>
              </head>
              <body>
                <h3>JavaScript Output:</h3>
                <div id="output"></div>
                <script>
                  // Capture console.log output
                  const output = document.getElementById('output');
                  const originalLog = console.log;
                  console.log = function(...args) {
                    originalLog.apply(console, args);
                    const line = document.createElement('div');
                    line.textContent = args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg) : arg
                    ).join(' ');
                    output.appendChild(line);
                  };
                  
                  // Execute user code in try/catch
                  try {
                    ${currentRoom.code}
                  } catch (error) {
                    console.log('Error:', error.message);
                  }
                </script>
              </body>
            </html>
          `;
          break;
        default:
          previewContent = `
            <html>
              <body>
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                  <h3>Preview not available for ${currentRoom.language}</h3>
                  <p>Preview is currently supported for HTML, CSS, and JavaScript code.</p>
                </div>
              </body>
            </html>
          `;
      }
      
      // Update iframe content
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(previewContent);
        iframeDoc.close();
        setIsLoading(false);
      }
    };
    
    // Update the preview when the code changes
    updatePreview();
    
    // Add event listener to iframe to handle load event
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => setIsLoading(false);
    }
    
    // Set up a timer to update the preview periodically (for real-time updates)
    const interval = setInterval(updatePreview, 3000);
    
    return () => clearInterval(interval);
  }, [currentRoom]);
  
  if (!currentRoom?.hasSubscription) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg border p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">Live Preview</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Subscribe to unlock live code preview
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col rounded-lg border overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Live Preview</h3>
      </div>
      
      <div className="relative flex-1 bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-sm text-muted-foreground animate-pulse">Loading preview...</p>
          </div>
        )}
        <iframe 
          ref={iframeRef}
          title="Code Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default LivePreview;
