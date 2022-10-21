import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "notiflix/dist/notiflix-3.2.5.min.css"

const DEBOUNCE_DELAY = 300;
const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info')

const filterOptions = ["name","capital","population","flags","languages"]

searchInputEl.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY))

function onSearchInput(e) {
  const countryName = e.target.value.trim()

  if (!countryName) {
    removeCountryInfo()
    return;
  }

  fetchCountries(countryName, filterOptions)
    .then(resp => {
      if (resp.status === 404) countryNotFoundHandler()
      else { countriesArrHandler(resp) }
    })
    .catch(err => console.log(err.name))
}

function countriesArrHandler(countriesArray) {
  if (countriesArray.length > 10) Notify.info("Too many matches found. Please enter a more specific name.")

  if (countriesArray.length >= 2 && countriesArray.length <= 10) countryListEl.innerHTML = makeCountryListItem(countriesArray)

  if (countriesArray.length === 1) countryInfoEl.innerHTML = makeCountryInfo(countriesArray)
}

function makeCountryListItem(countriesItems) {
  removeCountryInfo()

  return countriesItems.map(({flags, name}) => `<li class="country-item"><img src="${flags.svg}" width="30" alt="country flag"><span>${name.official}</span></li>`)
    .join("")
}

function makeCountryInfo(country) {
  removeCountryInfo()

  const { name, capital, population, languages } = country[0];

  return `<img src="${country[0].flags.svg}" width="30" alt="country flag">
  <span>${name.official}</span><p><b>Capital:</b> ${capital}</p><p><b>Population:</b> ${population}</p><p><b>Language:</b>${Object.values(languages)}</p>`
}

function countryNotFoundHandler() {
  removeCountryInfo()
  Notify.failure("Oops, there is no country with that name")
}

function removeCountryInfo() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}