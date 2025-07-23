// Função para buscar fazendas do backend
export async function getAllFazendas() {
  const res = await fetch('http://localhost:8000/api/fazendas');
  if (!res.ok) throw new Error('Erro ao buscar fazendas');
  return await res.json();
}
