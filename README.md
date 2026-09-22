# NutriTrack

MVP frontend em React Native + Expo SDK 57, TypeScript e Expo Router. Sem Supabase, servidor ou login. O diário, nome e metas ficam no aparelho via AsyncStorage.

## Executar

Requisitos: Node 24, npm e Development Build instalado. Para Android local, Android SDK e JDK compatível (a tentativa inicial usou o JBR 21 do Android Studio).

```sh
npm ci
npm run android
npm start
```

`npm run android` compila e instala o cliente em um aparelho/emulador disponível. `npm start` inicia Metro com `--dev-client`. Não usar Expo Go como validação. Para iOS, usar Mac com Xcode (`npm run ios`) ou um projeto EAS configurado. Os perfis development, preview e production estão em `eas.json`; nenhuma conta EAS foi vinculada nem houve publicação.

Development Build Android arm64 gerado nesta entrega: `artifacts/nutritrack-development-arm64.apk`. Instale no aparelho Android arm64 e execute `npm start` para servir o JavaScript. Este APK de desenvolvimento depende do Metro e não é um preview independente. A pasta `artifacts/` não entra no Git.

Identificadores `com.nutritrack.prototype` são exclusivos deste protótipo, não identificadores de publicação aprovados.

## Primeira fatia funcional

- Entrada sem conta, lembrada após reabrir.
- Diário inicialmente vazio, navegação por dia e totais derivados dos registros.
- Busca em três alimentos demonstrativos; quantidade por porção e seleção da refeição.
- Confirmação somente após salvar, detalhes e exclusão com confirmação.
- Histórico simples dos últimos sete dias, nome local e metas editáveis.
- Erros de leitura e gravação, nova tentativa e proteção contra envio duplicado.

O catálogo usa valores ilustrativos e está identificado na interface. Não é uma base nutricional validada. Não há refeições fictícias no diário. Desinstalar ou limpar dados pode remover o conteúdo local.

Ainda pendentes no plano completo: edição/desfazer, cadastro de alimentos próprios e favoritos, gráfico e filtros do histórico, refinamento visual das telas e validação nativa Android/iOS. Scanner e receitas ficam fora desta primeira fatia. A biblioteca Foods nesta etapa mostra o catálogo demonstrativo, não uma biblioteca pessoal pronta.

## Qualidade

```sh
npm run typecheck
npm run lint
npm run format:check
npm test -- --ci
npm run doctor
```

CI executa instalação pelo lockfile, tipos, lint, formatação e testes. Os testes de armazenamento usam adaptador em memória; não substituem a verificação do AsyncStorage em um aparelho.

## Materiais e decisões

- `AGENTS.md` e `docs/MOBILE_ENGINEERING.md`: contrato de engenharia.
- `docs/decisions/001-local-mvp.md`: decisão de persistência local.
- `design/`: tokens, ícones e 13 telas SVG.
- `docs/IMPLEMENTATION_STATUS.md`: validações e pendências.

Os vetores usados são extraídos das referências locais com `node scripts/extract-design-assets.cjs`. As cores base vêm de `design/tokens.json`. As duas cores inversas em runtime reproduzem o SVG Today; confirmação remota pendente. Inter usa os quatro arquivos de peso reais do pacote, sob licença OFL. Expo, React Native, Router, SVG e AsyncStorage usam licença MIT. Reanimated/Worklets e React DOM foram fixados às versões do SDK para satisfazer dependências do Router, sem introduzir animações de produto.

Sharp 0.35.4 (Apache-2.0) é ferramenta exclusiva de desenvolvimento para converter o logo SVG local em PNG de splash. O PNG está versionado em `assets/images/logo.png`; não é necessário converter imagens ao executar o app.

Referências oficiais consultadas para o setup: [criação de projeto Expo](https://docs.expo.dev/get-started/create-a-project/) e [armazenamento local](https://docs.expo.dev/develop/user-interface/store-data/). Compatibilidade conferida com o manifesto do SDK instalado e Expo Doctor.
