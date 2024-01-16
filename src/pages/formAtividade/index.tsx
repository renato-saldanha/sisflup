import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import styles from './styles.module.css'
import { AtividadeProps } from '@/src/uteis/interfaces'

export default function FormAtividade() {
  const history = useRouter();

  const atividade: AtividadeProps = history.query.atividade ? JSON.parse(history.query.atividade.toString()) : {}
  const isCadastro = history.query.isCadastro? JSON.parse(history.query.isCadastro.toString()) : false

  const id = atividade ? atividade.id : -1
  const [nomeCliente, setNomeCliente] = useState(atividade ? atividade.nome_cliente : "")
  const [endereco, setEndereco] = useState(atividade ? atividade.endereco_cliente : "")
  const [vendas, setVendas] = useState(atividade ? atividade.responsavel_vendas : "")
  const [medicao, setMedicao] = useState(atividade ? atividade.responsavel_medicao : "")
  const [producaoSerra, setProducaoSerra] = useState(atividade ? atividade.responsavel_producao_serra : "")
  const [producaoAcabamento, setProducaoAcabamento] = useState(atividade ? atividade.responsavel_producao_acabamento : "")
  const [entrega, setEntrega] = useState(atividade ? atividade.responsavel_entrega : "")
  const [instalacao, setInstalacao] = useState(atividade ? atividade.responsavel_instalacao : "")
  const [arquiteto, setArquiteto] = useState(atividade ? atividade.nome_arquiteto : "")
  const [dataEntrega, setDataEntrega] = useState<Date | null>(atividade ? atividade.data_entrega : null)
  const [observacoes, setObservacoes] = useState(atividade ? atividade.observacao : "")

  const atividadePesistencia: AtividadeProps = {
    id,
    nome_cliente: nomeCliente,
    endereco_cliente: endereco,
    data_entrega: dataEntrega,
    nome_arquiteto: arquiteto,
    responsavel_vendas: vendas,
    responsavel_medicao: medicao,
    responsavel_producao_acabamento: producaoAcabamento,
    responsavel_producao_serra: producaoSerra,
    responsavel_entrega: entrega,
    responsavel_instalacao: instalacao,
    observacao: observacoes
  }


  function handleSubmit(e: FormEvent) {
    e.preventDefault()
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.campos}>
        <div className={styles.camposDividido}>
          <label>Cliente</label>
          <input
            autoFocus
            id='nomeCliente'
            name='nomeCliente'
            value={nomeCliente}
            type='text'
            onChange={e => setNomeCliente(e.target.value)} />
          <label>Enredeço</label>
          <input
            id='endereco'
            name='endereco'
            value={endereco}
            type='text'
            onChange={e => setEndereco(e.target.value)} />
        </div>

        <div className={styles.camposDividido}>
          <label>Arquiteto</label>
          <input
            id='arquiteto'
            name='arquiteto'
            value={arquiteto}
            type='text'
            onChange={e => setArquiteto(e.target.value)} />
          <label>Data de Entrega</label>
          <input
            id='dataEntrega'
            name='dataEntrega'
            value={dataEntrega?.toDateString()}
            type='date'
          />
        </div>

        <div className={styles.camposDividido}>
          <label>Vendas</label>
          <input
            id='vendas'
            name='vendas'
            value={vendas}
            type='text'
            onChange={e => setVendas(e.target.value)} />

          <label>Medição</label>
          <input
            id='medicao'
            name='medicao'
            value={medicao}
            type='text'
            onChange={e => setMedicao(e.target.value)} />
          <label>Prod. Serra</label>
          <input
            id='producaoSerra'
            name='producaoSerra'
            value={producaoSerra}
            type='text'
            onChange={e => setProducaoSerra(e.target.value)} />
        </div>

        <div className={styles.camposDividido}>
          <label>Prod. Acabamento</label>
          <input
            id='producaoAcabamento'
            name='producaoAcabamento'
            value={producaoAcabamento}
            type='text'
            onChange={e => setProducaoAcabamento(e.target.value)} />
          <label>Entrega</label>
          <input
            id='entrega'
            name='entrega'
            value={entrega}
            type='text'
            onChange={e => setEntrega(e.target.value)} />
          <label>Instalação</label>
          <input
            id='instalacao'
            name='instalacao'
            value={instalacao}
            type='text'
            onChange={e => setInstalacao(e.target.value)} />
        </div>

        <label>Observações</label>
        <textarea
          id='observacoes'
          name='observacoes'
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)} />
      </div>
      <div className={styles.botoes}>
        {!isCadastro && <button >Concluir Atividade</button>}
        {isCadastro && <button>Salvar</button>}
      </div>
    </form>
  )
}