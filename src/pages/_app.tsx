import '@/src/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from './components/Header'
import UsuarioLogadoProvider from '../contexts/usuario'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UsuarioLogadoProvider>
        <Header />
        <Component {...pageProps} />
      </UsuarioLogadoProvider>
    </>
  )
}
