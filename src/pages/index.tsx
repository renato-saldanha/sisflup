import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { FocusEvent, KeyboardEvent, createRef, useEffect, useState } from 'react'

import { getCsrfToken, getSession, signIn, signOut } from 'next-auth/react'

import styles from '../styles/home.module.css'

import { config } from '../uteis/config'
import { constsComponents } from '../uteis/constIdComponents'
import { UsuarioProps } from '../uteis/interfaces'
import { path } from '../uteis/constPath'
import { useRouter } from 'next/router'

interface HomeProps {
  csrfToken: string | undefined
}

export default function Home({ csrfToken }: HomeProps) {
  const [id, setId] = useState<number | string>()
  const [nome, setNome] = useState<string>("")
  const [senha, setSenha] = useState<string>("")
  const [listaUsuariosSistema, setListaUsuariosSistema] = useState<UsuarioProps[]>([])
  const history = useRouter()
  const inputSenha = createRef<HTMLInputElement>()

  function focus() {
    inputSenha?.current?.select()
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

  function handleEntrarKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (senha === "") {
        alert("Informe a senha")
        return
      }
      handleEntrarClick()
    }
  }

  async function handleEntrarClick() {
    try {
      const res = await signIn('credentials', {
        credential: { csrfToken },
        id: id,
        senha: senha,
        redirect: false
      })

      if (res?.status === 200) history.push(path.atividadesGerais)
      else if (res?.status === 401) {
        alert("Senha não Confere")
        return
      }
      // method='post' action="api/auth/callback/credentials"
    } catch (error) {
      alert(error)
    }
  }

  function handleProcurarUsuarioExit(e: KeyboardEvent<HTMLInputElement> & FocusEvent<HTMLInputElement>) {
    if (e.currentTarget.name === "id" && e.currentTarget.value !== '0') {
      const usuario = listaUsuariosSistema.filter(u => u.id === id)[0]
      if (usuario) {
        setNome(usuario.nome)
        focus();
      } else {
        alert('Usuário não encontrado')
        setNome('')
        setId(0)
        e.preventDefault()
      }
    }
  }

  function handleProcurarUsuario(e: KeyboardEvent<HTMLInputElement> & FocusEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const usuario = listaUsuariosSistema.filter(u => u.id === id)[0]
      if (usuario) {
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
        <div className={styles.form}>
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
              onBlur={handleProcurarUsuarioExit}
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
            onKeyDown={handleEntrarKeyDown} />
          <button
            id={constsComponents.button}
            // type='submit'
            onClick={handleEntrarClick}
          > Entrar </button>
        </div>
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