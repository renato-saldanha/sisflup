import { ProviderProps, ReactNode, createContext, useState } from "react";
import { UsuarioProps } from "../uteis/interfaces";

interface UsuarioProviderProps {
  children: ReactNode
}

interface UsuarioContextData {
  usuarioLogado: UsuarioProps | undefined
  setUsuarioLogado: (usuario: UsuarioProps) => void,
  paginaAtiva: string,
  setPaginaAtiva: (a: string) => void
}

export const UsuarioLogadoContext = createContext({} as UsuarioContextData)

function UsuarioLogadoProvider({ children }: UsuarioProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioProps>()
  const [paginaAtiva, setPaginaAtiva] = useState("")

  function setUsuarioLogado(usuario: UsuarioProps) {
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