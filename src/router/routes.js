import LayoutComponent from '../components/Layout/LayoutComponent.vue';

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ClinicView from '../views/ClinicView.vue'
import ProfileView from '../views/ProfileView.vue'


export default [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/',
        component: LayoutComponent, 
        children: [
          {
            path: '/',
            name: 'home',
            component: HomeView
          },
          {
            path: '/',
            name: 'clinic',
            component: ClinicView
          },
          {
            path: '/',
            name: 'profile',
            component: ProfileView
          },
          
        ]
    },
];