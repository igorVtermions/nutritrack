# NutriTrack — contrato de engenharia mobile

Versão: 1.1 · Data: 2026-09-22 · Status: MVP frontend local, conforme decisão do usuário.

## 1. Objetivo e escopo

Construir um aplicativo nativo de acompanhamento alimentar com React Native e Expo, usando Development Build com Dev Client, fiel ao design NutriTrack. Entregar código compreensível, componentes reutilizáveis e fluxos demonstráveis em Android e iOS.

Este documento define decisões de projeto; não significa que dependências, testes, CI ou funcionalidades já foram implementados. O repositório contém inicialmente os artefatos de design. Não gerar o aplicativo inteiro quando o pedido for apenas documentação ou uma alteração isolada.

Termos normativos:

- **DEVE**: requisito para a entrega correspondente.
- **PREFERIR**: padrão que pode ter exceção justificada.
- **CONDICIONAL**: aplicar somente quando a funcionalidade exigir.

A interface inicial é em inglês. Nomes de código, rotas, componentes e testes também são em inglês. Documentação de engenharia pode ser em português. Não inventar autenticação, assinatura, sincronização, scanner ou recomendações nutricionais como requisitos já aprovados.

## 2. Fonte de verdade visual

Figma: https://www.figma.com/design/ypPFuD7Ldwf1VYIZo0DuED

Prancha: `2:11`. Página: `0:1`. Contexto de entrega: `design/FIGMA-STATUS.md`.

| Tela | Nó do Figma | Referência local |
| --- | --- | --- |
| Welcome | `5:3` | `design/screens/01-welcome.svg` |
| Today | `3:2` | `design/screens/02-today.svg` |
| Log food | `5:40` | `design/screens/03-search.svg` |
| Food details | `5:105` | `design/screens/04-food-detail.svg` |
| Meal details | `5:152` | `design/screens/05-meal-detail.svg` |
| History | `5:192` | `design/screens/06-history.svg` |
| Foods | `5:254` | `design/screens/07-foods.svg` |
| Settings | `5:320` | `design/screens/08-settings.svg` |
| Daily targets | `5:386` | `design/screens/09-targets.svg` |
| Loading | `5:426` | `design/screens/10-loading.svg` |
| Empty day | `5:469` | `design/screens/11-empty.svg` |
| Connection error | `5:514` | `design/screens/12-error.svg` |
| Meal added | `5:540` | `design/screens/13-success.svg` |

Ordem de precedência: instrução explícita atual do usuário → design aprovado mais recente → referências locais versionadas → padrões deste guia. Documentar divergências antes de alterar a identidade visual. Resolver detalhes técnicos rotineiros sem pedir aprovação repetitiva.

Limitações conhecidas da primeira versão:

- Existem 13 frames com textos editáveis e vetores; ainda não existe biblioteca completa de componentes ou protótipo conectado.
- A revisão visual completa está pendente. A tela Today foi inspecionada; o arco de progresso foi corrigido no Figma, mas falta conferir a captura após a correção.
- As ilustrações atuais são vetores simplificados. Não afirmar que reproduzem exatamente as ilustrações da imagem original.
- Metas e valores nutricionais são demonstrativos. Não assumir coerência entre calorias e a soma energética dos macros nas amostras.
- Os SVGs podem divergir do Figma após correções. Nunca sobrescrever uma correção recente com um export antigo.

Fidelidade significa conferir composição, cores, tipografia, proporções, espaçamento, raios, traços dos ícones e estados. Não significa renderizar a tela inteira como imagem ou reproduzir barras de sistema falsas.

## 3. Stack e política de dependências

| Área | Decisão |
| --- | --- |
| Plataforma | Expo em versão estável compatível com o React Native fornecido pelo SDK |
| Linguagem | TypeScript com `strict: true` |
| Navegação | Expo Router, com rotas tipadas quando suportadas pela versão escolhida |
| Desenvolvimento | `expo-dev-client`; Expo Go não é o alvo de validação |
| Estilos | `StyleSheet.create` + tokens tipados; sem Tailwind/NativeWind ou UI kit por padrão |
| Fonte | Inter, arquivos reais para os pesos usados, carregados com `expo-font` |
| Vetores e gráficos simples | `react-native-svg`, incluindo arco de progresso e barras de histórico |
| Safe area | `react-native-safe-area-context` |
| Persistência inicial | AsyncStorage atrás de repositórios, para registros e preferências locais; sem backend, Supabase ou login |
| Estado da UI | Hooks React; contexto pequeno apenas para dependências/configuração compartilhadas |
| Testes | `jest-expo` e React Native Testing Library, conforme compatibilidade do SDK |
| Qualidade | ESLint, regras de hooks, TypeScript e Prettier |

Não fixar neste documento números de versão que não foram testados. Na criação, verificar versões oficiais, instalar pacotes Expo/nativos com `npx expo install`, registrar versões no manifesto e manter um único lockfile. Usar npm por padrão se o projeto estiver vazio; respeitar o gerenciador existente.

Dependências condicionais:

- React Hook Form e Zod: quando formulários e validação de fronteiras justificarem a adoção; não instalar para uma tela estática.
- TanStack Query: quando houver API remota. Não duplicar seu cache em outro estado global.
- Zustand: somente se surgir estado global de cliente que não caiba bem em contexto pequeno; não instalar preventivamente.
- Reanimated: somente para animações/interações que exijam; verificar compatibilidade com Expo e arquitetura nativa.
- Lucide React Native: opção para ícones novos ou substituição explicitamente aprovada. Os ícones existentes devem corresponder aos vetores do design, sem misturar famílias arbitrariamente.
- SecureStore: credenciais e tokens caso autenticação seja adicionada; nunca armazenar segredos no código.
- Maestro: teste ponta a ponta do fluxo principal quando houver build executável e ambiente disponível.

Cada dependência nova precisa de propósito, verificação de manutenção/licença, compatibilidade com SDK e impacto nativo. Não atualizar Expo, React ou React Native isoladamente para resolver um problema localizado.

## 4. Estrutura do projeto

Criar pastas quando houver conteúdo real. A árvore é o destino arquitetural, não uma ordem para gerar dezenas de arquivos vazios.

```text
AGENTS.md
app.config.ts
eas.json
assets/
  fonts/
  images/
  icons/
design/                         # referências e rastreabilidade visual
docs/
  MOBILE_ENGINEERING.md
  decisions/                    # decisões relevantes, curtas
src/
  app/                          # apenas rotas e layouts do Expo Router
    _layout.tsx
    index.tsx                   # welcome ou redirecionamento após hidratação
    (tabs)/
      _layout.tsx
      today.tsx
      history.tsx
      foods.tsx
      settings.tsx
    food/
      search.tsx
      [foodId].tsx
    meal/
      [entryId].tsx
    targets.tsx
  bootstrap/                    # providers, hidratação, dependências e migrações
  design-system/
    tokens/
    theme/
    components/
    icons/
  domain/
    nutrition/                  # tipos e cálculos puros compartilhados
  features/
    onboarding/
    diary/
    food-catalog/
    history/
    settings/
  data/
    storage/                    # armazenamento local versionado e validação
    repositories/               # implementações concretas dos contratos
    fixtures/                   # dados exclusivos de demonstração/testes
  shared/
    date/
    errors/
    formatting/
    config/
tests/
  integration/
  e2e/
```

Uma funcionalidade pode conter `screens/`, `components/`, `hooks/`, `model/` e `index.ts`, apenas quando necessário. Testes unitários ficam próximos do código testado. Contratos de acesso a dados ficam junto ao modelo que os consome; implementações ficam em `data/repositories`.

Direção de dependências:

```text
app → screens/features → hooks/casos de uso → contratos de repositório
                        ↓
                 domínio puro
bootstrap → implementações de data → banco/API
features → design-system → tokens/React Native
```

- Rotas apenas extraem/validam parâmetros, compõem a tela e conectam navegação.
- Telas coordenam apresentação e estado; não executam SQL nem chamam HTTP diretamente.
- Design system não importa funcionalidades, navegação, repositórios ou dados de usuário.
- Domínio não importa React, Expo, componentes ou banco.
- Uma funcionalidade não acessa arquivos internos de outra. Compartilhar um contrato público específico ou mover uma regra realmente comum para domínio.
- `bootstrap` escolhe o repositório real ou demonstrativo. Evitar service locator e singleton global mutável.
- Evitar ciclos e arquivos `utils.ts`, `helpers.ts` ou `common.ts` que viram depósitos sem responsabilidade clara.

## 5. Componentização

Extrair componentes por responsabilidade, repetição e comportamento independente. Não transformar cada `View` em um componente nem criar um componente universal cheio de flags.

Primitivos compartilhados propostos:

- `AppText`: variantes tipográficas, cor semântica e suporte a escala de fonte.
- `Button`: variantes primary/secondary/destructive, loading e disabled.
- `IconButton`: área de toque acessível e label obrigatório.
- `Surface`: superfícies e raios padronizados, sem lógica de negócio.
- `TextField`: label, valor, erro, ajuda e estado de foco.
- `Screen`: safe area e composição da área de conteúdo; rolagem explícita por tela.
- `AppIcon`: mapeamento fechado dos ícones aprovados.
- `Skeleton`, `EmptyState`, `ErrorState`: apresentação reutilizável, mensagens e ações por props.

Componentes de domínio permanecem na funcionalidade: `DailyIntakeCard`, `MacroProgress`, `MealCard`, `FoodListItem`, `WeekIntakeChart`, `ServingSelector`, `TargetField`.

Regras de API:

- Props mínimas e semânticas; dados entram por props, ações saem por callbacks.
- Usar união discriminada quando estados são mutuamente exclusivos. Evitar `isLoading`, `hasError` e `isEmpty` contraditórios.
- Não acoplar `MealCard` a uma rota específica; receber `onPress`.
- Um componente compartilhado deve resolver uso real ou comportamento transversal verificável.
- Permitir composição e slots controlados; não expor todos os estilos internos como dezenas de props.
- Usar exports nomeados; exports default ficam nos arquivos onde o Expo Router os exige.
- Sem limites artificiais de linhas. Dividir quando leitura, responsabilidade ou testes pedirem.
- `memo`, `useMemo` e `useCallback` exigem razão de estabilidade ou medição; não aplicar em massa.

## 6. Design system

Fonte inicial: `design/tokens.json`. Ao criar tokens de runtime, registrar o mapeamento e manter as duas representações coerentes. Não manter cores duplicadas manualmente em cada funcionalidade.

| Token visual atual | Valor | Token semântico proposto |
| --- | --- | --- |
| bg | `#F7F8F3` | `color.background.canvas` |
| ink | `#20292D` | `color.text.primary`, `color.surface.inverse` |
| muted | `#667078` | `color.text.secondary` |
| lime | `#DEFA64` | `color.action.primary`, `color.progress.active` |
| soft | `#EEF5D8` | `color.surface.accentSubtle` |
| line | `#E3E7DF` | `color.border.default` |
| white | `#FFFFFF` | `color.surface.default`, `color.text.inverse` |

Valores encontrados nas telas mas ainda não consolidados nos tokens base: `#BCC5CB` para texto secundário inverso e `#455054` para trilhos/divisórias inversas. Conferir no Figma antes de consolidar. Cores de erro e estados adicionais também precisam ser documentadas; não inventar uso semântico global a partir de um único elemento.

Escala de espaçamento: `4, 8, 12, 16, 20, 24, 32`. Padding horizontal base de tela: 20. Raios iniciais: control 12, card 20, hero 24. A ação principal desenhada usa altura 54 e raio 17: registrar esses valores como tokens próprios de botão, sem arredondar para 12 por conveniência.

Tipografia:

- Família Inter. Mapear explicitamente arquivos/pesos regular, medium, semibold e bold efetivamente utilizados.
- Criar estilos semânticos `display`, `screenTitle`, `sectionTitle`, `body`, `label`, `caption` e `metric` a partir das medidas da tela correspondente.
- Referências presentes: display 42, título de tela 34, seção 24–25, corpo 16–18, label 14, caption 12 e métrica principal 52. São pontos de partida do desenho, não permissão para uniformizar diferenças intencionais sem conferir.
- Centralizar line height e letter spacing. Não usar peso sintético quando existe arquivo da fonte.
- Preservar escala de fonte do sistema; adaptar layout em vez de desativar `allowFontScaling` globalmente.

Ícones e ilustrações:

- Assets iniciais em `design/icons/`. Importar como vetores tipados por um wrapper e verificar a configuração de SVG escolhida.
- Tamanho visual típico 20–24; área de toque mínima 44, preferindo 48 em Android. Um ícone de 24 não é um alvo de toque de 24.
- Não usar emojis, caracteres Unicode improvisados ou misturar desenhos de famílias diferentes.
- Exportar ilustrações de refeições como assets independentes, com proporção e qualidade corretas. Nunca usar a tela inteira como asset.
- Splash nativo é diferente de skeleton de dados. Configurar splash com marca e fundo aprovados; liberar após fontes e preparação essenciais, sem atraso artificial.

## 7. Layout e fidelidade em dispositivos

O frame 390 × 844 é referência de comparação, não tamanho fixo do app. Valores de layout React Native são unidades lógicas.

- Usar Flexbox e dimensionamento pelo conteúdo. Não escalar a tela inteira proporcionalmente com `width / 390`.
- Posição absoluta somente para sobreposições justificadas, nunca para montar listas e formulários inteiros.
- Não desenhar relógio, bateria, sinal ou home indicator. Usar barras nativas e insets reais.
- Evitar aplicar safe area duas vezes quando o navegador já a gerencia.
- Posicionar CTA e tab bar sem sobrepor conteúdo, teclado ou indicador inferior. Incluir padding inferior apropriado no conteúdo rolável.
- Usar `FlatList` para listas extensas; `ScrollView` para conteúdo curto. Evitar listas virtualizadas dentro de rolagem equivalente.
- Testar largura compacta, frame base e aparelho maior. Suportar nomes longos e texto ampliado sem esconder valores ou ações.
- Ajustes necessários de acessibilidade/plataforma devem preservar hierarquia e ser documentados; não copiar problemas da referência cegamente.
- Modo claro é o escopo inicial. Não gerar dark mode incompleto nem permitir cores automáticas incompatíveis com o design.

## 8. Navegação e estados

As abas principais são Today, History, Foods e Settings. Busca e detalhes abrem no stack apropriado, preservando retorno e seleção de data/refeição. Passar IDs e parâmetros pequenos/serializáveis; buscar entidades no repositório. Nunca passar objetos completos ou callbacks em parâmetros de rota.

Loading, empty e error normalmente são estados da tela, não rotas públicas separadas. Meal added pode ser confirmação em tela ou feedback contextual conforme design validado; não substituir por toast arbitrariamente.

Cada fluxo assíncrono deve definir:

1. Estado inicial/carregamento sem flash enganoso de vazio.
2. Sucesso com dados.
3. Vazio real, com explicação e ação útil.
4. Erro recuperável, preservando a entrada e permitindo nova tentativa.
5. Envio em andamento que impede duplicação.

Não deixar botões silenciosamente sem ação. Para algo fora do escopo, identificar a indisponibilidade na demonstração ou acordar a omissão. Scanner e Recipes do desenho não implicam que já existe backend ou implementação.

## 9. Domínio nutricional e consistência

Modelos centrais: `Food`, `Serving`, `MealEntry`, `NutritionTotals`, `DailyTargets`, `LocalDate`. Usar IDs estáveis. Distinguir alimento de catálogo de registro consumido.

Um `MealEntry` guarda alimento/descrição, porção, quantidade, tipo de refeição, data local do diário, instante de criação e snapshot nutricional consumido. Alterações futuras no catálogo não devem reescrever silenciosamente o histórico.

Regras obrigatórias:

- Definir base nutricional explícita: por 100 g ou por porção conhecida. Conversões exigem fator válido.
- Não converter ml para g sem densidade conhecida; não somar unidades incompatíveis.
- Multiplicar nutrientes pelo fator da quantidade com uma única função de domínio, testada.
- Somar valores sem arredondamento intermediário; arredondar somente na apresentação.
- `remaining = target - consumed`; se negativo, mostrar excesso em linguagem neutra. Não esconder o valor negativo com clamp sem mudar a mensagem.
- O progresso visual do arco pode ser limitado a 0–100%; o valor textual deve informar consumo acima da meta.
- Meta zero/ausente não produz divisão por zero. Entrada inválida deve ser recusada com erro compreensível.
- Valores devem ser finitos, não negativos; quantidade consumida deve ser positiva. Definir limites de sanidade conforme o campo, sem inventar recomendações clínicas.
- A energia declarada pelo alimento pode divergir do cálculo 4/4/9 dos macros. Não corrigir silenciosamente dados da fonte.
- Data do diário é data local explícita, por exemplo `YYYY-MM-DD`. Não usar `toISOString().slice(0, 10)` para inferir o dia local.
- Definir política de fuso: manter o dia do registro escolhido pelo usuário; guardar instante separadamente. Testar virada de dia.
- Histórico informa quais dias entram na média. Para a amostra, hoje parcial fica excluído da média dos dias completos; zero registrado e dia sem dados são estados diferentes.

Fixtures de demonstração devem reproduzir a apresentação: 380 + 450 = 830 kcal; 2.000 − 830 = 1.170; 830 / 2.000 ≈ 42%. Adicionar 380 resulta em 1.210 consumidos e 790 restantes. As fixtures não são base nutricional validada.

## 10. Dados e persistência

Primeira versão: MVP apenas frontend, sem login, Supabase ou backend. Usar AsyncStorage como equivalente nativo ao localStorage para registros, alimentos próprios e preferências. Armazenamento administrado pelo bootstrap e encapsulado nos repositórios. Ver `docs/decisions/001-local-mvp.md`.

- Repositórios expõem operações do domínio, não tabelas ou SQL para a interface.
- Incluir versão de esquema e migrações incrementais. Nunca apagar dados para contornar uma migração.
- Serializar mutações relacionadas e persistir o documento versionado completo antes de atualizar a interface. Uma falha não deve alterar o estado confirmado. Consultas SQL e transações de banco não fazem parte deste MVP.
- Hidratar preferências antes de decidir onboarding e data inicial. Renderizar estado adequado enquanto isso ocorre.
- Atualizar Today, History e detalhes após adicionar, editar ou excluir; não manter totais independentes que divergem.
- Exclusão exige confirmação ou desfazer conforme fluxo. Desfazer restaura registro e agregados consistentemente.
- Tratar erro de escrita como erro real; não mostrar sucesso antes da confirmação de persistência sem mecanismo de rollback.
- Não misturar fixture com dados reais sem modo demo explícito. Demo deve ser determinística e reiniciável, sem destruir dados do usuário.
- Se API for introduzida, definir autenticação, timeouts, cancelamento, conflitos e política offline antes de prometer sincronização.

## 11. Clean code e segurança

- Tipos explícitos nas fronteiras públicas e inferência local quando clara.
- Dados externos começam como `unknown` e são validados; não usar cast para fingir validação.
- Funções e nomes devem expressar intenção. Evitar booleanos opacos, duplicação de fórmulas e números mágicos de negócio.
- Preferir funções puras para cálculos e composição para UI. Não criar classes e camadas por aplicação mecânica de SOLID.
- `useEffect` sincroniza com sistemas externos; não usar efeito para calcular valores derivados de props/estado.
- Não mutar props ou estado. Usar IDs como chaves, não índices de listas editáveis.
- Tratar erros esperados com tipos/contratos claros e mapear para mensagens úteis. Proibido `catch {}` silencioso ou dados fictícios como fallback de falha real.
- Limpar listeners, timers e subscriptions; cancelar ou ignorar resultados obsoletos de buscas concorrentes.
- Não guardar segredos em `EXPO_PUBLIC_*`, bundle, Git ou logs. Variáveis públicas são públicas.
- Não registrar alimentos, peso, metas, tokens ou identificadores pessoais em logs de produção.
- Pedir permissões de câmera/notificações somente quando o usuário usar o recurso correspondente; tratar recusa e indisponibilidade.
- Não introduzir analytics, serviços pagos, notificações remotas ou upload de dados sem escopo explícito.
- Comentários explicam decisões e limitações; não repetem o que o código já diz.

## 12. Acessibilidade e desempenho

- Botões/ícones interativos possuem role, label e estado acessíveis. Ícones decorativos não poluem leitura.
- Erro de campo é associado ao campo e não depende apenas de cor. Foco e retorno de navegação são previsíveis.
- Anunciar resultados importantes sem notificações repetitivas. Loading não bloqueia o leitor de tela indefinidamente.
- Conferir contraste dos pares efetivamente usados; verde-lima como fundo usa texto escuro.
- Não agrupar todos os controles da tela em um único elemento acessível.
- Respeitar reduzir movimento. Animações não podem ser necessárias para entender a informação.
- Evitar imagens enormes, cálculos pesados no render e listas sem virtualização quando crescem.
- Medir problemas de desempenho em build adequado; não tirar conclusões apenas pelo modo de desenvolvimento.

## 13. Expo Dev Client e builds

Fluxo obrigatório de desenvolvimento:

1. Inspecionar o repositório e escolher SDK estável compatível. Não rodar scaffold sobre arquivos existentes sem preservar o conteúdo.
2. Configurar TypeScript, alias `@/`, Expo Router, fonte e providers essenciais.
3. Instalar `expo-dev-client` e dependências compatíveis com o SDK.
4. Configurar identificadores Android/iOS e scheme explícitos; não inventar identificadores de publicação definitivos do cliente.
5. Criar perfis EAS `development`, `preview` e `production` com propósitos distintos. Development usa `developmentClient: true` e distribuição interna.
6. Gerar e instalar Development Build. Iniciar Metro com `npx expo start --dev-client`.
7. Ao mudar dependência nativa, config plugin ou configuração nativa relevante, reconstruir o cliente. Hot reload não incorpora código nativo novo.

Adotar Expo Continuous Native Generation quando compatível: preferir `app.config.ts` e config plugins às edições manuais de diretórios gerados. Se surgir necessidade real de manter projetos nativos manualmente, registrar a mudança de estratégia. Não executar `prebuild --clean` como solução automática.

Em Windows, build local de iOS exige macOS; usar EAS para compilação iOS ou máquina Mac disponível. Só afirmar teste iOS após executar em simulador/dispositivo compatível. Não publicar nas lojas nem disparar distribuição externa como parte implícita de um ajuste visual.

OTA, se adotado, precisa de runtime compatível e política de canais; mudança nativa exige novo binário. Dev Client não é o build final de entrega ao usuário.

## 14. Testes e verificação visual

Testar comportamento e risco, não estrutura interna ou getters triviais. Sem meta arbitrária de cobertura para substituir julgamento.

Obrigatórios conforme o código introduzido:

- Domínio: escala por porção, soma, arredondamento, meta zero, excesso, média e datas locais.
- Repositório: persistência após reabrir, validação de versão, edição, exclusão, escritas concorrentes e desfazer.
- Componentes/fluxos: busca, resultado vazio, falha/retry, formulário inválido, prevenção de duplicação e estados acessíveis.
- Integração: adicionar refeição atualiza diário/histórico; editar e excluir recalculam; preferências persistem.
- Ponta a ponta, quando houver build: abrir → registrar alimento → voltar ao Today → conferir total → reiniciar → confirmar persistência.

Mocks não substituem testar persistência real nem execução nativa. Snapshot isolado não prova fidelidade visual.

Para cada tela:

1. Registrar nó/referência e data da comparação.
2. Capturar o app nativo com dados e estado equivalentes ao design.
3. Comparar em dimensão equivalente, descontando barras nativas do sistema.
4. Conferir fontes, line heights, quebras, alinhamentos, cores, raios, assets e ações fixas.
5. Verificar tela compacta, texto ampliado e teclado quando aplicável.
6. Corrigir diferenças ou registrar exceção necessária. Sem screenshots, declarar validação visual pendente.

Nenhuma funcionalidade é considerada concluída apenas porque a versão web renderiza.

## 15. Automação de qualidade e definição de pronto

Na criação do app, implementar scripts reais para:

```text
typecheck     → TypeScript sem emissão
lint          → ESLint incluindo hooks e limites de imports aplicáveis
format:check  → Prettier em modo verificação
test          → testes relevantes com preset compatível
doctor        → verificação Expo Doctor
```

CI deve instalar pelo lockfile e executar verificações determinísticas sem segredos. Fazer validação de compatibilidade Expo após mudanças de dependências/configuração; não exigir recompilação nativa para toda alteração de texto.

Checklist de conclusão de uma entrega:

- Escopo pedido implementado, sem expandir produto sem necessidade.
- Arquitetura e responsabilidade dos componentes respeitadas.
- Tokens/assets correspondentes à referência usada.
- Comportamentos de loading, erro e vazio cobertos quando aplicáveis.
- Sem regressão de navegação, safe area, teclado ou persistência.
- Typecheck, lint e testes afetados executados; falhas anteriores distinguidas das novas.
- Validação nativa e visual realizada ou limitação explicitamente informada.
- Nenhum segredo, log sensível, dependência desnecessária ou controle sem ação.
- Documentação/decisões atualizadas quando contratos mudarem.

Não afrouxar regra de lint, apagar teste, ocultar erro ou adicionar supressão para declarar conclusão. Não declarar ferramenta, build, teste, tela ou protótipo validado sem evidência.

## 16. Procedimento para cada novo pedido

1. Ler `AGENTS.md`, este contrato e arquivos relevantes existentes.
2. Identificar tela/fluxo, nó do Figma e componentes já disponíveis.
3. Consultar o Figma quando acessível. Se bloqueado, usar a cópia local com transparência e manter comparação remota pendente.
4. Separar domínio, acesso a dados, estado de tela e apresentação antes de escrever.
5. Implementar a menor solução completa, reaproveitando componentes e tokens.
6. Validar o comportamento e a aparência do que mudou.
7. Responder com resultado, verificações e pendências reais; evitar despejar detalhes internos sem utilidade.

Prompt curto reutilizável:

> Implemente [tela ou fluxo] no NutriTrack seguindo AGENTS.md e docs/MOBILE_ENGINEERING.md. Use o Figma e as referências locais correspondentes, reutilize o design system e preserve a arquitetura por funcionalidades. Entregue o comportamento completo do escopo solicitado, valide com as verificações aplicáveis e informe qualquer divergência ou validação pendente.

`AGENTS.md` torna as instruções descobríveis para agentes que o suportam. Em outras ferramentas, anexar os dois arquivos ou referenciá-los explicitamente. Nenhum Markdown sozinho garante conformidade: lint, testes, CI e revisão tornam as regras verificáveis.

## 17. Sequência recomendada de implementação

1. Base Expo Dev Client, navegação, tipagem, fonte, tokens e qualidade automatizada.
2. Primitivos do design system e Today com fixtures determinísticas, conferidos visualmente.
3. Domínio nutricional, AsyncStorage e repositórios com testes.
4. Fluxo completo de busca/seleção/porção/registro e atualização do diário.
5. Edição, exclusão/desfazer, histórico, alimentos salvos e metas.
6. Estados de falha/vazio/loading, acessibilidade, revisão nas duas plataformas e build de demonstração.

Manter uma fatia funcional executável ao fim de cada etapa. Não entregar todas as telas decorativas antes de validar um fluxo de ponta a ponta.

## 18. Referências técnicas oficiais

Consultadas para este guia em 2026-09-22. Revalidar na escolha do SDK e em mudanças de dependências.

- [Expo — Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo — uso e reconstrução do Development Build](https://docs.expo.dev/develop/development-builds/use-development-builds/)
- [Expo — TypeScript](https://docs.expo.dev/guides/typescript/)
- [Expo Router — diretório src](https://docs.expo.dev/router/reference/src-directory/)
- [Expo Router — rotas tipadas](https://docs.expo.dev/router/reference/typed-routes/)
- [React Native — AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- [Lucide — React Native](https://lucide.dev/guide/packages/lucide-react-native)
