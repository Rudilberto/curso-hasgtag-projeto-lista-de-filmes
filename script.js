let nomeFilme = document.getElementById("nome");
let anoFilme = document.getElementById("ano");

// informacoes apresentadas no modal
const banner = document.getElementById("banner");
const sinopse = document.getElementById("sinopse");
const elenco = document.getElementById("elenco");
const genero = document.getElementById("genero");
const titulo = document.getElementById("titulo-filme");
// botao de pesquisa no filme
const search = document.getElementById("search");

// let listaFilmes = [];
// lista de filmes do local storage
let listaFilmes = JSON.parse(localStorage.getItem("movieList")) ?? [];
// o ?? faz com que se o valor for null ou undefined ele usara o valor da direita

let currentMovie = {};

// função que confere se o campo nome foi preenchido e trata o nome para um formato suportado em URLs
function validateName() {
  if (nomeFilme.value === "") {
    throw new Error('Digite o nome do filme no campo "Nome"');
  }
  return nomeFilme.value.split(" ").join("+");
}

// função que confere se o campo ano foi preenchido e se o ano é um numero válido
function validateYear() {
  if (anoFilme.value === "") {
    return "";
  } else if (Number(anoFilme.value) === NaN) {
    throw new Error("Digite o ano do filme corretamente!");
  } else if (anoFilme.value.length != 4) {
    throw new Error("Digite o ano do filme corretamente!");
  }
  return anoFilme.value;
}

// usa a API da omdb para buscar um object do filme selecionado e monta um modal com as informações do filme
async function searchMovie() {
  try {
    let link = `http://www.omdbapi.com/?apikey=${
      config.apiKey
    }&t=${validateName()}&y=${validateYear()}`;
    const response = await fetch(link);
    let data = await response.json();

    if (data.Error) {
      throw new Error("Filme não encontrado");
    }

    titulo.textContent = `${data.Title} - ${data.Year}`;
    banner.src = data.Poster;
    sinopse.textContent = data.Plot;
    elenco.textContent = data.Actors;
    genero.textContent = data.Genre;

    currentMovie = data;

    document.body.classList.toggle("modal-aberto");
  } catch (error) {
    notie.alert({ type: "error", text: error.message });
  }
}

search.addEventListener("click", () => {
  searchMovie();
});

const addMovieBtn = document.getElementById("add-to-list");

const movieListUl = document.getElementById("lista-filmes");

function addToList(movieObject) {
  listaFilmes.push(movieObject);
}

function updateListaFilmes(movieObject) {
  movieListUl.innerHTML += `<li id="${movieObject.imdbID}">
        <img
          src="${movieObject.Poster}"
          alt="Banner do filme ${movieObject.Title}"
        />
        <button id="btn-remover-filme" onclick="{removerFilme('${movieObject.imdbID}')}">
          <i class="bi bi-trash"></i> Remover
        </button>
      </li>`;
}

function confirmMovieIsOnList(id) {
  function idIsOnTheList(movieObject) {
    return movieObject.imdbID === id;
  }
  return Boolean(listaFilmes.find(idIsOnTheList));
}

function addCurrentMovie() {
  if (confirmMovieIsOnList(currentMovie.imdbID) === true) {
    notie.alert({ type: "error", text: "Filme já está na lista" });
  } else {
    addToList(currentMovie);
    updateListaFilmes(currentMovie);
    updateLocalStorage();
  }
}

addMovieBtn.addEventListener("click", function () {
  addCurrentMovie();
  document.body.classList.toggle("modal-aberto");
});

const removeMovieBtn = document.getElementById("btn-remover-filme");

function removerFilme(id) {
  listaFilmes = listaFilmes.filter((movie) => movie.imdbID !== id);
  document.getElementById(id).remove();
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("movieList", JSON.stringify(listaFilmes));
}

for (movie of listaFilmes) {
  updateListaFilmes(movie);
}
