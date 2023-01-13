export const fetchCountries = async countryName => {
  const countries = await fetch(
    `https://restcountries.com/v2/name/${countryName}?fields=name,capital,population,flags,languages`
  );
  if (!countries.ok) {
    throw Error(countries.statusText);
  } else {
    return await countries.json();
  }

};