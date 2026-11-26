import { NextResponse } from "next/server";
import pool from "@/lib/db";

const TABLE = process.env.DB_TABLE || "usuarios";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nome, email, fone } = await request.json();

    if (!nome?.trim() || !email?.trim() || !fone?.trim()) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `UPDATE ?? SET nome = ?, email = ?, fone = ? WHERE id = ?`,
      [TABLE, nome.trim(), email.trim(), fone.trim(), id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Registro não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Atualizado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar registro", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const [result] = await pool.query(`DELETE FROM ?? WHERE id = ?`, [
      TABLE,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Registro não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removido com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar registro", details: error.message },
      { status: 500 }
    );
  }
}
