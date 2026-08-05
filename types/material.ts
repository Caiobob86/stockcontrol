export interface Material {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  estoqueMinimo: number;
  quantidadeAtual: number;
  observacao: string;
  ativo: boolean;
}