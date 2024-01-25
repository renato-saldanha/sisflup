import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import styles from './styles.module.css'
import { path } from "@/src/uteis/constPath"
import Link from "next/link"
import { AtividadePesquisaProps, ListaProps, UsuarioPesquisaProps } from "@/src/uteis/interfaces"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import BotaoDeletarDialog from "../BotaoDeletarDialog"
import axios from "axios"
import { config } from "@/src/uteis/config"
import { constsComponents } from "@/src/uteis/constIdComponents"
import { Dispatch, SetStateAction } from "react"
import { Session } from "next-auth"
import { PERMISSAO_ADMIN } from "@/src/uteis/consts"

interface ListaUsuariosProps extends ListaProps<UsuarioPesquisaProps> {
  session?: Session
}

export default function ListaUsuarios({ session, lista, nomeTabela, setLista }: ListaUsuariosProps) {
  const usuarioLogado = session?.user

  function handleDeletarUsuario(id: number) {
    axios
      .delete(`${config.server}/usuario/deletarUsuario/${id}`)
      .then(r => {
        const listaAtualizada = lista.filter(i => i.id !== id)
        setLista(listaAtualizada)
        alert(r.request.response)
      })
      .catch(e => {
        alert(e.response.data.resposta)
      })
  }

  return (
    <Table className={styles.tabela}>
      <TableHeader >
        <TableRow className={styles.tableRow}>
          <TableHead className={styles.colunaId}>Id</TableHead>
          <TableHead className={styles.colunaNome}>Nome</TableHead>
          <TableHead className={styles.colunaSetor}>Setor</TableHead>
          <TableHead className={styles.colunaPermissao}>Permissão</TableHead>
          <TableHead className={styles.colunaBotoes}>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {lista?.map(item => (
          <TableRow
            key={item.id}
            className={styles.tableRow}>
            <TableCell className={styles.colunaId}>{item.id}</TableCell>
            <TableCell className={styles.colunaNome}>{item.nome}</TableCell>
            <TableCell className={styles.colunaSetor}>{item.setor}</TableCell>
            <TableCell className={styles.colunaPermissao}>{item.permissao}</TableCell>
            <TableCell className={styles.colunaBotoes} >
              {usuarioLogado?.id_permissao === PERMISSAO_ADMIN &&
                <Link
                  href={{
                    pathname: path.cadastroUsuario,
                    query: { usuario: JSON.stringify(item) }
                  }}
                  className={styles.botaoAlterar}>
                  <PencilIcon size={19} />
                </Link>
              }

              <BotaoDeletarDialog
                id={item.id}
                children={usuarioLogado?.id_permissao === PERMISSAO_ADMIN && <Trash2Icon id={constsComponents.botaoDeletar} size={19} />}
                handleEvento={handleDeletarUsuario}
                titulo="Deseja realmente deletar esse registro?" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}