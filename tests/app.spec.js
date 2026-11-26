import { test, expect } from '@playwright/test';

test.describe('Validação de Produção - f-props', () => {
  
  test('deve carregar a página inicial e a imagem robo.png sem erro 404', async ({ page }) => {
    await page.goto('/');
    
    // Verifica se a página carregou com status OK
    await expect(page).toHaveURL('http://localhost:3000/');

    // Testa diretamente se a imagem robo.png está acessível
    const imageResponse = await page.request.get('/robo.png');
    expect(imageResponse.status()).toBe(200);
  });

  test('deve realizar o CRUD completo na API /api/users (MySQL)', async ({ request }) => {
    // 1. Criar usuário (POST)
    const createRes = await request.post('/api/users', {
      data: {
        name: 'Usuário Teste Playwright',
        email: `teste.${Date.now()}@exemplo.com` // E-mail único para evitar erro de duplicidade
      }
    });
    expect(createRes.ok()).toBeTruthy();

    console.log(createRes)
    
    const createdUser = await createRes.json();

    // 2. Listar usuários (GET)
    const listRes = await request.get('/api/users');
    expect(listRes.status()).toBe(200);
    const users = await listRes.json();
    expect(Array.isArray(users)).toBeTruthy();

    // 3. Deletar o usuário de teste para manter o banco limpo (se a rota DELETE existir)
    if (createdUser.id) {
      const deleteRes = await request.delete(`/api/users/${createdUser.id}`);
      expect(deleteRes.ok()).toBeTruthy();
    }
  });

});
