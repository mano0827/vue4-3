import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      email: '',
      password: ''
    }
  },
  getters: {
    email(state) {
      return state.email;
    },
    password(state) {
      return state.password;
    },
    name(state) {
      return state.name;
    },
  },
  mutations: {
    setUser: function (user, payload) {
      user.email = payload.email
      user.password = payload.password
      user.name = payload.name

    }
  },
  actions: {

    signUp: function (context, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          const user = firebase.auth().currentUser
          user.updateProfile({
            displayName: payload.name,
          },
          )
            .then(() => {
              context.commit('setUser', payload)
            })
            .then(() => {
              const db = firebase.firestore();
              db.collection("userData").doc(user.uid).set({
                uid: user.uid,
                email: payload.email,
                password: payload.password,
                name: payload.name,
                myWallet: payload.myWallet,

              })
            })
            .then(() => {
              router.push('/home')
            })
        })
        .catch(function (error) {
          alert('入力に誤りがあります（' + error.message + '）');
        });
    },
    signIn: function (context, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          const user = firebase.auth().currentUser
          const docRef = firebase.firestore().collection("userData").doc(user.uid);
          firebase.auth().currentUser.updateProfile({
            displayName: payload.name,

          },
          )
          docRef.get()
            .then((doc) => {
              if (doc.exists) {
                context.commit('setUserData', doc)
              } else {
                console.log();
              }
            })
            .then(() => {
              context.commit('setUser', payload)
            })
            .then(() => {
              router.push('/home')
            })
            .catch(function (error) {
              alert('パスワードもしくはメールアドレスが異なります（' + error.message + '）');
            })
        });

    },
  },
  modules: {
  }
})

