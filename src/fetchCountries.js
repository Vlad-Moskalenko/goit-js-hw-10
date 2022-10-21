export function fetchCountries(name, filterOptions) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=${[...filterOptions]}`)
    .then(res => res.json())
    .then(data => data)
}