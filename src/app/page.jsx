"use client";

import { useState, useEffect } from "react";
import Grid from "./Grid";

// URL base da API do backend
/*const API_URL = "http://localhost:4000";*/
const API_URL = "/api/users";

export default function Home() {
  // Estados principais de controle da aplicação
  const [users, setUsers] = useState([]); // Lista de usuários cadastrados
  const [onEdit, setOnEdit] = useState(null); // Armazena o usuário selecionado para edição
  const [aviso, setAviso] = useState(""); // Mensagem temporária de feedback para o usuário

  // Estados dos campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [fone, setFone] = useState("");

  // Exibe uma mensagem de alerta na tela e a oculta após 3 segundos
  const mostrarAviso = (texto) => {
    setAviso(texto);
    setTimeout(() => setAviso(""), 3000);
  };

  // Carrega os usuários assim que o componente é montado na tela
  useEffect(() => {
    let ignore = false;

    async function fetchInitialUsers() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!ignore) {
          setUsers(Array.isArray(data.resultFinal) ? data.resultFinal : []);
        }
      } catch {
        if (!ignore) {
          setAviso("Erro ao buscar usuários.");
          setTimeout(() => setAviso(""), 3000);
        }
      }
    }

    fetchInitialUsers();

    // Evita atualizar estado se o componente for desmontado antes da resposta
    return () => {
      ignore = true;
    };
  }, []);

  // Função auxiliar para atualizar a lista após criar, editar ou deletar
  const atualizarLista = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(Array.isArray(data.resultFinal) ? data.resultFinal : []);
    } catch {
      mostrarAviso("Erro ao atualizar lista de usuários.");
    }
  };

  // Preenche o formulário diretamente no evento de clique (evita um useEffect desnecessário)
  const iniciarEdicao = (usuario) => {
    setOnEdit(usuario);
    setNome(usuario.nome || "");
    setEmail(usuario.email || "");
    setFone(usuario.fone || "");
  };

  // Reseta os campos do formulário e sai do modo de edição
  const limparFormulario = () => {
    setNome("");
    setEmail("");
    setFone("");
    setOnEdit(null);
  };

  // Lida com o envio do formulário para criar (POST) ou atualizar (PUT) um usuário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples para evitar envio de campos vazios
    if (!nome || !email || !fone) {
      return mostrarAviso("Preencha todos os campos!");
    }

    // Define o método HTTP e a rota com base no modo (edição ou criação)
    const method = onEdit ? "PUT" : "POST";
    const url = onEdit ? `${API_URL}/${onEdit.id}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, fone }),
      });

      mostrarAviso(onEdit ? "Usuário atualizado!" : "Usuário cadastrado!");
      limparFormulario();
      atualizarLista(); // Atualiza a listagem após salvar
    } catch {
      mostrarAviso("Erro ao salvar usuário.");
    }
  };

  // Remove um usuário pelo ID (DELETE) e atualiza a lista
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      mostrarAviso("Usuário removido!");
      // Se o usuário deletado estava sendo editado no momento, limpa o formulário
      if (onEdit?.id === id) limparFormulario();
      atualizarLista();
    } catch {
      mostrarAviso("Erro ao deletar usuário.");
    }
  };

  return (
    <main className="container">
      <h2>Backend Docker Mysql & Frontend Next.js</h2>

      {/* Exibe a barra de notificação caso exista alguma mensagem ativa */}
      {aviso && <div className="aviso">{aviso}</div>}

      {/* Formulário de cadastro e edição de usuários */}
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input value={fone} onChange={(e) => setFone(e.target.value)} />
        </div>

        <div className="form-actions">
          {/* O botão de cancelar só aparece quando o formulário está em modo de edição */}
          {onEdit && (
            <button
              type="button"
              className="btn-cancel"
              onClick={limparFormulario}
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-save">
            {onEdit ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </form>

      {/* Tabela/Grid que lista os usuários e dispara as ações de editar e excluir */}
      <Grid
        users={users}
        onEditUser={iniciarEdicao}
        onDeleteUser={handleDelete}
      />
    </main>
  );
}
