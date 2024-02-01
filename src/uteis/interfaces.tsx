export interface UsuarioProps {
  id: number
  nome: string
  senha: string
  id_permissao: number | null
  id_setor: number
}

export interface AtividadeProps {
  id: number
  nome_cliente: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  nome_bairro: string
  cidade: string
  uf: string
  nome_arquiteto: string
  data_entrega: string
  responsavel_vendas: string
  responsavel_medicao: string
  responsavel_producao_serra: string
  responsavel_producao_acabamento: string
  responsavel_entrega: string
  responsavel_instalacao: string
  observacoes: string
  id_setor?: number
  responsavel_atual?: string | undefined
}

export interface SetorProps {
  id: number
  nome: string
  descricao: string
}

export interface MenuSetorProps {
  id: number
  nome: string
  id_menu: string
}

export interface PermissaoProps {
  id: number
  nome: string
  descricao: string
}

export interface UsuarioPesquisaProps {
  id: number
  nome: string
  senha: string
  permissao: string | null
  setor: string | null
}

export interface AtividadePesquisaProps {
  id: number
  nome_cliente: string
  logradouro: string
  nome_bairro: string
  responsavel_atual: string
  data_entrega: string
  setor_atual: string
}

export interface ListaProps<T> {
  lista: T[]
  nomeTabela: string
  setLista: (lista: T[]) => void
}