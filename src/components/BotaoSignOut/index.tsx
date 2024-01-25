import { signOut } from "next-auth/react"
import styles from "./styles.module.css"

export default function BotaoSignOut() {
  return (
    <div className={styles.container}>
      <button
        id="button"
        className={styles.botao}
        onClick={() => signOut()}>Sair</button>
    </div>
  )
}