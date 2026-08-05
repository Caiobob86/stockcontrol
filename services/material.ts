import { supabase } from "../lib/supabase";

export async function listarMateriais() {
  const { data, error } = await supabase
    .from("materiais")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) throw error;

  return data ?? [];
}

export async function buscarMaterial(id: string) {
  const { data, error } = await supabase
    .from("materiais")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarQuantidade(
  id: string,
  quantidadeAtual: number
) {
  const { error } = await supabase
    .from("materiais")
    .update({
      quantidade_atual: quantidadeAtual,
    })
    .eq("id", id);

  if (error) throw error;
}