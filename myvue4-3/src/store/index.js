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
      uid: ''
    },
    userData: [],
    inputValue: ''
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
    uid(state) {
      return state.user.uid;
    },
    userData(state) {
      return state.userData
    },
    inputValue(state) {
      return state.inputValue
    },
  },
  mutations: {
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
    setUsersData(state, userData) {
      state.userData = userData
    },
    updateWallet(state, docs) {
      state.uid = docs[0].id
    },
    updateMyWallet(state) {
      state.user.myWallet = Number
    }

  },
  actions: {
    signUp(context, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
          const user = firebase.auth().currentUser
            .then(() => {
              const db = firebase.firestore();
              db.collection("userData").doc(user.uid).set({
                uid: payload.uid,
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

    async closeModal2({ state, commit }, inputValue) {
      const db = firebase.firestore();
      const isMyUid = firebase.auth().currentUser.uid
      try {
        const receiverDocs = await db.collection('userData').where('uid', '==', state.uid).get()
        const receiverId = receiverDocs.docs[0].id
        const senderDocs = await db.collection('userData').where('uid', '==', isMyUid).get()
        const senderId = senderDocs.docs[0].id
        await db.runTransaction(async t => {
          //送金される側
          await t.update(db.collection('userData').doc(receiverId), {
            myWallet: firebase.firestore.FieldValue.increment(Number(inputValue))
          })
          commit('updateWallet', inputValue)
          //送金する側
          await t.update(db.collection('userData').doc(senderId), {
            myWallet: firebase.firestore.FieldValue.increment(-Number(inputValue))
          })
          commit('updateMyWallet', inputValue)
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})
