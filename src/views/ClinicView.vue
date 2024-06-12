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
  <div>
    <div class="container-fluid">
      <form>
        <div class="form-group">
            <label for="example-text-input" class="form-control-label">Text</label>
            <input class="form-control" type="text" value="John Snow" id="example-text-input">
        </div>
        <div class="form-group">
            <label for="example-search-input" class="form-control-label">Search</label>
            <input class="form-control" type="search" value="Tell me your secret ..." id="example-search-input">
        </div>
        <div class="form-group">
            <label for="example-email-input" class="form-control-label">Email</label>
            <input class="form-control" type="email" value="@example.com" id="example-email-input">
        </div>
        <div class="form-group">
            <label for="example-url-input" class="form-control-label">URL</label>
            <input class="form-control" type="url" value="" id="example-url-input">
        </div>
        <div class="form-group">
            <label for="example-tel-input" class="form-control-label">Phone</label>
            <input class="form-control" type="tel" value="40-(770)-888-444" id="example-tel-input">
        </div>
        <div class="form-group">
            <label for="example-password-input" class="form-control-label">Password</label>
            <input class="form-control" type="password" value="password" id="example-password-input">
        </div>
        <div class="form-group">
            <label for="example-number-input" class="form-control-label">Number</label>
            <input class="form-control" type="number" value="23" id="example-number-input">
        </div>
        <div class="form-group">
            <label for="example-datetime-local-input" class="form-control-label">Datetime</label>
            <input class="form-control" type="tel" value="2018-11-23T10:30:00" id="example-datetime-local-input" v-mask="'##/##/####'">
        </div>
        <div class="form-group">
            <label for="example-date-input" class="form-control-label">Date</label>
            <input class="form-control" type="date" value="2018-11-23" id="example-date-input">
        </div>
        <div class="form-group">
            <label for="example-month-input" class="form-control-label">Month</label>
            <input class="form-control" type="month" value="2018-11" id="example-month-input">
        </div>
        <div class="form-group">
            <label for="example-week-input" class="form-control-label">Week</label>
            <input class="form-control" type="week" value="2018-W23" id="example-week-input">
        </div>
        <div class="form-group">
            <label for="example-time-input" class="form-control-label">Time</label>
            <input class="form-control" type="time" value="10:30:00" id="example-time-input">
        </div>
        <div class="form-group">
            <label for="example-color-input" class="form-control-label">Color</label>
            <input class="form-control" type="color" value="#5e72e4" id="example-color-input">
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
