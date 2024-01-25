import Head from "next/head";

import styles from './styles.module.css'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import { path } from "@/src/uteis/constPath";
import { constsComponents } from "@/src/uteis/constIdComponents";
import BotaoSignOut from "../BotaoSignOut";
import { signOut } from "next-auth/react";

export default function Header() {
  const history = useRouter()
  const pathName = usePathname()

  return (
    <div className={styles.container}>
      <Head>
        <title>Sisflup - Sistema de fluxo de produção</title>
      </Head>
      <div className={styles.containerBotao}>
      {(pathName !== path.login) && <button
          id="button"
          className={styles.botaoSignOut}
          onClick={() => signOut()}>Sair</button>}
      </div>
      <h1 className={styles.titulo}>
        Sisflup - Sistema de fluxo de produção
      </h1>
      <div >
        {(pathName !== path.login && pathName !== path.atividadesGerais) && <Button id={constsComponents.button} onClick={() => history.back()}>Voltar</Button>}
      </div>
    </div >
  )
}