import { useRouter } from 'next/router'
import { ChangeEvent, DetailedHTMLProps, FormEvent, InputHTMLAttributes, KeyboardEvent, MouseEvent, createRef, useContext, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import { AtividadeProps } from '@/src/uteis/interfaces'
import axios from 'axios';
import { config } from '../../uteis/config';
import { getDataUTC } from '@/src/uteis/funcs';
import moment from 'moment';
import { constsComponents } from '@/src/uteis/constIdComponents';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { path } from '@/src/uteis/constPath';
import { Session } from 'next-auth';
import { PERMISSAO_ADMIN } from '@/src/uteis/consts';
import { Setores } from '@/src/uteis/enums';
import InputMask from 'react-input-mask';


interface FormAtividadeProps {
  session?: Session
}

export default function FormAtividade({ session }: FormAtividadeProps) {
  const history = useRouter();
  const usuarioLogado = session?.user

  const inputbotaoCEP = createRef<HTMLButtonElement>()
  const inputNumero = createRef<HTMLInputElement>()

  const atividadeParam: AtividadeProps = history.query.atividade ? JSON.parse(history.query.atividade.toString()) : {}
  const isNovoCadastro = history.query.isCadastro ? JSON.parse(history.query.isCadastro.toString()) : false

  const id = atividadeParam.id > 0 ? atividadeParam.id : -1
  const [nomeCliente, setNomeCliente] = useState(atividadeParam ? atividadeParam.nome_cliente : "")
  const [cep, setCEP] = useState(atividadeParam ? atividadeParam.cep : "")
  const [numero, setNumero] = useState(atividadeParam ? atividadeParam.numero : "")
  const [logradouro, setLogradouro] = useState(atividadeParam ? atividadeParam.logradouro : "")
  const [complemento, setComplemento] = useState(atividadeParam ? atividadeParam.complemento : "")
  const [nomeBairro, setNomeBairro] = useState(atividadeParam ? atividadeParam.nome_bairro : "")
  const [cidade, setCidade] = useState(atividadeParam ? atividadeParam.cidade : "")
  const [uf, setUF] = useState(atividadeParam ? atividadeParam.uf : "")
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
    cep: cep,
    numero: numero,
    logradouro: logradouro,
    complemento: complemento,
    nome_bairro: nomeBairro,
    cidade: cidade,
    uf: uf,
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
    setLogradouro("")
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


  function inputBotaoCEPClick() {
    inputbotaoCEP?.current?.click()
  }

  function inputNumeroFocus() {
    inputNumero?.current?.focus()
  }

  function handleSalvar() {
    axios
      .post(`${config.server}/atividade/persistirAtividade`, atividadePesistencia)
      .then(r => {
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

  async function handleBuscarCEP(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    await axios
      .get(`${config.server}/bairro/buscarCEP/${cep}`)
      .then(r => {
        if (r.status === 200) {
          setLogradouro(r.data.logradouro)
          setNomeBairro(r.data.nome_bairro)
          setCidade(r.data.cidade)
          setUF(r.data.uf)
        }
      })
      .catch(e => {
        alert(e.response.data.resposta)
        return
      })
  }

  function handleCEPKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      inputBotaoCEPClick()
      inputNumeroFocus()
    }
  }

  function liberarObservacaoVendedor(id_setor: number) {
    if (usuarioLogado?.id_setor == Setores.Vendas && (id_setor === -1) &&
      (atividadeParam.id_setor === Setores.Vendas || atividadeParam.id_setor === Setores.Medicao)) {
      return true
    }
    return false
  }

  function permitirEditar(id_setor: number) {
    if (isNovoCadastro)
      return true

    if (liberarObservacaoVendedor(id_setor)) return true

    switch (usuarioLogado?.id_permissao) {
      case NIVEL_PERMISSOES.admin:
        return false
      default:
        if (atividadeParam.id_setor === usuarioLogado?.id_setor) {
          if (usuarioLogado?.id_setor === id_setor)
            return true
          else
            return false
        } else if (id_setor === Setores.Medicao && usuarioLogado?.id_setor === Setores.Vendas)
          return true
    }
  }

  useEffect(() => {

  }, [])

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.camposDividido}>
        <div className={styles.campoCliente}>
          <label>Cliente</label>
          <input
            autoFocus
            readOnly={!permitirEditar(0)}
            id='nomeCliente'
            name='nomeCliente'
            value={nomeCliente}
            type='text'
            onChange={e => setNomeCliente(e.target.value)} />
        </div>
        <div className={styles.campoCEP}>
          <label>CEP</label>
          <InputMask
            mask="99999-999"
            value={cep}
            readOnly={!permitirEditar(0)}
            id='cep'
            name='cep'
            type='text'
            onKeyDown={handleCEPKeyDown}
            onChange={e => setCEP(e.target.value)} />
        </div>
        <div className={styles.campoBotaoCEP}>
          <button
            id={constsComponents.button}
            className={styles.botaoBuscaCEP}
            ref={inputbotaoCEP}
            onClick={handleBuscarCEP}>
            Buscar CEP
          </button>
        </div>
      </div>

      <div className={styles.camposDividido}>
        <div className={styles.campoLogradouro}>
          <label>Logradouro</label>
          <input
            readOnly={!permitirEditar(0)}
            id='logradouro'
            name='logradouro'
            value={logradouro}
            type='text'
            onChange={e => setLogradouro(e.target.value)} />
        </div>
        <div className={styles.campoNumero}>
          <label>Nº</label>
          <input
            readOnly={!permitirEditar(0)}
            id='numero'
            name='numero'
            value={numero}
            type='text'
            ref={inputNumero}
            onChange={e => setNumero(e.target.value)} />
        </div>
        <div className={styles.campoComplemento}>
          <label>Complemento</label>
          <input
            readOnly={!permitirEditar(0)}
            id='complemento'
            name='complemento'
            value={complemento}
            type='text'
            onChange={e => setComplemento(e.target.value)} />
        </div>
      </div>

      <div className={styles.camposDividido}>
        <div className={styles.campoBairro}>
          <label>Bairro</label>
          <input
            readOnly={!permitirEditar(0)}
            id='bairro'
            name='bairro'
            value={nomeBairro}
            type='text'
            onChange={e => setNomeBairro(e.target.value)} />
        </div>
        <div className={styles.campoCidade}>
          <label>Cidade</label>
          <input
            readOnly={!permitirEditar(0)}
            id='cidade'
            name='cidade'
            value={cidade}
            type='text'
            onChange={e => setCidade(e.target.value)} />
        </div>
        <div className={styles.campoUF}>
          <label>UF</label>
          <input
            readOnly={!permitirEditar(0)}
            id='uf'
            name='uf'
            value={uf}
            type='text'
            onChange={e => setUF(e.target.value)} />
        </div>
      </div>

      <div className={styles.camposDividido}>
        <div className={styles.campoArquiteto}>
          <label>Arquiteto</label>
          <input
            readOnly={!permitirEditar(0)}
            id='arquiteto'
            name='arquiteto'
            value={arquiteto}
            type='text'
            onChange={e => setArquiteto(e.target.value)} />
        </div>
        <div className={styles.campoDataEntrega}>
          <label>Data de Entrega</label>
          <input
            readOnly={!permitirEditar(0)}
            id='dataEntrega'
            name='dataEntrega'
            value={dataEntrega}
            type='date'
            onChange={handleChangeDataEntrega} />
        </div>
      </div>

      <div className={styles.camposDividido}>
        <div className={styles.campoVendas}>
          <label>Vendas</label>
          <input
            readOnly={!permitirEditar(Setores.Vendas)}
            id='vendas'
            name='vendas'
            value={vendas}
            type='text'
            onChange={e => setVendas(e.target.value)} />
        </div>
        <div className={styles.campoMedicao}>
          <label>Medição</label>
          <input
            readOnly={!permitirEditar(Setores.Medicao)}
            id='medicao'
            name='medicao'
            value={medicao}
            type='text'
            onChange={e => setMedicao(e.target.value)} />
        </div>
        <div className={styles.campoProducaoSerra}>
          <label>Prod. Serra</label>
          <input
            readOnly={!permitirEditar(Setores.ProducaoSerra)}
            id='producaoSerra'
            name='producaoSerra'
            value={producaoSerra}
            type='text'
            onChange={e => setProducaoSerra(e.target.value)} />
        </div>
      </div>

      <div className={styles.camposDividido}>
        <div className={styles.campoProducaoAcabamento}>
          <label>Prod. Acabamento</label>
          <input
            readOnly={!permitirEditar(Setores.ProducaoAcabamento)}
            id='producaoAcabamento'
            name='producaoAcabamento'
            value={producaoAcabamento}
            type='text'
            onChange={e => setProducaoAcabamento(e.target.value)} />
        </div>
        <div className={styles.campoEntrega}>
          <label>Entrega</label>
          <input
            readOnly={!permitirEditar(Setores.Entrega)}
            id='entrega'
            name='entrega'
            value={entrega}
            type='text'
            onChange={e => setEntrega(e.target.value)} />
        </div>
        <div className={styles.campoInstalacao}>
          <label>Instalação</label>
          <input
            readOnly={!permitirEditar(Setores.Instalacao)}
            id='instalacao'
            name='instalacao'
            value={instalacao}
            type='text'
            onChange={e => setInstalacao(e.target.value)} />
        </div>
      </div>

      <div className={styles.camposDividido}>
        <div className={styles.campoObservacao}>
          <label>Observações</label>
          <textarea
            readOnly={!permitirEditar(-1)}
            id='observacoes'
            name='observacoes'
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)} />
        </div>
      </div>

      <div className={styles.botoes}>
        {((!isNovoCadastro && usuarioLogado?.id_setor === atividadeParam.id_setor) ||
          (usuarioLogado?.id_setor === Setores.Vendas && atividadeParam.id_setor === Setores.Medicao))
          && <button id={constsComponents.button} onClick={handleComplementar}>Complementar atividade</button>}

        { }
        {isNovoCadastro && <button id={constsComponents.button} onClick={handleSalvar}>Salvar</button>}
      </div>
    </form >
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