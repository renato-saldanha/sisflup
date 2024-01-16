import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import styles from './styles.module.css'
import { path } from "@/src/uteis/constPath"
import Link from "next/link"
import { UsuarioPesquisaProps } from "@/src/uteis/interfaces"
import { PencilIcon, Trash2Icon } from "lucide-react"

interface ListaUsuariosProps {
  lista: UsuarioPesquisaProps[]
  nomeTabela: string
}

export default function ListaUsuarios({ lista, nomeTabela }: ListaUsuariosProps) {
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
              <Link
                href={{
                  pathname: path.cadastroUsuario,
                  query: { usuario: JSON.stringify(item) }
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