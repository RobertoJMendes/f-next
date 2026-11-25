// Importa diretamente a configuração nativa do Next.js (já compatível com ESLint 9+)
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Importa a configuração do Prettier para desativar regras de estilo conflitantes
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Define pastas que o ESLint deve ignorar completamente
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },

  // Aplica as regras recomendadas do Next.js (Core Web Vitals, React e React Hooks)
  ...nextCoreWebVitals,

  // Desativa regras de formatação do ESLint que conflitam com o Prettier (sempre por último)
  prettierConfig,
];

export default eslintConfig;
