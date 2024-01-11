import { Button } from "@/components/ui/button"
import { Command, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { path } from "@/src/uteis/constPath"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { CommandEmpty, CommandInput } from "cmdk"
import { Check, ChevronDownIcon, ChevronDownSquare, ChevronsUpDown, PencilIcon, SearchIcon as Search, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { ChangeEvent, FormEvent, FormEventHandler, MouseEventHandler, useContext, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import styles from './styles.module.css'
import { constsComponents } from "@/src/uteis/constIdComponents"
import Head from "next/head"
import { usePathname } from "next/navigation"
import { UsuarioLogadoContext } from "@/src/contexts/usuario"



interface SetorProps {
  id: number,
  nomeSetor: string,
  descricao: string,
}

const setores: SetorProps[] = [
  {
    id: 0,
    nomeSetor: "Administração",
    descricao: "0 - Administração"
  },
  {
    id: 1,
    nomeSetor: "Vendas",
    descricao: "1 - Vendas"
  },
  {
    id: 2,
    nomeSetor: "Medição",
    descricao: "2 - Medição"
  },
  {
    id: 3,
    nomeSetor: "Prod.Serra",
    descricao: "3 - Prod.Serra"
  },
  {
    id: 4,
    nomeSetor: "Prod.Acabamento",
    descricao: "4 - Prod.Acabamento"
  },
  {
    id: 5,
    nomeSetor: "Entrega",
    descricao: "5 - Entrega"
  },
  {
    id: 6,
    nomeSetor: "Instalação",
    descricao: "6 - Instalação"
  },
  {
    id: 7,
    nomeSetor: "Pós-Venda",
    descricao: "7 - Pós-Venda"
  },
]

const usuarios = [
  {
    id: 0,
    nome: "Administrador",
    setor: "Adm.",
    permissao: "Administrador"
  },
  {
    id: 1,
    nome: "Renato Saldanha",
    setor: "Vendas",
    permissao: "Gestor"
  }
]

export default function Consulta() {
  const [descricao, setDescricao] = useState("")
  const [abrirSetor, setAbrirSetor] = useState(false)
  const [abrirPermissao, setAbrirPermissao] = useState(false)
  const [descricaoSetor, setDescricaoSetor] = useState("Selecione o setor")
  const { paginaAtiva } = useContext(UsuarioLogadoContext)

  const permissoes = [
    { permissao: "0 - Administrador" },
    { permissao: "1 - Gestor" },
  ]

  const paginaAtivaSingular = paginaAtiva.substring(0, paginaAtiva.length -1)

  function handleChangeSelectSetor(c: string) {
    // const setorSelecionado = setores.find(s => s.id === parseInt(c[0])) ?
    //   setNomeSetor(setorSelecionado.nomeSetor)
    // setSetor
    // setAbrirSetor(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  function handleSelectSetor() {

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Consulta de {paginaAtiva}</title>
      </Head>
      <div className={styles.botoesHeader}>
        <Link id={constsComponents.button} href={path.cadastroUsuario}>+ {paginaAtivaSingular}</Link>
      </div>
      <div className={styles.camposPesquisa} >
        <label>Descrição</label>
        <input
          type="text"
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={e => setDescricao(e.target.value)} />
        <label>Filtro</label>
        <Popover open={abrirSetor} onOpenChange={setAbrirSetor}>
          <PopoverTrigger asChild>
            <Button id={constsComponents.dropdown} className={styles.botaoDropDown}>
              {setores.find(setor => setor.descricao === descricaoSetor)?.descricao
                ? setores.find(setor => setor.descricao === descricaoSetor)?.descricao
                : "Selecione o filtro"}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent id={constsComponents.dropdownList} >
            <Command className={styles.lista}>
              {setores.map((setor, i) =>
                <CommandItem
                  key={setor.id}
                  value={setor.descricao}
                  onSelect={handleSelectSetor}
                >
                  {setores[i].descricao}
                </CommandItem>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        <Button><Search size={18} style={{ marginRight: 8 }} />  Pesquisar </Button>
      </div>

      <div >
        <Table className={styles.tabela}>
          <TableCaption className={styles.tableCaption}> {paginaAtiva} </TableCaption>
          <TableHeader className={styles.tableHead}>
            <TableRow className={styles.tableRow}>
              <TableHead className={styles.colunaId}>Id</TableHead>
              <TableHead className={styles.colunaNome}>Nome</TableHead>
              <TableHead className={styles.colunaSetor}>Setor</TableHead>
              <TableHead className={styles.colunaPermissao}>Permissão</TableHead>
              <TableHead className={styles.colunaBotoes}>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={styles.tableHead}>
            {usuarios.map(usuario => (
              <TableRow key={usuario.id} className={styles.tableRow}>
                <TableCell className={styles.colunaId}>{usuario.id}</TableCell>
                <TableCell className={styles.colunaNome}>{usuario.nome}</TableCell>
                <TableCell className={styles.colunaSetor}>{usuario.setor}</TableCell>
                <TableCell className={styles.colunaPermissao}>{usuario.permissao}</TableCell>
                <TableCell className={styles.colunaBotoes} >
                  <Link href={{ pathname: path.cadastroUsuario, query: usuario }} className={styles.botaoAlterar}><PencilIcon size={19} /></Link>
                  <Button className={styles.botaoDeletar}><Trash2Icon size={19} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}