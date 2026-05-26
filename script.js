const modalCadastro = document.getElementById("cadastroModal");
const modalLogin = document.getElementById("loginModal");
const modalPublicar = document.getElementById("publicarModal");
const modalEditarPerfil = document.getElementById("editarPerfilModal");

const btnCadastrar = document.getElementById("btnCadastrar");
const btnEntrar = document.getElementById("btnEntrar");
const btnPublicar = document.getElementById("btnPublicar");
const btnSair = document.getElementById("btnSair");
const btnEditarPerfil = document.getElementById("btnEditarPerfil");

const spanCloseCadastro = document.querySelector("#cadastroModal .close");
const spanCloseLogin = document.querySelector("#loginModal .close");
const spanClosePublicar = document.querySelector("#publicarModal .close");
const spanCloseEditarPerfil = document.querySelector(
  "#editarPerfilModal .close",
);

const menuDeslogado = document.getElementById("menuDeslogado");
const menuLogado = document.getElementById("menuLogado");
const nomeEmpresaDisplay = document.getElementById("nomeEmpresaDisplay");

let empresaLogadaAtual = null;

btnCadastrar.onclick = function (event) {
  event.preventDefault();
  modalCadastro.style.display = "block";
};

btnEntrar.onclick = function (event) {
  event.preventDefault();
  modalLogin.style.display = "block";
};

btnPublicar.onclick = function (event) {
  event.preventDefault();
  if (!empresaLogadaAtual) {
    alert("Você precisa fazer login (Entrar) antes de publicar uma vaga.");
    modalLogin.style.display = "block";
  } else {
    modalPublicar.style.display = "block";
  }
};

btnEditarPerfil.onclick = function (event) {
  event.preventDefault();
  if (empresaLogadaAtual) {
    // Preenche o formulário com os dados atuais da empresa logada
    document.getElementById("editNome").value = empresaLogadaAtual.nome;
    document.getElementById("editCnpj").value = empresaLogadaAtual.cnpj;
    document.getElementById("editCep").value = empresaLogadaAtual.cep;
    document.getElementById("editEndereco").value = empresaLogadaAtual.endereco;
    document.getElementById("editBairro").value = empresaLogadaAtual.bairro;
    document.getElementById("editNumero").value = empresaLogadaAtual.numero;
    document.getElementById("editWhatsapp").value = empresaLogadaAtual.whatsapp;
    document.getElementById("editSenha").value = empresaLogadaAtual.senha;
    modalEditarPerfil.style.display = "block";
  }
};

btnSair.onclick = function (event) {
  event.preventDefault();
  empresaLogadaAtual = null;
  menuDeslogado.style.display = "flex";
  menuLogado.style.display = "none";
  alert("Você saiu da sua conta.");
};

spanCloseCadastro.onclick = function () {
  modalCadastro.style.display = "none";
};

spanCloseLogin.onclick = function () {
  modalLogin.style.display = "none";
};

spanClosePublicar.onclick = function () {
  modalPublicar.style.display = "none";
};

spanCloseEditarPerfil.onclick = function () {
  modalEditarPerfil.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modalCadastro) {
    modalCadastro.style.display = "none";
  }
  if (event.target == modalLogin) {
    modalLogin.style.display = "none";
  }
  if (event.target == modalPublicar) {
    modalPublicar.style.display = "none";
  }
  if (event.target == modalEditarPerfil) {
    modalEditarPerfil.style.display = "none";
  }
};

// Lógica de Cadastro
const formCadastro = document.getElementById("formCadastro");
formCadastro.onsubmit = function (event) {
  event.preventDefault(); // Evita recarregar a página

  const nome = document.getElementById("nome").value;
  const cnpj = document.getElementById("cnpj").value;
  const cep = document.getElementById("cep").value;
  const endereco = document.getElementById("endereco").value;
  const bairro = document.getElementById("bairro").value;
  const numero = document.getElementById("numero").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const senha = document.getElementById("senha").value;

  // Recupera a lista de empresas ou cria uma vazia
  let empresas = JSON.parse(localStorage.getItem("empresas")) || [];

  // Verifica se a empresa já existe pelo nome
  const existe = empresas.find((emp) => emp.nome === nome);
  if (existe) {
    alert("Uma empresa com este nome já está cadastrada!");
    return;
  }

  // Salva a nova empresa no localStorage do navegador
  empresas.push({
    nome,
    cnpj,
    cep,
    endereco,
    bairro,
    numero,
    whatsapp,
    senha,
  });
  localStorage.setItem("empresas", JSON.stringify(empresas));

  alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
  formCadastro.reset();
  modalCadastro.style.display = "none";
};

// Lógica de Login
const formLogin = document.getElementById("formLogin");
formLogin.onsubmit = function (event) {
  event.preventDefault();

  const nomeLogin = document.getElementById("nomeLogin").value;
  const senhaLogin = document.getElementById("senhaLogin").value;

  let empresas = JSON.parse(localStorage.getItem("empresas")) || [];

  // Procura a empresa com o nome e senha exatos
  const empresaLogada = empresas.find(
    (emp) => emp.nome === nomeLogin && emp.senha === senhaLogin,
  );

  if (empresaLogada) {
    alert("Login realizado com sucesso! Bem-vindo(a), " + empresaLogada.nome);
    formLogin.reset();
    modalLogin.style.display = "none";

    empresaLogadaAtual = empresaLogada;
    menuDeslogado.style.display = "none";
    menuLogado.style.display = "flex";
    nomeEmpresaDisplay.innerText = "Olá, " + empresaLogada.nome;
  } else {
    alert("Nome da empresa ou senha incorretos.");
  }
};

// Lógica de Editar Perfil
const formEditarPerfil = document.getElementById("formEditarPerfil");
formEditarPerfil.onsubmit = function (event) {
  event.preventDefault();

  const nomeNovo = document.getElementById("editNome").value;
  const cnpjNovo = document.getElementById("editCnpj").value;
  const cepNovo = document.getElementById("editCep").value;
  const enderecoNovo = document.getElementById("editEndereco").value;
  const bairroNovo = document.getElementById("editBairro").value;
  const numeroNovo = document.getElementById("editNumero").value;
  const whatsappNovo = document.getElementById("editWhatsapp").value;
  const senhaNova = document.getElementById("editSenha").value;

  let empresas = JSON.parse(localStorage.getItem("empresas")) || [];
  const oldNome = empresaLogadaAtual.nome;

  // Verifica se o novo nome já está sendo usado por outra empresa
  if (nomeNovo !== oldNome) {
    const existe = empresas.find((emp) => emp.nome === nomeNovo);
    if (existe) {
      alert("Uma empresa com este nome já está cadastrada!");
      return;
    }
  }

  // Atualiza os dados na lista de empresas
  const index = empresas.findIndex((emp) => emp.nome === oldNome);
  if (index !== -1) {
    empresas[index] = {
      nome: nomeNovo,
      cnpj: cnpjNovo,
      cep: cepNovo,
      endereco: enderecoNovo,
      bairro: bairroNovo,
      numero: numeroNovo,
      whatsapp: whatsappNovo,
      senha: senhaNova,
    };
    localStorage.setItem("empresas", JSON.stringify(empresas));

    empresaLogadaAtual = empresas[index];
    nomeEmpresaDisplay.innerText = "Olá, " + empresaLogadaAtual.nome;
    alert("Perfil atualizado com sucesso!");
    modalEditarPerfil.style.display = "none";
  }
};

// Lógica de Publicar Nova Vaga
const formPublicar = document.getElementById("formPublicar");
formPublicar.onsubmit = function (event) {
  event.preventDefault();

  const titulo = document.getElementById("tituloVaga").value;
  const desc = document.getElementById("descVaga").value;
  const valor = document.getElementById("valorVaga").value;
  const horario = document.getElementById("horarioVaga").value;

  // Cria um objeto com os dados da nova vaga
  const novaVaga = {
    empresa: empresaLogadaAtual.nome,
    titulo: titulo,
    desc: desc,
    endereco: empresaLogadaAtual.endereco,
    bairro: empresaLogadaAtual.bairro,
    horario: horario,
    valor: valor,
    whatsapp: empresaLogadaAtual.whatsapp,
  };

  // Puxa as vagas salvas, adiciona a nova e salva novamente no navegador
  let vagas = JSON.parse(localStorage.getItem("vagas")) || [];
  vagas.push(novaVaga);
  localStorage.setItem("vagas", JSON.stringify(vagas));

  // Desenha a vaga na tela
  adicionarCardVaga(novaVaga);

  alert("Sua vaga foi publicada com sucesso!");
  formPublicar.reset();
  modalPublicar.style.display = "none";
};

// Função que cria o visual da vaga (Card)
function adicionarCardVaga(vaga) {
  // Remove parênteses, traços e espaços do número salvo para usar na API do WhatsApp
  const numeroLimpo = vaga.whatsapp ? vaga.whatsapp.replace(/\D/g, "") : "";
  const textoMsg = encodeURIComponent(
    `Olá! Vi a vaga de ${vaga.titulo} na FreelaMatch. Ainda está disponível?`,
  );
  const linkWhats = `https://wa.me/55${numeroLimpo}?text=${textoMsg}`;

  const novoCard = document.createElement("div");
  novoCard.className = "job-card";
  novoCard.innerHTML = `
    <div class="company-header">
      <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(vaga.empresa)}&background=random" alt="${vaga.empresa}" />
      <div>
        <h3>${vaga.titulo}</h3>
        <div class="company-name">${vaga.empresa}</div>
      </div>
    </div>
    <p style="margin-bottom: 1rem; font-size: 0.95rem">${vaga.desc}</p>
    <div class="job-detail">
      <strong>📍 Local:</strong> ${vaga.endereco}, ${vaga.bairro}
    </div>
    <div class="job-detail">
      <strong>⏰ Horário:</strong> ${vaga.horario}
    </div>
    <div class="rate" style="margin-top: 1rem">R$ ${vaga.valor}</div>
    <button class="btn" style="width: 100%" onclick="window.open('${linkWhats}', '_blank')">Me Candidatar</button>
  `;

  // Adiciona a nova vaga no início da lista (prepend)
  document.querySelector(".jobs-grid").prepend(novoCard);
}

// Carregar vagas salvas assim que a página abrir
window.addEventListener("load", () => {
  let vagas = JSON.parse(localStorage.getItem("vagas")) || [];
  // Percorre todas as vagas salvas e desenha cada uma
  vagas.forEach((vaga) => adicionarCardVaga(vaga));
});

// Lógica de Busca por Cidade
const inputBusca = document.getElementById("inputBusca");
const btnBuscar = document.getElementById("btnBuscar");
const sugestoesContainer = document.getElementById("sugestoesContainer");

let cidadesBrasil = [];
let focoSugestaoAtual = -1;

// Carrega a lista de cidades do Brasil usando a API gratuita do IBGE
async function carregarCidadesIBGE() {
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios",
    );
    const cidades = await response.json();

    cidadesBrasil = cidades.map(
      (cidade) =>
        `${cidade.nome} - ${cidade.microrregiao.mesorregiao.UF.sigla}`,
    );
  } catch (error) {
    console.error("Erro ao carregar as cidades do IBGE:", error);
  }
}

// Executa a função
carregarCidadesIBGE();

// Mostra sugestões de acordo com o que é digitado
inputBusca.addEventListener("input", function () {
  const termoOriginal = this.value.trim();
  // Normaliza tirando acentos para facilitar a busca (ex: "sao" acha "São")
  const valorNormalizado = termoOriginal
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  sugestoesContainer.innerHTML = "";
  focoSugestaoAtual = -1;

  if (!valorNormalizado) {
    sugestoesContainer.style.display = "none";
    return;
  }

  // Filtra e organiza para que as cidades que COMEÇAM com as letras apareçam primeiro
  const filtradas = cidadesBrasil
    .filter((cidade) =>
      cidade
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(valorNormalizado),
    )
    .sort((a, b) => {
      const aNorm = a
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      const bNorm = b
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const aStarts = aNorm.startsWith(valorNormalizado);
      const bStarts = bNorm.startsWith(valorNormalizado);

      if (aStarts && !bStarts) return -1; // Coloca quem "começa com" no topo
      if (!aStarts && bStarts) return 1;
      return aNorm.localeCompare(bNorm); // Desempata colocando em ordem alfabética
    })
    .slice(0, 10);

  if (filtradas.length > 0) {
    sugestoesContainer.style.display = "block";
    filtradas.forEach((cidade) => {
      const div = document.createElement("div");
      div.className = "sugestao-item";

      const [nomeCidade, uf] = cidade.split(" - ");

      // Destaca a parte digitada (tentando manter o texto igual digitado)
      let nomeDestacado = nomeCidade;
      if (termoOriginal) {
        const regex = new RegExp(`(${termoOriginal})`, "gi");
        nomeDestacado = nomeCidade.replace(regex, "<strong>$1</strong>");
      }

      div.innerHTML = `
        <div class="sugestoes-icon">
          <svg focusable="false" viewBox="0 0 24 24" width="20" height="20" fill="#70757a"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
        </div>
        <div class="sugestoes-text">
          <span class="sugestoes-text-main">${nomeDestacado}</span>
          <span class="sugestoes-text-secondary">${uf} &bull; Brasil</span>
        </div>
      `;

      div.onclick = function () {
        inputBusca.value = nomeCidade + " - " + uf;
        sugestoesContainer.style.display = "none";
        filtrarCards(nomeCidade.toLowerCase().trim());
      };
      sugestoesContainer.appendChild(div);
    });
  } else {
    sugestoesContainer.style.display = "none";
  }
});

// Permite navegar pelas opções usando as setas do teclado e o Enter
inputBusca.addEventListener("keydown", function (e) {
  const itens = sugestoesContainer.querySelectorAll(".sugestao-item");

  if (e.key === "ArrowDown" && sugestoesContainer.style.display === "block") {
    e.preventDefault();
    focoSugestaoAtual++;
    if (focoSugestaoAtual >= itens.length) focoSugestaoAtual = 0;
    destacarItem(itens);
  } else if (
    e.key === "ArrowUp" &&
    sugestoesContainer.style.display === "block"
  ) {
    e.preventDefault();
    focoSugestaoAtual--;
    if (focoSugestaoAtual < 0) focoSugestaoAtual = itens.length - 1;
    destacarItem(itens);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (
      sugestoesContainer.style.display === "block" &&
      focoSugestaoAtual > -1 &&
      itens[focoSugestaoAtual]
    ) {
      itens[focoSugestaoAtual].click(); // Escolhe a opção destacada pelo teclado
    } else {
      filtrarCards(inputBusca.value.split("-")[0].toLowerCase().trim());
      sugestoesContainer.style.display = "none";
    }
  }
});

function destacarItem(itens) {
  itens.forEach((item) => (item.style.backgroundColor = "white"));
  if (focoSugestaoAtual > -1) {
    itens[focoSugestaoAtual].style.backgroundColor = "#f1f3f4";
    itens[focoSugestaoAtual].scrollIntoView({ block: "nearest" });
  }
}

// Esconde as sugestões se o usuário clicar fora da caixa
document.addEventListener("click", function (e) {
  if (e.target !== inputBusca && !sugestoesContainer.contains(e.target)) {
    sugestoesContainer.style.display = "none";
  }
});

function filtrarCards(termoBuscado) {
  const termoNormalizado = termoBuscado
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card) => {
    // Pega todo o texto do card (que inclui a cidade) e deixa em minúsculo para comparar
    const textoCard = card.innerText
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (textoCard.includes(termoNormalizado)) {
      card.style.display = "block"; // Mostra o card se encontrou o termo
    } else {
      card.style.display = "none"; // Esconde se não encontrou
    }
  });
}

// Se o usuário clicar em buscar ou apertar Enter manualmente
btnBuscar.addEventListener("click", () =>
  filtrarCards(inputBusca.value.split("-")[0].toLowerCase().trim()),
);
