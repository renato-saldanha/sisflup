import { Button } from "@/components/ui/button"
import { Command, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { PermissaoProps, SetorProps } from "@/src/uteis/interfaces"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { CommandEmpty, CommandInput } from "cmdk"
import { Check, ChevronDownIcon, ChevronDownSquare, ChevronsUpDown } from "lucide-react"
import { ChangeEvent, FormEvent, FormEventHandler, MouseEventHandler, useState } from "react"

import styles from './styles.module.css'
import { useRouter } from "next/router"
import { constsComponents } from "@/src/uteis/constIdComponents"
import Head from "next/head"

const setores: SetorProps[] = [
  {
    id: 0,
    nome: "Administração",
    descricao: "0 - Administração"
  },
  {
    id: 1,
    nome: "Vendas",
    descricao: "1 - Vendas"
  },
  {
    id: 2,
    nome: "Medição",
    descricao: "2 - Medição"
  },
  {
    id: 3,
    nome: "Prod.Serra",
    descricao: "3 - Prod.Serra"
  },
  {
    id: 4,
    nome: "Prod.Acabamento",
    descricao: "4 - Prod.Acabamento"
  },
  {
    id: 5,
    nome: "Entrega",
    descricao: "5 - Entrega"
  },
  {
    id: 6,
    nome: "Instalação",
    descricao: "6 - Instalação"
  },
  {
    id: 7,
    nome: "Pós-Venda",
    descricao: "7 - Pós-Venda"
  },
]

const permissoes = [
  {
    id: 0,
    nome: "Administrador",
    descricao: "0 - Administrador"
  },
  {
    id: 1,
    nome: "Gestor",
    descricao: "1 - Gestor"
  },
]

export default function FormUsuario() {
  const id = 0;
  const [descricaoSetor, setDescricaoSetor] = useState("Selecione o setor")
  const [descricaoPermissao, setDescricaoPermissao] = useState("Selecione a permissão")
  const [nomeUsuario, setNomeUsuario] = useState("")
  const [idPermissao, setIdPermissao] = useState(-1)
  const [setor, setSetor] = useState<SetorProps>()
  const [senha, setSenha] = useState("")
  const [permissao, setPermissao] = useState<PermissaoProps>()
  const [abrirSetor, setAbrirSetor] = useState(false)
  const [abrirPermissao, setAbrirPermissao] = useState(false)

  const history = useRouter()

  const setorSelecionado = {
    id,
    nomeUsuario,
    senha,
    idPermissao
  }

  function handleSelectSetor(c: string) {
    const setorSelecionado: SetorProps | undefined = setores.find(s => s.id === parseInt(c[0]))
    if (setorSelecionado) {
      setDescricaoSetor(setorSelecionado.descricao)
      setSetor(setorSelecionado)
    }
    setAbrirSetor(false)
  }

  function handleSelectPermissao(c: string) {
    const permissaoSelecionada: PermissaoProps | undefined = permissoes.find(s => s.id === parseInt(c[0]))
    if (permissaoSelecionada) {
      setDescricaoPermissao(permissaoSelecionada.descricao)
      setPermissao(permissaoSelecionada)
    }
    setAbrirPermissao(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Cadastro de Usuário</title>
      </Head>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Nome</label>
        <input
          autoFocus
          placeholder="Digite o nome do usuário"
          type="text"
          id="nome"
          name="nome"
          value={nomeUsuario}
          onChange={e => setNomeUsuario(e.target.value)} />

        <label>Setor</label>
        <Popover open={abrirSetor} onOpenChange={setAbrirSetor}>
          <PopoverTrigger asChild>
            <Button id={constsComponents.dropdown}>
              {setores.find(setor => setor.descricao === descricaoSetor)?.descricao
                ? setores.find(setor => setor.descricao === descricaoSetor)?.descricao
                : "Selecione o setor"}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent id={constsComponents.dropdownList}>
            <Command >
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

        <label>Senha</label>
        <input
          type="text"
          placeholder="Digite a senha"
          id="senha"
          name="senha"
          value={senha}
          onChange={e => setSenha(e.target.value)} />

        <label>Permissão</label>
        <Popover open={abrirPermissao} onOpenChange={setAbrirPermissao}>
          <PopoverTrigger asChild>
            <Button id={constsComponents.dropdown}>
              {permissoes.find(permissao => permissao.descricao === descricaoPermissao)?.descricao
                ? permissoes.find(permissao => permissao.descricao === descricaoPermissao)?.descricao
                : "Selecione a permissão"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent  id={constsComponents.dropdownList}>
            <Command >
              {permissoes.map((permissao, i) =>
                <CommandItem
                  key={permissao.id}
                  value={permissao.descricao}
                  onSelect={handleSelectPermissao}
                >
                  {permissoes[i].descricao}
                </CommandItem>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        <div className={styles.botoes}>
          <button>Salvar</button>          
        </div>
      </form >

    </div >
  )
}