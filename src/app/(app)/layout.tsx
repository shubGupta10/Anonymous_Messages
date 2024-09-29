import Navbar from "@/components/Navbar"

export const metadata = {
  title: 'Anonymous Feedback',
  description: 'Coded on Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}</body>
    </html>
  )
}
