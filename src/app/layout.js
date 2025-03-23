import "./globals.css"; // اگر از فایل global CSS استفاده می‌کنید

export const metadata = {
  title: "Digital Menu",
  description: "Manage your cafes and menus easily!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Digital Menu</h1>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto p-4">{children}</main>

        {/* Footer */}
        <footer className="bg-white shadow-md p-4 mt-8">
          <div className="container mx-auto text-center">
            <p className="text-gray-600">© 2023 Digital Menu. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}