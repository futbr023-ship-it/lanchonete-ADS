// ============================================================
// Prática 1 + 4: Cadastro com validação e redirecionamento
// ============================================================

const form = document.getElementById('form-cadastro');
const divMensagem = document.getElementById('mensagem');

// Cria e injeta um <p> dinamicamente (Requisito 4 da Prática 1)
function exibirMensagem(texto, tipo) {
    divMensagem.innerHTML = ''; // limpa mensagens anteriores
    const p = document.createElement('p');
    p.textContent = texto;
    p.className = tipo === 'erro' ? 'msg-erro' : 'msg-sucesso';
    divMensagem.appendChild(p);
}

form.addEventListener('submit', function (event) {
    // A regra de ouro: impede o recarregamento da página
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    // Requisito 2: senha com no mínimo 6 caracteres
    if (senha.length < 6) {
        exibirMensagem('A senha deve ter no mínimo 6 caracteres.', 'erro');
        document.getElementById('senha').focus();
        return;
    }

    // Requisito 3: senha e confirmar senha precisam ser idênticas
    if (senha !== confirmaSenha) {
        exibirMensagem('As senhas não coincidem. Tente novamente.', 'erro');
        document.getElementById('confirma-senha').focus();
        return;
    }

    // Sucesso
    const primeiroNome = nome.split(' ')[0] || 'cliente';
    exibirMensagem(`Cadastro realizado com sucesso, ${primeiroNome}! Entrando...`, 'sucesso');

    // Prática 4: redireciona para o cardápio após 1 segundo
    setTimeout(() => {
        window.location.href = 'cardapio.html';
    }, 1000);
});

// Ao digitar novamente, limpa a mensagem exibida
form.addEventListener('input', function () {
    divMensagem.innerHTML = '';
});