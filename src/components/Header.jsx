
import { Twitter, MessageCircle, FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-4">
      <nav className="container mx-auto flex justify-center space-x-6">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-cyan-300 transition-colors">
          <Twitter className="mr-2" size={20} />
          X (Twitter)
        </a>
        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-cyan-300 transition-colors">
          <MessageCircle className="mr-2" size={20} />
          Telegram
        </a>
        <a href="/docs" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-cyan-300 transition-colors">
          <FileText className="mr-2" size={20} />
          Docs
        </a>
      </nav>
    </header>
  );
};

export default Header;