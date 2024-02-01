import { Button } from "@/components/ui/button"
import { Command, CommandItem } from "@/components/ui/command"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { path } from "@/src/uteis/constPath"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { ChevronDownIcon, PencilIcon, SearchIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { createRef, useContext, useEffect, useState } from "react"

import { config } from "@/src/uteis/config"
import { constsComponents } from "@/src/uteis/constIdComponents"
import { AtividadePesquisaProps, UsuarioPesquisaProps } from "@/src/uteis/interfaces"
import axios from "axios"
import Head from "next/head"
import { useRouter } from "next/router"
import styles from './styles.module.css'
import ListaUsuarios from "@/src/components/ListaUsuarios"
import ListaAtividades from "@/src/components/ListaAtividades"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { Session } from "next-auth"


interface FiltroProps {
  descricao: string,
  filtro: string
}

interface ConsultaProps {
  session?: Session
}

export default function Consulta({ session }: ConsultaProps) {
  const history = useRouter()

  const paginaAtiva = history.query.nomePagina ? history.query.nomePagina : ""

  const [lista, setLista] = useState<UsuarioPesquisaProps[] | AtividadePesquisaProps[]>()

  const nomeTabela = paginaAtiva.toString()

  const [descricao, setDescricao] = useState("")
  const [abrirSetor, setAbrirSetor] = useState(false)
  const [filtroSelecionado, setFiltroSelecionado] = useState<FiltroProps>()

  const paginaAtivaSingular = String(paginaAtiva).substring(0, paginaAtiva.length - 1)
  const pathTipoLista = String(paginaAtiva).substring(0, paginaAtiva.length - 1).toLowerCase()

  const inputDescricao = createRef<HTMLInputElement>()

  const filtrosDropdown = () => {
    switch (nomeTabela.toLowerCase()) {
      case 'usuarios':
        return [
          { descricao: 'Nome', filtro: "usuarios.nome" },
          { descricao: 'Setor', filtro: "setores.nome" }
        ]
      case 'atividades':
        return [
          { descricao: "Cliente", filtro: "atividades.nome_cliente" },
          { descricao: "Setor", filtro: "setores.nome" },
          { descricao: "Responsavel", filtro: "responsavel" },
          { descricao: "Arquiteto", filtro: "atividades.nome_arquiteto" },
          { descricao: "Bairro", filtro: "bairros.nome_bairro" }
        ]
    }
  }

  useEffect(() => {

  }, [])

  function handleSelectFiltro(c: string) {
    const filtroSelecionado = filtrosDropdown()?.find(s => s.filtro.toLowerCase() === c.toLowerCase())
    setFiltroSelecionado(filtroSelecionado)
    setAbrirSetor(false)
  }

  function handlePesquisar() {
    if (!filtroSelecionado) {
      alert("Favor selecionar um filtro!")
      return
    }

    axios
      .get(`${config.server}/${pathTipoLista}/getLista${nomeTabela}/${descricao === "" ? "all" : descricao}&${filtroSelecionado?.filtro}`)
      .then(r => {
        if (r.data) setLista(r.data)
      })
      .catch(e => {
        alert(e)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Consulta de {paginaAtiva}</title>
      </Head>
      <div className={styles.botoesHeader}>
        <Link id={constsComponents.button}
          href={{
            pathname: "form" + paginaAtivaSingular,
            query: { isCadastro: true }
          }}>
          + {paginaAtivaSingular}
        </Link>
      </div>
      <div className={styles.camposPesquisa} >
        <label>Descrição</label>
        <input
          autoFocus
          type="text"
          id="descricao"
          name="descricao"
          value={descricao}
          ref={inputDescricao}
          onChange={e => setDescricao(e.target.value)} />
        <label>Filtro</label>
        <Popover open={abrirSetor} onOpenChange={setAbrirSetor}>
          <PopoverTrigger asChild>
            <Button id={constsComponents.dropdown} className={styles.botaoDropDown}>
              {filtrosDropdown()?.find(filtro => filtro.descricao === filtroSelecionado?.descricao)?.descricao
                ? filtrosDropdown()?.find(filtro => filtro.descricao === filtroSelecionado?.descricao)?.descricao
                : "Selecione o filtro"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent id={constsComponents.dropdownList} >
            <Command style={{ width: 300 }}>
              {filtrosDropdown()?.map((filtro, i) =>
                <CommandItem
                  key={filtro.filtro}
                  value={filtro.filtro}
                  onSelect={handleSelectFiltro}
                >
                  {filtrosDropdown()![i].descricao}
                </CommandItem>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        <button
          id={constsComponents.button}
          className={styles.botaoPesquisar}
          onClick={() => handlePesquisar()}>
          <SearchIcon size={18} style={{ marginRight: 8 }} />
          Pesquisar
        </button>
      </div>

      {lista && nomeTabela === "Usuarios" && <ListaUsuarios session={session} lista={lista as UsuarioPesquisaProps[]} nomeTabela={nomeTabela} setLista={setLista} />}
      {lista && nomeTabela === "Atividades" && <ListaAtividades session={session} lista={lista as AtividadePesquisaProps[]} nomeTabela={nomeTabela} setLista={setLista} />}

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