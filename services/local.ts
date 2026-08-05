import { supabase } from "../lib/supabase";

export async function listarLocais() {
  const { data, error } = await supabase
    .from("locais_estoque")
    .select("*")
    .eq("ativo", true)
    .order("ordem");

  if (error) throw error;

  return data ?? [];
}

export function listarPrincipais(locais: any[]) {
  return locais.filter(
    (item) => item.tipo === "principal"
  );
}

export function listarFilhos(
  locais: any[],
  parentId: string
) {
  return locais.filter(
    (item) => item.parent_id === parentId
  );
}