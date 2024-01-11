import React, { KeyboardEvent, createRef, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'

import styles from '../styles/home.module.css'
import stylesComponetes from '../styles/stylesComponentes.module.css'

import { path } from '../uteis/constPath'
import { iUsuario } from '../uteis/interfaces'
import Head from 'next/head'
import Link from 'next/link'
import UsuarioLogadoProvider, { UsuarioLogadoContext } from '../contexts/usuario'

export default function Home() {
  const [id, setId] = useState<number | string>()
  const [nome, setNome] = useState<string>("")
  const [senha, setSenha] = useState<string>("")
  const [usuarioIdentificacao, setUsuarioIdentificacao] = useState<iUsuario | null>(null)
  const [listaUsuariosSistema, setListaUsuariosSistema] = useState<iUsuario[]>([])

  const setUsuarioLogado = useContext(UsuarioLogadoContext).setUsuarioLogado

  const inputSenha = createRef<HTMLInputElement>();
  const buttonEntrar = createRef<HTMLAnchorElement>();

  function entrar() {
    buttonEntrar?.current?.click()
  }

  function focus() {
    inputSenha?.current?.focus();
  }

  useEffect(() => {
    axios
      .get('http://localhost:4000/getListaUsuarios')
      .then(r => {
        if (r.data && r.data.length > 0) {
          setListaUsuariosSistema(r.data)
        }
      })
  }, [!listaUsuariosSistema])

  function handleEntrar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const usuario = listaUsuariosSistema.filter(u => u.id === usuarioIdentificacao?.id)[0]
      if (usuario) {
        axios
          .get(`http://localhost:4000/login/${id}&${senha}`)
          .then(r => {
            if (r.data) {
              let usuarioRecebido: iUsuario = r.data.usu
              setUsuarioLogado(usuarioRecebido)
              entrar()
            }
          })
          .catch(error => {
            alert(error)
            e.preventDefault()
          })
      } else {
        alert('Preencha com um Usuário')
        e.preventDefault()
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
    } else if (/[0-9]/.test(e.target.value)
      && e.key === 'Backspace'
      && e.target.value.length <= 1) {
      e.preventDefault();
      setId(0)
    }
  }


  return (
    <div className={styles.container}>
      <Head>
        <title> Login </title>
      </Head>
      <UsuarioLogadoProvider>
        <>
          <form className={styles.form}>
            <label >Identificação</label>
            <div className={styles.identificacao}>
              <input
                autoFocus
                type="text"
                id='id'
                name='id'
                value={id}
                onKeyDown={handleProcurarUsuario}
                onChange={e => setId(parseInt(e.target.value))} />
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

            <Link
              ref={buttonEntrar}
              href={path.atividadesGerais}
            > Entrar </Link>
          </form>
        </>
      </UsuarioLogadoProvider>
    </div>

  )
}
