<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="signOut" class="signout">ログアウト</button>
    <p class="name">{{ userName }}さんようこそ！</p>
    <p class="wallet">残高：{{ $store.getters.myWallet }}</p>
    <h1>ユーザ一覧</h1>
    <table>
      <thead>
        <tr>
          <th>ユーザー</th>
        </tr>
      </thead>
      <tr v-for="(user, index) in userData" v-bind:key="index">
        <td>{{ user.name }}</td>
        <td>
          <button class="button2" @click="openModal(user, index)">
            Walletを見る
          </button>
        </td>
        <td>
          <button class="button2" @click="openModal2(user, index)">送る</button>
        </td>
      </tr>
    </table>
    <div>
      <Modal
        :user="user"
        v-for="(user, index) in userData"
        v-bind:key="index"
        :val="usersIndex"
        v-show="showContent"
        @click="closeModal"
        @open="showContent = true"
        @close="showContent = false"
      ></Modal>
    </div>
    <div>
      <Modal2
        :user="user"
        v-for="(user, index) in userData"
        v-bind:key="index"
        :val="usersIndex"
        v-show="showContent2"
        @click="closeModal2"
        @open="showContent2 = true"
        @close="showContent2 = false"
      ></Modal2>
    </div>
  </div>
</template>
<script>
import Modal from "../Modal.vue";
import Modal2 from "../Modal2.vue";
import firebase from "firebase";
export default {
  name: "Home",
  components: {
    Modal,
    Modal2,
  },
  data() {
    return {
      userName: "",
      showContent: false,
      showContent2: false,
      usersIndex: "",
      userData: [],
    };
  },

  methods: {
    openModal(user) {
      console.log(user);
      this.showContent = true;
      this.usersIndex = user;
    },
    closeModal() {
      this.showContent = false;
    },
    openModal2(user) {
      console.log(user);
      this.showContent2 = true;
      this.usersIndex = user;
    },
    closeModal2() {
      this.showContent2 = false;
    },

    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin");
        });
    },
  },
  computed: {
    myWallet() {
      return this.$store.getters.myWallet;
    },
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.userName = user.displayName;
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("true");
      } else {
        location.href = "/signin";
      }

      const currentUser = firebase.auth().currentUser;
      this.uid = currentUser.uid;
      firebase
        .firestore()
        .collection("userData")
        .where(firebase.firestore.FieldPath.documentId(), "!=", currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = {
              name: doc.data().name,
              myWallet: doc.data().myWallet,
            };
            this.userData.push(data);
          });
        });
    });
  },
};
</script>

<style scoped>
.signout {
  color: rgb(32, 130, 155);
  border: rgb(32, 130, 155) solid 2px;
  text-decoration: none;
  border-radius: 7px;
  margin-top: 10px;
  padding: 9px;
  font-weight: bold;
  background: white;
  position: absolute;
  top: 20px;
  right: 60px;
}

:hover.signout {
  background: rgb(68, 163, 187);
  transition: 0.3s;
  color: aliceblue;
}

.name {
  position: absolute;
  left: 160px;
}

h1 {
  margin-top: 70px;
}

.wallet {
  position: absolute;
  right: 200px;
}

.overlay {
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content1 {
  z-index: 2;
  width: 30%;
  padding: 1em;
  background: linear-gradient(
    white 0%,
    white 70%,
    rgb(197, 195, 195) 70%,
    rgb(197, 195, 195) 100%
  );
}

.content2 {
  z-index: 2;
  width: 30%;
  padding: 1em;
  background: linear-gradient(white 100px, rgb(197, 195, 195) 100px);
}

.btn {
  background: red;
  color: #fff;
  border: none;
  padding: 2px 6px;
}
</style>
