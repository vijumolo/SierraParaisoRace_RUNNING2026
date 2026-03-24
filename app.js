document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('categoryFilter');
    const genderFilter = document.getElementById('genderFilter');
    const cityFilter = document.getElementById('cityFilter');
    const searchFilter = document.getElementById('searchFilter');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsCount = document.getElementById('resultsCount');
    
    const diplomaModal = document.getElementById('diplomaModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const diplomaFrame = document.getElementById('diplomaFrame');
    const modalAthleteName = document.getElementById('modalAthleteName');

    // athletesData is now loaded globally from data.js
    renderResults(athletesData);

    // Event Listeners for filters
    categoryFilter.addEventListener('change', filterData);
    genderFilter.addEventListener('change', filterData);
    cityFilter.addEventListener('input', filterData);
    searchFilter.addEventListener('input', filterData);

    // Modal close events
    closeModalBtn.addEventListener('click', closeModal);
    diplomaModal.addEventListener('click', (e) => {
        if (e.target === diplomaModal) {
            closeModal();
        }
    });

    function filterData() {
        const catValue = categoryFilter.value;
        const genValue = genderFilter.value;
        const cityValue = cityFilter.value.toLowerCase().trim();
        const searchValue = searchFilter.value.toLowerCase().trim();

        const filtered = athletesData.filter(athlete => {
            const matchCategory = catValue === 'all' || athlete.categoria === catValue;
            const matchGender = genValue === 'all' || athlete.genero === genValue;
            const matchCity = athlete.ciudad.toLowerCase().includes(cityValue);
            const matchSearch = athlete.nombre.toLowerCase().includes(searchValue) || 
                              athlete.placa.toString().includes(searchValue);

            return matchCategory && matchGender && matchCity && matchSearch;
        });

        renderResults(filtered);
    }

    function renderResults(data) {
        resultsContainer.innerHTML = '';
        resultsCount.textContent = data.length;

        if (data.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron resultados para los filtros aplicados.</p>';
            return;
        }

        data.forEach(athlete => {
            const card = document.createElement('div');
            card.className = 'record-card';
            
            // Si el puesto es un número, agregar símbolo, si es DNS dejarlo igual
            const puestoLabel = isNaN(athlete.puesto) ? athlete.puesto : `#${athlete.puesto}`;
            
            card.innerHTML = `
                <div class="record-header">
                    <span class="puesto-badge">Puesto: ${puestoLabel}</span>
                    <span class="placa-badge">Placa: ${athlete.placa}</span>
                </div>
                <div class="record-body">
                    <h3>${athlete.nombre}</h3>
                    <p><strong>Ciudad:</strong> ${athlete.ciudad}</p>
                    <p><strong>Categoría:</strong> ${athlete.categoria} - ${athlete.genero}</p>
                    <p><strong>Tiempo Oficial:</strong> ${athlete.tiempoChip}</p>
                    ${athlete.velProm ? `<p><strong>Ritmo:</strong> ${athlete.ritmo}</p>` : ''}
                </div>
                <div class="record-footer">
                    <button class="btn-diploma" ${athlete.diplomaPage === null ? 'disabled' : ''} 
                        data-name="${athlete.nombre}" 
                        data-page="${athlete.diplomaPage !== null ? athlete.diplomaPage : ''}">
                        ${athlete.diplomaPage === null ? 'Sin Diploma' : 'Ver Diploma Virtual'}
                    </button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });

        // Add event listeners to the new buttons
        const diplomaBtns = document.querySelectorAll('.btn-diploma:not(:disabled)');
        diplomaBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                const pageNum = btn.getAttribute('data-page');
                openModal(name, pageNum);
            });
        });
    }

    function openModal(name, pageNum) {
        modalAthleteName.textContent = `Diploma - ${name}`;
        // Load the individual isolated PDF for this athlete
        diplomaFrame.src = `Diplomas_individual/diploma_${pageNum}.pdf`;
        diplomaModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling in background
    }

    function closeModal() {
        diplomaModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            diplomaFrame.src = ''; // Clear iframe to free memory when closed
        }, 300);
    }
});
