const aniversariantes = document.querySelectorAll(".pessoa");

const now = new Date().toLocaleString("pt-br", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
});

const hoje = now.split("/").splice(0, 2).join("/");

aniversariantes.forEach((el) => {
    const nome = el.querySelector(".nome").textContent;
    const dataAniversario = el.querySelector(".dataAniversario").textContent;
    const dia = dataAniversario.split("/")[0].trim();
    const mes = dataAniversario.split("/")[1].trim();
    const ano = dataAniversario.split("/")[2].trim();

    let diasFaltando;

    const dataDoAniver = `${dia}/${mes}`;

    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth();
    const diaAtual = new Date().getDate();

    diasFaltando = Math.floor(
        Math.floor(new Date() - new Date(`${anoAtual}-${mes}-${dia}`)) /
            (1000 * 60 * 60 * 24)
    );

    let idade = anoAtual - ano;

    if (diasFaltando < 0) {
        diasFaltando = Math.abs(diasFaltando);
        idade = anoAtual - ano - 1;
    } else if (diasFaltando > 0) {
        diasFaltando = Math.abs(
            Math.round(
                Math.floor(
                    new Date() - new Date(`${anoAtual + 1}-${mes}-${dia}`)
                ) /
                    (1000 * 60 * 60 * 24)
            )
        );
    }

    el.querySelector(".nome").title = `${
        idade > 1 ? `${idade} anos` : `${idade} ano`
    }`;

    el.querySelector(".dataAniversario").title = `${
        diasFaltando > 1
            ? `${diasFaltando} dias para o aniversário.`
            : `${diasFaltando} dia para o aniversário.`
    }`;

    if (dataDoAniver == hoje) {
        const html = `<p><span class="nomeAniversariando">${nome}</span> está fazendo ${
            idade > 1 ? `${idade} anos` : `${idade} ano`
        } hoje!</p>`;
        document
            .querySelector(".aniversariandoHoje")
            .insertAdjacentHTML("beforeend", html);
        el.classList.add("aniversariando");
    }
});

if (document.querySelector(".aniversariandoHoje").children.length > 0) {
    document.querySelector(".aniversariandoHoje").classList.remove("hidden");
}

const procurarNomes = document.querySelector("#procurarNomes");
procurarNomes.addEventListener("input", () => {
    const valor = procurarNomes.value.toLowerCase().trim();

    aniversariantes.forEach((el) => {
        const nome = el.querySelector(".nome").textContent.toLowerCase();
        const data = el.querySelector(".dataAniversario").textContent.trim();
        if (nome.includes(valor) || data.includes(valor)) {
            el.classList.remove("hidden");
        } else {
            el.classList.add("hidden");
        }
    });
});
