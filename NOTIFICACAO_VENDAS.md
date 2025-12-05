# 🎉 Sistema de Notificação de Vendas

## Funcionalidade Implementada

Foi implementado um sistema de notificação visual e sonora que aparece automaticamente quando uma das vendedoras (Elaine, Julia ou Maria Vitória) realiza uma nova venda.

### O que acontece quando uma venda é detectada:

1. **Som**: Toca automaticamente o arquivo de áudio `videoplayback.mp3`
2. **Notificação Visual**: Aparece uma notificação grande no centro da tela com:
   - Nome da vendedora em destaque
   - Texto "VENDEU!" animado
   - Valor da venda formatado em reais
   - Animações de notas de dinheiro caindo (💵)
3. **Auto-fechamento**: A notificação desaparece automaticamente após 5 segundos

## Como adicionar o arquivo de áudio

1. Copie o arquivo `videoplayback.mp3` que você enviou para a pasta `public/` do projeto
2. Certifique-se de que o arquivo está nomeado exatamente como `videoplayback.mp3`
3. O caminho completo deve ser: `public/videoplayback.mp3`

### Estrutura esperada:
```
BI WF/
  └── public/
      └── videoplayback.mp3
```

## Como funciona a detecção

O sistema compara as vendas de hoje com o estado anterior a cada 15 segundos (intervalo de atualização do dashboard). Quando detecta que o total de vendas de uma vendedora aumentou, dispara a notificação.

### Vendedoras monitoradas:
- Elaine
- Julia  
- Maria Vitória

## Personalização

Se quiser ajustar:
- **Volume do som**: Edite `components/SaleNotification.tsx`, linha 18: `audioElement.volume = 0.7` (0.0 a 1.0)
- **Tempo de exibição**: Edite `components/SaleNotification.tsx`, linha 28: `5000` (em milissegundos)
- **Quantidade de notas**: Edite `components/SaleNotification.tsx`, linha 41: `length: 20` (número de notas caindo)

## Teste

Para testar, basta que uma das vendedoras faça uma venda no sistema. A notificação aparecerá automaticamente na próxima atualização do dashboard (máximo 15 segundos).

