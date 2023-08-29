const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-button');
const abilitiesList = document.getElementById('abilitiesList');

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type} pokemon-item" data-pokemon='${JSON.stringify(pokemon)}'>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}



function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
// Abrir modal
pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon-item');
    if (clickedPokemon) {
        const pokemonData = JSON.parse(clickedPokemon.getAttribute('data-pokemon'));
        populateModal(pokemonData);
        modal.style.display = 'block';
    }
});

// fechar o modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    abilitiesList.innerHTML = ''; // Limpa o modal
});

// Fecha o modal quando o usuário clica fora do modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        abilitiesList.innerHTML = ''; // Limpa o modal
    }
});

// Preencher o modal com as habilidades e os status do Pokémon
function populateModal(pokemon) {
    abilitiesList.innerHTML = pokemon.abilities.map(ability => `<li>${ability}</li>`).join('');
    abilitiesList.innerHTML += `<h2> Pokemon Status </h2>`
    abilitiesList.innerHTML += pokemon.stats.map(stat => `
    <table>
        <tr>
        <th>${stat.stat.name}</th>
        <th>${stat.base_stat}
        </tr>
    </table>`).join('');
}