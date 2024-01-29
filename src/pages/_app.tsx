import '@/src/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import { SessionProvider } from 'next-auth/react'
import BotaoSignOut from '../components/BotaoSignOut'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <Header />
          <Component {...pageProps} />
          <strong style={{ color: 'white', position:"absolute", bottom:"0%", width: '100%', padding:"8px", textAlign:"right"}}>
            RS Soluções Tecnológicas. Email: ranalisesaldanha@gmail.com - Telefone: (65) 9 9271-2774
          </strong>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
