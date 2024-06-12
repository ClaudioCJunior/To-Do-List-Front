<script setup>
  import { reactive, ref, toRefs } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const store = useStore()

  const form = reactive({
    email: "", 
    password: ""
  });

  // const email = ref("");
  // const password = ref("");

  const validate = reactive({
    invalidateEmail: false, 
    invalidatePass: false
  });

  function valid() {
    if(form.email === ""){
      validate.invalidateEmail = true;
    }else{
      validate.invalidateEmail = false;
    }

    if(form.password === ""){
      validate.invalidatePass = true;
    }else{
      validate.invalidatePass = false;
    }

    if(validate.invalidateEmail || validate.invalidatePass){
      return false;
    }

    return true;
  }

  async function login () {
    try{
      await store.dispatch('userStore/authenticate', form);

      //const user = store.state.userStore.user;

      //await store.dispatch('employeeStore/listAllByUser', user);
    }catch(e){
      console.error(e);
    }
    
    router.push({name: 'home'});
  }


  function submit() {
    if(!valid()){
      return;
    }

    login();
  }

</script>

<template>
  <div class="teste d-flex flex-wrap align-items-center justify-content-center">
    <div class="col-10 col-sm-8 col-md-6 col-lg-4">
      <div class="rounded shadow-lg p-3 mb-5 bg-body-tertiary">
        <form novalidate @submit.prevent="submit">
          <div class="mb-3" >
            <label for="email" class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" :class="{'is-invalid': validate.invalidateEmail}" id="email" placeholder="name@example.com" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input v-model="form.password" type="password" class="form-control" :class="{'is-invalid': validate.invalidatePass}" id="password" required>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Lembrar senha</label>
          </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
  .teste {
    height:100vh;
  }
</style>
