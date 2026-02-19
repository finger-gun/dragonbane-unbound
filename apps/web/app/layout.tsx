import './globals.css';

export const metadata = {
  title: 'Dragonbane Unbound',
  description: 'Local-first tabletop tools for running Dragonbane faster.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
