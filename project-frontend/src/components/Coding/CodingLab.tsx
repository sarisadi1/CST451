import React, { useState } from 'react';
import { Code, Filter, Search, Trophy, Clock, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CodeEditor from './CodeEditor';
import { Challenge } from '../../types';
import { motion } from 'framer-motion';

const CodingLab: React.FC = () => {
  const { courses, updateProgress } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');

  // Extract all challenges from courses
  const allChallenges: Challenge[] = courses.flatMap(course =>
    course.lessons.flatMap(lesson => lesson.challenges)
  );

  const filteredChallenges = allChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'ALL' || challenge.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === 'ALL' || challenge.language === selectedLanguage;
    
    return matchesSearch && matchesDifficulty && matchesLanguage;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'HARD':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getLanguageIcon = (language: string) => {
    const icons: { [key: string]: string } = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡'
    };
    return icons[language] || '💻';
  };

  const handleChallengeComplete = (challengeId: string) => {
    // Find which course this challenge belongs to
    const course = courses.find(c =>
      c.lessons.some(l => l.challenges.some(ch => ch.id === challengeId))
    );
    
    if (course) {
      updateProgress(course.id, undefined, challengeId);
    }
  };

  if (selectedChallenge) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <button
            onClick={() => setSelectedChallenge(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <span>← Back to Coding Lab</span>
          </button>
        </div>
        <CodeEditor 
          challenge={selectedChallenge}
          onComplete={() => handleChallengeComplete(selectedChallenge.id)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <Code className="h-8 w-8 text-blue-600" />
          <span>Coding Lab</span>
        </h1>
        <p className="text-gray-600">Practice coding challenges and improve your programming skills</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Challenges</p>
              <p className="text-3xl font-bold text-gray-900">{allChallenges.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">85%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Avg. Time</p>
              <p className="text-3xl font-bold text-gray-900">8m</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setSelectedChallenge(challenge)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getLanguageIcon(challenge.language)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">{challenge.points}pt</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Language:</span>
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {challenge.language}
                  </span>
                </div>
                {challenge.isCompleted && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No challenges found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CodingLab;