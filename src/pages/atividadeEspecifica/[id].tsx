import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link'
import { path } from '@/src/uteis/constPath'
import { MouseEventHandler, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AtividadeProps, MenuSetorProps, UsuarioProps } from '@/src/uteis/interfaces'
import axios from 'axios'
import { config } from '@/src/uteis/config'

import { Button } from '@/components/ui/button'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import BotaoCheckDialog from '@/src/components/BotaoCheckDialog'
import { constsComponents } from '@/src/uteis/constIdComponents'
import { getSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query"
import { Setores } from '@/src/uteis/enums'


export default function AtividadeEspecifica() {
  const history = useRouter()
  const setorMenuProps: MenuSetorProps = history.query.setor ? JSON.parse(history.query.setor.toString()) : {}
  const usuarioLogado: UsuarioProps = history.query.usuarioLogado ? JSON.parse(history.query.usuarioLogado.toString()) : {}
  const nomeTabela = setorMenuProps.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") //Remove acentos
  const [listaAtividades, setListaAtividades] = useState<AtividadeProps[]>([])

  const [checkBoxChecked, setCheckBoxChecked] = useState(false)

  const { data, error, isFetching, isPending, isSuccess } = useQuery<AtividadeProps[], Error>({
    queryKey: ['listaAtividades'],
    queryFn: () =>
      axios
        .get(`${config.server}/atividade/getListaAtividades/${setorMenuProps.id}`)
        .then(r => r.data),
    refetchInterval: 7000
  })


  function handleClickPushAtividade(atividade: AtividadeProps) {
    if (!atividade.responsavel_atual)
      history.push({
        pathname: path.atividadeEspecificaDetalhada,
        query: { atividade: JSON.stringify(atividade) }
      })
  }

  function handleClickConcluirAtividade(atividade: AtividadeProps) {
    axios
      .put(`${config.server}/atividade/concluirAtividade`, atividade)
      .then(r => {
        const listaAtualizada = listaAtividades.filter(a => a.id !== atividade.id)
        alert(r.request.response)
        setListaAtividades(listaAtualizada)
      })
      .catch(e => alert(e.response.data.resposta))
  }

  useEffect(() => {
    if (error) {
      alert('Ocorreu um erro ao carregar a Lista de atividades!')
      return
    }

    if (isPending)
      return

    if (isSuccess)
      setListaAtividades(data)
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>{nomeTabela}</title>
      </Head>
      <h2 className={styles.titulo}>{nomeTabela}</h2>
      <div className={styles.itens}>
        {listaAtividades && listaAtividades.map(atividade => (
          <Button
            key={atividade.id}
            id={`${setorMenuProps.id_menu}Menu`}
            style={!atividade.responsavel_atual ? { backgroundColor: 'red' } : undefined}
            onClick={() => handleClickPushAtividade(atividade)}
          >
            <>
              {atividade.responsavel_atual && atividade.responsavel_atual.length > 0 &&
                (setorMenuProps.id === Setores.Vendas || setorMenuProps.id === Setores.Medicao) &&
                (usuarioLogado.id_setor === Setores.Vendas || usuarioLogado.id_setor === Setores.Medicao)
                && <BotaoCheckDialog
                  children={<input checked={false} defaultChecked={false} type='checkbox' />}
                  titulo="Deseja realmente concluir essa atividade?"
                  handleEvendo={() => handleClickConcluirAtividade(atividade)}
                />}
            </>
            <p className={styles.detalheNome}> {atividade.nome_cliente} </p>
            <p className={styles.detalheEndereco}> {atividade.logradouro}, {atividade.nome_bairro}</p>
          </Button>
        ))}
      </div>
    </div >

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
      // session
    },
  }
}