import store from '../store'
import * as userStorage from '../storage/user';

export default async (to, from, next) => {
    const storageToken =  userStorage.getLocalToken();
    const storeToken = store.state.userStore.token;

    console.log("storageToken " + storageToken);
    console.log("storeToken " + storeToken);

    const hasStorageToken = storageToken != null && storageToken != undefined && storageToken != "";
    const hasStoreToken = storeToken != null && storeToken != undefined && storeToken != "";

    console.log("hasStorageToken " + hasStorageToken);
    console.log("hasStoreToken " + hasStoreToken);

    if(hasStorageToken && !hasStoreToken){
        try{
            await store.dispatch('userStore/validateToken'); 
        }catch(e){
            console.error(e);
            userStorage.removeLocalToken();
            next({name: 'login'});
        }
    }

    console.log("hasStoreTokenPos " + store.getters['userStore/hasToken']);

    if(store.getters['userStore/hasToken']){
        if(to.name === 'login' || to.name === 'sign'){
            next({name: 'home'})
        }else{
            next();
        }
    }else{
        if(to.name === 'login' || to.name === 'sign'){
            next()
        }else{
            next({name: 'login'})
        }
        
    }
};