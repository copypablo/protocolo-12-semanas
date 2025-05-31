// Código da aplicação principal
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados do localStorage
    carregarDados();
    
    // Inicializar calendário
    inicializarCalendario();
    
    // Atualizar data de registro
    atualizarDataRegistro();
    
    // Verificar se é fim de semana
    verificarFimDeSemana();
    
    // Atualizar estatísticas
    atualizarEstatisticas();
    
    // Atualizar galeria
    atualizarGaleria();
});

// Variáveis globais
let registrosDiarios = [];
let fotosSalvas = [];
let diaAtual = 1;
let fotoAtual = null;

// Funções de navegação
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar a seção selecionada
    document.getElementById(sectionId).classList.add('active');
    
    // Atualizar botões de navegação
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Encontrar o botão correspondente e ativá-lo
    document.querySelectorAll('.nav-button').forEach(button => {
        if (button.getAttribute('onclick').includes(sectionId)) {
            button.classList.add('active');
        }
    });
    
    // Ações específicas para cada seção
    if (sectionId === 'registro') {
        atualizarDataRegistro();
    }
}

// Funções de dados
function carregarDados() {
    // Carregar registros diários do localStorage
    const registrosSalvos = localStorage.getItem('registrosDiarios');
    if (registrosSalvos) {
        registrosDiarios = JSON.parse(registrosSalvos);
        
        // Determinar o dia atual com base nos registros
        diaAtual = registrosDiarios.length + 1;
        if (diaAtual > 90) diaAtual = 90;
        
        // Atualizar contador de dias
        document.getElementById('day-counter').textContent = `Dia ${diaAtual} de 90`;
    }
    
    // Carregar fotos salvas
    const fotosSalvasData = localStorage.getItem('fotosSalvas');
    if (fotosSalvasData) {
        fotosSalvas = JSON.parse(fotosSalvasData);
    }
}

function salvarDados() {
    // Salvar registros diários no localStorage
    localStorage.setItem('registrosDiarios', JSON.stringify(registrosDiarios));
    
    // Salvar fotos
    localStorage.setItem('fotosSalvas', JSON.stringify(fotosSalvas));
}

// Funções do calendário
function inicializarCalendario() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';
    
    // Obter data atual
    const hoje = new Date();
    const dataInicio = new Date(hoje);
    dataInicio.setDate(hoje.getDate() - (diaAtual - 1));
    
    // Obter primeiro dia do mês
    const primeiroDia = new Date(dataInicio);
    primeiroDia.setDate(1);
    
    // Adicionar dias vazios para alinhar com o dia da semana
    const diaSemanaInicio = primeiroDia.getDay();
    for (let i = 0; i < diaSemanaInicio; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.style.visibility = 'hidden';
        calendarContainer.appendChild(dayElement);
    }
    
    // Adicionar dias do calendário
    for (let i = 1; i <= 90; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        // Verificar se é fim de semana
        const data = calcularData(i);
        const diaSemana = data.getDay();
        if (diaSemana === 0 || diaSemana === 6) {
            dayElement.classList.add('weekend');
        }
        
        // Verificar se é o dia atual
        if (i === diaAtual) {
            dayElement.classList.add('today');
        }
        
        // Verificar status do dia
        const registroDia = registrosDiarios.find(r => r.dia === i);
        if (registroDia) {
            if (registroDia.dieta >= 75) {
                dayElement.classList.add('completed');
            } else if (registroDia.dieta >= 50) {
                dayElement.classList.add('partial');
            } else {
                dayElement.classList.add('missed');
            }
        }
        
        // Adicionar número do dia
        dayElement.textContent = i;
        
        // Adicionar evento de clique
        dayElement.addEventListener('click', () => {
            if (registroDia) {
                mostrarDetalhesRegistro(registroDia);
            } else if (i <= diaAtual) {
                // Ir para a tela de registro se o dia for menor ou igual ao atual
                showSection('registro');
            }
        });
        
        calendarContainer.appendChild(dayElement);
    }
}

function calcularData(dia) {
    // Calcular a data com base no dia do desafio
    // Assumindo que o dia 1 é hoje
    const hoje = new Date();
    const dataInicio = new Date(hoje);
    dataInicio.setDate(hoje.getDate() - (diaAtual - 1));
    
    const dataDia = new Date(dataInicio);
    dataDia.setDate(dataInicio.getDate() + (dia - 1));
    
    return dataDia;
}

function formatarData(data) {
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
}

function nomeDiaSemana(data) {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return diasSemana[data.getDay()];
}

// Funções do formulário de registro
function atualizarDataRegistro() {
    const dataAtual = calcularData(diaAtual);
    document.getElementById('data-atual').textContent = formatarData(dataAtual);
    
    const diaSemanaEl = document.getElementById('dia-semana');
    diaSemanaEl.textContent = nomeDiaSemana(dataAtual);
    
    // Destacar se for fim de semana
    const diaSemana = dataAtual.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
        diaSemanaEl.style.backgroundColor = 'var(--warning-color)';
    } else {
        diaSemanaEl.style.backgroundColor = 'var(--secondary-color)';
    }
}

function addWater(ml) {
    const aguaInput = document.getElementById('agua');
    const valorAtual = aguaInput.value ? parseInt(aguaInput.value) : 0;
    aguaInput.value = valorAtual + ml;
}

function previewPhoto(input) {
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = '';
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            fotoAtual = e.target.result;
            
            const img = document.createElement('img');
            img.src = fotoAtual;
            preview.appendChild(img);
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.innerHTML = '<span>Prévia da foto</span>';
    }
}

function salvarRegistro() {
    // Obter valores do formulário
    const agua = parseInt(document.getElementById('agua').value) || 0;
    const sono = parseInt(document.getElementById('sono').value) || 0;
    const dietaEl = document.querySelector('input[name="dieta"]:checked');
    const dieta = dietaEl ? parseInt(dietaEl.value) : 0;
    const observacoes = document.getElementById('observacoes').value;
    
    // Validar dados
    if (sono === 0 || dieta === 0) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Criar objeto de registro
    const registro = {
        dia: diaAtual,
        data: formatarData(calcularData(diaAtual)),
        diaSemana: nomeDiaSemana(calcularData(diaAtual)),
        agua,
        sono,
        dieta,
        observacoes,
        foto: fotoAtual ? true : false
    };
    
    // Adicionar ao array de registros
    registrosDiarios.push(registro);
    
    // Se tiver foto, adicionar ao array de fotos
    if (fotoAtual) {
        fotosSalvas.push({
            dia: diaAtual,
            data: registro.data,
            foto: fotoAtual,
            observacoes: observacoes
        });
    }
    
    // Salvar dados
    salvarDados();
    
    // Atualizar dia atual
    diaAtual++;
    if (diaAtual > 90) diaAtual = 90;
    document.getElementById('day-counter').textContent = `Dia ${diaAtual} de 90`;
    
    // Atualizar calendário
    inicializarCalendario();
    
    // Atualizar estatísticas
    atualizarEstatisticas();
    
    // Atualizar galeria
    atualizarGaleria();
    
    // Mostrar mensagem de sucesso
    alert('Registro salvo com sucesso!');
    
    // Limpar formulário
    limparFormulario();
    
    // Voltar para o dashboard
    showSection('dashboard');
}

function limparFormulario() {
    document.getElementById('agua').value = '';
    document.getElementById('sono').value = '0';
    
    const dietaOptions = document.querySelectorAll('input[name="dieta"]');
    dietaOptions.forEach(option => {
        option.checked = false;
    });
    
    document.getElementById('observacoes').value = '';
    document.getElementById('foto').value = '';
    document.getElementById('photo-preview').innerHTML = '<span>Prévia da foto</span>';
    fotoAtual = null;
}

// Funções de estatísticas
function atualizarEstatisticas() {
    if (registrosDiarios.length === 0) {
        // Zerar estatísticas
        document.getElementById('agua-media').textContent = '0 ml';
        document.getElementById('sono-media').textContent = '0';
        document.getElementById('dieta-media').textContent = '0%';
        document.getElementById('dias-registrados').textContent = '0';
        document.getElementById('dias-registrados-stats').textContent = '0';
        document.getElementById('dias-perfeitos').textContent = '0';
        document.getElementById('melhor-sequencia').textContent = '0 dias';
        document.getElementById('progresso-total').textContent = '0%';
        return;
    }
    
    // Calcular médias
    const aguaTotal = registrosDiarios.reduce((sum, r) => sum + r.agua, 0);
    const aguaMedia = Math.round(aguaTotal / registrosDiarios.length);
    
    const sonoTotal = registrosDiarios.reduce((sum, r) => sum + r.sono, 0);
    const sonoMedia = (sonoTotal / registrosDiarios.length).toFixed(1);
    
    const dietaTotal = registrosDiarios.reduce((sum, r) => sum + r.dieta, 0);
    const dietaMedia = Math.round(dietaTotal / registrosDiarios.length);
    
    // Calcular dias perfeitos (dieta 100%)
    const diasPerfeitos = registrosDiarios.filter(r => r.dieta === 100).length;
    
    // Calcular melhor sequência
    let sequenciaAtual = 0;
    let melhorSequencia = 0;
    
    for (let i = 0; i < registrosDiarios.length; i++) {
        if (registrosDiarios[i].dieta >= 75) {
            sequenciaAtual++;
            if (sequenciaAtual > melhorSequencia) {
                melhorSequencia = sequenciaAtual;
            }
        } else {
            sequenciaAtual = 0;
        }
    }
    
    // Calcular progresso total
    const progressoTotal = Math.round((registrosDiarios.length / 90) * 100);
    
    // Atualizar elementos na página
    document.getElementById('agua-media').textContent = `${aguaMedia} ml`;
    document.getElementById('sono-media').textContent = sonoMedia;
    document.getElementById('dieta-media').textContent = `${dietaMedia}%`;
    document.getElementById('dias-registrados').textContent = registrosDiarios.length;
    document.getElementById('dias-registrados-stats').textContent = registrosDiarios.length;
    document.getElementById('dias-perfeitos').textContent = diasPerfeitos;
    document.getElementById('melhor-sequencia').textContent = `${melhorSequencia} dias`;
    document.getElementById('progresso-total').textContent = `${progressoTotal}%`;
}


    // Mostrar alerta se for sexta, sábado ou domingo
    const alertaFimDeSemana = document.getElementById('weekend-alert');
    
    if (diaSemana === 5 || diaSemana === 6 || diaSemana === 0) {
        alertaFimDeSemana.style.display = 'block';
    } else {
        alertaFimDeSemana.style.display = 'none';
    }
}

// Função para mostrar detalhes de um registro
function mostrarDetalhesRegistro(registro) {
    // Criar modal para mostrar os detalhes
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = 'var(--border-radius-md)';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.maxHeight = '90%';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';
    modalContent.style.boxShadow = 'var(--shadow-lg)';
    
    const header = document.createElement('div');
    header.style.background = 'var(--gradient-primary)';
    header.style.color = 'white';
    header.style.padding = '20px';
    header.style.borderTopLeftRadius = 'var(--border-radius-md)';
    header.style.borderTopRightRadius = 'var(--border-radius-md)';
    header.style.position = 'relative';
    
    const title = document.createElement('h3');
    title.textContent = `Detalhes do Dia ${registro.dia} - ${registro.data}`;
    title.style.marginRight = '30px';
    title.style.fontSize = '18px';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '15px';
    closeBtn.style.right = '15px';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = 'white';
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    const body = document.createElement('div');
    body.style.padding = '20px';
    
    // Criar grid para os detalhes
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
    grid.style.gap = '15px';
    grid.style.marginBottom = '20px';
    
    // Água
    const aguaItem = document.createElement('div');
    aguaItem.style.textAlign = 'center';
    aguaItem.style.padding = '15px';
    aguaItem.style.backgroundColor = '#f8f9fa';
    aguaItem.style.borderRadius = 'var(--border-radius-sm)';
    aguaItem.style.boxShadow = 'var(--shadow-sm)';
    
    const aguaTitle = document.createElement('h4');
    aguaTitle.textContent = 'Água';
    aguaTitle.style.marginBottom = '8px';
    aguaTitle.style.color = 'var(--gray-color)';
    aguaTitle.style.fontSize = '14px';
    
    const aguaValue = document.createElement('p');
    aguaValue.textContent = `${registro.agua} ml`;
    aguaValue.style.fontSize = '24px';
    aguaValue.style.fontWeight = '700';
    aguaValue.style.color = 'var(--primary-color)';
    
    aguaItem.appendChild(aguaTitle);
    aguaItem.appendChild(aguaValue);
    
    // Sono
    const sonoItem = document.createElement('div');
    sonoItem.style.textAlign = 'center';
    sonoItem.style.padding = '15px';
    sonoItem.style.backgroundColor = '#f8f9fa';
    sonoItem.style.borderRadius = 'var(--border-radius-sm)';
    sonoItem.style.boxShadow = 'var(--shadow-sm)';
    
    const sonoTitle = document.createElement('h4');
    sonoTitle.textContent = 'Sono';
    sonoTitle.style.marginBottom = '8px';
    sonoTitle.style.color = 'var(--gray-color)';
    sonoTitle.style.fontSize = '14px';
    
    const sonoValue = document.createElement('p');
    sonoValue.textContent = `${registro.sono}/5`;
    sonoValue.style.fontSize = '24px';
    sonoValue.style.fontWeight = '700';
    sonoValue.style.color = 'var(--primary-color)';
    
    sonoItem.appendChild(sonoTitle);
    sonoItem.appendChild(sonoValue);
    
    // Dieta
    const dietaItem = document.createElement('div');
    dietaItem.style.textAlign = 'center';
    dietaItem.style.padding = '15px';
    dietaItem.style.backgroundColor = '#f8f9fa';
    dietaItem.style.borderRadius = 'var(--border-radius-sm)';
    dietaItem.style.boxShadow = 'var(--shadow-sm)';
    
    const dietaTitle = document.createElement('h4');
    dietaTitle.textContent = 'Dieta';
    dietaTitle.style.marginBottom = '8px';
    dietaTitle.style.color = 'var(--gray-color)';
    dietaTitle.style.fontSize = '14px';
    
    const dietaValue = document.createElement('p');
    dietaValue.textContent = `${registro.dieta}%`;
    dietaValue.style.fontSize = '24px';
    dietaValue.style.fontWeight = '700';
    dietaValue.style.color = 'var(--primary-color)';
    
    dietaItem.appendChild(dietaTitle);
    dietaItem.appendChild(dietaValue);
    
    grid.appendChild(aguaItem);
    grid.appendChild(sonoItem);
    grid.appendChild(dietaItem);
    
    // Observações
    const obsSection = document.createElement('div');
    obsSection.style.marginBottom = '20px';
    
    const obsTitle = document.createElement('h4');
    obsTitle.textContent = 'Observações';
    obsTitle.style.marginBottom = '10px';
    obsTitle.style.color = 'var(--dark-color)';
    
    const obsText = document.createElement('p');
    obsText.textContent = registro.observacoes || 'Sem observações';
    obsText.style.padding = '15px';
    obsText.style.backgroundColor = '#f8f9fa';
    obsText.style.borderRadius = 'var(--border-radius-sm)';
    obsText.style.lineHeight = '1.6';
    
    obsSection.appendChild(obsTitle);
    obsSection.appendChild(obsText);
    
    // Foto
    const fotoIndex = fotosSalvas.findIndex(f => f.dia === registro.dia);
    if (fotoIndex !== -1) {
        const fotoSection = document.createElement('div');
        
        const fotoTitle = document.createElement('h4');
        fotoTitle.textContent = 'Foto do Dia';
        fotoTitle.style.marginBottom = '10px';
        fotoTitle.style.color = 'var(--dark-color)';
        
        const fotoBtn = document.createElement('button');
        fotoBtn.textContent = 'Ver Foto';
        fotoBtn.className = 'button';
        fotoBtn.style.width = '100%';
        
        fotoBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            mostrarFoto(fotosSalvas[fotoIndex]);
        });
        
        fotoSection.appendChild(fotoTitle);
        fotoSection.appendChild(fotoBtn);
        
        body.appendChild(grid);
        body.appendChild(obsSection);
        body.appendChild(fotoSection);
    } else {
        body.appendChild(grid);
        body.appendChild(obsSection);
    }
    
    const footer = document.createElement('div');
    footer.style.padding = '15px 20px';
    footer.style.borderTop = '1px solid rgba(0,0,0,0.05)';
    footer.style.textAlign = 'right';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.className = 'button';
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    footer.appendChild(closeButton);
    
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modalContent.appendChild(footer);
    
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Fechar modal ao clicar no botão ou fora do conteúdo
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}
