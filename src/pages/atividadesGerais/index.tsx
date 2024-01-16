import { GetServerSideProps, GetStaticProps } from 'next';
import styles from './styles.module.css'

import { useContext, useEffect } from "react"
import Head from 'next/head';
import UsuarioLogadoProvider, { UsuarioLogadoContext } from '@/src/contexts/usuario';
import { useRouter } from 'next/router';
import { UsuarioProps } from '@/src/uteis/interfaces';
import Link from 'next/link';
import { path } from '../../uteis/constPath'
import { PERMISSAO_ADMIN } from '@/src/uteis/consts';


export default function AtividadesGerais() {
  const { usuarioLogado, setPaginaAtiva } = useContext(UsuarioLogadoContext)
  const history = useRouter()  

  useEffect(() => {
    if (!usuarioLogado) {
      history.push("/")
    }
  }, [usuarioLogado])

  return (
    <>
      <Head>
        <title> Atividades Gerais </title>
      </Head>
      <div className={styles.container}>
        {usuarioLogado?.id_permissao === PERMISSAO_ADMIN && (
          <div className={styles.consultas}>
            <Link onClick={() => setPaginaAtiva("Usuarios")} href={path.consultaUsuarios}>Usuarios</Link>
            <Link onClick={() => setPaginaAtiva("Atividades")} href={path.consultaAtividades}>Atividades</Link>
          </div>
        )}
        <div className={styles.atividades}>
          <Link style={{ backgroundColor: '#F6FA2E' }} href={path.atividadeEspecifica}>Vendas</Link>
          <Link style={{ backgroundColor: '#73B8F9' }} href={path.atividadeEspecifica}>Medição</Link>
          <Link style={{ backgroundColor: '#E9E9E2' }} href={path.atividadeEspecifica}>Prod. Serra</Link>
          <Link style={{ backgroundColor: '#93938F' }} href={path.atividadeEspecifica}>Prod. Acabam.</Link>
          <Link style={{ backgroundColor: '#FF9A23' }} href={path.atividadeEspecifica}>Entrega</Link>
          <Link style={{ backgroundColor: '#1962F0' }} href={path.atividadeEspecifica}>Instalação</Link>
          <Link style={{ backgroundColor: '#66D63E' }} href={path.atividadeEspecifica}>Pós-venda</Link>
        </div>

      </div>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   const res = await fetch('http://localhost:4000/')
//   return { props: { res } }
// }

// export const getStaticProps: GetStaticProps = async ({context}) => {
//   let logado = await context.usu
//   if (!context) {
//     return {
//       redirect : "/",
//     }
//   }

//   return {
//     props: {
//       context: context
//     }
//   }
// }