import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Challenge, CodeExecution } from '../../types';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  challenge: Challenge;
  onComplete?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ challenge, onComplete }) => {
  const { executeCode, saveCodeDraft, getCodeDraft } = useApp();
  const [code, setCode] = useState(challenge.starterCode);
  const [execution, setExecution] = useState<CodeExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Load saved draft
    const draft = getCodeDraft(challenge.id);
    if (draft) {
      setCode(draft);
    }
  }, [challenge.id, getCodeDraft]);

  useEffect(() => {
    // Auto-save draft
    const timer = setTimeout(() => {
      if (code !== challenge.starterCode) {
        saveCodeDraft(challenge.id, code);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [code, challenge.id, challenge.starterCode, saveCodeDraft]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await executeCode(code, challenge.language);
      setExecution(result);
      
      if (result.status === 'SUCCESS') {
        toast.success('Code executed successfully!');
        if (onComplete) {
          onComplete();
        }
      } else {
        toast.error('Code execution failed');
      }
    } catch (error) {
      toast.error('Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    saveCodeDraft(challenge.id, code);
    toast.success('Code saved successfully!');
  };

  const handleReset = () => {
    setCode(challenge.starterCode);
    setExecution(null);
    toast.success('Code reset to starter template');
  };

  const getLanguageDisplayName = (language: string) => {
    const names: { [key: string]: string } = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++'
    };
    return names[language] || language;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600 bg-green-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'HARD':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Challenge Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{challenge.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getLanguageDisplayName(challenge.language)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Points:</span>
            <span className="font-bold text-orange-600">{challenge.points}</span>
          </div>
        </div>
        <p className="text-gray-700">{challenge.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Code Editor */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Code Editor</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm">Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100 transition-all duration-200"
              >
                <Save className="h-4 w-4" />
                <span className="text-sm">Save</span>
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isRunning ? 'Running...' : 'Run Code'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="500px"
              language={challenge.language === 'cpp' ? 'cpp' : challenge.language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col border-l border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Output & Test Results</h3>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* Test Cases */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Test Cases</h4>
              <div className="space-y-2">
                {challenge.testCases.map((testCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Test Case {index + 1}
                      </span>
                      {execution && (
                        <div className="flex items-center space-x-1">
                          {execution.status === 'SUCCESS' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : execution.status === 'ERROR' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-gray-500">Input:</span>
                        <code className="ml-2 bg-white px-2 py-1 rounded text-gray-800">
                          {testCase.input || 'None'}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-500">Expected:</span>
                        <code className="ml-2 bg-white px-2 py-1 rounded text-gray-800">
                          {testCase.expectedOutput}
                        </code>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Execution Result */}
            {execution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h4 className="font-medium text-gray-900">Execution Result</h4>
                
                {execution.status === 'SUCCESS' && execution.output && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-800">Success</span>
                    </div>
                    <pre className="text-sm text-green-700 bg-white p-2 rounded">
                      {execution.output}
                    </pre>
                  </div>
                )}

                {execution.status === 'ERROR' && execution.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Error</span>
                    </div>
                    <pre className="text-sm text-red-700 bg-white p-2 rounded">
                      {execution.error}
                    </pre>
                  </div>
                )}

                {(execution.executionTime || execution.memory) && (
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    {execution.executionTime && (
                      <span>Runtime: {execution.executionTime.toFixed(2)}ms</span>
                    )}
                    {execution.memory && (
                      <span>Memory: {execution.memory.toFixed(2)}MB</span>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {!execution && (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Run your code to see the results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;