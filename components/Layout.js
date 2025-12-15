import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <Header />
      <main className="flex-1 container py-8 sm:py-12">{children}</main>
      <Footer />
    </div>
  );
}
