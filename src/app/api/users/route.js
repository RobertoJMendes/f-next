import { NextResponse } from "next/server";
import pool from "@/lib/db";

const TABLE = process.env.DB_TABLE || "usuarios";

export async function GET() {
  try {
    const [rows] = await pool.query(`SELECT * FROM ??`, [TABLE]);
    return NextResponse.json({ resultFinal: rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar registros", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nome, email, fone } = await request.json();

    if (!nome?.trim() || !email?.trim() || !fone?.trim()) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO ?? (nome, email, fone) VALUES (?, ?, ?)`,
      [TABLE, nome.trim(), email.trim(), fone.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, nome, email, fone },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao cadastrar registro", details: error.message },
      { status: 500 }
    );
  }
}
