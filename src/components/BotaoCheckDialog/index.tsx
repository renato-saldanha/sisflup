import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { HTMLAttributes, MouseEvent, ReactNode, RefAttributes, useContext } from "react"

import styles from './styles.module.css'
import { PERMISSAO_ADMIN } from "@/src/uteis/consts"
import { AlertDialogTriggerProps } from "@radix-ui/react-alert-dialog"
import { AtividadePesquisaProps } from "@/src/uteis/interfaces"
import { constsComponents } from "@/src/uteis/constIdComponents"

interface BotaoCheckDialogProps {
  titulo: string
  children: ReactNode
  handleEvendo: () => void
}

export default function BotaoCheckDialog({ titulo, children, handleEvendo }: BotaoCheckDialogProps) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    handleEvendo()
  }

  return (
    <AlertDialog >
      <AlertDialogTrigger asChild >
        <div className={styles.container}>
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className={styles.dialogContent}>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className={styles.dialogContentButtons}>
          <AlertDialogAction
            id={constsComponents.button}
            className={styles.dialogButton}
            onClick={handleClick}>Sim</AlertDialogAction>
          <AlertDialogCancel
            id={constsComponents.button}
            className={styles.dialogButton}
          >Não</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}