import { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { GetSessionParams, getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import styles from './styles.module.css';

import { config } from '@/src/uteis/config';
import { PERMISSAO_ADMIN } from '@/src/uteis/consts';
import { MenuSetorProps, UsuarioProps } from '@/src/uteis/interfaces';
import { path } from '../../uteis/constPath';
import { constsComponents } from '@/src/uteis/constIdComponents';
import { redirect } from "next/dist/server/api-utils";
import { Session } from "next-auth";

interface AtividadesGeraisProps {
  session?: Session
}

export default function AtividadesGerais({ session }: AtividadesGeraisProps) {
  const usuarioLogado = session?.user
  const [listaSetores, setListaSetores] = useState<MenuSetorProps[]>([])

  useEffect(() => {
    axios
      .get(`${config.server}/setor/getListaSetores`)
      .then(r => {
        if (r.data && r.data.length > 0) {
          const listaComIdMenu = r.data.map((setor: MenuSetorProps) => {
            setor.id_menu = setor.nome.replace(' ', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() + "Button"
            return setor
          })
          setListaSetores(listaComIdMenu)
        }
      })
      .catch(e => alert(e.response.data.resposta))
  }, [!listaSetores])

  return (
    <>
      <Head>
        <title> Atividades Gerais </title>
      </Head>
      <div className={styles.container}>
        <div className={styles.consultas}>
          {usuarioLogado?.id_permissao === PERMISSAO_ADMIN && (
            <Link
              id={constsComponents.button}
              href={{
                pathname: path.consultaUsuarios,
                query: { nomePagina: "Usuarios" }
              }}>Usuarios</Link>
          )}
          <Link
            id={constsComponents.button}
            href={{
              pathname: path.consultaAtividades,
              query: { nomePagina: "Atividades" }
            }}>Atividades</Link>
        </div>

        <div className={styles.setores}>
          {listaSetores.map(setor => (
            <Link
              key={setor.id_menu}
              id={setor.id_menu}
              href={{
                pathname: `${path.atividadeEspecifica}/${setor.id}`,
                query: { setor: JSON.stringify(setor) }
              }}>{setor.nome}</Link>
          ))}
        </div>

      </div>
    </>
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