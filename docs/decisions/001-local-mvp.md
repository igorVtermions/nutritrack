# 001 — MVP frontend com armazenamento local

Data: 2026-09-22. Decisão explícita do usuário.

O protótipo inicial não possui backend, Supabase, autenticação ou cadastro de conta. Perfil, preferências e registros pertencem à instalação local do app.

Usar `@react-native-async-storage/async-storage`, equivalente ao localStorage no React Native. A implementação web do pacote pode usar localStorage. Esta decisão substitui SQLite na primeira versão do contrato de engenharia.

O repositório salva JSON versionado, valida dados ao carregar e serializa alterações. A interface só confirma sucesso depois de salvar. Dados inválidos ou de versão desconhecida geram erro recuperável, sem apagar ou substituir o conteúdo silenciosamente.

O catálogo inicial contém amostras nutricionais explicitamente identificadas como demonstrativas. O diário começa vazio. Não popular refeições fictícias no diário do usuário.

Não há sincronização entre aparelhos nem garantia de recuperação após desinstalação ou limpeza dos dados. Perfil local não representa conta. Metas iniciais são exemplos editáveis, não recomendações nutricionais.

Referência técnica: https://docs.expo.dev/develop/user-interface/store-data/
