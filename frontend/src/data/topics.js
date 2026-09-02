// próxima categoria entra aqui, seguindo o mesmo formato:
// { id: 'algum-id', label: 'Nome que aparece na tela', topics: [...] }
export const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Front-End',
    topics: [
      'Elementos semânticos do HTML5',
      'Flexbox e Grid Layout em CSS',
      'Responsividade e media queries',
      'React, Vue e Angular: principais diferenças',
      'Virtual DOM: como funciona',
      'Gerenciamento de estado (Context API, Redux, Pinia)',
      'Componentização e reutilização de UI',
      'Acessibilidade web (WCAG e ARIA)',
      'Performance de front-end: lazy loading e code splitting',
      'Fetch API e consumo de APIs REST',
      'LocalStorage, SessionStorage e Cookies',
      'Bundlers: Vite e Webpack, para que servem',
      'TypeScript no front-end',
      'Progressive Web Apps (PWA)',
      'Web Components'
    ]
  },
  {
    id: 'backend',
    label: 'Back-End',
    topics: [
      'Node.js e o event loop',
      'Frameworks: Express, Django, Ruby on Rails, Spring Boot',
      'APIs REST: verbos HTTP e status codes',
      'GraphQL vs REST',
      'Autenticação: JWT, OAuth2 e sessões',
      'Middleware: o que é e para que serve',
      'ORMs: Sequelize, Prisma e SQLAlchemy',
      'Arquitetura MVC',
      'Microsserviços vs monólito',
      'Filas de mensagens (RabbitMQ, Kafka)',
      'Cache no back-end com Redis',
      'Rate limiting e proteção de APIs',
      'WebSockets no servidor',
      'Testes automatizados no back-end',
      'Variáveis de ambiente e configuração segura'
    ]
  },
  {
    id: 'mobile',
    label: 'Mobile',
    topics: [
      'Desenvolvimento nativo vs cross-platform',
      'Swift e o ecossistema iOS',
      'Kotlin e o ecossistema Android',
      'React Native: como funciona a ponte nativa',
      'Flutter e a linguagem Dart',
      'Ciclo de vida de uma tela mobile',
      'Armazenamento local em apps mobile',
      'Notificações push',
      'Publicação nas lojas (App Store e Google Play)',
      'Performance e consumo de bateria',
      'Design responsivo para diferentes telas',
      'Permissões de dispositivo (câmera, localização)',
      'Testes em dispositivos reais vs emuladores',
      'Kotlin Multiplatform'
    ]
  },
  {
    id: 'jogos',
    label: 'Jogos',
    topics: [
      'Motores de jogo: Unity, Unreal Engine e Godot',
      'Game loop: o ciclo central de um jogo',
      'Física de jogos: colisões e gravidade',
      'Sistemas de partículas',
      'Inteligência artificial de NPCs',
      'Level design',
      'Otimização de performance em jogos',
      'Shaders e materiais',
      'Áudio em jogos: efeitos e trilha sonora',
      'Multiplayer e sincronização de rede',
      'C# no desenvolvimento com Unity',
      'Animação de personagens (rigging)',
      'Balanceamento de gameplay'
    ]
  },
  {
    id: 'ia-ml',
    label: 'IA & Machine Learning',
    topics: [
      'Aprendizado supervisionado vs não supervisionado',
      'Redes neurais: o neurônio artificial',
      'Overfitting e underfitting',
      'LLMs: o que é um token',
      'Embeddings vetoriais',
      'Prompt engineering',
      'RAG: retrieval-augmented generation',
      'Fine-tuning vs prompt engineering',
      'Bibliotecas: TensorFlow, PyTorch e Scikit-learn',
      'Processamento de linguagem natural (NLP)',
      'Visão computacional',
      'Viés em modelos de IA',
      'Aprendizado por reforço',
      'Pipelines de dados para machine learning'
    ]
  },
  {
    id: 'engenharia-software',
    label: 'Engenharia de Software',
    topics: [
      'Padrões de projeto: Singleton, Factory, Observer',
      'Princípios SOLID',
      'Clean Code: o que torna um código legível',
      'Testes unitários, de integração e end-to-end',
      'Controle de versão com Git',
      'Refatoração de código',
      'Complexidade de algoritmos (Big O)',
      'Estruturas de dados: pilhas, filas e árvores',
      'Programação orientada a objetos',
      'Programação funcional',
      'Metodologias ágeis: Scrum e Kanban',
      'Revisão de código (code review)',
      'Documentação técnica'
    ]
  },
  {
    id: 'banco-dados',
    label: 'Banco de Dados',
    topics: [
      'SQL: joins e subqueries',
      'Bancos relacionais vs NoSQL',
      'Normalização de dados',
      'Índices e otimização de consultas',
      'Transações e propriedades ACID',
      'MongoDB e bancos orientados a documentos',
      'Modelagem de dados (diagramas ER)',
      'Réplicas e sharding',
      'Backup e recuperação de dados',
      'Cassandra e bancos distribuídos',
      'Cache de consultas com Redis'
    ]
  },
  {
    id: 'devops',
    label: 'DevOps',
    topics: [
      'Docker: containers e imagens',
      'Kubernetes: orquestração de containers',
      'CI/CD: integração e entrega contínua',
      'Infraestrutura como código (Terraform)',
      'Observabilidade: métricas, logs e traces',
      'Cloud computing: AWS, Azure e GCP',
      'Linux: administração básica de sistemas',
      'Automação com scripts (Bash, Python)',
      'Monitoramento com Prometheus e Grafana',
      'GitOps e Argo CD',
      'Ambientes de desenvolvimento, staging e produção'
    ]
  },
  {
    id: 'ciberseguranca',
    label: 'Cibersegurança',
    topics: [
      'Criptografia simétrica vs assimétrica',
      'Autenticação de dois fatores (2FA)',
      'OWASP Top 10: principais vulnerabilidades web',
      'SQL Injection e como preveni-lo',
      'Cross-Site Scripting (XSS)',
      'Firewalls e sistemas de detecção de intrusão',
      'Engenharia social e phishing',
      'Testes de penetração (pentest)',
      'Princípio do menor privilégio',
      'Segurança em APIs',
      'Gestão de vulnerabilidades',
      'Zero Trust: o modelo de segurança'
    ]
  }
];