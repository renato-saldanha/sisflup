import { Button } from "@/components/ui/button"
import { Command, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { PermissaoProps, SetorProps, UsuarioProps } from "@/src/uteis/interfaces"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { CommandEmpty, CommandInput } from "cmdk"
import { Check, ChevronDownIcon, ChevronDownSquare, ChevronsUpDown } from "lucide-react"
import { ChangeEvent, FormEvent, FormEventHandler, MouseEventHandler, useContext, useEffect, useState } from "react"

import styles from './styles.module.css'
import { useRouter } from "next/router"
import { constsComponents } from "@/src/uteis/constIdComponents"
import Head from "next/head"
import axios from "axios"
import { config } from "@/src/uteis/config"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { path } from "@/src/uteis/constPath"
import { Session } from "next-auth"

interface FormUsuarioProps {
  session?: Session
}

export default function FormUsuario({ session }: FormUsuarioProps) {
  const usuarioLogado = session?.user
  const history = useRouter()
  const usuario: UsuarioProps = history.query.usuario ? JSON.parse(history.query.usuario.toString()) : {}
  const server = config.server

  const id = usuario ? usuario.id : -1;
  const [nomeUsuario, setNomeUsuario] = useState(usuario ? usuario.nome : "")
  const [senha, setSenha] = useState(usuario ? usuario.senha : "")
  const [idSetorSelecionado, setIdSetorSelecionado] = useState(usuario ? usuario.id_setor : -1)
  const [idPermissaoSelecionada, setIdPermissaoSelecionada] = useState(usuario ? usuario.id_permissao : -1)

  const [setoresDropdown, setSetoresDropdown] = useState<SetorProps[]>([]);
  const [permissoesDropdown, setPermissoesDropdown] = useState<PermissaoProps[]>([])
  const [abrirSetor, setAbrirSetorDropdown] = useState(false)
  const [abrirPermissao, setAbrirPermissaoDropdown] = useState(false)

  const usuarioPersistencia = {
    id,
    nome: nomeUsuario,
    senha,
    id_setor: idSetorSelecionado,
    id_permissao: idPermissaoSelecionada,
  }

  function limparCampos() {
    setNomeUsuario("")
    setSenha("")
    setIdSetorSelecionado(-1)
    setIdPermissaoSelecionada(-1)
  }

  useEffect(() => {
    if (setoresDropdown.length > 0) return
    axios
      .get(`${server}/setor/getListaSetores`)
      .then(r => {
        if (r.data && r.data.length > 0) {
          const setoresComDescricao = r.data.map((setor: SetorProps) => {
            setor.descricao = `${setor.id} - ${setor.nome}`
            return setor
          })
          setSetoresDropdown(setoresComDescricao)
        }
      })
      .catch(e => alert(`Ocorreu um erro ao gerar a lista de Setores: ${e.response.data.resposta}`))

    if (permissoesDropdown.length > 0) return
    axios
      .get(`${server}/permissao/getListaPermissoes`)
      .then(r => {
        if (r.data && r.data.length > 0) {
          const permissoesComDescricao = r.data.map((permissao: PermissaoProps) => {
            permissao.descricao = `${permissao.id} - ${permissao.nome}`
            return permissao
          })
          setPermissoesDropdown(permissoesComDescricao)
        }
      })
      .catch(e => alert(`Ocorreu um erro ao gerar a lista de Permissões: ${e.response.data.resposta}`))
  }, [!setoresDropdown])

  function handleSelectSetorDropdown(c: string) {
    const setorSelecionado: SetorProps | undefined = setoresDropdown.find(s => s.id === parseInt(c[0]))
    if (setorSelecionado) {
      setIdSetorSelecionado(setorSelecionado.id)
    }
    setAbrirSetorDropdown(false)
  }

  function handleSelectPermissaoDropdown(c: string) {
    const permissaoSelecionada: PermissaoProps | undefined = permissoesDropdown.find(s => s.id === parseInt(c[0]))
    if (permissaoSelecionada) {
      setIdPermissaoSelecionada(permissaoSelecionada.id)
    }
    setAbrirPermissaoDropdown(false)
  }

  function handleClick() {
    axios
      .post(`${server}/usuario/persistirUsuario`, usuarioPersistencia)
      .then(r => {
        if (r.data) {
          alert(r.data.resposta)
          usuarioPersistencia.id > 0 ? history.back() : limparCampos()
        }
      })
      .catch(e => {
        alert(e.response.data.resposta)
        return
      })
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
        <Popover open={abrirSetor} onOpenChange={setAbrirSetorDropdown}>
          <PopoverTrigger asChild>
            <Button id={constsComponents.dropdown}>
              {setoresDropdown.find(setor => setor.id === idSetorSelecionado)?.descricao
                ? setoresDropdown.find(setor => setor.id === idSetorSelecionado)?.descricao
                : "Selecione o setor"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent id={constsComponents.dropdownList}>
            <Command >
              {setoresDropdown.map((setor, i) =>
                <CommandItem
                  key={setor.id}
                  value={setor.descricao}
                  onSelect={handleSelectSetorDropdown}
                >
                  {setoresDropdown[i].descricao}
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
        <Popover open={abrirPermissao} onOpenChange={setAbrirPermissaoDropdown}>
          <PopoverTrigger asChild>
            <Button id={constsComponents.dropdown}>
              {permissoesDropdown.find(permissao => permissao.id === idPermissaoSelecionada)?.descricao
                ? permissoesDropdown.find(permissao => permissao.id === idPermissaoSelecionada)?.descricao
                : "Selecione a permissão"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent id={constsComponents.dropdownList}>
            <Command >
              {permissoesDropdown.map((permissao, i) =>
                <CommandItem
                  key={permissao.id}
                  value={permissao.descricao}
                  onSelect={handleSelectPermissaoDropdown}
                >
                  {permissoesDropdown[i].descricao}
                </CommandItem>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        <div className={styles.botoes}>
          <button
            id="button"
            type="submit"
            onClick={handleClick}>Salvar</button>
        </div>
      </form >

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
      session
    },
  }
}