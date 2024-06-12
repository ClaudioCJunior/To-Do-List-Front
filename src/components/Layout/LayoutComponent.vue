<script setup>
import { reactive, ref, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

onMounted(() => {
  //console.log('Rota Atual:', router.currentRoute.value.name);
  redirectRoute(router.currentRoute.value.name);
});

const sidebar = reactive({
    inicio: {
      name: "Inicio",
      list: {
        inicio: {
          active: true,
          name: "Início",
          icon: "fa-solid fa-house-chimney-medical",
          route: { name: 'home', params: {}}
        },
        agendamentos: {
          active: false,
          name: "Agendamentos",
          icon: "fa-regular fa-calendar-days",
          route: { name: 'schedules', params: {}}
        },
        consultas: {
          active: false,
          name: "Consultas",
          icon: "fa-solid fa-clipboard-question",
          route: { name: 'queries', params: {}}
        },
        notificacoes: {
          active: false,
          name: "Notificações",
          icon: "fa-solid fa-comment",
          route: { name: 'notifications', params: {}}
        },
      }
    }, 
    configuracoes: {
      name: "Configurações",
      list: {
        perfil: {
          active: false,
          name: "Perfil",
          icon: "fa-solid fa-user-pen",
          route: { name: 'profile', params: {}}
        },
        clinica: {
          active: false,
          name: "Clínica",
          icon: "fa-regular fa-calendar-days",
          route: { name: 'clinic', params: {}}
        },
        clientes: {
          active: false,
          name: "Clientes",
          icon: "fa-solid fa-house-medical-flag",
          route: { name: 'clients', params: {}}
        },
        procedimentos: {
          active: false,
          name: "Procedimentos",
          icon: "fa-solid fa-users",
          route: { name: 'procedures', params: {}}
        },
      }
    }, 
    outrasOpcoes: {
      name: "Outras Opções",
      list: {
        sair: {
          active: false,
          name: "Sair",
          icon: "fa-solid fa-right-from-bracket",
          route: { name: 'sair', params: {}}
        },
      }
    }, 
  });



async function logout() {
  try {
    await store.dispatch('userStore/logout');
  } catch (e) {
    console.error(e);
  }

  router.push({ name: 'login' });
}

function redirectRoute(nameRoute) {
  let route = "";

  for (let key in sidebar) {
    if (typeof sidebar[key] === 'object' && sidebar[key] !== null) {
      for (let item in sidebar[key].list) {
        if (typeof sidebar[key].list[item] === 'object' && sidebar[key].list[item] !== null) {
          if(sidebar[key].list[item].route.name === nameRoute){
            sidebar[key].list[item].active = true;
            route = sidebar[key].list[item].route;
          }else{
            sidebar[key].list[item].active = false;
          }
        }
      }
    }
  }

  router.push(route);
}
</script>

<template>
  <!-- Navbar Light -->
  <nav class="navbar navbar-expand-lg navbar-light bg-white z-index-3 py-3">
    <div class="container">
      <a class="navbar-brand" href="#"> To-do List</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <vue-feather type="user" size="15"></vue-feather>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li><a class="dropdown-item" href="#">Configurações</a></li>
              <li><a class="dropdown-item" href="#" @click="logout">Sair</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->

  <div class="container-fluid mt-2">
    <div class="row">
      <main class="col-10 col-sm-12">
        <router-view></router-view>
      </main>
    </div>
  </div>
 </template>

<style scoped>.nav-link>.active {
  background-color: green !important;
}

.nav-item>a:hover {
  color: green;
}

/*code to change background color*/
.navbar-nav>.active>a {
  background-color: #C0C0C0;
  color: green;
}

.esconder-mobile {
    display: none;
}

@media (min-width: 768px) { 
  .esconder-mobile {
    display: block;
  }

}

</style>