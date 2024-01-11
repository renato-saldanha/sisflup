import { ProviderProps, ReactNode, createContext, useState } from "react";
import { iUsuario } from "../uteis/interfaces";

interface UsuarioProviderProps {
  children: ReactNode
}

interface UsuarioContextData {
  usuarioLogado: iUsuario | undefined
  setUsuarioLogado: (usuario: iUsuario) => void,
  paginaAtiva: string,
  setPaginaAtiva: (a: string) => void
}

export const UsuarioLogadoContext = createContext({} as UsuarioContextData)

function UsuarioLogadoProvider({ children }: UsuarioProviderProps) {
  const [usuario, setUsuario] = useState<iUsuario>()
  const [paginaAtiva, setPaginaAtiva] = useState("")

  function setUsuarioLogado(usuario: iUsuario) {
    setUsuario(usuario)
  }

  return (
    <UsuarioLogadoContext.Provider value={{
      usuarioLogado: usuario, setUsuarioLogado, paginaAtiva, setPaginaAtiva
    }}>
      {children}
    </UsuarioLogadoContext.Provider>
  )
}

export default UsuarioLogadoProvider