document.getElementById('btnSearch').addEventListener('click', fetchSearchResults);
document.getElementById('clrSearch').addEventListener('click', clearSearchResults);
function fetchSearchResults() {
  const query = document.getElementById('conditionInput').value.toLowerCase();
  const searchResults = document.getElementById('search-res');
    console.log(searchResults)
  searchResults.innerHTML = '';

  fetch('travel_recommendation_api.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
        // console.log(data);
      const createSearchComponent = (id, name, imageUrl, description) => {
        return `
          <div class='column res-component'>
            <div class=''>
              <img class='img-show' src='${imageUrl}' alt='${name}'>
            </div>
            <div class="search-details">
              <div class='search-title'>${name}</div>
              <div class='details'>${description}</div>
            </div>
            <div class="d-flex align-items-start justify-content-start ml-3">
              <button class='btn' onclick="bookLocation(${id})">Visit</button>
            </div>
          </div>
        `;
      };

      const searchInCategory = (category) => {
        category.forEach(item => {
            if (category == data.countries) {
                cities_check = []
                item.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        cities_check.push({id: item.id, city: city})
                    }
                });
                console.log("cities", cities_check)
                if (cities_check){
                    cities_check.forEach(city => {
                        console.log(city)
                        searchResults.innerHTML += createSearchComponent(city.id, city.city.name, city.city.imageUrl, city.city.description);
                    });
                }
            }
            else if (category == data.temples) {
                if (item.name.toLowerCase().includes(query)) {
                    searchResults.innerHTML += createSearchComponent(item.id, item.name, item.imageUrl, item.description);
                }
            }
            else if (category == data.beaches) {
                if (item.name.toLowerCase().includes(query)) {
                    searchResults.innerHTML += createSearchComponent(item.id, item.name, item.imageUrl, item.description);
                }
            }
        });
        };

      searchInCategory(data.countries);
      searchInCategory(data.temples);
      searchInCategory(data.beaches);

      if (searchResults.innerHTML === '') {
        searchResults.innerHTML = '<div class="column res-component d-flex align-items-center justify-content-center" style={font-weight:bold}>No results found.</div>';
      }
    })
    .catch(error => {
      console.error('Error fetching the JSON data:', error);
      searchResults.innerHTML = '<div class="error">Error fetching search results. Please try again later.</div>';
    });
}

function clearSearchResults() {
    document.getElementById('search-res').innerHTML = '';
    document.getElementById('conditionInput').value = '';
}


function bookLocation(id) {
  window.location.href = `booking.html?id=${id}`;
}
