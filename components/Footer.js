export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12" style={{borderColor: 'rgba(6,95,70,0.06)'}}>
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-emerald-700 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/tools" className="hover:underline">All Tools</a></li>
              <li><a href="/pricing" className="hover:underline">Pricing</a></li>
              <li><a href="/api" className="hover:underline">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/blog" className="hover:underline">Blog</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/privacy" className="hover:underline">Privacy</a></li>
              <li><a href="/terms" className="hover:underline">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-4">Follow</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm pt-4 text-gray-500">
          <p>&copy; 2025 ProURLMonitor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
