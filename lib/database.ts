export type Material = {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  estoqueMinimo: number;
  quantidadeAtual: number;
  observacao: string;
  ativo: boolean;
};

export type LocalEstoque = {
  id: string;
  nome: string;
};

export type Movimentacao = {
  id: string;
  materialId: string;
  localId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  responsavel: string;
  observacao: string;
  data: string;
};
export const materiais = [
  {
    id: "1",
    codigo: "PF001",
    nome: "parafuso sextavado",
    unidade: "UN",
    estoqueMinimo: 50,
    quantidadeAtual: 60,
    observacao: "teste",
    ativo: true,
  },
  {
    id: "2",
    codigo: "PF002",
    nome: "parafuso brocante",
    unidade: "UN",
    estoqueMinimo: 10,
    quantidadeAtual: 20,
    observacao: "almoxarifado",
    ativo: true,
  },
  {
    id: "3",
    codigo: "MAT001",
    nome: "Cimento CP-II 50kg",
    unidade: "SC",
    estoqueMinimo: 20,
    quantidadeAtual: 100,
    observacao: "material de teste",
    ativo: true,
  },
] satisfies Material[];
export const locais = [
  { id: "1", nome: "Torre 1" },
  { id: "2", nome: "Torre 2" },
  { id: "3", nome: "Torre 3" },
  { id: "4", nome: "Torre 4" },
  { id: "5", nome: "Torre 5" },
  { id: "6", nome: "Torre 6" },
  { id: "7", nome: "Torre 7" },
] satisfies LocalEstoque[];