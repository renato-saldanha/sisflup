import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import styles from './styles.module.css'
import { path } from "@/src/uteis/constPath"
import Link from "next/link"
import { AtividadePesquisaProps, AtividadeProps, ListaProps, UsuarioProps } from "@/src/uteis/interfaces"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { getDataLocal } from "@/src/uteis/funcs"
import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { PERMISSAO_ADMIN } from "@/src/uteis/consts"
import axios from "axios"
import { config } from "@/src/uteis/config"
import BotaoDeletarDialog from "../BotaoDeletarDialog"
import { constsComponents } from "@/src/uteis/constIdComponents"
import { getSession, useSession } from "next-auth/react"
import { GetServerSideProps } from "next"
import { Session } from "next-auth"


interface ListaAtividadesProps extends ListaProps<AtividadePesquisaProps> {
  session?: Session
}

export default function ListaAtividades({ session, lista, nomeTabela, setLista }: ListaAtividadesProps) {
  const usuarioLogado = session?.user

  function handleDeletarAtividade(id: number) {
    axios
      .delete(`${config.server}/atividade/deletarAtividade/${id}`)
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
          <TableHead className={styles.colunaCliente}>Cliente</TableHead>
          <TableHead className={styles.colunaEndereco}>Endereço</TableHead>
          <TableHead className={styles.colunaResponsavel}>Responsável</TableHead>
          <TableHead className={styles.colunaDataEntrega}>Data Entrega</TableHead>
          <TableHead className={styles.colunaBotoes}>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {lista?.map(item => (
          <TableRow
            key={item.id}
            className={styles.tableRow}>
            <TableCell className={styles.colunaId}>{item.id}</TableCell>
            <TableCell className={styles.colunaCliente}>{item.nome_cliente}</TableCell>
            <TableCell className={styles.colunaEndereco}>{item.endereco_cliente}</TableCell>
            <TableCell className={styles.colunaResponsavel}>{item.responsavel}</TableCell>
            <TableCell className={styles.colunaDataEntrega}>{getDataLocal(item.data_entrega)}</TableCell>
            {usuarioLogado?.id_permissao === PERMISSAO_ADMIN && (
              <TableCell className={styles.colunaBotoes}>
                <Link
                  href={{
                    pathname: path.cadastroAtividade,
                    query: { atividade: JSON.stringify(item), isCadastro: true }
                  }}
                  className={styles.botaoAlterar}>
                  <PencilIcon size={19} />
                </Link>

                <BotaoDeletarDialog
                  id={item.id}
                  children={<Trash2Icon id={constsComponents.botaoDeletar} size={19} />}
                  handleEvento={handleDeletarAtividade}
                  titulo="Deseja realmente deletar esse registro?" />
              </TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
