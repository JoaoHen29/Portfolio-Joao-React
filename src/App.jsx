import { useEffect, useState } from 'react'

// ===== Dados do portfólio (antes ficavam no HomeController do Spring) =====
const perfil = {
  nome: 'João Henrique Alves de Souza',
  iniciais: 'JH',
  titulo: 'Estudante de Sistemas de Informação | Desenvolvedor Web',
  sobre:
    'Sou estudante de Sistemas de Informação na Universidade de Mogi das Cruzes (UMC) e trabalho ' +
    'em um escritório de Comércio Exterior. Durante o dia acompanho a rotina das equipes de ' +
    'operacional e financeiro, e à noite me dedico ao desenvolvimento web, praticando tanto o ' +
    'back-end quanto o front-end. Gosto de transformar o que aprendo em sala em projetos práticos.',
  curso: 'Bacharelado em Sistemas de Informação',
  universidade: 'Universidade de Mogi das Cruzes (UMC)',
  trabalho: 'Escritório de Comércio Exterior',
  email: 'jhalvesdesouza@gmail.com',
}

const habilidades = [
  { categoria: 'Back-end', itens: ['Java', 'Spring Boot', 'Python', 'Flask'] },
  { categoria: 'Front-end', itens: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vite', 'Thymeleaf', 'Bootstrap'] },
  { categoria: 'Banco de dados', itens: ['PostgreSQL', 'SQL', 'Flyway'] },
  { categoria: 'Ferramentas e Deploy', itens: ['Git', 'GitHub', 'Vercel', 'Postman', 'VS Code', 'IntelliJ IDEA'] },
]

const projetos = [
  {
    titulo: 'SafeClick',
    descricao:
      'Projeto Final de Curso: plataforma web de educação em segurança digital ("Aprenda antes de clicar"), ' +
      'com conteúdos educativos, quizzes e simulações de golpes.',
    categoria: 'Web',
    tecnologias: ['Python', 'Flask', 'PostgreSQL', 'Bootstrap'],
    link: 'https://github.com/EduMafra10/SafeClick',
  },
  {
    titulo: 'Portfólio com React',
    descricao: 'Este site: portfólio reescrito em React com Vite, publicado no GitHub e hospedado na Vercel.',
    categoria: 'Front-end',
    tecnologias: ['React', 'Vite', 'JavaScript', 'Vercel'],
    link: null,
  },
  {
    titulo: 'Portfólio com Spring Boot',
    descricao:
      'Versão anterior deste portfólio: aplicação Spring Boot com Thymeleaf, em que o Controller envia os dados para a página pelo Model.',
    categoria: 'Java',
    tecnologias: ['Java', 'Spring Boot', 'Thymeleaf'],
    link: 'https://github.com/JoaoHen29/Atividade-Web-Thymeleaf',
  },
  {
    titulo: 'API com Spring Boot',
    descricao:
      'Atividades da disciplina Java Spring Fundamentals: API com Spring Boot, banco PostgreSQL, migrações com Flyway e testes no Postman.',
    categoria: 'Java',
    tecnologias: ['Java', 'Spring Boot', 'PostgreSQL', 'Flyway'],
    link: null,
  },
  {
    titulo: 'Feriados Nacionais',
    descricao:
      'Página que consulta a BrasilAPI e mostra os feriados do ano em uma tabela, destacando os fins de semana e o próximo feriado.',
    categoria: 'Front-end',
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'API'],
    link: null,
  },
  {
    titulo: 'Inscrição em Evento',
    descricao: 'Formulário com estados e cidades carregados da API do IBGE, com requisições encadeadas e filtro de cidades.',
    categoria: 'Front-end',
    tecnologias: ['HTML', 'CSS', 'JavaScript', 'API'],
    link: null,
  },
]

const menu = [
  { id: 'inicio', texto: 'Início' },
  { id: 'sobre', texto: 'Sobre' },
  { id: 'habilidades', texto: 'Habilidades' },
  { id: 'projetos', texto: 'Projetos' },
  { id: 'contato', texto: 'Contato' },
]

const filtros = ['todos', 'Java', 'Web', 'Front-end']

function App() {
  // ===== Estados (substituem o script.js antigo) =====
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('tema') || 'claro'
    } catch {
      return 'claro'
    }
  })
  const [menuAberto, setMenuAberto] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [secaoAtiva, setSecaoAtiva] = useState('inicio')
  const [mostrarTopo, setMostrarTopo] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [sucesso, setSucesso] = useState('')

  const projetosFiltrados = projetos.filter((p) => filtro === 'todos' || p.categoria === filtro)

  // Tema claro / escuro (e lembra a escolha)
  useEffect(() => {
    document.body.classList.toggle('escuro', tema === 'escuro')
    try {
      localStorage.setItem('tema', tema)
    } catch {
      /* navegador sem localStorage */
    }
  }, [tema])

  // Link ativo no menu + botão "voltar ao topo" conforme a rolagem
  useEffect(() => {
    function aoRolar() {
      let atual = 'inicio'
      document.querySelectorAll('main section').forEach((secao) => {
        if (window.scrollY >= secao.offsetTop - 120) atual = secao.id
      })
      setSecaoAtiva(atual)
      setMostrarTopo(window.scrollY > 400)
    }
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Animação: elementos aparecem ao rolar a página
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel')
            observador.unobserve(entrada.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.revelar:not(.visivel)').forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [filtro])

  // Some com a mensagem de sucesso depois de 5 segundos
  useEffect(() => {
    if (!sucesso) return
    const timer = setTimeout(() => setSucesso(''), 5000)
    return () => clearTimeout(timer)
  }, [sucesso])

  function enviarFormulario(evento) {
    evento.preventDefault()
    const nome = evento.target.nome.value
    setSucesso(`Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`)
    evento.target.reset()
    setMensagem('')
  }

  return (
    <>
      {/* ===== Cabeçalho / Menu ===== */}
      <header className="cabecalho">
        <nav className="nav container">
          <a href="#inicio" className="logo">
            {perfil.iniciais}
            <span>.</span>
          </a>

          <ul className={`nav-links ${menuAberto ? 'aberto' : ''}`}>
            {menu.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={secaoAtiva === item.id ? 'ativo' : ''}
                  onClick={() => setMenuAberto(false)}
                >
                  {item.texto}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-acoes">
            <button
              className="btn-icone"
              title="Alternar tema claro/escuro"
              aria-label="Alternar tema"
              onClick={() => setTema(tema === 'escuro' ? 'claro' : 'escuro')}
            >
              {tema === 'escuro' ? '☀️' : '🌙'}
            </button>
            <button className="btn-icone menu-mobile" aria-label="Abrir menu" onClick={() => setMenuAberto(!menuAberto)}>
              ☰
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* ===== Início ===== */}
        <section id="inicio" className="hero">
          <div className="container hero-conteudo">
            <div className="hero-texto">
              <p className="saudacao">Olá, eu sou</p>
              <h1>{perfil.nome}</h1>
              <p className="subtitulo">{perfil.titulo}</p>

              <div className="hero-botoes">
                <a href="#projetos" className="btn btn-primario">Ver projetos</a>
                <a href="#contato" className="btn btn-secundario">Fale comigo</a>
              </div>

              <div className="hero-numeros">
                <div>
                  <strong>{projetos.length}</strong>
                  <span>Projetos</span>
                </div>
                <div>
                  <strong>{habilidades.length}</strong>
                  <span>Áreas de estudo</span>
                </div>
              </div>
            </div>

            <div className="hero-avatar" aria-hidden="true">
              <div className="avatar">{perfil.iniciais}</div>
            </div>
          </div>
        </section>

        {/* ===== Sobre ===== */}
        <section id="sobre" className="secao">
          <div className="container">
            <h2 className="titulo-secao">Sobre mim</h2>
            <div className="sobre-grid">
              <p className="sobre-texto">{perfil.sobre}</p>

              <div className="sobre-cards">
                <div className="card-info revelar">
                  <span className="card-icone">🎓</span>
                  <div>
                    <h3>Curso</h3>
                    <p>{perfil.curso}</p>
                  </div>
                </div>
                <div className="card-info revelar">
                  <span className="card-icone">🏫</span>
                  <div>
                    <h3>Universidade</h3>
                    <p>{perfil.universidade}</p>
                  </div>
                </div>
                <div className="card-info revelar">
                  <span className="card-icone">💼</span>
                  <div>
                    <h3>Atuação profissional</h3>
                    <p>{perfil.trabalho}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Habilidades ===== */}
        <section id="habilidades" className="secao secao-alternada">
          <div className="container">
            <h2 className="titulo-secao">Habilidades</h2>
            <div className="habilidades-grid">
              {habilidades.map((habilidade) => (
                <div className="card-habilidade revelar" key={habilidade.categoria}>
                  <h3>{habilidade.categoria}</h3>
                  <ul className="tags">
                    {habilidade.itens.map((item) => (
                      <li className="tag" key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Projetos ===== */}
        <section id="projetos" className="secao">
          <div className="container">
            <h2 className="titulo-secao">Projetos</h2>

            <div className="filtros">
              {filtros.map((f) => (
                <button key={f} className={`filtro ${filtro === f ? 'ativo' : ''}`} onClick={() => setFiltro(f)}>
                  {f === 'todos' ? 'Todos' : f}
                </button>
              ))}
            </div>

            <div className="projetos-grid">
              {projetosFiltrados.map((projeto) => (
                <article className="card-projeto revelar" key={projeto.titulo}>
                  <span className="categoria">{projeto.categoria}</span>
                  <h3>{projeto.titulo}</h3>
                  <p>{projeto.descricao}</p>

                  <ul className="tags">
                    {projeto.tecnologias.map((tec) => (
                      <li className="tag" key={tec}>{tec}</li>
                    ))}
                  </ul>

                  {projeto.link && (
                    <a href={projeto.link} className="link-projeto" target="_blank" rel="noopener noreferrer">
                      Ver no GitHub →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Contato ===== */}
        <section id="contato" className="secao secao-alternada">
          <div className="container contato-grid">
            <div>
              <h2 className="titulo-secao">Contato</h2>
              <p>Quer trocar uma ideia sobre algum projeto? Mande uma mensagem pelo formulário ou por e-mail.</p>
              <a className="email" href={`mailto:${perfil.email}`}>{perfil.email}</a>
            </div>

            <form className="form-contato revelar" onSubmit={enviarFormulario}>
              {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

              <label htmlFor="nome">Nome</label>
              <input type="text" id="nome" name="nome" placeholder="Seu nome" required />

              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" placeholder="seu@email.com" required />

              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows="4"
                maxLength="500"
                placeholder="Escreva sua mensagem..."
                required
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
              <small className="contador">{mensagem.length}/500 caracteres</small>

              <button type="submit" className="btn btn-primario">Enviar mensagem</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <p>
          &copy; {new Date().getFullYear()} {perfil.nome} · Feito com React + Vite · Hospedado na Vercel
        </p>
      </footer>

      <button
        className={`voltar-topo ${mostrarTopo ? 'visivel' : ''}`}
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  )
}

export default App