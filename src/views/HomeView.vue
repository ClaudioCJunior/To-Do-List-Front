<script setup>
import store from '../store'
import { reactive, ref, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'

const objUseStore = useStore()

const user = reactive({
  name: "",
  email: "",
  image: "../assets/img/bruce-mars.jpg"
});

const categorizations = reactive([
  {
    id: 0,
    name: "General",
    icon: "ni ni-books"
  }
]);

const tasks = reactive([]);

const completedName = ref("Concluir");

completedName

const manipulateTasks = reactive({
    filter: [
      { field: "completionStatus", value: false },
    ],
    sort: { field: "dueDate", direction: "ASC" }
  });

const filters = reactive({
  completionStatus : false,
  dueDate: "",
  priority: 0,
  evaluationPoints: 0
});

const sort = reactive({
  field: "",
  direction: ""
});

const objTaskSave = reactive({
  id: 0,
  title: "",
  description: "",
  completionStatus : false,
  dueDate: "",
  priority: 0,
  evaluationPoints: 0,
  dateFormatted: "",
  listCategorization: []
});

const categorizationModel = reactive([
{
    id: 0,
    name: "General",
    selected: false,
  },
  {
    id: 1,
    name: "Home",
    selected: false,
  },
  {
    id: 2,
    name: "Work",
    selected: false,
  },
  {
    id: 3,
    name: "Personal",
    selected: false,
  },
  {
    id: 4,
    name: "Shopping",
    selected: false,
  },
]);

const categorizationFilter = reactive(
  {
    id: 0,
    name: "",
  }
);



onMounted(async () => {
  user.name = store.state.userStore.user.name;
  user.email = store.state.userStore.user.email;

  let storeCategorization = store.state.categorizationStore.categorizations;

  if (storeCategorization == null || storeCategorization.length == 0) {
    await getCategorizations();
    storeCategorization = store.state.categorizationStore.categorizations;
  }

  const icons = [
    "ni ni-box-2",
    "ni ni-laptop",
    "ni ni-user-run",
    "ni ni-cart"
  ]

  let i = 0;

  for (const categorization of storeCategorization) {
    let objCat = {
      id: categorization.id,
      name: categorization.name,
      icon: icons[i]
    };

    categorizations.push(objCat);

    i++;
  }

  await findTasks();
});

async function findTasks(){
  await getTasks();

  const storeTasks = store.state.taskStore.tasks;


  tasks.splice(0, tasks.length);

  for (const storeTask of storeTasks) {
    let objTask = {
      id: storeTask.id,
      title: storeTask.title,
      description: storeTask.description,
      priority: storeTask.priority,
      dueDate: storeTask.dueDate,
      completionStatus: storeTask.completionStatus,
      evaluationPoints: storeTask.evaluationPoints,
      categorizations: storeTask.categorizations,
      dateFormatted: storeTask.dateFormatted,
      priorityFormatted: storeTask.priorityFormatted,
    };

    tasks.push(objTask);
  }

  
}

async function getCategorizations() {
  try {
    await objUseStore.dispatch('categorizationStore/getAll', {});
  } catch (e) {
    console.error(e);
  }
}

async function getTasks() {
  try {
    const query = toQueryString(manipulateTasks);

    await objUseStore.dispatch('taskStore/getAll', query);
  } catch (e) {
    console.error(e);
  }
}

async function setManipulateTasksAndFindTasks() {
  manipulateTasks.filter = [];

  manipulateTasks.filter.push({ field: "completionStatus", value: filters.completionStatus });

  if(filters.dueDate != ""){
    manipulateTasks.filter.push({ field: "dueDate", value: new Date(filters.dueDate).toISOString() });
  }

  manipulateTasks.filter.push({ field: "priority", value: filters.priority });
  
  if(filters.evaluationPoints > 0){
    manipulateTasks.filter.push({ field: "evaluationPoints", value: filters.evaluationPoints });
  }

  if(categorizationFilter.id > 0){
    manipulateTasks.filter.push({ field: "categorization", value: categorizationFilter.id });
  }

  await findTasks();

  if(filters.completionStatus){
    completedName.value = "Retornar";
  }else{
    completedName.value = "Concluir";
  }
}

async function saveNewTask() {
  console.log(objTaskSave.dateFormatted.split('/').reverse().join('-'));

  const formattedDueDate = new Date(objTaskSave.dateFormatted.split('/').reverse().join('-')).toISOString();
  objTaskSave.dueDate = formattedDueDate;

  objTaskSave.priority = parseInt(objTaskSave.priority);

  objTaskSave.listCategorization = categorizationModel
    .filter(categorization => categorization.selected)
    .map(categorization => categorization.id);

  let response = null;  

  if(objTaskSave.id > 0){
    response = await objUseStore.dispatch('taskStore/update', objTaskSave);
  }else{
    response = await objUseStore.dispatch('taskStore/create', objTaskSave);
  }

  if(response.status == 201 || response.status == 200){
      objTaskSave.id = 0;
      objTaskSave.title= "";
      objTaskSave.description= "";
      objTaskSave.completionStatus = false;
      objTaskSave.dueDate = "";
      objTaskSave.priority = 0;
      objTaskSave.evaluationPoints = 0;
      objTaskSave.dateFormatted = "";
      objTaskSave.listCategorization = [];

      categorizationModel.forEach(categorization => {
        categorization.selected = false;
      });

      await findTasks();
  }

  
}

function toQueryString(obj) {
  const str = [];
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      if (Array.isArray(obj[p])) {
        obj[p].forEach((item, index) => {
          for (const key in item) {
            str.push(encodeURIComponent(`${p}[${index}][${key}]`) + '=' + encodeURIComponent(item[key]));
          }
        });
      } else if (typeof obj[p] === 'object') {
        for (const key in obj[p]) {
          str.push(encodeURIComponent(`${p}[${key}]`) + '=' + encodeURIComponent(obj[p][key]));
        }
      } else {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
  }
  return str.join('&');
}


async function handleCheckboxClick(task, key){
  const obj = { 
    id: task.id,
    completionStatus: !task.completionStatus
  } 

  const response = await objUseStore.dispatch('taskStore/updateStatus', obj);

  if(response.status == 200){
    await findTasks();
  }
}

async function handleCategorizationClick(categorization){
  categorizationFilter.id = categorization.id;
  categorizationFilter.name = categorization.name;

  manipulateTasks.filter = [];

  if(categorizationFilter.id > 0){
    manipulateTasks.filter.push({ field: "categorization", value: categorization.id });
  }

  console.log(manipulateTasks);

  await findTasks();
}

async function handleDeleteTask(task){
  const response = await objUseStore.dispatch('taskStore/delete', task);

  if(response.status == 200){
    await findTasks();
  }
}

async function handleSortDirectionChange() {
    manipulateTasks.sort.field = sort.field;
  manipulateTasks.sort.direction = sort.direction;

  await findTasks();
}

async function handleUpdateTask(task){
  objTaskSave.id = task.id;
  objTaskSave.title = task.title;
  objTaskSave.description = task.description;
  objTaskSave.completionStatus = task.completionStatus;
  objTaskSave.dueDate = task.dueDate;
  objTaskSave.priority = task.priority;
  objTaskSave.evaluationPoints = task.evaluationPoints;
  objTaskSave.dateFormatted = task.dateFormatted;

  categorizationModel.forEach(categorization => {
    categorization.selected = false;
  });

  task.categorizations.forEach(categorization => {
    const index = categorizationModel.findIndex(c => c.id === categorization.id);

    if(index > -1){
      categorizationModel[index].selected = true;
    }
  });
}


</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="page-header min-height-100 border-radius-xl mt-4"
        style="background-image: url('../assets/img/curved-images/curved0.jpg'); background-position-y: 50%;">
        <span class="mask bg-gradient-primary opacity-6"></span>
      </div>
      <div class="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
        <div class="row gx-4">
          <div class="col-auto">
            <div class="avatar avatar-xl position-relative">
              <img src="../assets/img/bruce-mars.jpg" alt="profile_image" class="w-100 border-radius-lg shadow-sm">
            </div>
          </div>
          <div class="col-auto my-auto">
            <div class="h-100">
              <h5 class="mb-1">
                {{ user.name }}
              </h5>
              <p class="mb-0 font-weight-bold text-sm">
                {{ user.email }}
              </p>
            </div>
          </div>
          <div class="col-lg-2 col-md-4 col-12 col-sm-6  my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
            <div class="nav-wrapper position-relative end-0">
              <a class="nav-link mb-0 px-0 py-1 " data-bs-toggle="tab" href="javascript:;" role="tab"
                aria-selected="false" tabindex="-1">
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid py-4">
        <div class="row">
          <div class="row">
            <div class="col-xl-2 col-sm-6 mb-xl-0 mb-4" v-for="(categorization, key) in categorizations" :key="key">
              <div class="card move-on-hover overflow-hidden" @click="handleCategorizationClick(categorization)">
                <div class="card-body p-3">
                  <div class="row">
                    <div class="col-8">
                      <div class="numbers">
                        <p class="mb-0 text-capitalize font-weight-bold">{{ categorization.name }}</p>
                        <!-- <h5 class="font-weight-bolder mb-0">
                          100
                        </h5> -->
                      </div>
                    </div>
                    <div class="col-4 text-end">
                      <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                        <i class="ni text-lg opacity-10" :class="categorization.icon" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="row ">
          <div class="row ">
            <div class="col-lg-2 col-md-6">
              <div class="card overflow-hidden">
                <div class="card-header pb-0">
                  <div class="row">
                    <div class="col-12">
                      <h6 v-if=" objTaskSave.id > 0">Alterar Tarefa</h6>
                      <h6 v-else>Nova Tarefa</h6>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <form novalidate @submit.prevent="saveNewTask">
                    <div class="float-start mt-3 col-12">
                      <div class="form-group">
                        <label for="example-text-input" class="form-control-label">Titulo </label>
                        <input class="form-control" type="text" v-model="objTaskSave.title">
                      </div>
                      <div class="form-group">
                        <label for="example-text-input" class="form-control-label">Descrição </label>
                        <input class="form-control" type="text" v-model="objTaskSave.description">
                      </div>
                      <div class="form-group">
                      <label for="example-password-input" class="form-control-label">Data Vencimento</label>
                      <input class="form-control" type="tel" placeholder="01/01/2001" v-mask="'##/##/####'" v-model="objTaskSave.dateFormatted">
                      </div>
                      <div class="form-group">
                      <label for="example-text-input" class="form-control-label">Prioridade </label>
                      <select class="form-control" v-model="objTaskSave.priority">
                        <option value="0">Low</option>
                        <option value="1">Normal</option>
                        <option value="2">High</option>
                        <option value="3">Critical</option>
                      </select>

                      </div>
                      <div class="form-group">
                      <label for="example-search-input" class="form-control-label">Pontos</label>
                      <input class="form-control" type="number" v-model="objTaskSave.evaluationPoints">
                      </div>
                      <div class="form-group">
                        <label for="example-text-input" class="form-control-label">Categoria </label>
                        <div v-for="(categorization, index) in categorizations" :key="index">
                          <div v-if="categorization.id > 0">
                            <label class="form-check-label">
                              <input class="form-check-input" type="checkbox" :value="categorization.id" v-model="categorizationModel[index].selected">
                              {{ categorization.name }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button v-if="objTaskSave.id > 0" type="submit" class="btn bg-gradient-primary float-end">Alterar</button>
                    <button v-else type="submit" class="btn bg-gradient-success float-end">Incluir</button>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-lg-8 col-md-6 mb-md-0 mb-4">
              <div class="card">
                <div class="card-header pb-0">
                  <div class="row">
                    <div class="col-lg-8 col-7">
                      <h6 v-if="categorizationFilter.name !== ''">Tarefas - {{ categorizationFilter.name }}</h6>
                      <h6 v-else>Tarefas - Gerais</h6>
                    </div>
                    <div class="col-lg-4 col-7">
                      <div class="row">
                        <div class="col">
                            <select class="form-control" v-model="sort.field" @change="handleSortDirectionChange()">
                            <option value="">Ordenar Por</option>
                            <option value="title">Titulo</option>
                            <option value="description">Descrição</option>
                            <option value="priority">Prioridade</option>
                            <option value="dueDate">Data Vencimento</option>
                            <option value="evaluationPoints">Pontos Avaliação</option>
                          </select>
                        </div>
                        <div class="col">
                            <select class="form-control" v-model="sort.direction" @change="handleSortDirectionChange()">
                              <option value="">Direção</option>
                              <option value="ASC">ASC</option>
                              <option value="DESC">DESC</option>
                            </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <table class="table">
                  <tr>
                    <th scope="col" style="width: 10%;">{{ completedName }}</th>
                    <th scope="col" style="width: 20%;">Titulo</th>
                    <th scope="col" style="width: 20%;">Descrição</th>
                    <th scope="col" style="width: 10%;">Prioridade</th>
                    <th scope="col" style="width: 10%;">Data Vencimento</th>
                    <th scope="col" style="width: 10%;">Pontos Avaliação</th>
                    <th scope="col" style="width: 5%;"></th>
                    <th scope="col" style="width: 5%;"></th>
                  </tr>
                  <tbody>
                    <tr v-for="(task, key) in tasks" :key="key">
                      <td>
                        <input class="form-check-input" type="checkbox" id="defaultCheck1" v-model="task.completionStatus" @click="handleCheckboxClick(task, key)">
                      </td>
                      <td>{{ task.title }}</td>
                      <td>{{ task.description }}</td>
                      <td>{{ task.priorityFormatted }}</td>
                      <td>{{ task.dateFormatted }}</td>
                      <td>{{ task.evaluationPoints }}</td>
                      <td>
                        <button type="button" class="btn bg-gradient-info btn-sm" @click="handleUpdateTask(task)">Editar</button>
                      </td>
                      <td>
                        <button type="button" class="btn bg-gradient-danger btn-sm" @click="handleDeleteTask(task)">Deletar</button>
                      </td>
                     
                    </tr>
                  </tbody>
                </table>
              

              </div>

            </div>
            <div class="col-lg-2 col-md-6">
              <div class="card overflow-hidden">
                <div class="card-header pb-0">
                  <div class="row">
                    <div class="col-12">
                      <h6>Filtros</h6>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <form novalidate @submit.prevent="setManipulateTasksAndFindTasks">
                    <div class="float-start mt-3 col-12">
                      <div class="form-group">
                      <label for="example-password-input" class="form-control-label">Status</label>
                      <select class="form-control" v-model="filters.completionStatus">
                        <option value="false">Pendentes</option>
                        <option value="true">Concluídos</option>
                      </select>
                      </div>
                      <div class="form-group">
                      <label for="example-password-input" class="form-control-label">Data Vencimento</label>
                      <input class="form-control" type="tel" placeholder="01/01/2001" v-mask="'##/##/####'" v-model="filters.dueDate">
                      </div>
                      <div class="form-group">
                      <label for="example-text-input" class="form-control-label">Prioridade </label>
                      <select class="form-control" v-model="filters.priority">
                        <option value="0">Low</option>
                        <option value="1">Normal</option>
                        <option value="2">High</option>
                        <option value="3">Critical</option>
                      </select>
                      </div>
                      <div class="form-group">
                      <label for="example-search-input" class="form-control-label">Pontos</label>
                      <input class="form-control" type="number" v-model="filters.evaluationPoints">
                      </div>
                    </div>
                    <button type="submit" class="btn bg-gradient-info float-end">Filtrar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
