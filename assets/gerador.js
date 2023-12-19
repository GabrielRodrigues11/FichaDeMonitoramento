//ADICIONA O SETOR
let currentSetorIndex = 2; // Inicia do segundo setor

document.getElementById('adicionarSetorBtn').addEventListener('click', function () {
    const setorAtual = document.querySelector(`.setor:nth-child(${currentSetorIndex})`);

    if (setorAtual) {
        setorAtual.style.display = 'flex';
        currentSetorIndex++;
    }
});

// REMOVE O RETOR

document.getElementById('ocultarUltimoSetorBtn').addEventListener('click', function () {
    if (currentSetorIndex > 2) {
        currentSetorIndex--; // Volta para o último setor exibido
        const ultimoSetorExibido = document.querySelector(`.setor:nth-child(${currentSetorIndex})`);
        ultimoSetorExibido.style.display = 'none';
    }
});





//ADICIONA USUARIO

document.getElementById('addUsuario').addEventListener('click', function (event) {
    // Evite que a página role para o início
    event.preventDefault();

    // Encontre o próximo conjunto de campos de usuário que está oculto
    var proximoUsuario = document.querySelector('.usuario:not([style*="display: flex;"]):not(:first-child)');

    // Se houver um próximo conjunto de campos e não estiver visível, mostre-o com display flex
    if (proximoUsuario) {
        proximoUsuario.style.display = 'flex';
    }
});

//REMOVE USUARIO

document.getElementById('removeUsuario').addEventListener('click', function (event) {
    // Evite que a página role para o início
    event.preventDefault();

    // Encontre todos os conjuntos de campos de usuário visíveis
    var usuariosVisiveis = document.querySelectorAll('.usuario[style*="display: flex;"]');

    // Se houver mais de um conjunto de campos de usuário visível, oculte o último
    if (usuariosVisiveis.length > 1) {
        var ultimoUsuario = usuariosVisiveis[usuariosVisiveis.length - 1];
        ultimoUsuario.style.display = 'none';
    }
    // Se houver apenas um usuário visível, oculte o primeiro
    else if (usuariosVisiveis.length === 1) {
        var primeiroUsuario = usuariosVisiveis[0];
        primeiroUsuario.style.display = 'none';
    }
});


// CONFIGURAÇÃO DO INPUT TEMPO

function formatarHora(input) {
    // Limpa qualquer caractere não numérico
    let valorLimpo = input.value.replace(/[^0-9]/g, '');

    // Adiciona ":" entre os dois primeiros dígitos e os dois últimos dígitos
    if (valorLimpo.length > 2) {
        valorLimpo = valorLimpo.substring(0, 2) + ':' + valorLimpo.substring(2);
    }

    // Atualiza o valor no campo
    input.value = valorLimpo;
}


//GERAR PDF


function gerarPDF() {
    // Crie uma instância do objeto jsPDF
    var pdf = new jsPDF();
    let globalCounter = 1;

    var yPosition = 20;  // Defina a posição y inicial

    // Função auxiliar para verificar e adicionar conteúdo a uma nova página, se necessário
    function addContentToPage(content, options = {}) {
        const lineHeight = 10;  // Altura da linha
        const pageHeight = 280;  // Altura da página

        // Verifique se o conteúdo ultrapassa o limite inferior da página
        if (yPosition + lineHeight > pageHeight) {
            pdf.addPage();  // Crie uma nova página
            yPosition = 20;  // Reinicie a posição y para o topo da nova página
        }

        const { font = 'helvetica', fontSize = 12, color = 'black', margin = 20, style = '' } = options;

        pdf.setFont(font, style);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color);

        pdf.text(margin, yPosition, content);
        yPosition += lineHeight;  // Aumente a posição y para a próxima linha
    }

    function addCenteredText(content, options = {}) {
        const { fontSize = 12, font = 'times', color = 'black', margin = 10, style = '', align = 'left' } = options;

        // Obtenha a largura do texto
        const textWidth = pdf.getStringUnitWidth(content) * fontSize / pdf.internal.scaleFactor;

        // Calcule a posição x para centralizar o texto
        const xPosition = (pdf.internal.pageSize.width - textWidth) / 2;

        // Adicione o texto
        pdf.setFont(font, style);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color);
        pdf.text(xPosition, yPosition, content, null, null, align);

        // Ajuste a posição y para a próxima linha
        yPosition += fontSize + margin;
    }

    addCenteredText('Ficha De Monitoramento', { fontSize: 18, font: 'times', color: 'black', margin: 10, style: 'bold' });

    // Adicione texto para os dados da empresa
    var conta = document.getElementById('conta');
    var nomeRazao = document.getElementById('nomeRazao');
    var endereco = document.getElementById('endereco');
    var bairro = document.getElementById('bairro');
    var cidade = document.getElementById('cidade');
    var estado = document.getElementById('estado');
    var cep = document.getElementById('cep');
    var emailResp = document.getElementById('emailResp');
    var comoChegar = document.getElementById('comoChegar');
    var providenciaInspetor = document.getElementById('providenciaInput');
    var modeloCentral = document.getElementById('modeloCentral');
    var localCentral = document.getElementById('localCentral');
    var senhaMaster = document.getElementById('senhaMaster');
    var senhaInstalador = document.getElementById('senhaInstalador');
    var palavraChaveCentral = document.getElementById('palavraChaveCentral');

    var servicosCheckbox = document.getElementsByName('servico');
    var servicosSelecionados = Array.from(servicosCheckbox).some((checkbox) => checkbox.checked);

    function marcarCamposVazios(campos) {
        campos.forEach(campo => {
            if (campo.type === 'checkbox') {
                // Se for um checkbox, verifica se está marcado
                if (!campo.checked) {
                    campo.classList.add('campo-vazio');
                } else {
                    campo.classList.remove('campo-vazio');
                }
            } else {
                // Para outros tipos de campos, verifica se está vazio
                if (campo.value.trim() === '') {
                    campo.classList.add('campo-vazio');
                } else {
                    campo.classList.remove('campo-vazio');
                }
            }
        });
    }

    // Verifica se os campos estão preenchidos
    var camposObrigatorios = [
        conta, nomeRazao, endereco, bairro, cidade, estado, cep,
        emailResp, comoChegar, providenciaInspetor, modeloCentral,
        localCentral, senhaMaster, senhaInstalador, palavraChaveCentral
    ];

    var servicosCheckbox = document.getElementsByName('servico');
    var peloMenosUmServicoSelecionado = Array.from(servicosCheckbox).some((checkbox) => checkbox.checked);

    // Adiciona a classe de destaque aos campos vazios
    marcarCamposVazios(camposObrigatorios);

    // Remove a classe de destaque de todos os checkboxes
    servicosCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    // Se pelo menos um serviço estiver marcado, remove a classe de destaque de todos os checkboxes
    if (peloMenosUmServicoSelecionado) {
        servicosCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.remove('campo-vazio');
        });
    } else {
        // Se nenhum serviço estiver marcado, adiciona a classe de destaque a todos os checkboxes
        servicosCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });
    }

    // Campos específicos para validar
    var avisarDisparoCheckbox = document.getElementsByName('avisarDisparo');
    var peloMenosUmCheckboxAvisarDisparoMarcado = Array.from(avisarDisparoCheckbox).some((checkbox) => checkbox.checked);

    avisarDisparoCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    if (!peloMenosUmCheckboxAvisarDisparoMarcado) {
        alert('Selecione pelo menos uma opção em "Avisar ao cliente (Disparos)" antes de gerar o PDF.');

        // Adiciona a classe de destaque aos rótulos dos checkboxes "Avisar ao cliente (Disparos)"
        avisarDisparoCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });

        // Rola até a seção de "Avisar ao cliente (Disparos)"
        document.querySelector('.avisar-cliente').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

        return;
    }

    // Campos de radio buttons
    var acessoRemotoRadio = document.getElementsByName('acessoRemoto');
    var uraHabilitadaRadio = document.getElementsByName('uraHabilitada');

    // Campos de checkboxes adicionais
    var acessoRemotoTesteCheckbox = document.getElementsByName('acessoRemotoTeste');
    var meiosComunicacaoCheckbox = document.getElementsByName('meiosComunicacao');
    var acessoRemoto12hCheckbox = document.getElementsByName('acessoRemoto12h');
    var acessoRemoto24hCheckbox = document.getElementsByName('acessoRemoto24h');

    // Adiciona a classe de destaque aos rótulos dos checkboxes adicionais
    acessoRemotoTesteCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    acessoRemoto12hCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    acessoRemoto24hCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    // Verifica se pelo menos um checkbox em cada grupo adicional está marcado
    if (
        !peloMenosUmCheckboxMarcado(acessoRemotoTesteCheckbox) &&
        !peloMenosUmCheckboxMarcado(acessoRemoto12hCheckbox) &&
        !peloMenosUmCheckboxMarcado(acessoRemoto24hCheckbox)
    ) {
        alert('Marque pelo menos uma opção para os campos de checkboxes antes de avançar.');

        // Adiciona a classe de destaque aos rótulos dos checkboxes adicionais
        acessoRemotoTesteCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });

        acessoRemoto12hCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });

        acessoRemoto24hCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });

        // Rola até a seção dos checkboxes adicionais
        document.querySelector('.acesso-remoto').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

        return;
    }


    // Adiciona a classe de destaque aos rótulos dos grupos de radio buttons
    acessoRemotoRadio.forEach(radio => {
        radio.parentNode.parentNode.classList.remove('campo-vazio');
    });

    uraHabilitadaRadio.forEach(radio => {
        radio.parentNode.parentNode.classList.remove('campo-vazio');
    });

    // Campos de checkboxes adicionais
    acessoRemotoTesteCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    meiosComunicacaoCheckbox.forEach(checkbox => {
        checkbox.parentNode.classList.remove('campo-vazio');
    });

    if (!peloMenosUmRadioSelecionado(acessoRemotoRadio) || !peloMenosUmRadioSelecionado(uraHabilitadaRadio)) {
        alert('Selecione uma opção para os campos de radio buttons antes de gerar o PDF.');

        // Adiciona a classe de destaque aos rótulos dos grupos de radio buttons
        acessoRemotoRadio.forEach(radio => {
            radio.parentNode.parentNode.classList.add('campo-vazio');
        });

        uraHabilitadaRadio.forEach(radio => {
            radio.parentNode.parentNode.classList.add('campo-vazio');
        });

        // Rola até a seção dos grupos de radio buttons
        document.querySelector('.container_acesso').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

        return;
    }

    // Campos de checkboxes adicionais
    if (!peloMenosUmCheckboxMarcado(acessoRemotoTesteCheckbox) || !peloMenosUmCheckboxMarcado(meiosComunicacaoCheckbox)) {
        alert('Selecione pelo menos uma opção para os campos de checkboxes antes de gerar o PDF.');

        // Adiciona a classe de destaque aos rótulos dos checkboxes adicionais
        acessoRemotoTesteCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });

        meiosComunicacaoCheckbox.forEach(checkbox => {
            checkbox.parentNode.classList.add('campo-vazio');
        });

        // Rola até a seção dos checkboxes adicionais
        document.querySelector('.acesso-remoto').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

        return;
    }

    function peloMenosUmRadioSelecionado(radios) {
        return Array.from(radios).some(radio => radio.checked);
    }

    function peloMenosUmCheckboxMarcado(checkboxes) {
        return Array.from(checkboxes).some(checkbox => checkbox.checked);
    }

    addContentToPage('Empresa: Alarm Center', { fontSize: 14, font: 'times', color: 'black', margin: 10, style: 'bold' });
    addContentToPage('Conta: ' + conta.value);
    addContentToPage('Partição: ' + particao.value);
    addContentToPage('Técnico: ' + tecnico.value);

    // Adicione espaço entre seções
    yPosition += 10;

    // Adicione texto para os dados do local de instalação
    addContentToPage('Dados do Local da Instalação', { fontSize: 12, font: 'times', color: 'black', margin: 10, style: 'bold' });
    addContentToPage('Nome / Razão social: ' + document.getElementById('nomeRazao').value);
    addContentToPage('Nome Fantasia: ' + document.getElementById('nomeFantasia').value);
    addContentToPage('Endereço: ' + document.getElementById('endereco').value);
    addContentToPage('Bairro: ' + document.getElementById('bairro').value);
    addContentToPage('Cidade: ' + document.getElementById('cidade').value);
    addContentToPage('Estado: ' + document.getElementById('estado').value);
    addContentToPage('Cep: ' + document.getElementById('cep').value);
    addContentToPage('Fone 1: ' + document.getElementById('fone1').value);
    addContentToPage('Fone 2: ' + document.getElementById('fone2').value);
    addContentToPage('Email Responsável: ' + document.getElementById('emailResp').value);
    addContentToPage('Resp. Alterações Cadastrais Sigma: ' + document.getElementById('alteSigma').value);
    // Adicione outros campos conforme necessário

    // Adicione espaço entre seções
    yPosition += 10;

    // Adicione texto para 'Serviços Prestados'
    addContentToPage('Serviços Prestados:', { fontSize: 12, font: 'times', color: 'black', margin: 10, style: 'bold' });

    // Adicione texto para os serviços selecionados

    var servicosCheckbox = document.getElementsByName('servico');
    for (var i = 0; i < servicosCheckbox.length; i++) {
        if (servicosCheckbox[i].checked) {
            addContentToPage('- ' + servicosCheckbox[i].value);
        }
    }

    // Adicione espaço entre seções
    yPosition += 10;

    // Adicione texto para 'Observações e Particularidades sobre o Cliente'
    addContentToPage('Observações e Particularidades sobre o Cliente', { fontSize: 12, font: 'times', color: 'black', margin: 10, style: 'bold' });
    addContentToPage('Avisar ao cliente (Disparos):');
    var avisarDisparoCheckbox = document.getElementsByName('avisarDisparo');
    var peloMenosUmCheckboxAvisarDisparoMarcado = Array.from(avisarDisparoCheckbox).some((checkbox) => checkbox.checked);

    if (!peloMenosUmCheckboxAvisarDisparoMarcado) {
        alert('Selecione pelo menos uma opção em "Avisar ao cliente (Disparos)" antes de gerar o PDF.');
        // Você pode querer adicionar um código para rolar até a seção ou fazer algo adequado ao seu layout aqui
        return;
    }

    for (var i = 0; i < avisarDisparoCheckbox.length; i++) {
        if (avisarDisparoCheckbox[i].checked) {
            addContentToPage('- ' + avisarDisparoCheckbox[i].value);
        }
    }

    // Adicione espaço entre seções
    yPosition += 10;

    // Adicione texto para 'Acesso remoto à Central'
    var acessoRemotoRadios = document.getElementsByName('acessoRemoto');
    var peloMenosUmRadioAcessoRemotoMarcado = Array.from(acessoRemotoRadios).some((radio) => radio.checked);

    // Verificar se pelo menos um dos radio buttons em "URA Habilitada" está marcado
    var uraHabilitadaRadios = document.getElementsByName('uraHabilitada');
    var peloMenosUmRadioURAHabilitadaMarcado = Array.from(uraHabilitadaRadios).some((radio) => radio.checked);

    // Se nenhum estiver marcado, exiba um alerta
    if (!peloMenosUmRadioAcessoRemotoMarcado || !peloMenosUmRadioURAHabilitadaMarcado) {
        alert('Selecione uma opção "Sim" ou "Não" para todas as escolhas antes de gerar o PDF.');
        // Você pode adicionar um código para rolar até a seção ou fazer algo adequado ao seu layout aqui
        return;
    }

    // Adicionar conteúdo ao PDF para as opções selecionadas em "Acesso Remoto"
    var opcaoAcessoRemoto = '';
    for (var i = 0; i < acessoRemotoRadios.length; i++) {
        if (acessoRemotoRadios[i].checked) {
            opcaoAcessoRemoto = acessoRemotoRadios[i].value;
            break;
        }
    }
    addContentToPage('Acesso Remoto à Central: ' + opcaoAcessoRemoto);

    // Adicionar conteúdo ao PDF para a opção selecionada em "URA Habilitada"
    var opcaoURAHabilitada = '';
    for (var i = 0; i < uraHabilitadaRadios.length; i++) {
        if (uraHabilitadaRadios[i].checked) {
            opcaoURAHabilitada = uraHabilitadaRadios[i].value;
            break;
        }
    }
    addContentToPage('URA Habilitada: ' + opcaoURAHabilitada);

    addContentToPage('Horário da Ativação Automática: ' + document.getElementById('horarioAtivacao').value);
    addContentToPage('Intervalo de Tempo para Ativar "Sem Movimento": ' + document.getElementById('intervaloSemMovimento').value);
    yPosition += 20
    addContentToPage('Perfil do Cliente: ' + document.getElementById('perfilCliente').value);

    // Adicione espaço entre seções
    yPosition += 10;

    // Adicione texto para 'Observações e peculiaridades sobre o local'
    addContentToPage('Observações e peculiaridades sobre o local', { fontSize: 12, font: 'times', color: 'black', margin: 10, style: 'bold' });
    addContentToPage('Como chegar ao local: ' + document.getElementById('comoChegar').value);
    addContentToPage('Aparência do Imóvel: ' + document.getElementById('aparenciaImovel').value);
    addContentToPage('Localização do Button: ' + document.getElementById('localizacaoButton').value);

    // Adicione espaço entre seções
    yPosition += 20;

    // Adicione texto para 'Providências do Inspetor'
    addContentToPage('Providências do Inspetor', { fontSize: 12, font: 'times', color: 'black', margin: 10, style: 'bold' });
    yPosition += 5;
    addContentToPage('Providencias: ' + document.getElementById('providenciaInput').value);
    var providenciasCheckbox = document.getElementsByName('providenciasInspetor');
    for (var i = 0; i < providenciasCheckbox.length; i++) {
        if (providenciasCheckbox[i].checked) {
            if (providenciasCheckbox[i].value === 'Chaves do local') {
                // Se for o checkbox relacionado às chaves do local, adicione o número dos chaveiros
                var numeroChaveiros = document.getElementById('numeroChaveiros').value;
                addContentToPage('- ' + providenciasCheckbox[i].value + ' - Número dos chaveiros: ' + numeroChaveiros);
            } else {
                // Para outros checkboxes, apenas adicione o valor
                addContentToPage('- ' + providenciasCheckbox[i].value);
            }
        }
    }

    // Adicione espaço entre seções
    yPosition += 20;

    // Adicione texto para 'Equipamentos de Segurança'
    addContentToPage('Equipamentos de Segurança');
    addContentToPage('Modelo da Central: ' + document.getElementById('modeloCentral').value);
    addContentToPage('Local da Central: ' + document.getElementById('localCentral').value);
    addContentToPage('Local do Teclado: ' + document.getElementById('localTeclado').value);
    addContentToPage('Senha Master: ' + document.getElementById('senhaMaster').value);
    addContentToPage('senha Instalador: ' + document.getElementById('senhaInstalador').value);
    addContentToPage('Acesso Remoto com:');

    // Verifique os checkboxes de Acesso Remoto e adicione os valores selecionados à página
    var acessoRemotoCheckboxes = document.getElementsByName('acessoRemotoTeste');
    for (var i = 0; i < acessoRemotoCheckboxes.length; i++) {
        if (acessoRemotoCheckboxes[i].checked) {
            addContentToPage('- ' + acessoRemotoCheckboxes[i].value);
        }
    }

    var acessoRemoto12hCheckbox = document.getElementsByName('acessoRemoto12h');
    if (acessoRemoto12hCheckbox[0].checked) {
        addContentToPage('- ' + acessoRemoto12hCheckbox[0].value);
    }

    var acessoRemoto24hCheckbox = document.getElementsByName('acessoRemoto24h');
    if (acessoRemoto24hCheckbox[0].checked) {
        addContentToPage('- ' + acessoRemoto24hCheckbox[0].value);
    }

    // Adicione espaço entre seções
    yPosition += 20;

    // Adicione 'Meios de Comunicação da Central' à página
    addContentToPage('Meios de Comunicação da Central:');
    var meiosComunicacaoCheckboxes = document.getElementsByName('meiosComunicacao');
    var peloMenosUmCheckboxMeiosComunicacaoMarcado = Array.from(meiosComunicacaoCheckboxes).some((checkbox) => checkbox.checked);

    if (!peloMenosUmCheckboxMeiosComunicacaoMarcado) {
        alert('Selecione pelo menos uma opção em "Meios de Comunicação da Central" antes de gerar o PDF.');
        // Adicione código adicional para rolar até a seção ou realizar a ação adequada ao seu layout
        return;
    }

    // Adicionar conteúdo ao PDF para as opções selecionadas em "meiosComunicacao"
    for (var i = 0; i < meiosComunicacaoCheckboxes.length; i++) {
        if (meiosComunicacaoCheckboxes[i].checked) {
            addContentToPage(`${meiosComunicacaoCheckboxes[i].value}: OK`);
        } else {
            addContentToPage(`${meiosComunicacaoCheckboxes[i].value}: Não Selecionado`);
        }
    }
    yPosition += 20;


    if (document.getElementById('localSetor1').value.trim() !== '' ||
        document.getElementById('cameraSetor1').value.trim() !== '' ||
        document.getElementById('particaoSetor1').value.trim() !== '' ||
        document.getElementById('modeloSetor1').value.trim() !== '') {

        addContentToPage('Distribuição de Setores');
        yPosition += 10;
        addContentToPage('Setor: 1');
        addContentToPage(`Local: ${document.getElementById('localSetor1').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor1').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor1').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor1').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor1').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor1').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor2').value.trim() !== '' ||
        document.getElementById('cameraSetor2').value.trim() !== '' ||
        document.getElementById('particaoSetor2').value.trim() !== '' ||
        document.getElementById('modeloSetor2').value.trim() !== '') {

        addContentToPage('Setor: 2');
        addContentToPage(`Local: ${document.getElementById('localSetor2').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor2').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor2').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor2').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor2').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor2').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor3').value.trim() !== '' ||
        document.getElementById('cameraSetor3').value.trim() !== '' ||
        document.getElementById('particaoSetor3').value.trim() !== '' ||
        document.getElementById('modeloSetor3').value.trim() !== '') {

        addContentToPage('Setor: 3');
        addContentToPage(`Local: ${document.getElementById('localSetor3').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor3').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor3').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor3').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor3').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor3').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor4').value.trim() !== '' ||
        document.getElementById('cameraSetor4').value.trim() !== '' ||
        document.getElementById('particaoSetor4').value.trim() !== '' ||
        document.getElementById('modeloSetor4').value.trim() !== '') {

        addContentToPage('Setor: 4');
        addContentToPage(`Local: ${document.getElementById('localSetor4').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor4').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor4').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor4').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor4').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor4').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor5').value.trim() !== '' ||
        document.getElementById('cameraSetor5').value.trim() !== '' ||
        document.getElementById('particaoSetor5').value.trim() !== '' ||
        document.getElementById('modeloSetor5').value.trim() !== '') {

        addContentToPage('Setor: 5');
        addContentToPage(`Local: ${document.getElementById('localSetor5').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor5').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor5').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor5').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor5').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor5').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor6').value.trim() !== '' ||
        document.getElementById('cameraSetor6').value.trim() !== '' ||
        document.getElementById('particaoSetor6').value.trim() !== '' ||
        document.getElementById('modeloSetor6').value.trim() !== '') {

        addContentToPage('Setor: 6');
        addContentToPage(`Local: ${document.getElementById('localSetor6').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor6').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor6').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor6').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor6').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor6').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor7').value.trim() !== '' ||
        document.getElementById('cameraSetor7').value.trim() !== '' ||
        document.getElementById('particaoSetor7').value.trim() !== '' ||
        document.getElementById('modeloSetor7').value.trim() !== '') {

        addContentToPage('Setor: 7');
        addContentToPage(`Local: ${document.getElementById('localSetor7').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor7').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor7').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor7').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor7').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor7').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor8').value.trim() !== '' ||
        document.getElementById('cameraSetor8').value.trim() !== '' ||
        document.getElementById('particaoSetor8').value.trim() !== '' ||
        document.getElementById('modeloSetor8').value.trim() !== '') {

        addContentToPage('Setor: 8');
        addContentToPage(`Local: ${document.getElementById('localSetor8').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor8').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor8').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor8').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor8').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor8').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor9').value.trim() !== '' ||
        document.getElementById('cameraSetor9').value.trim() !== '' ||
        document.getElementById('particaoSetor9').value.trim() !== '' ||
        document.getElementById('modeloSetor9').value.trim() !== '') {

        addContentToPage('Setor: 9');
        addContentToPage(`Local: ${document.getElementById('localSetor9').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor9').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor9').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor9').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor9').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor9').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    if (document.getElementById('localSetor10').value.trim() !== '' ||
        document.getElementById('cameraSetor10').value.trim() !== '' ||
        document.getElementById('particaoSetor10').value.trim() !== '' ||
        document.getElementById('modeloSetor10').value.trim() !== '') {

        addContentToPage('Setor: 10');
        addContentToPage(`Local: ${document.getElementById('localSetor10').value}`);
        addContentToPage(`Câmera: ${document.getElementById('cameraSetor10').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoSetor10').value}`);
        addContentToPage(`Modelo: ${document.getElementById('modeloSetor10').value}`);
        addContentToPage(`Câmera Interna: ${document.getElementById('cameraInternaSetor10').checked ? 'Interno' : ''}`);
        addContentToPage(`Câmera Externa: ${document.getElementById('cameraExternaSetor10').checked ? 'Externo' : ''}`);
        yPosition += 10;
    }

    yPosition += 20;

    if (
        document.getElementById('nome').value.trim() !== '' ||
        document.getElementById('sobrenome').value.trim() !== '' ||
        document.getElementById('funcao').value.trim() !== '' ||
        document.getElementById('celular').value.trim() !== '' ||
        document.getElementById('fixo').value.trim() !== '' ||
        document.getElementById('email').value.trim() !== '' ||
        document.getElementById('particaoUsuario').value.trim() !== '' ||
        document.getElementById('propriedade').value.trim() !== ''
    ) {
        addContentToPage('Cadastro de usuários e contatos');
        yPosition += 10;
        addContentToPage(`Nome: ${document.getElementById('nome').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade').value}`);
        yPosition += 20;
    }

    if (
        document.getElementById('nome2').value.trim() !== '' ||
        document.getElementById('sobrenome2').value.trim() !== '' ||
        document.getElementById('funcao2').value.trim() !== '' ||
        document.getElementById('celular2').value.trim() !== '' ||
        document.getElementById('fixo2').value.trim() !== '' ||
        document.getElementById('email2').value.trim() !== '' ||
        document.getElementById('particaoUsuario2').value.trim() !== '' ||
        document.getElementById('propriedade2').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome2').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome2').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao2').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular2').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo2').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email2').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario2').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade2').value}`);
        yPosition += 20;
    }

    if (
        document.getElementById('nome3').value.trim() !== '' ||
        document.getElementById('sobrenome3').value.trim() !== '' ||
        document.getElementById('funcao3').value.trim() !== '' ||
        document.getElementById('celular3').value.trim() !== '' ||
        document.getElementById('fixo3').value.trim() !== '' ||
        document.getElementById('email3').value.trim() !== '' ||
        document.getElementById('particaoUsuario3').value.trim() !== '' ||
        document.getElementById('propriedade3').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome3').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome3').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao3').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular3').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo3').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email3').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario3').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade3').value}`);
        yPosition += 10;
    }

    if (
        document.getElementById('nome4').value.trim() !== '' ||
        document.getElementById('sobrenome4').value.trim() !== '' ||
        document.getElementById('funcao4').value.trim() !== '' ||
        document.getElementById('celular4').value.trim() !== '' ||
        document.getElementById('fixo4').value.trim() !== '' ||
        document.getElementById('email4').value.trim() !== '' ||
        document.getElementById('particaoUsuario4').value.trim() !== '' ||
        document.getElementById('propriedade4').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome4').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome4').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao4').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular4').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo4').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email4').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario4').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade4').value}`);
        yPosition += 20;
    }

    if (
        document.getElementById('nome5').value.trim() !== '' ||
        document.getElementById('sobrenome5').value.trim() !== '' ||
        document.getElementById('funcao5').value.trim() !== '' ||
        document.getElementById('celular5').value.trim() !== '' ||
        document.getElementById('fixo5').value.trim() !== '' ||
        document.getElementById('email5').value.trim() !== '' ||
        document.getElementById('particaoUsuario5').value.trim() !== '' ||
        document.getElementById('propriedade5').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome5').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome5').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao5').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular5').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo5').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email5').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario5').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade5').value}`);
        yPosition += 10;
    }

    if (
        document.getElementById('nome6').value.trim() !== '' ||
        document.getElementById('sobrenome6').value.trim() !== '' ||
        document.getElementById('funcao6').value.trim() !== '' ||
        document.getElementById('celular6').value.trim() !== '' ||
        document.getElementById('fixo6').value.trim() !== '' ||
        document.getElementById('email6').value.trim() !== '' ||
        document.getElementById('particaoUsuario6').value.trim() !== '' ||
        document.getElementById('propriedade6').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome6').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome6').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao6').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular6').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo6').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email6').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario6').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade6').value}`);
        yPosition += 10;
    }

    if (
        document.getElementById('nome7').value.trim() !== '' ||
        document.getElementById('sobrenome7').value.trim() !== '' ||
        document.getElementById('funcao7').value.trim() !== '' ||
        document.getElementById('celular7').value.trim() !== '' ||
        document.getElementById('fixo7').value.trim() !== '' ||
        document.getElementById('email7').value.trim() !== '' ||
        document.getElementById('particaoUsuario7').value.trim() !== '' ||
        document.getElementById('propriedade7').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome7').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome7').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao7').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular7').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo7').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email7').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario7').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade7').value}`);
        yPosition += 10;
    }

    if (
        document.getElementById('nome8').value.trim() !== '' ||
        document.getElementById('sobrenome8').value.trim() !== '' ||
        document.getElementById('funcao8').value.trim() !== '' ||
        document.getElementById('celular8').value.trim() !== '' ||
        document.getElementById('fixo8').value.trim() !== '' ||
        document.getElementById('email8').value.trim() !== '' ||
        document.getElementById('particaoUsuario8').value.trim() !== '' ||
        document.getElementById('propriedade8').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome8').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome8').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao8').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular8').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo8').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email8').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario8').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade8').value}`);
        yPosition += 10;
    }

    if (
        document.getElementById('nome9').value.trim() !== '' ||
        document.getElementById('sobrenome9').value.trim() !== '' ||
        document.getElementById('funcao9').value.trim() !== '' ||
        document.getElementById('celular9').value.trim() !== '' ||
        document.getElementById('fixo9').value.trim() !== '' ||
        document.getElementById('email9').value.trim() !== '' ||
        document.getElementById('particaoUsuario9').value.trim() !== '' ||
        document.getElementById('propriedade9').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome9').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome9').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao9').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular9').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo9').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email9').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario9').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade9').value}`);
        yPosition += 10;
    }

    if (
        document.getElementById('nome10').value.trim() !== '' ||
        document.getElementById('sobrenome10').value.trim() !== '' ||
        document.getElementById('funcao10').value.trim() !== '' ||
        document.getElementById('celular10').value.trim() !== '' ||
        document.getElementById('fixo10').value.trim() !== '' ||
        document.getElementById('email10').value.trim() !== '' ||
        document.getElementById('particaoUsuario10').value.trim() !== '' ||
        document.getElementById('propriedade10').value.trim() !== ''
    ) {
        addContentToPage(`Nome: ${document.getElementById('nome10').value}`);
        addContentToPage(`Sobrenome: ${document.getElementById('sobrenome10').value}`);
        addContentToPage(`Função: ${document.getElementById('funcao10').value}`);
        addContentToPage(`Cel: ${document.getElementById('celular10').value}`);
        addContentToPage(`Fixo: ${document.getElementById('fixo10').value}`);
        addContentToPage(`E-mail: ${document.getElementById('email10').value}`);
        addContentToPage(`Partição: ${document.getElementById('particaoUsuario10').value}`);
        addContentToPage(`Propriedade: ${document.getElementById('propriedade10').value}`);
        yPosition += 10;
    }

    addContentToPage('Palavra chave da central: ' + document.getElementById('palavraChaveCentral').value);


    pdf.save(document.getElementById('nomeRazao').value + '.pdf');

}
