const container = document.querySelector('#contenedor');
const input = document.querySelector('#inputBuscar');
const btn = document.querySelector('#btnBuscar');
btn.addEventListener('click', () => {
  const termino = input.value.trim();
  if (termino === '') {
    container.innerHTML = `<div class="alert alert-warning mt-3">Por favor, ingresa un término de búsqueda.</div>`;
    return;
  }

  container.innerHTML = "<h4 class='text-center my-4 text-muted'>Buscando...</h4>";

  fetch(`https://images-api.nasa.gov/search?q=${termino}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = '';
      const items = data.collection.items;

      if (!items || items.length === 0) {
        container.innerHTML = `<div class="alert alert-info mt-3">No se encontraron resultados.</div>`;
        return;
      }

      const row = document.createElement('div');
      row.classList.add('row', 'justify-content-center');

      items.forEach(item => {
        const { title, description, date_created } = item.data[0];
        const imgUrl = item.links ? item.links[0].href : 'https://via.placeholder.com/400x300?text=Sin+imagen';

        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${imgUrl}" class="card-img-top" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text" style="
                max-height: 100px;
                overflow-y: auto;
                text-align: justify;
              ">
                ${description || 'Sin descripción disponible.'}
              </p>
              <p class="text-muted mb-0" style="font-size: 0.9em;">${date_created}</p>
            </div>
          </div>
        `;
        row.appendChild(col);
      });

      container.appendChild(row);
    })
    .catch(() => {
      container.innerHTML = `<div class="alert alert-danger mt-3">Ocurrió un error al obtener los datos.</div>`;
    });
});