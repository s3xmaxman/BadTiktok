import type { Metadata } from 'next'
import './globals.css'
import AuthOverlay from './components/AuthOverlay'
import UserProvider from './context/user'
import AllOverlays from './components/AllOverlays'



export const metadata: Metadata = {
  title: 'Tiktok Clone',
  description: 'Tiktok Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>   
        <body>
          <AllOverlays />
          {children}
        </body>
      </UserProvider>   
    </html>
  )
}
