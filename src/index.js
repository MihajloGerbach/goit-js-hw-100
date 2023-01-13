import './css/styles.css';
import { fetchCountries } from './api';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  inputUser: document.querySelector('#search-box'),
  listField: document.querySelector('.country-list'),
  infoField: document.querySelector('.country-info'),
};

refs.inputUser.addEventListener(
  'input',
  debounce(onInputUser, DEBOUNCE_DELAY, { trailing: true })
);

async function onInputUser(e) {
  const userSearch = e.target.value.trim();
  if (!userSearch) {
    clearInput();
    return;
  }
  try {
    const countries = await fetchCountries(userSearch);
    getResponsiv(countries);
    // .then(getResponsiv)
    // .catch(getError);
  } catch (error) {
    getError(error);
  }
}

function getError(error) {
  Notify.failure('Oops, there is no country with that name');
}

function getResponsiv(countries) {
  showInfoManyCountry(countries);

  if (countries.length < 10 && countries.length >= 2) {
    clearInput();
    const template = createListCountrie(countries);
    markupListField(template);
  }
  if (countries.length === 1) {
    clearInput();
    const templateInfoCountry = createInfoOneCountry(countries);
    markupInfoField(templateInfoCountry);
    document.addEventListener('keydown', e => {
      if (e.code === 'Backspace') {
        return clearInput();
      }
    });
  }
}

function createListCountrie(country) {
  return country
    .map(({ flags: { svg }, name }) => {
      return `<li class='list-name'>
        <img src="${svg}" alt="" width="30" />
        <span>${name}</span>
        </li>`;
    })
    .join('');
}

function createInfoOneCountry(country) {
  return country
    .map(({ flags: { svg }, name, capital, population, languages }) => {
      return `<img src="${svg}" alt="${name}" width="30" />
           <p class='title'>${name}</p>
           <p class='title-capital'>Capital: <span class='span-capital'>${capital}</span></p>
           <p class='title-capital'>Population: <span class='span-capital'>${population}</span></p>
           <p class='title-capital'>languages: <span class='span-capital'>${languages.map(
             ({ name }) => {
               return name;
             }
           )}</span>
           
           </p>`;
    })
    .join('');
}

function clearInput() {
  refs.infoField.innerHTML = '';
  refs.listField.innerHTML = '';
}

function markupInfoField(templateInfoCountry) {
  refs.infoField.insertAdjacentHTML('beforeend', templateInfoCountry);
}

function markupListField(template) {
  refs.listField.insertAdjacentHTML('beforeend', template);
}
function showInfoManyCountry(countries) {
  if (countries.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}


