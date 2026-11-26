// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração principal do Playwright para o projeto f-props.
 * Define onde estão os testes, qual navegador usar e como iniciar o servidor Next.js.
 */
export default defineConfig({
  // Pasta onde o Playwright vai procurar os arquivos de teste (*.spec.js)
  testDir: './tests',

  // Executa um teste por vez (sequencial) para evitar que dois testes alterem
  // o banco de dados MySQL ao mesmo tempo e causem conflito de dados
  fullyParallel: false,

  // Gera um relatório visual em HTML ao final da execução dos testes
  reporter: 'html',

  // Configurações padrão aplicadas a todos os testes
  use: {
    // Endereço base da aplicação; permite usar apenas '/' ou '/api/users' nos testes
    baseURL: 'http://localhost:3000',

    // Grava o rastreamento (prints, logs de rede) caso um teste falhe na primeira tentativa
    trace: 'on-first-retry',
  },

  // Define em quais navegadores os testes vão rodar (aqui, apenas no Google Chrome/Chromium)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Configuração do servidor web: o Playwright sobe o Next.js automaticamente
  // antes de iniciar os testes e desliga quando terminar
  webServer: {
    // Comando usado para iniciar o servidor (usa o build de produção que você já gerou)
    command: 'npm run start',

    // URL que o Playwright fica monitorando até responder para saber que o servidor está pronto
    url: 'http://localhost:3000',

    // Se você já tiver deixado o 'npm run start' rodando em outro terminal local,
    // ele reaproveita esse servidor em vez de tentar abrir outro na mesma porta
    reuseExistingServer: !process.env.CI,
  },
});
