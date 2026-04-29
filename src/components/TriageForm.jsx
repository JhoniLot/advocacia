import React, { useState } from 'react';
import { FileUp, Loader2 } from 'lucide-react';

const TriageForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_id: '',
    phone: '',
    description: '',
    profit: ''
  });

  const formatCPFCNPJ = (value) => {
    const raw = value.replace(/\D/g, '').slice(0, 14);
    if (raw.length <= 11) {
      return raw
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return raw
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const formatPhone = (value) => {
    const raw = value.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 10) {
      return raw
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    } else {
      return raw
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
  };

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf === '') return false;
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let add = 0;
    for (let i=0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  };

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g,'');
    if(cnpj === '') return false;
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawId = formData.client_id.replace(/\D/g, '');
    const rawPhone = formData.phone.replace(/\D/g, '');

    if (rawId.length === 11 && !validateCPF(rawId)) {
      alert('Documento inválido: O CPF informado não é válido.');
      return;
    }
    if (rawId.length === 14 && !validateCNPJ(rawId)) {
      alert('Documento inválido: O CNPJ informado não é válido.');
      return;
    }
    if (rawId.length !== 11 && rawId.length !== 14) {
      alert('Documento inválido: Deve conter 11 (CPF) ou 14 (CNPJ) dígitos.');
      return;
    }
    if (rawPhone.length < 10 || rawPhone.length > 11) {
      alert('Contato inválido: O telefone deve conter DDD + 8 ou 9 dígitos.');
      return;
    }

    // Passa os dados limpos para o Supabase
    onSubmit(e, {
      ...formData,
      client_id: rawId,
      phone: rawPhone
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input 
        type="text" 
        placeholder="QUALIFICAÇÃO DO CLIENTE (NOME COMPLETO)" 
        required
        autoFocus
        value={formData.client_name}
        onChange={(e) => setFormData({...formData, client_name: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="CPF / CNPJ" 
          required
          value={formData.client_id}
          onChange={(e) => setFormData({...formData, client_id: formatCPFCNPJ(e.target.value)})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
        <input 
          type="number" 
          placeholder="HONORÁRIOS CONTRATUAIS PACTUADOS (R$)" 
          required
          value={formData.profit}
          onChange={(e) => setFormData({...formData, profit: e.target.value})}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
        />
      </div>
      <input 
        type="text" 
        placeholder="TELEFONE DE CONTATO" 
        required
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }} 
      />
      <textarea 
        placeholder="SÍNTESE DOS FATOS E OBJETO DA AÇÃO" 
        rows="4" 
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        style={{ width: '100%', background: 'transparent', border: '1px solid #2d3139', padding: '12px', color: 'white' }}
      ></textarea>
      <div style={{ border: '1px dashed #2d3139', padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
        <FileUp size={24} color="var(--accent-primary)" />
        <p style={{ fontSize: '0.8em', marginTop: '10px' }}>JUNTADA DE DOCUMENTOS (PROVA DOCUMENTAL)</p>
      </div>
      <button type="submit" disabled={loading} style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'CADASTRAR E PROTOCOLAR AÇÃO'}
      </button>
    </form>
  );
};

export default TriageForm;
