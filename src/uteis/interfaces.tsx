export interface iUsuario {
  id: number,
  nome: string,
  senha: string,
  id_permissao: number | null,
  id_setor: number | null,
}

export interface SetorProps {
  id: number,
  nome: string,
  descricao: string,
}

export interface PermissaoProps {
  id: number,
  nome: string,
  descricao: string,
}