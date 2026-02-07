<template>
  <nav class="navbar navbar-expand-lg custom-nav shadow-sm px-md-4">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex flex-column m-0" to="/">
        <span class="logo-line">LOGO</span>
        <span class="logo-line">MARCA</span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarTaller" 
        aria-controls="navbarTaller" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTaller">
        <ul class="navbar-nav mx-auto gap-lg-4 my-3 my-lg-0">
          <li class="nav-item">
            <router-link class="custom-link" to="/servicios">Servicios</router-link>
          </li>
          <li class="nav-item">
            <router-link class="custom-link" to="/nosotros">Nosotros</router-link>
          </li>
          <li class="nav-item">
            <router-link class="custom-link" to="/empresas">Empresas</router-link>
          </li>
        </ul>

        <div class="d-flex justify-content-center ms-lg-auto">
          <button class="btn btn-reserva fw-bold text-white">
            RESERVAR CITA
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-nav {
  background-color: #ffffff;
  min-height: 110px;
}

.logo-line {
  color: #003366;
  font-weight: 850;
  font-size: 1.6rem;
  line-height: 0.85;
  letter-spacing: -1px;
}

.custom-link {
  text-decoration: none;
  color: #003366 !important;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.2s;
}

.custom-link:hover {
  color: #52b155 !important;
}

.btn-reserva {
  background-color: #52b155;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.95rem;
  white-space: nowrap;
}

.btn-reserva:hover {
  background-color: #469c49;
}

@media (min-width: 992px) {
  .navbar-nav {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }
  .custom-link {
    display: block;
    padding: 10px 0;
  }
  .btn-reserva {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>