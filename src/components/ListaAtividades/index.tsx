import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import styles from './styles.module.css'
import { path } from "@/src/uteis/constPath"
import Link from "next/link"
import { AtividadePesquisaProps } from "@/src/uteis/interfaces"
import { PencilIcon, Trash2Icon } from "lucide-react"

interface ListaAtividadesProps {
  lista: AtividadePesquisaProps[]
  nomeTabela: string
}

export default function ListaAtividades({ lista, nomeTabela }: ListaAtividadesProps) {
  function getDataLocal(data: Date) {
    const dataFormatada = new Date(data)
    return dataFormatada.toLocaleDateString('pt-BR')
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
            <TableCell className={styles.colunaCliente}>{item.cliente}</TableCell>
            <TableCell className={styles.colunaEndereco}>{item.endereco}</TableCell>
            <TableCell className={styles.colunaResponsavel}>{item.responsavel}</TableCell>
            <TableCell className={styles.colunaDataEntrega}>{getDataLocal(item.data_entrega)}</TableCell>
            <TableCell className={styles.colunaBotoes}>
              <Link
                href={{
                  pathname: path.cadastroAtividade,
                  query: { atividade: JSON.stringify(item) , isCadastro: true}
                }}
                className={styles.botaoAlterar}><PencilIcon size={19} /></Link>
              <button className={styles.botaoDeletar}><Trash2Icon size={19} /></button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}