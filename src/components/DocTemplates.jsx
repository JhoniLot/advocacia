import React, { useState } from 'react';
import { FileText, Download, Users, Check } from 'lucide-react';

const DocTemplates = ({ processes }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState(null);

  const templates = [
    {
      id: 'procuracao',
      title: 'Procuração Ad Judicia',
      description: 'Representação legal ampla para o foro em geral.',
      content: `
        <h1 style="text-align: center; font-family: Arial, sans-serif; font-size: 16pt; margin-bottom: 40px;">PROCURAÇÃO AD JUDICIA</h1>
        
        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5;">
          <b>OUTORGANTE:</b> <span>{{nome}}</span>, inscrito no CPF/CNPJ sob o nº <span>{{cpf}}</span>, com telefone para contato <span>{{telefone}}</span>.
        </p>

        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5; margin-top: 20px;">
          <b>OUTORGADOS:</b> PRIME JURÍDICO & ASSOCIADOS, sociedade de advogados, com sede na Av. República, nº 500, São Paulo/SP.
        </p>

        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5; margin-top: 20px;">
          <b>PODERES:</b> Por este instrumento particular de mandato, o Outorgante confere aos Outorgados amplos poderes para o foro em geral, com a cláusula <i>ad judicia et extra</i>, em qualquer Juízo, Instância ou Tribunal, podendo propor contra quem de direito as ações competentes e defendê-lo nas contrárias, seguindo umas e outras até final decisão, usando dos recursos legais e acompanhando-os.
        </p>

        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5; margin-top: 20px;">
          <b>PODERES ESPECÍFICOS:</b> Confere ainda poderes para confessar, reconhecer a procedência do pedido, transigir, desistir, renunciar ao direito sobre o qual se funda a ação, receber, dar quitação, firmar compromissos e assinar declaração de hipossuficiência econômica.
        </p>

        <div style="margin-top: 60px; font-family: Arial, sans-serif; font-size: 11pt; text-align: center;">
          <p>São Paulo, <span>{{data_atual}}</span>.</p>
          <br><br><br>
          <p>___________________________________________________</p>
          <p><b><span>{{nome}}</span></b></p>
        </div>
      `
    },
    {
      id: 'contrato',
      title: 'Contrato de Honorários',
      description: 'Contrato de prestação de serviços jurídicos.',
      content: `
        <h1 style="text-align: center; font-family: Arial, sans-serif; font-size: 16pt; margin-bottom: 40px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</h1>
        
        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5;">
          Pelo presente instrumento particular, de um lado <b><span>{{nome}}</span></b>, doravante denominado <b>CONTRATANTE</b>, e de outro lado <b>PRIME JURÍDICO</b>, doravante denominado <b>CONTRATADO</b>, ajustam o seguinte:
        </p>

        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5; margin-top: 20px;">
          <b>CLÁUSULA PRIMEIRA (Do Objeto):</b> O presente contrato tem como objeto a prestação de serviços advocatícios para o patrocínio da ação referente à: <i><span>{{descricao}}</span></i>.
        </p>

        <p style="font-family: Arial, sans-serif; font-size: 11pt; text-align: justify; line-height: 1.5; margin-top: 20px;">
          <b>CLÁUSULA SEGUNDA (Dos Honorários):</b> Em remuneração aos serviços prestados, o Contratante pagará ao Contratado o valor de <b>R$ <span>{{valor}}</span></b>.
        </p>

        <div style="margin-top: 60px; font-family: Arial, sans-serif; font-size: 11pt; text-align: center;">
          <p>São Paulo, <span>{{data_atual}}</span>.</p>
          <br><br><br>
          <div style="display: flex; justify-content: space-around;">
            <div>
              <p>______________________________________</p>
              <p><b>CONTRATANTE</b></p>
            </div>
            <div>
              <p>______________________________________</p>
              <p><b>CONTRATADO</b></p>
            </div>
          </div>
        </div>
      `
    }
  ];

  const handleGenerateDoc = (template) => {
    if (!selectedClient) {
      alert('Por favor, selecione um cliente primeiro.');
      return;
    }

    const client = processes.find(p => p.id === selectedClient);
    if (!client) return;

    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    let replacedContent = template.content
      .replace(/\{\{nome\}\}/g, client.client_name)
      .replace(/\{\{cpf\}\}/g, client.client_id || 'NÃO INFORMADO')
      .replace(/\{\{telefone\}\}/g, client.phone || 'NÃO INFORMADO')
      .replace(/\{\{valor\}\}/g, client.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
      .replace(/\{\{descricao\}\}/g, client.description || 'Objeto da ação jurídica')
      .replace(/\{\{data_atual\}\}/g, dataAtual);

    // Download do arquivo .doc
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Document</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + replacedContent + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.title} - ${client.client_name}.doc`;
    link.click();

    setGeneratedDoc(template.id);
    setTimeout(() => setGeneratedDoc(null), 3000);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '1.5em', letterSpacing: '2px', textTransform: 'uppercase' }}>Automação de Documentos</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8em', marginTop: '4px' }}>
          Gere peças e contratos pré-preenchidos em segundos.
        </p>
      </div>

      {/* SELETOR DE CLIENTE */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #2d3139' }}>
        <Users size={20} color="var(--accent-primary)" />
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.7em', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Selecione o Cliente/Caso
          </label>
          <select 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '10px', color: 'white', fontSize: '0.9em' }}
          >
            <option value="">-- Selecione um Cliente --</option>
            {processes.map(p => (
              <option key={p.id} value={p.id} style={{ background: 'var(--bg-surface)' }}>
                {p.client_name} ({p.id.slice(0, 8)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID DE TEMPLATES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {templates.map(template => (
          <div 
            key={template.id} 
            className="glass-card" 
            style={{ 
              padding: '30px', 
              border: '1px solid #2d3139', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              minHeight: '200px'
            }}
          >
            <div>
              <FileText size={32} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.1em', fontWeight: '700', marginBottom: '8px' }}>{template.title}</h3>
              <p style={{ fontSize: '0.8em', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{template.description}</p>
            </div>

            <button 
              onClick={() => handleGenerateDoc(template)}
              disabled={!selectedClient}
              style={{ 
                width: '100%', 
                marginTop: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                background: generatedDoc === template.id ? '#48bb78' : 'var(--text-primary)',
                color: 'var(--bg-deep)',
                opacity: selectedClient ? 1 : 0.5
              }}
            >
              {generatedDoc === template.id ? (
                <>
                  <Check size={16} /> GERADO COM SUCESSO
                </>
              ) : (
                <>
                  <Download size={16} /> GERAR DOCUMENTO (.DOC)
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocTemplates;
