import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import '../../../styles/globals.css'
import styles from './styles.module.css'

interface FormAtividadeProps {
  mostrarBtnConcluir?: boolean,
  mostrarBtnSalvar?: boolean,
}

export default function FormAtividade({ mostrarBtnConcluir = true, mostrarBtnSalvar = false }: FormAtividadeProps) {
  const [nomeCliente, setNomeCliente] = useState("")
  const [endereco, setEndereco] = useState("")
  const [vendas, setVendas] = useState("")
  const [medicao, setMedicao] = useState("")
  const [producaoSerra, setProducaoSerra] = useState("")
  const [producaoAcabamento, setProducaoAcabamento] = useState("")
  const [entrega, setEntrega] = useState("")
  const [instalacao, setInstalacao] = useState("")
  const [arquiteto, setArquiteto] = useState("")
  const [dataEntrega, setDataEntrega] = useState<Date>()
  const [observacoes, setObservacoes] = useState("")

  const history = useRouter();

  const atividade = {
    nomeCliente,
    endereco,
    vendas,
    medicao,
    producaoSerra,
    producaoAcabamento,
    entrega,
    instalacao,
    arquiteto,
    dataEntrega,
    observacoes
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
        {mostrarBtnConcluir && <button >Concluir Atividade</button>}
        {mostrarBtnSalvar && <button>Salvar</button>}
      </div>
    </form>
  )
}