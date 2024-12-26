import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronDown, Search, ArrowUp } from 'lucide-react';
import './DocumentationPage.css';

// Documentation sections
const sections = [
  {
    title: 'Getting Started',
    items: [
      { id: 'getting-started', title: 'Getting Started Guide' },
      { id: 'introduction', title: 'Introduction to Mentora' }
    ]
  },
  {
    title: 'Core Features',
    items: [
      { id: 'chat', title: 'Chat with Eliana' },
      { id: 'quiz', title: 'Quiz System' },
      { id: 'brain-brawl', title: 'Brain Brawl' },
      { id: 'progress', title: 'Progress Tracking' },
      { id: 'leaderboard', title: 'Leaderboard System' }
    ]
  },
  {
    title: 'Technical & Support',
    items: [
      { id: 'technical', title: 'Technical Information' },
      { id: 'privacy', title: 'Privacy & Security' },
      { id: 'support', title: 'Support & Help' }
    ]
  }
];

// Documentation content
const documentationContent: Record<string, { title: string; content: string; lastUpdated: string }> = {
  'getting-started': {
    title: 'Getting Started',
    content: `
# Getting Started with Mentora

Welcome to Mentora! This guide will help you get started with our platform and make the most of your learning experience. Follow these steps to begin your educational journey with us.

## Overview

### Platform Features
- AI-powered learning assistant
- Interactive quizzes
- Competitive Brain Brawl
- Progress tracking
- Performance analytics
- Social learning

## Account Setup

### 1. Creating Your Account
1. Click "Sign Up"
2. Choose authentication method
3. Enter required information
4. Verify email
5. Complete profile
6. Start learning

### 2. Profile Configuration
- Add personal details
- Set preferences
- Choose subjects
- Select grade level
- Upload photo
- Customize settings

## Initial Setup

### 1. Onboarding Process
1. Welcome introduction
2. Feature overview
3. Subject selection
4. Grade level choice
5. Interest areas
6. Learning goals

### 2. Platform Navigation
- Dashboard overview
- Feature locations
- Quick access
- Menu options
- Settings access
- Help resources

## Core Features

### 1. Chat with Eliana
- AI learning assistant
- Subject expertise
- Instant help
- Study guidance
- Practice support
- Learning resources

### 2. Quiz System
- Subject quizzes
- Progress tracking
- Performance metrics
- Learning analytics
- Practice sessions
- Knowledge assessment

### 3. Brain Brawl
- Competitive learning
- Real-time matches
- Subject challenges
- Skill testing
- Score tracking
- Achievement system

### 4. Progress Tracking
- Performance metrics
- Learning analytics
- Achievement tracking
- Goal monitoring
- Improvement tracking
- Progress reports

## Getting Help

### 1. Support Resources
- Help center
- FAQs
- User guides
- Video tutorials
- Contact support
- Community help

### 2. Common Questions
- Account setup
- Feature access
- Technical issues
- Learning support
- Content questions
- Platform usage

## Best Practices

### 1. Learning Strategy
- Regular engagement
- Balanced practice
- Goal setting
- Progress monitoring
- Active participation
- Continuous improvement

### 2. Time Management
- Study scheduling
- Practice sessions
- Quiz planning
- Battle preparation
- Progress review
- Goal tracking

### 3. Feature Usage
- Regular practice
- Active learning
- Feature exploration
- Resource utilization
- Progress tracking
- Community engagement

## Platform Navigation

### 1. Main Sections
- Dashboard
- Chat
- Quizzes
- Brain Brawl
- Progress
- Settings

### 2. Key Functions
- Feature access
- Content navigation
- Settings management
- Progress tracking
- Resource finding
- Help access

## Technical Requirements

### 1. System Requirements
- Modern browser
- Stable internet
- Updated system
- Sufficient memory
- Display capability
- Audio support

### 2. Device Support
- Desktop computers
- Laptops
- Tablets
- Mobile phones
- Web browsers
- Operating systems

## Privacy & Security

### 1. Account Security
- Strong passwords
- Regular updates
- Secure access
- Privacy settings
- Data protection
- Safe usage

### 2. Data Privacy
- Information security
- Privacy controls
- Data management
- Access settings
- Content privacy
- User protection

## Tips for Success

### 1. Getting Started
- Complete profile
- Explore features
- Set goals
- Start learning
- Track progress
- Seek help

### 2. Regular Usage
- Daily practice
- Feature utilization
- Progress monitoring
- Goal achievement
- Active participation
- Continuous learning

### 3. Community Engagement
- Peer interaction
- Knowledge sharing
- Support network
- Collaborative learning
- Social features
- Group activities

Remember, Mentora is designed to support your educational journey. Take time to explore all features, set clear goals, and maintain regular engagement for the best learning experience!
    `,
    lastUpdated: '2024-01-15'
  },
  'introduction': {
    title: 'Introduction to Mentora',
    content: `
# Welcome to Mentora

Mentora is an advanced educational platform designed to provide personalized learning experiences through AI-powered assistance. Our platform combines cutting-edge technology with proven educational methodologies to help students achieve their academic goals.

## Key Features

- **AI Learning Assistant (Eliana)**: Get instant help and explanations for any subject
- **Interactive Quizzes**: Test your knowledge with adaptive quizzes
- **Brain Brawl**: Challenge other students in educational competitions
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Personalized Learning**: Receive customized recommendations based on your performance

## Why Choose Mentora?

1. **Personalized Learning Experience**: Our AI adapts to your learning style and pace
2. **Comprehensive Subject Coverage**: Access materials across various subjects and grade levels
3. **Engaging Learning Methods**: Learn through interactive quizzes and competitions
4. **Progress Monitoring**: Track your improvement with detailed analytics
5. **Community Learning**: Connect with peers and compete in educational challenges

## Getting Started

To begin your learning journey with Mentora:

1. Create your account
2. Complete your profile
3. Select your subjects of interest
4. Start learning with Eliana
5. Track your progress

We're excited to be part of your educational journey!
    `,
    lastUpdated: '2024-01-15'
  },
  'eliana-chat': {
    title: 'Chat with Eliana',
    content: `
# Chat with Eliana - Your AI Learning Assistant

Eliana is your personal AI learning assistant, designed to provide instant help, explanations, and guidance across all subjects. This guide will help you make the most of your interactions with Eliana.

## Getting Started with Eliana

### How to Access
1. Log into your Mentora account
2. Click on the "Chat" option in the navigation menu
3. You'll be connected to Eliana immediately

### Key Features

#### 1. Subject-Specific Help
- Ask questions about any subject in your curriculum
- Get detailed explanations with examples
- Request step-by-step problem-solving guidance

#### 2. Adaptive Learning
- Eliana remembers your previous interactions
- Adjusts explanations based on your understanding
- Provides personalized learning recommendations

#### 3. Interactive Learning
- Practice problems and exercises
- Real-time feedback on your answers
- Progressive difficulty based on your performance

## Best Practices for Using Eliana

### 1. Be Specific with Questions
✅ Good: "Can you explain how photosynthesis works in plants?"
❌ Avoid: "Tell me about plants"

### 2. Follow Up for Clarity
- Ask for simpler explanations if needed
- Request additional examples
- Seek clarification on specific points

### 3. Use Learning Features
- Practice with sample problems
- Ask for quizzes to test understanding
- Request summaries of complex topics

## Tips for Effective Learning

1. **Start with Basics**
   - Ensure you understand fundamental concepts
   - Build up to more complex topics
   - Ask for prerequisites when needed

2. **Active Learning**
   - Try to solve problems before asking for solutions
   - Explain concepts back to Eliana
   - Apply concepts to real-world examples

3. **Regular Practice**
   - Set aside dedicated time for learning
   - Review previous topics regularly
   - Track your progress

## Common Questions & Features

### Study Planning
- Ask Eliana to help create study schedules
- Get recommendations for topic sequences
- Receive time management tips

### Exam Preparation
- Request practice questions
- Get exam strategy advice
- Review key concepts efficiently

### Subject Understanding
- Deep dive into specific topics
- Connect different concepts
- Explore practical applications

## Technical Tips

1. **Clear Communication**
   - Use proper punctuation
   - Break down complex questions
   - Provide context when needed

2. **Session Management**
   - Start new topics with clear intentions
   - Save important explanations
   - Review session history for continuity

3. **Feedback Loop**
   - Let Eliana know if explanations are helpful
   - Ask for alternative explanations when needed
   - Share your learning preferences

## Support and Additional Help

If you encounter any issues while using Eliana:
1. Refresh the chat if responses seem unclear
2. Check your internet connection
3. Contact support for technical issues

Remember, Eliana is here to help you succeed in your learning journey. Don't hesitate to ask questions and seek clarification whenever needed!
    `,
    lastUpdated: '2024-01-15'
  },
  'brain-brawl': {
    title: 'Brain Brawl',
    content: `
# Brain Brawl - Competitive Learning

Brain Brawl is an exciting competitive learning feature that allows you to challenge other students or AI opponents in real-time quiz battles. Test your knowledge, improve your skills, and climb the leaderboard while having fun!

## Overview

### Key Features
- Real-time quiz battles
- AI opponent matching
- Subject-specific challenges
- Grade-level appropriate content
- Dynamic scoring system
- Performance tracking

## Getting Started

### 1. Accessing Brain Brawl
1. Navigate to the Brain Brawl section
2. Select your preferred subject
3. Choose your grade level
4. Click "Start Battle"
5. Wait for opponent matching
6. Begin the challenge

### 2. Matchmaking System
- Real-time player matching
- AI opponent fallback
- Subject-based pairing
- Grade-level matching
- Quick match initiation
- Fair competition

## Battle Structure

### 1. Battle Format
- Multiple-choice questions
- Timed responses
- Score tracking
- Progress indicators
- Real-time feedback
- Final results

### 2. Question Types
- Subject-specific content
- Grade-appropriate difficulty
- Varied topics
- Dynamic generation
- Comprehensive coverage
- Learning objectives

### 3. Time Management
- Question time limits
- Response windows
- Battle duration
- Break intervals
- Progress tracking
- Time indicators

## Scoring System

### 1. Point Calculation
- Correct answers
- Response speed
- Streak bonuses
- Challenge completion
- Performance multipliers
- Total battle score

### 2. Performance Metrics
- Accuracy rate
- Average time
- Total points
- Win/loss ratio
- Improvement trends
- Ranking changes

### 3. Rewards
- Victory points
- Achievement badges
- Bonus rewards
- Streak benefits
- Special recognition
- Leaderboard position

## Playing Against AI

### 1. AI Opponent Features
- Adaptive difficulty
- Quick matching
- Consistent availability
- Learning progression
- Performance tracking
- Skill development

### 2. AI Battle Strategy
- Practice opportunities
- Skill assessment
- Learning focus
- Performance improvement
- Strategy development
- Confidence building

## Best Practices

### 1. Battle Strategy
- Read carefully
- Manage time
- Stay focused
- Use knowledge
- Learn from mistakes
- Maintain composure

### 2. Preparation Tips
- Review subjects
- Practice regularly
- Study weak areas
- Time management
- Mental preparation
- Strategy planning

### 3. Learning Approach
- Identify patterns
- Note mistakes
- Review answers
- Apply knowledge
- Track progress
- Set goals

## Features

### 1. Battle Interface
- Clear display
- Question presentation
- Answer options
- Time indicator
- Score tracking
- Progress bar

### 2. Results Display
- Final scores
- Performance summary
- Correct answers
- Time analysis
- Points breakdown
- Ranking update

### 3. Post-Battle Analysis
- Question review
- Performance stats
- Learning insights
- Improvement areas
- Achievement tracking
- Progress monitoring

## Technical Aspects

### 1. Performance
- Real-time updates
- Smooth transitions
- Quick responses
- Stable connection
- Error handling
- System reliability

### 2. Device Support
- Cross-platform
- Mobile responsive
- Desktop optimized
- Tablet compatible
- Browser support
- Technical requirements

## Support

### Getting Help
1. Check guidelines
2. Review FAQs
3. Contact support
4. Report issues
5. Seek assistance
6. Share feedback

### Common Issues
- Connection problems
- Matching delays
- Score updates
- Technical glitches
- Display issues
- Performance concerns

## Tips for Success

### 1. General Advice
- Regular practice
- Subject focus
- Time management
- Strategy development
- Progress tracking
- Continuous learning

### 2. Competition Tips
- Stay calm
- Think clearly
- Read thoroughly
- Manage time
- Learn patterns
- Improve constantly

### 3. Learning Goals
- Knowledge expansion
- Skill development
- Performance improvement
- Understanding growth
- Confidence building
- Achievement tracking

Remember, Brain Brawl is designed to make learning fun and competitive. Use it to challenge yourself, improve your knowledge, and enjoy the learning process while competing with others!
    `,
    lastUpdated: '2024-01-15'
  },
  'quiz-system': {
    title: 'Quiz System',
    content: `
# Quiz System - Adaptive Learning Assessment

The Quiz System is a comprehensive assessment tool designed to help you test and improve your knowledge across various subjects. With adaptive difficulty and detailed feedback, it's an essential part of your learning journey.

## Overview

### Key Features
- Subject-specific quizzes
- Grade-level appropriate content
- Adaptive difficulty adjustment
- Detailed performance analytics
- Instant feedback and explanations
- Progress tracking and insights

## Getting Started

### 1. Accessing Quizzes
1. Navigate to the "Quizzes" section
2. Select your desired subject
3. Choose your grade level
4. Begin the quiz session

### 2. Quiz Structure
- Multiple choice questions
- Time-limited sections
- Progressive difficulty
- Comprehensive topic coverage
- Instant feedback mechanism

## Quiz Types

### 1. Subject Quizzes
- Topic-specific assessments
- Curriculum-aligned content
- Varied question formats
- Comprehensive coverage

### 2. Practice Tests
- Full-length assessments
- Timed sections
- Exam-style questions
- Performance analysis

### 3. Quick Reviews
- Short topic checks
- Rapid assessment
- Key concept focus
- Immediate feedback

## Features

### 1. Adaptive Learning
- Questions adjust to your level
- Personalized difficulty
- Progress-based adaptation
- Skill-appropriate challenges

### 2. Performance Tracking
- Detailed statistics
- Progress visualization
- Strength identification
- Improvement areas

### 3. Learning Resources
- Detailed explanations
- Related content links
- Study recommendations
- Practice materials

## Best Practices

### 1. Preparation
- Review relevant material
- Set learning goals
- Choose appropriate difficulty
- Plan study schedule

### 2. During Quiz
- Read carefully
- Manage time effectively
- Use elimination method
- Mark uncertain answers

### 3. Post-Quiz
- Review all answers
- Study explanations
- Note difficult topics
- Plan follow-up study

## Performance Analysis

### 1. Score Reports
- Overall performance
- Subject breakdown
- Topic-wise analysis
- Time management stats

### 2. Progress Tracking
- Historical performance
- Improvement trends
- Comparative analysis
- Achievement markers

### 3. Recommendations
- Study suggestions
- Topic focus areas
- Resource recommendations
- Practice strategies

## Tips for Success

### 1. Regular Practice
- Schedule regular sessions
- Vary subject focus
- Track improvement
- Set achievement goals

### 2. Strategic Approach
- Start with strengths
- Gradually increase difficulty
- Focus on weak areas
- Use feedback effectively

### 3. Time Management
- Set time limits
- Practice pacing
- Review time usage
- Improve efficiency

## Technical Aspects

### 1. Requirements
- Stable internet connection
- Updated browser
- Device compatibility
- Proper settings

### 2. Troubleshooting
- Refresh if needed
- Check connectivity
- Clear cache
- Contact support

## Support

### Getting Help
1. Check FAQ section
2. Review user guide
3. Contact technical support
4. Report issues

### Feedback
- Submit suggestions
- Report questions
- Share experience
- Request features

## Making the Most of Quizzes

### 1. Learning Strategy
- Use as study tool
- Track progress regularly
- Set improvement goals
- Review consistently

### 2. Integration
- Combine with other features
- Link to study plans
- Use with Brain Brawl
- Connect with Eliana

### 3. Continuous Improvement
- Regular practice
- Performance review
- Skill development
- Knowledge expansion

Remember, the Quiz System is designed to help you learn and improve. Use it regularly, track your progress, and celebrate your achievements as you advance in your educational journey!
    `,
    lastUpdated: '2024-01-15'
  },
  'progress-tracking': {
    title: 'Progress Tracking',
    content: `
# Progress Tracking - Monitor Your Learning Journey

The Progress Tracking system provides comprehensive insights into your learning journey, helping you understand your growth, identify areas for improvement, and celebrate your achievements.

## Overview

### Key Features
- Detailed performance analytics
- Visual progress representation
- Achievement tracking
- Learning insights
- Personalized recommendations
- Progress reports

## Dashboard Components

### 1. Quick Stats
- Total study time
- Number of sessions
- Current learning streak
- Most studied subjects
- Average session length
- Weekly activity summary

### 2. Performance Metrics
- Subject-wise progress
- Quiz scores and trends
- Brain Brawl statistics
- Learning milestones
- Improvement indicators
- Comparative analysis

### 3. Learning Analytics
- Engagement patterns
- Strength areas
- Growth opportunities
- Time management insights
- Learning style analysis
- Skill development tracking

## Features

### 1. Progress Reports
- Downloadable PDF reports
- Periodic summaries
- Detailed analytics
- Performance trends
- Achievement records
- Future recommendations

### 2. Achievement System
- Skill badges
- Learning milestones
- Subject mastery levels
- Special accomplishments
- Progress streaks
- Challenge completions

### 3. Learning Insights
- Personalized feedback
- Study pattern analysis
- Improvement suggestions
- Focus area recommendations
- Learning style insights
- Adaptive guidance

## Using Progress Tracking

### 1. Accessing Your Progress
1. Navigate to the "Progress" section
2. View dashboard overview
3. Explore detailed metrics
4. Generate progress reports

### 2. Understanding Metrics
- Performance indicators
- Growth measurements
- Activity tracking
- Achievement progress
- Learning patterns
- Time utilization

### 3. Utilizing Insights
- Review recommendations
- Set learning goals
- Adjust study plans
- Track improvements
- Celebrate achievements
- Plan next steps

## Best Practices

### 1. Regular Review
- Check progress daily
- Monitor weekly trends
- Review monthly reports
- Track long-term growth
- Analyze patterns
- Update goals

### 2. Goal Setting
- Set achievable targets
- Track milestone progress
- Adjust goals as needed
- Celebrate achievements
- Plan next challenges
- Maintain motivation

### 3. Performance Optimization
- Identify weak areas
- Focus on improvements
- Use recommendations
- Track effectiveness
- Adjust strategies
- Maintain consistency

## Features in Detail

### 1. Study Time Tracking
- Session duration
- Subject distribution
- Peak learning times
- Break patterns
- Efficiency metrics
- Productivity analysis

### 2. Subject Progress
- Topic completion
- Understanding levels
- Quiz performance
- Practice consistency
- Improvement areas
- Mastery tracking

### 3. Achievement Tracking
- Badge collection
- Level progression
- Milestone completion
- Special achievements
- Community ranking
- Personal bests

## Making the Most of Progress Tracking

### 1. Regular Monitoring
- Daily check-ins
- Weekly reviews
- Monthly assessments
- Trend analysis
- Goal alignment
- Strategy adjustment

### 2. Using Insights
- Apply recommendations
- Follow learning paths
- Adjust study habits
- Optimize time use
- Enhance effectiveness
- Track improvements

### 3. Long-term Planning
- Set future goals
- Plan study paths
- Track milestones
- Adjust timelines
- Maintain motivation
- Celebrate success

## Technical Aspects

### 1. Data Accuracy
- Regular syncing
- Complete sessions
- Accurate tracking
- Proper logging
- System updates
- Data verification

### 2. Report Generation
- PDF downloads
- Data compilation
- Format options
- Share capabilities
- Archive access
- Custom reports

## Support

### Getting Help
1. Check documentation
2. Review tutorials
3. Contact support
4. Report issues

### Feedback
- Submit suggestions
- Report bugs
- Share experiences
- Request features

Remember, Progress Tracking is your personal learning compass. Use it regularly to guide your educational journey, celebrate your achievements, and maintain steady progress toward your goals!
    `,
    lastUpdated: '2024-01-15'
  },
  'leaderboard': {
    title: 'Leaderboard System',
    content: `
# Leaderboard System - Compete and Excel

The Leaderboard System showcases top performers across different categories, encouraging healthy competition and recognizing academic achievements within the Mentora community.

## Overview

### Key Features
- Global rankings
- Subject-specific leaderboards
- Weekly competitions
- Real-time updates
- Performance tracking
- Achievement recognition

## Leaderboard Types

### 1. Global Leaderboard
- Overall performance ranking
- Total points accumulated
- Achievement milestones
- Activity levels
- Consistency scores
- Community standing

### 2. Subject Leaderboards
- Subject-specific rankings
- Topic mastery levels
- Specialized achievements
- Expert recognition
- Progress tracking
- Performance metrics

### 3. Weekly Rankings
- Weekly performance
- Recent achievements
- Active participation
- Short-term goals
- Dynamic competition
- Regular updates

## Scoring System

### 1. Point Calculation
- Quiz performance
- Brain Brawl victories
- Learning streak bonuses
- Activity rewards
- Achievement points
- Special event scores

### 2. Ranking Factors
- Overall score
- Win rate
- Participation level
- Consistency
- Improvement rate
- Achievement completion

### 3. Performance Metrics
- Games played
- Victory count
- Average score
- Best performances
- Improvement trends
- Competitive stats

## Features

### 1. Real-time Updates
- Live ranking changes
- Instant score updates
- Performance tracking
- Position changes
- Achievement alerts
- Competition status

### 2. Filtering Options
- Time period selection
- Subject filtering
- Grade level sorting
- Performance metrics
- Achievement types
- Competition categories

### 3. Personal Stats
- Individual ranking
- Performance history
- Achievement progress
- Competition record
- Improvement metrics
- Goal tracking

## Best Practices

### 1. Competition Strategy
- Focus on improvement
- Regular participation
- Balanced approach
- Goal setting
- Progress monitoring
- Skill development

### 2. Achievement Focus
- Target key metrics
- Track progress
- Complete challenges
- Earn badges
- Maintain consistency
- Celebrate milestones

### 3. Community Engagement
- Friendly competition
- Peer learning
- Knowledge sharing
- Support network
- Collaborative growth
- Positive interaction

## Using the Leaderboard

### 1. Accessing Rankings
1. Navigate to Leaderboard
2. Select category
3. Apply filters
4. View rankings
5. Check personal stats
6. Track progress

### 2. Understanding Stats
- Score breakdown
- Ranking position
- Performance metrics
- Achievement status
- Competition history
- Progress indicators

### 3. Setting Goals
- Target rankings
- Achievement planning
- Performance goals
- Improvement targets
- Competition aims

## Competition Guidelines

### 1. Fair Play
- Honest participation
- Respectful competition
- Rule compliance
- Ethical behavior
- Positive attitude
- Community support

### 2. Active Participation
- Regular engagement
- Consistent effort
- Quality contributions
- Positive interaction
- Continuous learning
- Community support

### 3. Growth Mindset
- Focus on improvement
- Learn from others
- Share knowledge
- Support peers
- Celebrate success
- Maintain motivation

## Technical Aspects

### 1. Updates and Refresh
- Real-time sync
- Regular updates
- Data accuracy
- System reliability
- Performance optimization
- Technical stability

### 2. Data Display
- Clear visualization
- Easy navigation
- Responsive design
- Mobile compatibility
- User-friendly interface
- Accessible information

## Support

### Getting Help
1. Review guidelines
2. Check FAQs
3. Contact support
4. Report issues

### Feedback
- Share suggestions
- Report problems
- Provide feedback
- Request features

Remember, the Leaderboard System is designed to motivate and inspire. Use it to track your progress, compete with peers, and strive for academic excellence while maintaining a positive and supportive learning environment!
    `,
    lastUpdated: '2024-01-15'
  },
  'chat': {
    title: 'Chat with Eliana',
    content: `
# Chat with Eliana - Your AI Learning Assistant

Eliana is your personal AI learning assistant, designed to provide comprehensive educational support, answer questions, and guide you through your learning journey. She combines advanced AI capabilities with a friendly, approachable personality to create an engaging learning experience.

## Overview

### Key Features
- Personalized learning support
- Subject-specific expertise
- Interactive conversations
- Real-time assistance
- Adaptive responses
- Learning guidance

## Getting Started

### 1. Accessing Eliana
1. Navigate to Chat section
2. Start a new conversation
3. Type your question
4. Receive instant response
5. Continue dialogue
6. Save important info

### 2. Communication Style
- Clear and concise
- Friendly approach
- Educational focus
- Patient guidance
- Adaptive support
- Engaging dialogue

## Capabilities

### 1. Academic Support
- Subject explanations
- Concept clarification
- Problem-solving help
- Study guidance
- Learning resources
- Practice suggestions

### 2. Learning Assistance
- Homework help
- Exam preparation
- Study planning
- Topic exploration
- Skill development
- Knowledge enhancement

### 3. Interactive Features
- Real-time responses
- Follow-up questions
- Detailed explanations
- Visual aids
- Practice problems
- Learning resources

## Subject Areas

### 1. Core Subjects
- Mathematics
- Science
- English
- History
- Geography
- Literature

### 2. Specialized Topics
- Advanced concepts
- Specific themes
- Detailed analysis
- In-depth study
- Complex problems
- Special topics

### 3. Study Skills
- Learning strategies
- Time management
- Note-taking
- Test preparation
- Research methods
- Academic planning

## Best Practices

### 1. Asking Questions
- Be specific
- Provide context
- Show work
- Ask follow-ups
- Seek clarification
- Share understanding

### 2. Learning Strategy
- Active engagement
- Regular practice
- Topic exploration
- Knowledge building
- Skill development
- Progress tracking

### 3. Effective Communication
- Clear questions
- Detailed responses
- Interactive dialogue
- Focused discussion
- Constructive feedback
- Learning objectives

## Features

### 1. Conversation Tools
- Message history
- Save important info
- Quick responses
- Topic organization
- Search function
- Resource sharing

### 2. Learning Resources
- Study materials
- Practice problems
- Example solutions
- Reference guides
- Learning tips
- Additional resources

### 3. Progress Tracking
- Learning history
- Topic coverage
- Skill development
- Understanding level
- Achievement tracking
- Growth monitoring

## Using Effectively

### 1. Starting Conversations
1. Choose subject
2. Frame question
3. Provide context
4. Share details
5. Ask clearly
6. Follow up

### 2. Getting Best Results
- Be specific
- Show work
- Ask follow-ups
- Seek examples
- Request practice
- Apply learning

### 3. Learning Process
- Active participation
- Regular engagement
- Topic exploration
- Skill practice
- Knowledge building
- Progress review

## Tips for Success

### 1. Maximizing Learning
- Regular interaction
- Topic focus
- Active engagement
- Practice application
- Knowledge review
- Progress tracking

### 2. Question Strategy
- Clear objectives
- Specific queries
- Relevant context
- Follow-up plans
- Understanding check
- Application focus

### 3. Study Approach
- Systematic learning
- Regular practice
- Topic mastery
- Skill development
- Knowledge application
- Progress monitoring

## Technical Aspects

### 1. Chat Interface
- User-friendly design
- Quick responses
- Clear display
- Easy navigation
- Message history
- Resource access

### 2. Performance
- Fast responses
- Reliable service
- Stable connection
- Data accuracy
- System updates
- Technical support

## Support

### Getting Help
1. Check guidelines
2. Review FAQs
3. Contact support
4. Report issues
5. Share feedback
6. Seek assistance

### Common Questions
- Usage tips
- Feature access
- Technical help
- Learning support
- Resource finding
- Progress tracking

Remember, Eliana is here to support your learning journey. Use her expertise to enhance your understanding, develop your skills, and achieve your educational goals!
    `,
    lastUpdated: '2024-01-15'
  },
  'quiz': {
    title: 'Quiz System',
    content: `
# Quiz System - Test Your Knowledge

The Quiz System is a comprehensive tool designed to help you assess and improve your understanding of various subjects through interactive questions and detailed feedback. Practice at your own pace and track your progress over time.

## Overview

### Key Features
- Subject-specific quizzes
- Grade-level appropriate content
- Instant feedback
- Progress tracking
- Performance analytics
- Learning recommendations

## Getting Started

### 1. Accessing Quizzes
1. Navigate to Quiz section
2. Select subject area
3. Choose grade level
4. Pick quiz type
5. Start assessment
6. Track progress

### 2. Quiz Types
- Practice quizzes
- Topic assessments
- Chapter tests
- Review sessions
- Custom quizzes
- Challenge modes

## Quiz Structure

### 1. Question Types
- Multiple choice
- True/False
- Short answer
- Problem solving
- Concept application
- Critical thinking

### 2. Difficulty Levels
- Basic understanding
- Intermediate application
- Advanced concepts
- Challenge questions
- Mixed difficulty
- Adaptive progression

### 3. Time Management
- Flexible timing
- Progress tracking
- Completion estimates
- Break suggestions
- Time management
- Pacing guidance

## Features

### 1. Quiz Interface
- Clear layout
- Easy navigation
- Progress indicator
- Time tracking
- Answer selection
- Feedback display

### 2. Learning Tools
- Hint system
- Explanation access
- Reference materials
- Study guides
- Practice problems
- Resource links

### 3. Performance Tracking
- Score history
- Progress charts
- Improvement metrics
- Topic mastery
- Weak areas
- Learning patterns

## Best Practices

### 1. Quiz Strategy
- Read carefully
- Plan answers
- Check work
- Use resources
- Track time
- Review mistakes

### 2. Learning Approach
- Regular practice
- Topic focus
- Skill building
- Knowledge review
- Progress monitoring
- Goal setting

### 3. Time Management
- Pace yourself
- Set schedules
- Take breaks
- Stay focused
- Review regularly
- Plan ahead

## Subject Areas

### 1. Core Subjects
- Mathematics
- Science
- English
- History
- Geography
- Literature

### 2. Topic Coverage
- Key concepts
- Important facts
- Critical skills
- Problem types
- Application areas
- Review topics

### 3. Skill Development
- Understanding
- Application
- Analysis
- Evaluation
- Creation
- Integration

## Using Effectively

### 1. Quiz Selection
1. Choose subject
2. Select level
3. Pick format
4. Set goals
5. Start quiz
6. Track results

### 2. Answer Strategy
- Read thoroughly
- Consider options
- Apply knowledge
- Check work
- Use time wisely
- Learn from feedback

### 3. Review Process
- Note mistakes
- Study explanations
- Practice weak areas
- Track improvement
- Set goals
- Plan review

## Performance Analysis

### 1. Score Tracking
- Quiz results
- Topic performance
- Progress trends
- Improvement rates
- Mastery levels
- Achievement stats

### 2. Progress Metrics
- Completion rates
- Accuracy scores
- Time management
- Topic mastery
- Skill development
- Learning curves

### 3. Improvement Areas
- Weak topics
- Skill gaps
- Time management
- Understanding levels
- Practice needs
- Focus areas

## Technical Features

### 1. Quiz Engine
- Dynamic loading
- Smooth transitions
- Answer processing
- Score calculation
- Progress saving
- Result storage

### 2. User Interface
- Responsive design
- Easy navigation
- Clear display
- Interactive elements
- Progress indicators
- Result summaries

## Support

### Getting Help
1. View instructions
2. Check FAQs
3. Access help
4. Report issues
5. Contact support
6. Share feedback

### Common Questions
- Quiz access
- Score tracking
- Progress saving
- Technical issues
- Content questions
- Feature usage

## Tips for Success

### 1. Preparation
- Review material
- Set goals
- Plan time
- Gather resources
- Stay focused
- Maintain pace

### 2. During Quiz
- Read carefully
- Think clearly
- Work systematically
- Check answers
- Manage time
- Stay calm

### 3. After Quiz
- Review results
- Study mistakes
- Plan practice
- Set goals
- Track progress
- Apply learning

Remember, the Quiz System is designed to help you learn and improve. Use it regularly to assess your knowledge, identify areas for improvement, and track your progress toward your educational goals!
    `,
    lastUpdated: '2024-01-15'
  },
  'progress': {
    title: 'Progress Tracking',
    content: `
# Progress Tracking - Monitor Your Growth

The Progress Tracking system provides comprehensive insights into your learning journey, helping you monitor achievements, identify areas for improvement, and maintain steady progress toward your educational goals.

## Overview

### Key Features
- Performance analytics
- Achievement tracking
- Learning insights
- Progress visualization
- Goal monitoring
- Improvement metrics

## Dashboard Features

### 1. Quick Stats
- Overall progress
- Recent activity
- Achievement count
- Learning streak
- Time invested
- Performance score

### 2. Performance Metrics
- Subject scores
- Quiz results
- Battle records
- Learning time
- Activity levels
- Improvement rates

### 3. Visual Analytics
- Progress charts
- Performance graphs
- Achievement badges
- Trend analysis
- Comparison tools
- Growth indicators

## Progress Categories

### 1. Subject Progress
- Topic mastery
- Concept understanding
- Skill development
- Knowledge gaps
- Learning patterns
- Improvement areas

### 2. Quiz Performance
- Score history
- Answer accuracy
- Time management
- Topic proficiency
- Error patterns
- Learning trends

### 3. Battle Statistics
- Win/loss record
- Point accumulation
- Subject performance
- Competition level
- Skill rating
- Ranking progress

## Achievement System

### 1. Badge Types
- Subject mastery
- Quiz excellence
- Battle victories
- Learning streaks
- Activity milestones
- Special achievements

### 2. Unlocking Criteria
- Performance targets
- Activity goals
- Time investment
- Skill demonstration
- Challenge completion
- Consistency marks

### 3. Progress Levels
- Beginner stages
- Intermediate goals
- Advanced targets
- Expert challenges
- Master achievements
- Special recognition

## Learning Analytics

### 1. Performance Tracking
- Score analysis
- Time management
- Answer patterns
- Learning speed
- Skill development
- Knowledge growth

### 2. Progress Metrics
- Completion rates
- Success ratios
- Activity levels
- Learning pace
- Improvement trends
- Achievement rates

### 3. Insight Generation
- Strength identification
- Weakness detection
- Learning patterns
- Study suggestions
- Progress recommendations
- Growth opportunities

## Goal Setting

### 1. Goal Types
- Performance targets
- Learning objectives
- Achievement aims
- Time commitments
- Skill development
- Knowledge expansion

### 2. Progress Monitoring
- Goal tracking
- Milestone checking
- Progress updates
- Achievement marking
- Path adjustment
- Success celebration

### 3. Adjustment Tools
- Goal modification
- Target updating
- Path correction
- Strategy adjustment
- Focus shifting
- Plan optimization

## Reports and Analysis

### 1. Progress Reports
- Performance summary
- Achievement list
- Activity record
- Time analysis
- Growth metrics
- Improvement notes

### 2. Detailed Analytics
- Subject breakdown
- Topic analysis
- Skill assessment
- Time utilization
- Pattern recognition
- Trend identification

### 3. Improvement Plans
- Focus areas
- Study suggestions
- Practice recommendations
- Resource guidance
- Strategy tips
- Growth planning

## Using Effectively

### 1. Regular Review
1. Check dashboard
2. Review progress
3. Analyze performance
4. Note achievements
5. Identify needs
6. Plan improvements

### 2. Goal Management
- Set realistic goals
- Track progress
- Adjust targets
- Maintain focus
- Celebrate success
- Plan ahead

### 3. Performance Analysis
- Review metrics
- Study patterns
- Identify trends
- Apply insights
- Make adjustments
- Track changes

## Best Practices

### 1. Regular Monitoring
- Daily checks
- Weekly reviews
- Monthly analysis
- Progress updates
- Goal assessment
- Plan adjustment

### 2. Data Utilization
- Review stats
- Apply insights
- Follow suggestions
- Track changes
- Monitor impact
- Adjust approach

### 3. Growth Focus
- Continuous improvement
- Regular practice
- Goal pursuit
- Skill development
- Knowledge expansion
- Achievement hunting

## Technical Features

### 1. Data Display
- Clear visualization
- Interactive charts
- Progress bars
- Achievement icons
- Status indicators
- Performance meters

### 2. System Functions
- Auto-tracking
- Data updates
- Progress saving
- Report generation
- Insight creation
- Goal monitoring

## Support

### Getting Help
1. View tutorials
2. Check FAQs
3. Read guides
4. Contact support
5. Share feedback
6. Request assistance

### Common Questions
- Progress tracking
- Data accuracy
- Report access
- Feature usage
- Goal setting
- Achievement tracking

Remember, Progress Tracking is your personal learning compass. Use it regularly to guide your educational journey, celebrate your achievements, and maintain steady progress toward your goals!
    `,
    lastUpdated: '2024-01-15'
  },
  'technical': {
    title: 'Technical Information',
    content: `
# Technical Information

This section provides detailed technical information about Mentora's platform requirements, compatibility, and performance optimization guidelines to ensure the best possible learning experience.

## System Requirements

### 1. Web Browsers
- Chrome (recommended, version 90+)
- Firefox (version 88+)
- Safari (version 14+)
- Edge (version 90+)
- Opera (version 76+)
- Regular updates recommended

### 2. Hardware Requirements
- Processor: 1.6 GHz or faster
- RAM: 4 GB minimum
- Storage: 1 GB free space
- Display: 1280x720 minimum
- Internet: Broadband connection
- Audio capability required

### 3. Operating Systems
- Windows 10/11
- macOS 10.14+
- Linux (major distributions)
- Chrome OS
- iOS 14+
- Android 9+

## Device Compatibility

### 1. Desktop/Laptop
- Full functionality
- Optimal performance
- Complete feature access
- Best user experience
- Maximum screen space
- Keyboard support

### 2. Tablet Devices
- Touch optimization
- Responsive design
- Feature adaptation
- Portrait/landscape modes
- Touch gestures
- Mobile interface

### 3. Mobile Phones
- Responsive layout
- Essential features
- Touch interface
- Simplified navigation
- Data optimization
- Battery efficiency

## Network Requirements

### 1. Internet Connection
- Broadband required
- 5 Mbps minimum
- Stable connection
- Low latency
- Reliable service
- Consistent speed

### 2. Bandwidth Usage
- Average: 50-100 MB/hour
- Video: 200-300 MB/hour
- Audio: 50 MB/hour
- Images: 20-30 MB/hour
- Text: 5-10 MB/hour
- Background: 1-2 MB/hour

### 3. Connection Quality
- Stable connection
- Low latency
- Minimal packet loss
- Consistent speed
- Regular testing
- Performance monitoring

## Performance Optimization

### 1. Browser Settings
- Clear cache regularly
- Update frequently
- Enable JavaScript
- Allow cookies
- Permit notifications
- Optimize storage

### 2. Device Settings
- Close unused apps
- Free up memory
- Update system
- Manage storage
- Monitor resources
- Optimize performance

### 3. Connection Tips
- Use stable network
- Avoid interference
- Close bandwidth-heavy apps
- Monitor usage
- Test speed
- Optimize settings

## Technical Support

### 1. Common Issues
- Connection problems
- Browser compatibility
- Performance issues
- Feature access
- Display problems
- Audio difficulties

### 2. Troubleshooting Steps
1. Check requirements
2. Update software
3. Clear cache
4. Test connection
5. Verify settings
6. Contact support

### 3. Getting Help
- Online resources
- Support articles
- FAQs
- Contact forms
- Email support
- Live chat

## Security Requirements

### 1. Account Security
- Strong passwords
- Regular updates
- Secure access
- Two-factor authentication
- Session management
- Activity monitoring

### 2. Data Protection
- Encryption
- Secure storage
- Privacy controls
- Access management
- Regular backups
- Security updates

### 3. Safe Usage
- Secure connection
- Updated software
- Trusted devices
- Regular monitoring
- Safety practices
- Privacy awareness

## Mobile Experience

### 1. App Features
- Responsive design
- Touch optimization
- Offline access
- Push notifications
- Data syncing
- Battery efficiency

### 2. Mobile Optimization
- Fast loading
- Data efficiency
- Touch interface
- Screen adaptation
- Performance focus
- Resource management

### 3. Usage Guidelines
- Regular updates
- Cache management
- Storage optimization
- Battery conservation
- Data monitoring
- Performance tracking

## Browser Extensions

### 1. Recommended
- Ad blockers
- PDF viewers
- Screen readers
- Language tools
- Study aids
- Performance enhancers

### 2. Settings
- Enable JavaScript
- Allow cookies
- Permit notifications
- Enable pop-ups
- Allow audio
- Grant permissions

### 3. Optimization
- Regular updates
- Cache clearing
- Resource management
- Performance monitoring
- Compatibility checks
- Security verification

## Technical Tips

### 1. Performance
- Regular updates
- Cache management
- Resource optimization
- Connection monitoring
- System maintenance
- Regular checks

### 2. Maintenance
- Update software
- Clear cache
- Check settings
- Monitor performance
- Verify security
- Test features

### 3. Best Practices
- Regular updates
- Security checks
- Performance monitoring
- Resource management
- System optimization
- Regular maintenance

## Support Resources

### 1. Documentation
- User guides
- Technical docs
- FAQs
- Tutorials
- Help articles
- Support resources

### 2. Contact Options
- Email support
- Live chat
- Help desk
- Phone support
- Feedback forms
- Community forums

### 3. Self-Help
- Troubleshooting guides
- Knowledge base
- Video tutorials
- Setup guides
- Tips and tricks
- Best practices

Remember to keep your system updated and optimized for the best learning experience. If you encounter any technical issues, our support team is here to help!
    `,
    lastUpdated: '2024-01-15'
  },
  'privacy': {
    title: 'Privacy & Security',
    content: `
# Privacy & Security

At Mentora, we prioritize the protection of your personal information and learning data. This section outlines our comprehensive approach to privacy and security, ensuring a safe and trusted learning environment.

## Data Protection

### 1. Personal Information
- Secure storage
- Encrypted data
- Access control
- Privacy settings
- Data minimization
- Regular audits

### 2. Learning Data
- Progress tracking
- Performance metrics
- Usage statistics
- Activity logs
- Preference settings
- Account history

### 3. Security Measures
- Data encryption
- Secure servers
- Regular backups
- Access controls
- Monitoring systems
- Security updates

## Account Security

### 1. Authentication
- Strong passwords
- Two-factor authentication
- Session management
- Login monitoring
- Security alerts
- Access verification

### 2. Access Control
- User permissions
- Role-based access
- Session timeouts
- Device management
- Activity tracking
- Security logs

### 3. Security Features
- Password requirements
- Account recovery
- Security questions
- Login history
- Device tracking
- Alert systems

## Privacy Controls

### 1. User Settings
- Profile visibility
- Data sharing
- Notification preferences
- Privacy options
- Contact settings
- Account controls

### 2. Data Management
- View data
- Export options
- Delete content
- Update information
- Manage preferences
- Control sharing

### 3. Communication
- Email preferences
- Notification settings
- Contact options
- Message privacy
- Alert management
- Communication controls

## Data Usage

### 1. Information Collection
- Required data
- Optional information
- Usage statistics
- Performance metrics
- System logs
- Analytics data

### 2. Data Processing
- Learning analytics
- Performance tracking
- Progress monitoring
- Feature improvement
- System optimization
- Service enhancement

### 3. Data Sharing
- Third-party services
- Integration partners
- Security providers
- Support services
- Analytics tools
- Service providers

## Security Practices

### 1. Platform Security
- Secure infrastructure
- Regular updates
- Vulnerability testing
- Security monitoring
- Incident response
- System protection

### 2. User Protection
- Account security
- Data privacy
- Safe access
- Secure communication
- Privacy controls
- Security guidance

### 3. Best Practices
- Regular updates
- Strong passwords
- Secure access
- Privacy awareness
- Safe usage
- Security monitoring

## Privacy Rights

### 1. User Rights
- Access data
- Update information
- Delete content
- Export data
- Control sharing
- Manage preferences

### 2. Data Requests
- View information
- Update records
- Delete data
- Export content
- Modify settings
- Control access

### 3. Privacy Controls
- Profile settings
- Sharing options
- Visibility controls
- Access management
- Privacy preferences
- Security settings

## Security Features

### 1. Technical Security
- Data encryption
- Secure storage
- Access control
- Monitoring systems
- Backup procedures
- Security protocols

### 2. User Security
- Account protection
- Privacy settings
- Access management
- Security tools
- Safety features
- Protection measures

### 3. System Security
- Infrastructure protection
- Network security
- Application safety
- Data protection
- System monitoring
- Security updates

## Compliance

### 1. Standards
- Data protection
- Privacy laws
- Security regulations
- Industry standards
- Best practices
- Legal requirements

### 2. Regulations
- GDPR compliance
- COPPA adherence
- Privacy laws
- Security standards
- Data protection
- Legal frameworks

### 3. Certifications
- Security compliance
- Privacy standards
- Industry certifications
- Quality assurance
- Regular audits
- System verification

## Support

### 1. Security Help
- Technical support
- Security guidance
- Privacy assistance
- Account help
- Protection advice
- Safety resources

### 2. Privacy Support
- Data requests
- Privacy questions
- Information help
- Settings assistance
- Control guidance
- Rights support

### 3. Resources
- Help articles
- Security guides
- Privacy FAQs
- Support documents
- Training materials
- Best practices

## Best Practices

### 1. Account Safety
- Strong passwords
- Regular updates
- Secure access
- Privacy checks
- Security monitoring
- Safe usage

### 2. Data Protection
- Information security
- Privacy awareness
- Safe sharing
- Data management
- Access control
- Security measures

### 3. Safe Usage
- Regular monitoring
- Security updates
- Privacy checks
- Safe practices
- Protection measures
- Safety guidelines

Remember, your privacy and security are our top priorities. Always follow recommended security practices and reach out to our support team if you have any concerns or questions about your data protection.
    `,
    lastUpdated: '2024-01-15'
  },
  'support': {
    title: 'Support',
    content: `
# Support - Help & Assistance

Our comprehensive support system is designed to help you get the most out of your learning experience. Find answers to common questions, troubleshooting guides, and ways to contact our support team.

## Getting Help

### 1. Support Options
- Help center
- Documentation
- FAQs
- Live chat
- Email support
- Community forums

### 2. Contact Methods
1. Email support
2. Live chat
3. Help desk
4. Support ticket
5. Community help
6. Social media

### 3. Response Times
- Live chat: Immediate
- Email: 24 hours
- Tickets: 48 hours
- Forums: Community-based
- Social: 24-48 hours
- Emergency: Priority handling

## Common Issues

### 1. Account Problems
- Login issues
- Password reset
- Account access
- Profile updates
- Settings changes
- Security concerns

### 2. Technical Difficulties
- Connection problems
- Performance issues
- Browser compatibility
- Mobile access
- Feature functionality
- System errors

### 3. Learning Support
- Content questions
- Feature guidance
- Study help
- Progress tracking
- Achievement issues
- Learning tools

## Self-Help Resources

### 1. Documentation
- User guides
- Feature tutorials
- Setup instructions
- Best practices
- Tips and tricks
- Troubleshooting

### 2. Video Tutorials
- Getting started
- Feature guides
- How-to videos
- Tips and tricks
- Best practices
- Problem solving

### 3. Knowledge Base
- Common solutions
- Feature explanations
- Technical guides
- FAQs
- Tips articles
- Updates info

## Community Support

### 1. Forums
- User discussions
- Problem solving
- Experience sharing
- Tips exchange
- Feature requests
- Community help

### 2. User Groups
- Study groups
- Subject forums
- Grade levels
- Special interests
- Learning teams
- Support networks

### 3. Peer Support
- Knowledge sharing
- Problem solving
- Learning tips
- Study strategies
- Success stories
- Community help

## Technical Support

### 1. System Issues
- Performance problems
- Browser compatibility
- Mobile access
- Feature functionality
- Error messages
- Connection issues

### 2. Troubleshooting
1. Check requirements
2. Update software
3. Clear cache
4. Test connection
5. Verify settings
6. Contact support

### 3. System Updates
- Regular maintenance
- Feature updates
- Security patches
- Performance improvements
- Bug fixes
- System enhancements

## Account Support

### 1. Account Management
- Profile updates
- Settings changes
- Privacy controls
- Security settings
- Preferences
- Account status

### 2. Access Issues
- Login problems
- Password reset
- Account recovery
- Security verification
- Access restoration
- Profile management

### 3. Data Management
- Information updates
- Content management
- Data export
- Privacy settings
- Security options
- Preference changes

## Feature Support

### 1. Learning Tools
- Quiz system
- Brain Brawl
- Progress tracking
- Chat assistance
- Study tools
- Learning resources

### 2. Platform Features
- Navigation help
- Function guidance
- Tool usage
- Feature access
- Settings help
- Integration support

### 3. Content Help
- Subject material
- Quiz questions
- Learning resources
- Study guides
- Practice problems
- Educational content

## Feedback System

### 1. User Feedback
- Feature requests
- Bug reports
- Suggestions
- Improvements
- Experience sharing
- Rating system

### 2. Issue Reporting
1. Identify problem
2. Gather details
3. Report issue
4. Track status
5. Receive updates
6. Verify resolution

### 3. Enhancement Requests
- Feature suggestions
- Improvement ideas
- Content requests
- Tool proposals
- Interface feedback
- System enhancements

## Support Guidelines

### 1. Getting Help
1. Check documentation
2. Search FAQs
3. Try self-help
4. Contact support
5. Follow up
6. Share feedback

### 2. Best Practices
- Clear communication
- Detailed information
- Prompt responses
- Follow instructions
- Provide feedback
- Stay engaged

### 3. Response Process
- Initial contact
- Issue assessment
- Solution provision
- Implementation
- Verification
- Follow-up

Remember, our support team is here to help you succeed in your learning journey. Don't hesitate to reach out if you need assistance or have questions about any aspect of the platform!
    `,
    lastUpdated: '2024-01-15'
  },
  // Add more content for other sections
};

const Breadcrumb = ({ section, item }: { section: string; item: string }) => (
  <div className="flex items-center text-sm text-gray-500 mb-6">
    <span className="hover:text-gray-700 cursor-pointer">Documentation</span>
    <ChevronRight className="w-4 h-4 mx-2" />
    <span className="hover:text-gray-700 cursor-pointer">{section}</span>
    <ChevronRight className="w-4 h-4 mx-2" />
    <span className="text-purple-600 font-medium">{item}</span>
  </div>
);

const LastUpdated = ({ date }: { date: string }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
      Last updated on {formattedDate}
    </div>
  );
};

export const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState<string[]>(['Getting Started', 'Core Features', 'Technical & Support']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (documentationContent[item.id]?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const LoadingContent = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-40 bg-gray-200 rounded"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  const getCurrentSection = () => {
    const section = sections.find(section =>
      section.items.some(item => item.id === activeSection)
    );
    const item = section?.items.find(item => item.id === activeSection);
    return { section: section?.title || '', item: item?.title || '' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            Documentation
          </h1>
          <p className="mt-2 text-gray-600">
            Everything you need to know about using Mentora effectively.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <div key={section.title} className="rounded-lg bg-white shadow-sm">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-900 rounded-t-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      {section.title}
                      {expandedSections.includes(section.title) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.includes(section.title) && (
                      <div className="p-2 space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full p-2 text-left text-sm rounded-lg transition-colors duration-200 ${
                              activeSection === item.id
                                ? 'bg-purple-50 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 bg-white rounded-lg shadow-sm p-6 lg:p-8 min-h-[calc(100vh-16rem)]"
          >
            {/* Breadcrumb */}
            <Breadcrumb {...getCurrentSection()} />

            <div className="prose max-w-none">
              {isLoading ? (
                <LoadingContent />
              ) : documentationContent[activeSection] ? (
                <div className="markdown-content">
                  {documentationContent[activeSection].content}
                  <LastUpdated date={documentationContent[activeSection].lastUpdated} />
                </div>
              ) : (
                <div className="text-gray-600">
                  This section is currently being updated. Please check back later.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}; 