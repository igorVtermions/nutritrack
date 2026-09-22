# 002 — Alimentos próprios, favoritos, edição e desfazer

Data: 2026-09-22. Continuação autorizada do plano do MVP frontend.

O documento persistido passa à versão 2, mantendo a chave `nutritrack:diary:v1` para localizar os dados existentes. A versão 1 válida é migrada em memória com `customFoods: []`, `favoriteIds: []` e `deletedEntry: null`. A gravação da versão 2 ocorre somente na próxima mutação confirmada. Documentos inválidos ou versões desconhecidas não são sobrescritos.

Alimentos próprios têm ID com prefixo `custom:`, nome, descrição explícita de uma porção e valores por essa porção. Não converter medidas incompatíveis. Os valores são informados pelo usuário, separados visualmente dos alimentos demonstrativos. O ícone de alimento existente representa cadastros sem ilustração; não foram criadas imagens substitutas.

A edição altera quantidade e tipo de refeição, mantendo ID, data e instante. O novo snapshot deriva do snapshot salvo dividido pela quantidade anterior e multiplicado pela nova. Não consultar o catálogo para reescrever o histórico.

`deletedEntry` mantém uma única exclusão reversível, inclusive após reabrir. Uma nova exclusão substitui a anterior. Desfazer restaura o snapshot exato, limpa o slot e evita duplicar IDs. A opção aparece em detalhes e no diário. Erro ao excluir, editar ou desfazer preserva o estado confirmado.

Histórico usa semanas iniciadas na segunda-feira e meses de calendário. A média inclui somente datas anteriores a hoje com registros. Zero registrado é incluído; ausência, hoje parcial e datas futuras são excluídos. O gráfico tem valores textuais complementares e listas virtualizadas.

O formulário de criar alimento não tem frame próprio na referência local: reutiliza campos, botões e tokens existentes. Comparação visual nativa/remota pendente. O README passa a ser mantido integralmente em inglês, conforme instrução do usuário.
