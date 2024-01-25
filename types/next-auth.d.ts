import { UsuarioProps } from "@/src/uteis/interfaces";

enum Usuario {
  id = "id",
  nome = "nome",
  senha = "senha",
  id_permissao = "id_permissao",
  id_setor = "id_setor",
}

declare module "next-auth" {
  interface Session {
    user: UsuarioProps;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UsuarioProps
  }
}