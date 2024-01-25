import { useContext, useEffect } from 'react'
import FormAtividade from '../formAtividade'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { path } from '@/src/uteis/constPath'
import { Session } from 'next-auth'

interface AtividadeEspecificaDetalhadaProps {
  session: Session
}

export default function AtividadeEspecificaDetalhada({ session }: AtividadeEspecificaDetalhadaProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Atividade</title>
      </Head>
      <FormAtividade session={session} />
    </div>

  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session?.user) {
    return {
      redirect: {
        destination: path.login,
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    },
  }
}