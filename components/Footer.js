export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/tools" className="text-gray-300 hover:text-emerald-400 transition">All Tools</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-emerald-400 transition">Pricing</a></li>
              <li><a href="/api" className="text-gray-300 hover:text-emerald-400 transition">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-300 hover:text-emerald-400 transition">About</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-emerald-400 transition">Blog</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-emerald-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-gray-300 hover:text-emerald-400 transition">Privacy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-emerald-400 transition">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-400 mb-4">Follow</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2025 ProURLMonitor. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
