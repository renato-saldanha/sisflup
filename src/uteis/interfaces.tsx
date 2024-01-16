export interface UsuarioProps {
  id: number
  nome: string
  senha: string
  id_permissao: number | null
  id_setor: number | null
}

export interface AtividadeProps {
  id: number
  nome_cliente: string
  endereco_cliente: string
  nome_arquiteto: string
  data_entrega: Date | null
  responsavel_vendas: string
  responsavel_medicao: string
  responsavel_producao_serra: string
  responsavel_producao_acabamento: string
  responsavel_entrega: string
  responsavel_instalacao: string
  observacao: string
}

export interface SetorProps {
  id: number
  nome: string
  descricao: string
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
  cliente: string
  endereco: string
  responsavel: string
  data_entrega: Date
  setor_atual: string
}
