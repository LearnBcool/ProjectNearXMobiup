
const Footer = () => {
  return (
    <footer className="bg-gray-800 bg-opacity-50 py-4">
      <div className="container mx-auto px-4 flex justify-center space-x-4">
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
          Privacy Policy
        </a>
        <a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
          Terms of Use
        </a>
      </div>
    </footer>
  );
};

export default Footer;