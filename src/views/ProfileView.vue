<script setup>
  import { reactive, ref, toRefs, computed} from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const store = useStore()

  const formPerson = reactive({
    firstName: "",
    lastName: "",
    surName: "",
    cpf: "",
    ddd: "",
    phone: "",
    birthDate: "",
  });

  function formataCPF(cpf){
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
    
    //realizar a formatação...
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  
  const cpfFormated = computed({
    // getter
    get() {
      const result = formataCPF(formPerson.cpf);

      return result;
    },
    // setter
    set(newValue) {
      newValue = newValue.replace(/[^0-9]/g,'');

      formPerson.cpf = newValue;
    }
  })

  const phoneFormated = computed({
    // getter
    get() {
      return formPerson.phone;
    },
    // setter
    set(newValue) {
      newValue = newValue.replace(/[^0-9]/g,'');

      formPerson.phone = newValue;
    }
  })

</script>

<template>
  <div>
    <div class="container-fluid">
      <form>
        <div class="float-start mt-3 col-12">
          <div class="nav-item">
            <h6 class="esconder-mobile text-uppercase text-xs font-weight-bolder opacity-6">Dados do Pessoais</h6>
          </div>
          <div class="form-group">
              <label for="example-text-input" class="form-control-label">Nome</label>
              <input v-model="formPerson.firstName" class="form-control" type="text" >
          </div>
          <div class="form-group">
              <label for="example-search-input" class="form-control-label">Sobrenome</label>
              <input v-model="formPerson.lastName" class="form-control" type="search" >
          </div>
          <div class="form-group">
              <label for="example-email-input" class="form-control-label">Apelido</label>
              <input v-model="formPerson.surName" class="form-control" type="text" >
          </div>
          <div class="form-group">
              <label for="example-url-input" class="form-control-label">CPF</label>
              <input v-model="cpfFormated" class="form-control" type="text" placeholder="999.999.999-99" v-mask="'###.###.###-##'">
          </div>
          <div class="form-group">
              <label for="example-password-input" class="form-control-label">DDD</label>
              <input v-model="formPerson.lastName" class="form-control" type="text" placeholder="999" v-mask="'###'">
          </div>
          <div class="form-group">
              <label for="example-tel-input" class="form-control-label">Telefone</label>
              <input v-model="phoneFormated" class="form-control" type="tel" placeholder="99999-9999" v-mask="'#####-####'">
          </div>
          <div class="form-group">
              <label for="example-password-input" class="form-control-label">Data Nascimento</label>
              <input v-model="formPerson.lastName" class="form-control" type="tel" placeholder="01/01/2001" v-mask="'##/##/####'">
          </div>
        </div>
        <button type="submit" class="btn bg-gradient-success float-end">Alterar</button>
      </form>
      <form>
        <div class="float-start mt-3 col-12">
          <div class="nav-item">
            <h6 class="esconder-mobile text-uppercase text-xs font-weight-bolder opacity-6">Dados de autenticação</h6>
          </div>
          <div class="form-group">
              <label for="example-text-input" class="form-control-label">Email</label>
              <input class="form-control" type="email" placeholder="email@example.com">
          </div>
          <div class="form-group">
              <label for="example-text-input" class="form-control-label">Senha Atual</label>
              <input class="form-control" type="text" >
          </div>
          <div class="form-group">
              <label for="example-text-input" class="form-control-label">Nova Senha</label>
              <input class="form-control" type="text" >
          </div>
          <button type="submit" class="btn bg-gradient-success float-end">Alterar</button>
        </div>
      </form> 
    
    </div>
  </div>
</template>


<style>
  .teste {
    height:100vh;
  }
</style>
