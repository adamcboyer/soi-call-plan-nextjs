export const metadata = {
  title: 'SOI Call Plan',
  description: '30-Day call tracking for real estate contacts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#fafafa' }}>{children}</body>
    </html>
  );
}
