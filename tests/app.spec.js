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
    const uniqueEmail = `teste.${Date.now()}@exemplo.com`;

    // 1. Criar usuário (POST) - Enviando nome, email e fone conforme exigido pela API
    const createRes = await request.post('/api/users', {
      data: {
        nome: 'Usuário Teste Playwright',
        email: uniqueEmail,
        fone: '11999999999'
      }
    });
    expect(createRes.status()).toBe(201);
    
    const createdUser = await createRes.json();
    expect(createdUser.id).toBeDefined();

    // 2. Listar usuários (GET) - Acessando a propriedade resultFinal retornada pela API
    const listRes = await request.get('/api/users');
    expect(listRes.status()).toBe(200);
    
    const listBody = await listRes.json();
    expect(Array.isArray(listBody.resultFinal)).toBeTruthy();
    expect(listBody.resultFinal.some((user) => user.id === createdUser.id)).toBeTruthy();

    // 3. Atualizar usuário (PUT) - Testando a rota dinâmica /api/users/[id]
    const updateRes = await request.put(`/api/users/${createdUser.id}`, {
      data: {
        nome: 'Usuário Teste Atualizado',
        email: uniqueEmail,
        fone: '11888888888'
      }
    });
    expect(updateRes.status()).toBe(200);

    // 4. Deletar o usuário de teste para manter o banco limpo (DELETE)
    const deleteRes = await request.delete(`/api/users/${createdUser.id}`);
    expect(deleteRes.status()).toBe(200);
  });

});
