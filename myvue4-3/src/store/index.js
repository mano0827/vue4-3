import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router'
import createPersistedState from "vuex-persistedstate"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      name: '',
      email: '',
      password: '',
      myWallet: '',
    },
    users: [],
    // ログインしてないユーザー情報
    modalDatas: [],

  },
  getters: {
    email(state) {
      return state.user.email;
    },
    password(state) {
      return state.user.password;
    },
    name(state) {
      return state.user.name;
    },
    myWallet(state) {
      return state.user.myWallet;
    },
    users(state) {
      return state.users
    },
    modalDatas(state) {
      return state.modalDatas
    },
  },
  mutations: {
    // ユーザー情報
    setUser(state, payload) {
      state.user.email = payload.email
      state.user.password = payload.password
      state.user.name = payload.name
      state.user.myWallet = payload.myWallet

    },
    setUserData(state, doc) {
      state.user.name = doc.data().name
      state.user.myWallet = doc.data().myWallet
    },
    setUsersData(state, users) {
      state.users = users
    },
    setModalDatas(state, modalDatas) {
      state.modalDatas = modalDatas
    },
  },
  actions: {

    signUp(context, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          const user = firebase.auth().currentUser
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
              context.commit('setUser', payload)
            })
            .then(() => {
              router.push('/home')
            })
        })
        .catch(function (error) {
          alert('入力に誤りがあります（' + error.message + '）');
        });
    },
    signIn(context, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          const user = firebase.auth().currentUser
          const docRef = firebase.firestore().collection("userData").doc(user.uid);
          docRef.get()
            .then((doc) => {
              if (doc.exists) {
                context.commit('setUserData', doc)
              } else {
                console.log();
              }
            })
            .then(() => {
              router.push('/home')
            })
            .catch(function (error) {
              alert('パスワードもしくはメールアドレスが異なります（' + error.message + '）');
            })
        })
    },
    // モーダル用のデータ
    // modalSet (context, usersIndex) {
    modalSet (context) {
      const modalDatas = [];
      const user = firebase.auth().currentUser
      const db = firebase.firestore();
      db.collection("userData")
      // ログインしてないユーザーを取得
          .where(firebase.firestore.FieldPath.documentId(), "!=", user.uid)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  const modalData = {
                      // uid: usersIndex,
                      name: doc.data().name,
                      myWallet: doc.data().myWallet
                  }
                  modalDatas.push(modalData)
                  context.commit('setModalDatas', modalDatas)
                  // console.log(modalDatas)
              });
              });
  },
},
  modules: {
  },
  plugins: [createPersistedState({storage: window.sessionStorage})]
})

