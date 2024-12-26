import React from 'react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentora</h3>
            <p className="text-gray-600 mb-4">
              Empowering learners with personalized AI assistance and adaptive learning paths.
            </p>
            <p className="text-gray-600 mb-4">Stay inspired—follow me for tips, updates, and creative insights!</p>
            <div className="flex space-x-4">
              <a href="https://github.com/SurajRai1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <Github size={20} />
              </a>
              <a href="https://x.com/SuhangRai37" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/rai_suhang37/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/suraj-rai-28b77b250/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/documentation" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
              <li><Link to="/tutorials" className="text-gray-600 hover:text-gray-900">Tutorials</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Mentora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};