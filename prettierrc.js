/** @type {import("prettier").Config} */
const config = {
  // === REGRAS GERAIS (JS / TS / CSS / HTML) ===

  // Adiciona ponto e vírgula no final das linhas (ex: const a = 1;)
  semi: true,

  // Usa aspas simples ('') no JavaScript em vez de aspas duplas ("")
  singleQuote: true,

  // Define o tamanho da indentação como 2 espaços
  tabWidth: 2,

  // Usa espaços em vez de caracteres de tabulação (Tab)
  useTabs: false,

  // Adiciona vírgula no final de itens em objetos/arrays multilinhas ('all', 'es5' ou 'none')
  trailingComma: "none",

  // Quebra a linha automaticamente quando ultrapassar 80 caracteres
  printWidth: 80,

  // Padroniza a quebra de linha como LF (\n) para evitar conflitos entre Windows e Linux/Mac
  endOfLine: "lf",

  // === REGRAS ESPECÍFICAS PARA HTML E JSX (REACT / NEXT.JS) ===

  // Em arquivos JSX/React, define se atributos HTML usam aspas simples ou duplas
  // false = usa aspas duplas no HTML/JSX (ex: <div className="box">), que é o padrão web
  jsxSingleQuote: false,

  // Coloca o sinal de fechamento '>' de tags HTML/JSX multilinhas no final da última linha
  // false = coloca o '>' em uma nova linha isolada (melhor legibilidade)
  bracketSameLine: false,

  // Coloca apenas um atributo por linha quando uma tag HTML/JSX quebrar em várias linhas
  singleAttributePerLine: true,

  // Define como o Prettier trata espaços em branco dentro de tags HTML
  // 'css' = respeita o comportamento padrão do CSS (evita quebrar layout de textos inline)
  htmlWhitespaceSensitivity: "css",

  // === REGRAS DE JAVASCRIPT MODERNO ===

  // Inclui parênteses ao redor de parâmetros únicos em arrow functions (ex: (x) => x)
  arrowParens: "always",

  // Adiciona espaços dentro das chaves de objetos (ex: { foo: bar })
  bracketSpacing: true,
};

export default config;
