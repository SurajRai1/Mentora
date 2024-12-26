import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  slug: string;
}

// Sample blog post data - in a real app, this would come from an API or database
const blogPosts: Record<string, BlogPost> = {
  'ai-powered-learning': {
    id: '1',
    title: 'AI-Powered Learning: How Mentora is Revolutionizing Education',
    content: `
      <p>The landscape of education is rapidly evolving, and artificial intelligence is at the forefront of this transformation. In this comprehensive guide, we'll explore how AI-powered learning platforms like Mentora are revolutionizing the way students learn and grow.</p>

      <h2>The Power of AI in Education</h2>
      <p>Artificial Intelligence is transforming education by providing personalized learning experiences that adapt to each student's unique needs and learning style. Here's how:</p>
      <ul>
        <li>Personalized learning paths that adapt to student progress</li>
        <li>Real-time feedback and assistance</li>
        <li>Adaptive difficulty levels that ensure optimal challenge</li>
        <li>Data-driven insights for better learning outcomes</li>
        <li>Continuous improvement through machine learning</li>
      </ul>

      <h2>How Mentora's AI Assistant Makes Learning Easier</h2>
      <p>Mentora's AI assistant is designed to provide comprehensive support to students in their learning journey. Key features include:</p>
      <ul>
        <li>Instant answers to questions across various subjects</li>
        <li>Detailed explanations that break down complex concepts</li>
        <li>Step-by-step problem solving guidance</li>
        <li>Multiple learning approaches to suit different learning styles</li>
        <li>24/7 availability for continuous support</li>
      </ul>

      <h2>The Future of Education</h2>
      <p>As we look ahead, the integration of AI in education will continue to evolve and improve. We can expect to see:</p>
      <ul>
        <li>More sophisticated hybrid learning models</li>
        <li>Enhanced AI-human collaboration in teaching</li>
        <li>Increasingly personalized curriculum development</li>
        <li>Advanced real-time assessment capabilities</li>
        <li>Greater accessibility to quality education globally</li>
      </ul>

      <p>The future of education is here, and it's powered by AI. Platforms like Mentora are leading the way in making quality education more accessible, personalized, and effective than ever before.</p>
    `,
    author: 'Mentora Team',
    date: 'March 15, 2024',
    readTime: '8 min read',
    category: 'Educational Technology',
    imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=1200',
    slug: 'ai-powered-learning'
  },
  'brain-brawl-future': {
    id: '2',
    title: 'Brain Brawl: The Future of Competitive Learning',
    content: `
      <p>Brain Brawl represents a groundbreaking shift in educational technology, combining the thrill of competition with effective learning strategies. In this comprehensive exploration, we'll dive into how Brain Brawl is transforming the educational landscape and why it's becoming the preferred choice for students worldwide.</p>

      <h2>Revolutionizing Learning Through Competition</h2>
      <p>Brain Brawl introduces a unique approach to education that leverages the natural human drive for competition to enhance learning outcomes. Here's what makes it special:</p>
      <ul>
        <li>Real-time competitive matches that test knowledge and quick thinking</li>
        <li>Subject-specific challenges that align with educational curricula</li>
        <li>Adaptive difficulty levels that ensure balanced competition</li>
        <li>Instant feedback mechanisms that promote rapid learning</li>
        <li>Social elements that foster healthy competition and collaboration</li>
      </ul>

      <h2>The Science Behind Brain Brawl</h2>
      <p>The effectiveness of Brain Brawl is rooted in well-researched educational principles and cognitive science:</p>
      <ul>
        <li>Active Recall: Questions and challenges that promote better retention</li>
        <li>Spaced Repetition: Strategic review of concepts at optimal intervals</li>
        <li>Competitive Learning: Increased engagement through gamification</li>
        <li>Social Learning: Peer interaction that enhances understanding</li>
        <li>Adaptive Learning: Personalized difficulty progression</li>
      </ul>

      <h2>Key Features That Drive Success</h2>
      <p>Brain Brawl incorporates several innovative features that make learning both effective and enjoyable:</p>
      <ul>
        <li>Dynamic Matchmaking: Pairs students of similar skill levels</li>
        <li>Progress Tracking: Detailed analytics of performance and improvement</li>
        <li>Reward System: Achievement badges and ranking systems</li>
        <li>Subject Mastery: Comprehensive coverage of various topics</li>
        <li>Community Features: Forums and discussion boards for peer interaction</li>
      </ul>

      <h2>Impact on Student Performance</h2>
      <p>Research and user feedback have shown significant improvements in several areas:</p>
      <ul>
        <li>Enhanced subject matter retention and understanding</li>
        <li>Increased motivation and engagement in learning</li>
        <li>Improved critical thinking and problem-solving skills</li>
        <li>Better time management under pressure</li>
        <li>Development of healthy competitive spirit</li>
      </ul>

      <h2>Future Developments</h2>
      <p>Brain Brawl continues to evolve with exciting new features on the horizon:</p>
      <ul>
        <li>Advanced AI-powered opponent matching</li>
        <li>Expanded subject coverage and specialized topics</li>
        <li>Enhanced multiplayer tournaments and events</li>
        <li>Integration with educational institutions</li>
        <li>Cross-platform accessibility and mobile optimization</li>
      </ul>

      <h2>Tips for Success in Brain Brawl</h2>
      <p>To maximize your learning experience with Brain Brawl, consider these strategies:</p>
      <ul>
        <li>Regular practice sessions to build consistency</li>
        <li>Focus on understanding concepts rather than memorization</li>
        <li>Participate in community discussions and forums</li>
        <li>Track your progress and identify areas for improvement</li>
        <li>Challenge yourself with increasingly difficult matches</li>
      </ul>

      <p>Brain Brawl represents more than just another educational tool—it's a paradigm shift in how we approach learning. By combining competitive elements with proven educational strategies, it creates an engaging and effective learning environment that prepares students for academic success while making the journey enjoyable.</p>
    `,
    author: 'Mentora Team',
    date: 'March 12, 2024',
    readTime: '6 min read',
    category: 'Learning Techniques',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    slug: 'brain-brawl-future'
  },
  'essential-study-tips': {
    id: '3',
    title: '10 Essential Study Tips for Academic Success in 2024',
    content: `
      <p>In today's fast-paced educational environment, effective study strategies are more important than ever. This comprehensive guide presents 10 essential study tips that combine traditional methods with modern technology to help you achieve academic excellence in 2024.</p>

      <h2>1. Active Recall and Spaced Repetition</h2>
      <p>The foundation of effective learning lies in how we review and retain information:</p>
      <ul>
        <li>Test yourself regularly instead of passive re-reading</li>
        <li>Use flashcards and quiz features in learning platforms</li>
        <li>Space out your review sessions for optimal retention</li>
        <li>Implement the Pomodoro Technique for focused study sessions</li>
        <li>Utilize Brain Brawl's quiz system for interactive practice</li>
      </ul>

      <h2>2. Digital Organization and Note-Taking</h2>
      <p>Modern tools can significantly enhance your study organization:</p>
      <ul>
        <li>Use digital note-taking apps with cloud synchronization</li>
        <li>Implement a consistent file naming and organization system</li>
        <li>Create digital mind maps for complex topics</li>
        <li>Utilize calendar apps for study scheduling</li>
        <li>Keep backup copies of important study materials</li>
      </ul>

      <h2>3. Personalized Learning Environment</h2>
      <p>Create an optimal study space that enhances focus and productivity:</p>
      <ul>
        <li>Designate a specific area for studying</li>
        <li>Ensure proper lighting and ventilation</li>
        <li>Minimize distractions and notifications</li>
        <li>Use noise-canceling headphones if needed</li>
        <li>Keep essential study materials readily accessible</li>
      </ul>

      <h2>4. AI-Assisted Learning</h2>
      <p>Leverage artificial intelligence to enhance your study routine:</p>
      <ul>
        <li>Use Mentora's AI assistant for personalized help</li>
        <li>Implement AI-powered flashcard systems</li>
        <li>Utilize smart study planning tools</li>
        <li>Access AI-generated practice questions</li>
        <li>Get instant feedback on problem-solving</li>
      </ul>

      <h2>5. Collaborative Learning Strategies</h2>
      <p>Enhance understanding through peer interaction:</p>
      <ul>
        <li>Form study groups for complex subjects</li>
        <li>Participate in online discussion forums</li>
        <li>Share and compare notes with classmates</li>
        <li>Engage in peer teaching sessions</li>
        <li>Use collaborative document editing tools</li>
      </ul>

      <h2>6. Time Management and Planning</h2>
      <p>Effective time management is crucial for academic success:</p>
      <ul>
        <li>Create detailed study schedules</li>
        <li>Break large tasks into manageable chunks</li>
        <li>Set specific goals for each study session</li>
        <li>Track your progress regularly</li>
        <li>Allow flexibility for unexpected changes</li>
      </ul>

      <h2>7. Health and Wellness</h2>
      <p>Maintain physical and mental well-being for optimal learning:</p>
      <ul>
        <li>Get adequate sleep and regular exercise</li>
        <li>Practice stress-management techniques</li>
        <li>Take regular breaks during study sessions</li>
        <li>Maintain a balanced diet</li>
        <li>Stay hydrated throughout the day</li>
      </ul>

      <h2>8. Multi-Modal Learning</h2>
      <p>Engage different learning styles for better comprehension:</p>
      <ul>
        <li>Combine visual, auditory, and kinesthetic learning</li>
        <li>Create mind maps and diagrams</li>
        <li>Record and listen to study materials</li>
        <li>Use educational videos and animations</li>
        <li>Practice hands-on exercises when possible</li>
      </ul>

      <h2>9. Progress Tracking and Analysis</h2>
      <p>Monitor your learning journey effectively:</p>
      <ul>
        <li>Keep a study journal or log</li>
        <li>Use analytics tools to track performance</li>
        <li>Regularly review and adjust study strategies</li>
        <li>Set and monitor achievement milestones</li>
        <li>Celebrate progress and achievements</li>
      </ul>

      <h2>10. Resource Optimization</h2>
      <p>Make the most of available learning resources:</p>
      <ul>
        <li>Utilize online educational platforms</li>
        <li>Access digital libraries and databases</li>
        <li>Participate in online tutorials and webinars</li>
        <li>Use educational apps and tools</li>
        <li>Seek help from teachers and mentors</li>
      </ul>

      <p>Success in modern education requires a balanced approach that combines proven study methods with innovative technology. By implementing these tips and continuously refining your study strategy, you'll be well-equipped to achieve your academic goals in 2024 and beyond.</p>
    `,
    author: 'Mentora Team',
    date: 'March 10, 2024',
    readTime: '7 min read',
    category: 'Study Tips',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
    slug: 'essential-study-tips'
  }
};

export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-purple-600 hover:text-purple-700 flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Blog */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg mb-8"
          />

          {/* Article Content */}
          <div
            className="prose max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Footer */}
          <footer className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <Bookmark className="w-5 h-5" />
                  <span>Save</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Category: {post.category}
              </span>
            </div>
          </footer>
        </article>
      </div>
    </motion.div>
  );
}; 