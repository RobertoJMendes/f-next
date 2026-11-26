-- Cria a tabela de usuários caso ela ainda não exista no banco de dados
CREATE TABLE IF NOT EXISTS usuarios (
  -- Chave primária numérica gerada automaticamente a cada novo registro
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Dados cadastrais obrigatórios vindos do formulário
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  fone VARCHAR(50) NOT NULL,
  
  -- Registra automaticamente a data e hora exata em que o usuário foi criado
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
