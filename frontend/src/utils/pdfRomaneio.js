import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function emitirRomaneioPDF({ frigorifico, produtor, fazenda, data, lote, pesoVivo, pesoCarcaca, rendimento, precoArroba, bonificacao, valorBruto, valorLiquido }) {
  const doc = new jsPDF();
  // Logo (opcional): doc.addImage(frigorifico.logo, 'PNG', 10, 10, 40, 20);
  doc.setFontSize(14);
  doc.text(`Romaneio de Abate - ${frigorifico.nome}`, 60, 20);
  doc.setFontSize(10);
  doc.text(`Produtor: ${produtor}`, 10, 40);
  doc.text(`Fazenda: ${fazenda}`, 10, 46);
  doc.text(`Data do Abate: ${data}`, 10, 52);
  doc.text(`Lote: ${lote}   Animais: ${lote.length}`, 10, 58);

  autoTable(doc, {
    startY: 65,
    head: [['Peso Vivo Total', 'Peso Carcaça', 'Rendimento (%)']],
    body: [[
      `${pesoVivo} kg`,
      `${pesoCarcaca} kg`,
      `${rendimento.toFixed(2)}%`
    ]]
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Preço Arroba', 'Valor Bruto', 'Bonificações/Penalidades', 'Valor Líquido']],
    body: [[
      `R$ ${precoArroba.toLocaleString('pt-BR')}`,
      `R$ ${valorBruto.toLocaleString('pt-BR')}`,
      `R$ ${bonificacao.toLocaleString('pt-BR')}`,
      `R$ ${valorLiquido.toLocaleString('pt-BR')}`
    ]]
  });

  doc.save(`Romaneio_Lote_${lote.length}_${data}.pdf`);
}
