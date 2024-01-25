import { useRouter } from 'next/router'
import { ChangeEvent, DetailedHTMLProps, FormEvent, InputHTMLAttributes, MouseEventHandler, useContext, useEffect, useState } from 'react'
import styles from './styles.module.css'
import { AtividadeProps } from '@/src/uteis/interfaces'
import axios from 'axios';
import { config } from '@/src/uteis/config';
import { getDataUTC } from '@/src/uteis/funcs';
import moment from 'moment';
import { constsComponents } from '@/src/uteis/constIdComponents';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { path } from '@/src/uteis/constPath';
import { Session } from 'next-auth';


interface FormAtividadeProps {
  session?: Session
}

export default function FormAtividade({ session }: FormAtividadeProps) {
  const history = useRouter();
  const usuarioLogado = session?.user

  const atividadeParam: AtividadeProps = history.query.atividade ? JSON.parse(history.query.atividade.toString()) : {}
  const isNovoCadastro = history.query.isCadastro ? JSON.parse(history.query.isCadastro.toString()) : false

  const id = atividadeParam.id > 0 ? atividadeParam.id : -1
  const [nomeCliente, setNomeCliente] = useState(atividadeParam ? atividadeParam.nome_cliente : "")
  const [endereco, setEndereco] = useState(atividadeParam ? atividadeParam.endereco_cliente : "")
  const [vendas, setVendas] = useState(atividadeParam ? atividadeParam.responsavel_vendas : "")
  const [medicao, setMedicao] = useState(atividadeParam ? atividadeParam.responsavel_medicao : "")
  const [producaoSerra, setProducaoSerra] = useState(atividadeParam ? atividadeParam.responsavel_producao_serra : "")
  const [producaoAcabamento, setProducaoAcabamento] = useState(atividadeParam ? atividadeParam.responsavel_producao_acabamento : "")
  const [entrega, setEntrega] = useState(atividadeParam ? atividadeParam.responsavel_entrega : "")
  const [instalacao, setInstalacao] = useState(atividadeParam ? atividadeParam.responsavel_instalacao : "")
  const [arquiteto, setArquiteto] = useState(atividadeParam ? atividadeParam.nome_arquiteto : "")
  const [dataEntrega, setDataEntrega] = useState(atividadeParam ? getDataUTC(atividadeParam.data_entrega) : "")
  const [observacoes, setObservacoes] = useState(atividadeParam ? atividadeParam.observacoes : "")

  const NIVEL_PERMISSOES = {
    admin: 1,
    gestor: 2
  }

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
    observacoes: observacoes,
    id_setor: usuarioLogado ? usuarioLogado.id_setor + 1 : -1,
    responsavel_atual: usuarioLogado?.id_setor === 1 ? vendas
      : usuarioLogado?.id_setor === 2 ? medicao
        : usuarioLogado?.id_setor === 3 ? producaoAcabamento
          : usuarioLogado?.id_setor === 4 ? producaoSerra
            : usuarioLogado?.id_setor === 5 ? entrega
              : instalacao
  }

  function limparCampos() {
    setNomeCliente("")
    setEndereco("")
    setVendas("")
    setMedicao("")
    setProducaoSerra("")
    setProducaoAcabamento("")
    setEntrega("")
    setInstalacao("")
    setObservacoes("")
    setDataEntrega("")
    setArquiteto("")
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
  }

  function handleSalvar() {
    axios
      .post(`${config.server}/atividade/persistirAtividade`, atividadePesistencia)
      .then(r => {
        alert(r.request.response)
        atividadePesistencia.id < 0
          ? limparCampos()
          : history.back()
      })
      .catch(e => {
        alert(e.response.data.resposta)
        return
      })
  }

  function handleComplementar() {
    axios
      .put(`${config.server}/atividade/complementarAtividade`, atividadePesistencia)
      .then(r => {
        alert(r.request.response)
        atividadePesistencia.id < 0
          ? limparCampos()
          : history.back()
      })
      .catch(e => {
        alert(e.response.data.resposta)
        return
      })
  }

  function handleChangeDataEntrega(e: ChangeEvent<HTMLInputElement>) {
    setDataEntrega(e.target.value)
  }

  function permitirEditar(id_setor: number) {
    if (isNovoCadastro) return true
    switch (usuarioLogado?.id_permissao) {
      case NIVEL_PERMISSOES.admin:
        return false
      default:
        if (atividadeParam.id_setor === usuarioLogado?.id_setor) {
          if (usuarioLogado?.id_setor === id_setor) {
            return true
          } else {
            return false
          }
        }
    }
  }

  useEffect(() => {

  }, [])

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.campos}>
        <div className={styles.camposDividido}>
          <label>Cliente</label>
          <input
            autoFocus
            readOnly={!permitirEditar(0)}
            id='nomeCliente'
            name='nomeCliente'
            value={nomeCliente}
            type='text'
            onChange={e => setNomeCliente(e.target.value)} />
          <label>Enredeço</label>
          <input
            readOnly={!permitirEditar(0)}
            id='endereco'
            name='endereco'
            value={endereco}
            type='text'
            onChange={e => setEndereco(e.target.value)} />
        </div>

        <div className={styles.camposDividido}>
          <label>Arquiteto</label>
          <input
            readOnly={!permitirEditar(0)}
            id='arquiteto'
            name='arquiteto'
            value={arquiteto}
            type='text'
            onChange={e => setArquiteto(e.target.value)} />
          <label>Data de Entrega</label>
          <input
            readOnly={!permitirEditar(0)}
            id='dataEntrega'
            name='dataEntrega'
            value={dataEntrega}
            type='date'
            onChange={handleChangeDataEntrega}
          />
        </div>

        <div className={styles.camposDividido}>
          <label>Vendas</label>
          <input
            readOnly={!permitirEditar(1)}
            id='vendas'
            name='vendas'
            value={vendas}
            type='text'
            onChange={e => setVendas(e.target.value)} />

          <label>Medição</label>
          <input
            readOnly={!permitirEditar(2)}
            id='medicao'
            name='medicao'
            value={medicao}
            type='text'
            onChange={e => setMedicao(e.target.value)} />
          <label>Prod. Serra</label>
          <input
            readOnly={!permitirEditar(3)}
            id='producaoSerra'
            name='producaoSerra'
            value={producaoSerra}
            type='text'
            onChange={e => setProducaoSerra(e.target.value)} />
        </div>

        <div className={styles.camposDividido}>
          <label>Prod. Acabamento</label>
          <input
            readOnly={!permitirEditar(4)}
            id='producaoAcabamento'
            name='producaoAcabamento'
            value={producaoAcabamento}
            type='text'
            onChange={e => setProducaoAcabamento(e.target.value)} />
          <label>Entrega</label>
          <input
            readOnly={!permitirEditar(5)}
            id='entrega'
            name='entrega'
            value={entrega}
            type='text'
            onChange={e => setEntrega(e.target.value)} />
          <label>Instalação</label>
          <input
            readOnly={!permitirEditar(6)}
            id='instalacao'
            name='instalacao'
            value={instalacao}
            type='text'
            onChange={e => setInstalacao(e.target.value)} />
        </div>

        <label>Observações</label>
        <textarea
          readOnly={!permitirEditar(0)}
          id='observacoes'
          name='observacoes'
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)} />
      </div>
      <div className={styles.botoes}>
        {!isNovoCadastro && usuarioLogado?.id_setor === atividadeParam.id_setor && <button id={constsComponents.button} onClick={handleComplementar}>Complementar atividade</button>}
        {isNovoCadastro && <button id={constsComponents.button} onClick={handleSalvar}>Salvar</button>}
      </div>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session?.user) {
    return {
      redirect: {
        destination: path.login,
        permanent: false
      }
    }
  }

  return {
    props: {
      // session
    },
  }
}