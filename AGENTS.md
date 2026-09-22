# NutriTrack — instruções para desenvolvimento

Estas instruções se aplicam a todo o repositório e a todos os pedidos de implementação, correção, revisão e refatoração.

## Leitura obrigatória

Antes de alterar código, leia `docs/MOBILE_ENGINEERING.md`. Esse documento define arquitetura, design system, contratos de dados, fluxo Expo Dev Client e critérios de conclusão.

Para trabalho de interface, leia também `design/FIGMA-STATUS.md`, `design/tokens.json` e a referência da tela em `design/screens/`. A referência principal é o [arquivo NutriTrack no Figma](https://www.figma.com/design/ypPFuD7Ldwf1VYIZo0DuED).

## Regras essenciais

Escopo aprovado em 2026-09-22: MVP apenas frontend, sem Supabase, backend ou login. Dados de perfil, cadastros e registros são locais, via AsyncStorage (equivalente nativo ao localStorage). Ver `docs/decisions/001-local-mvp.md`.

1. Use React Native + Expo + TypeScript estrito + Expo Router, validando no Development Build com `expo-dev-client`.
2. Preserve a identidade e os detalhes do Figma. Não redesenhe a interface, substitua ilustrações ou introduza bibliotecas de UI por conveniência.
3. Organize por funcionalidades. Rotas são adaptadores finos; componentes visuais não acessam banco, rede ou armazenamento diretamente.
4. Reutilize os tokens e componentes do design system. Nada de cores, fontes, espaçamentos e raios arbitrários repetidos nas telas.
5. Prefira soluções simples e tipadas. Não use `any`, supressões de TypeScript, abstrações especulativas ou dependências sem justificativa.
6. Implemente comportamento real para o escopo pedido, incluindo carregamento, vazio, erro e prevenção de envio duplicado. Demonstrações usam dados explicitamente separados da produção.
7. Garanta safe areas, teclado, acessibilidade, rolagem, adaptação a tamanhos de tela e navegação de retorno.
8. Teste regras de domínio e fluxos afetados; valide a aparência no app nativo. Não declare testes ou comparação visual que não foram executados.
9. Preserve alterações existentes. Não execute limpeza de pastas nativas, migrações destrutivas, upgrades amplos ou publicação sem autorização aplicável.
10. Ao concluir, informe o que mudou, o que foi validado e quaisquer limitações. Atualize documentação quando houver mudança de contrato, arquitetura ou design aprovado.

## Como interpretar novos pedidos

- Considere estas regras implicitamente incluídas em cada pedido de construção.
- Examine o código atual antes de propor estrutura ou instalar pacotes.
- Faça a menor alteração completa que resolve o pedido, respeitando os limites entre funcionalidades.
- Se o pedido explícito do usuário mudar uma decisão deste guia, aplique-o e atualize a decisão relevante. Não trate o guia como superior à instrução explícita do usuário.
- Se houver ambiguidade material de produto ou divergência visual sem evidência suficiente, explique o ponto específico; continue o trabalho independente dessa resposta.
- Não afirme que o Figma foi consultado se o acesso estiver indisponível. Use as referências locais, identifique a versão usada e declare comparação remota pendente.

Este arquivo orienta agentes compatíveis com `AGENTS.md`; não substitui lint, testes, CI ou revisão humana.
