import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { KeyboardEvent, createRef, useEffect, useState } from 'react'

import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react'

import styles from '../styles/home.module.css'

import { config } from '../uteis/config'
import { constsComponents } from '../uteis/constIdComponents'
import { UsuarioProps } from '../uteis/interfaces'
import { path } from '../uteis/constPath'

interface HomeProps {
  csrfToken: string | undefined
}

export default function Home({ csrfToken }: HomeProps) {
  const [id, setId] = useState<number | string>()
  const [nome, setNome] = useState<string>("")
  const [senha, setSenha] = useState<string>("")
  const [usuarioIdentificacao, setUsuarioIdentificacao] = useState<UsuarioProps | null>(null)
  const [listaUsuariosSistema, setListaUsuariosSistema] = useState<UsuarioProps[]>([])

  const inputSenha = createRef<HTMLInputElement>();

  function focus() {
    inputSenha?.current?.select();
  }

  useEffect(() => {

    axios
      .get(`${config.server}/usuario/getListaUsuarios`)
      .then(r => {
        if (r.data && r.data.length > 0) {
          setListaUsuariosSistema(r.data)
        }
      })
  }, [!listaUsuariosSistema])

  function handleEntrar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (senha === "") {
        alert("Informe a senha")
        return
      }
    }
  }

  function handleProcurarUsuario(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const usuario = listaUsuariosSistema.filter(u => u.id === id)[0]
      if (usuario) {
        setUsuarioIdentificacao(usuario)
        setNome(usuario.nome)
        focus();
      } else {
        alert('Usuário não encontrado')
        setNome('')
        setId(0)
      }
    }

    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
      e.preventDefault();
    } else if (/[0-9]/.test(e.key)
      && e.key === 'Backspace'
      && e.key.length <= 1) {
      e.preventDefault();
      setId(0)
    }
  }


  return (
    <div className={styles.container}>
      <Head>
        <title> Login </title>
      </Head>
      <>
        <form className={styles.form} method='post' action="api/auth/callback/credentials">
          <input name="csrfToken" type='hidden' defaultValue={csrfToken} />
          <label >Identificação</label>
          <div className={styles.identificacao}>
            <input
              autoFocus
              type="text"
              id='id'
              name='id'
              value={id}
              onKeyDown={handleProcurarUsuario}
              onChange={e => setId(!e.target.value ? 0 : parseInt(e.target.value))} />
            <input
              readOnly={true}
              type='text'
              id='nome'
              name='nome'
              value={nome}
              onChange={e => setNome(e.target.value)} />
          </div>
          <label >Senha</label>
          <input
            type='password'
            id='senha'
            name='senha'
            value={senha}
            ref={inputSenha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={handleEntrar} />
          <button
            id={constsComponents.button}
            type='submit'
            onClick={() => handleEntrar}
          > Entrar </button>
        </form>
      </>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session?.user) {
    return {
      redirect: {
        destination: path.atividadesGerais,
        permanent: false
      }
    }
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  }
}