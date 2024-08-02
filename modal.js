const body = document.getElementsByTagName("body");
// formulario de busca dos filmes
const form = document.getElementById("form-search");
// botao fechar do modal
const X = document.getElementsByClassName("X")[0];

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

X.addEventListener("click", function () {
  document.body.classList.toggle("modal-aberto");
});
