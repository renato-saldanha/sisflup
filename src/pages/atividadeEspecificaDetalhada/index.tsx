import { useContext, useEffect } from 'react'
import FormAtividade from '../formAtividade'
import styles from './styles.module.css'
import UsuarioLogadoProvider, { UsuarioLogadoContext } from '@/src/contexts/usuario'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface AtividadeEspecificaDetalhadaProps {
  mostrarBtnConcluir: boolean,
  mostrarBtnSalvar: boolean
}

export default function AtividadeEspecificaDetalhada() {
  const { usuarioLogado } = useContext(UsuarioLogadoContext)
  const history = useRouter()

  useEffect(() => {
    if (!usuarioLogado) history.push("/")
  }, [usuarioLogado])

  return (
    <div className={styles.container}>
      <Head>
        <title>Atividade</title>
      </Head>      
      <FormAtividade />
    </div>

  )
}