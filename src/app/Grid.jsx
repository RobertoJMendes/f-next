export default function Grid({ users, onEditUser, onDeleteUser }) {
  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Fone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#94a3b8" }}>
                Nenhum usuário cadastrado.
              </td>
            </tr>
          ) : (
            users.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.email}</td>
                <td>{item.fone}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => onEditUser(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDeleteUser(item.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
