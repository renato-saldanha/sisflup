import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link'
import { path } from '@/src/uteis/constPath'
import { useContext, useEffect } from 'react'
import UsuarioLogadoProvider, { UsuarioLogadoContext } from '@/src/contexts/usuario'
import { useRouter } from 'next/router'
import { iUsuario } from '@/src/uteis/interfaces'

interface AtividadeEspecificaProps {
  usuarioLogado: iUsuario
}

export default function AtividadeEspecifica() {
  const q = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  const { usuarioLogado } = useContext(UsuarioLogadoContext)
  const history = useRouter()

  useEffect(() => {
    if (!usuarioLogado) {
      history.push("/")
    }
  }, [usuarioLogado])


  return (
    <div className={styles.container}>
      <Head>
        <title>Medição</title>
      </Head>
      <div className={styles.header}>
        <h1 className={styles.titulo}> Medição </h1>
      </div>

      <div className={styles.itens}>
        {q.map(q => (
          <Link
            href={path.atividadeEspecificaDetalhada}>
            <p className={styles.detalhe}> João</p>
            <p className={styles.detalhe}> Rua B lote 5</p>
          </Link>
        ))}
      </div>

    </div>
  )
}