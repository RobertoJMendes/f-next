import { test, expect } from '@playwright/test';

test.describe('Testes E2E do Front-end - f-props', () => {
  
  test.beforeEach(async ({ page }) => {
    // Acessa a aplicação antes de cada teste
    await page.goto('/');
  });

  test('deve renderizar a estrutura inicial da página corretamente', async ({ page }) => {
    // Verifica o título principal
    await expect(page.getByRole('heading', { name: 'Backend Docker Mysql & Frontend Next.js' })).toBeVisible();

    // Verifica se os campos do formulário estão visíveis
    await expect(page.locator('.form-group', { hasText: 'Nome' }).locator('input')).toBeVisible();
    await expect(page.locator('.form-group', { hasText: 'E-mail' }).locator('input')).toBeVisible();
    await expect(page.locator('.form-group', { hasText: 'Telefone' }).locator('input')).toBeVisible();

    // Verifica o botão inicial de Salvar e garante que Cancelar não aparece
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeHidden();

    // Verifica o cabeçalho da tabela (Grid)
    await expect(page.getByRole('columnheader', { name: 'Nome' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'E-mail' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Fone' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Ações' })).toBeVisible();
  });

  test('deve exibir aviso de validação ao tentar salvar com campos vazios', async ({ page }) => {
    // Clica em Salvar sem preencher nada
    await page.getByRole('button', { name: 'Salvar' }).click();

    // Verifica se a mensagem de aviso aparece na tela
    const aviso = page.locator('.aviso');
    await expect(aviso).toBeVisible();
    await expect(aviso).toHaveText('Preencha todos os campos!');
  });

  test('deve realizar o fluxo completo na interface: Criar, Editar, Cancelar Edição e Excluir usuário', async ({ page }) => {
    // Dados únicos para evitar conflito com registros existentes no banco
    const timestamp = Date.now();
    const nomeInicial = `Teste Front ${timestamp}`;
    const emailUsuario = `front.${timestamp}@exemplo.com`;
    const foneInicial = '11999990000';

    const nomeEditado = `Editado Front ${timestamp}`;
    const foneEditado = '11888881111';

    // Mapeia os inputs do formulário
    const inputNome = page.locator('.form-group', { hasText: 'Nome' }).locator('input');
    const inputEmail = page.locator('.form-group', { hasText: 'E-mail' }).locator('input');
    const inputFone = page.locator('.form-group', { hasText: 'Telefone' }).locator('input');

    // ==========================================
    // 1. CRIAR USUÁRIO PELA TELA
    // ==========================================
    await inputNome.fill(nomeInicial);
    await inputEmail.fill(emailUsuario);
    await inputFone.fill(foneInicial);
    await page.getByRole('button', { name: 'Salvar' }).click();

    // Valida feedback visual e limpeza do formulário
    await expect(page.locator('.aviso')).toHaveText('Usuário cadastrado!');
    await expect(inputNome).toHaveValue('');
    await expect(inputEmail).toHaveValue('');
    await expect(inputFone).toHaveValue('');

    // Localiza a linha específica desse usuário na tabela (Grid)
    const linhaUsuario = page.locator('tbody tr', { hasText: emailUsuario });
    await expect(linhaUsuario).toBeVisible();
    await expect(linhaUsuario).toContainText(nomeInicial);
    await expect(linhaUsuario).toContainText(foneInicial);

    // ==========================================
    // 2. TESTAR BOTÃO CANCELAR EDIÇÃO
    // ==========================================
    await linhaUsuario.getByRole('button', { name: 'Editar' }).click();

    // Verifica se os dados subiram para o formulário e os botões mudaram
    await expect(inputNome).toHaveValue(nomeInicial);
    await expect(page.getByRole('button', { name: 'Atualizar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

    // Clica em Cancelar e verifica se voltou ao estado normal
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(inputNome).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeHidden();

    // ==========================================
    // 3. EDITAR E ATUALIZAR USUÁRIO PELA TELA
    // ==========================================
    await linhaUsuario.getByRole('button', { name: 'Editar' }).click();
    await inputNome.fill(nomeEditado);
    await inputFone.fill(foneEditado);
    await page.getByRole('button', { name: 'Atualizar' }).click();

    // Valida aviso e atualização na tabela
    await expect(page.locator('.aviso')).toHaveText('Usuário atualizado!');
    await expect(linhaUsuario).toContainText(nomeEditado);
    await expect(linhaUsuario).toContainText(foneEditado);

    // ==========================================
    // 4. EXCLUIR USUÁRIO PELA TELA (Limpa o banco)
    // ==========================================
    await linhaUsuario.getByRole('button', { name: 'Excluir' }).click();

    // Valida aviso e garante que a linha sumiu da tabela
    await expect(page.locator('.aviso')).toHaveText('Usuário removido!');
    await expect(linhaUsuario).toBeHidden();
  });

});
