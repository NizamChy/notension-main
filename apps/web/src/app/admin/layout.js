// Admin / merchant panel: its own pages, no customer header or footer.
export const metadata = {
  title: { default: "Admin", template: "NoTension Admin | %s" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
}
