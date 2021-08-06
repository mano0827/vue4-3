<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="signOut" class="signout">ログアウト</button>
    <p class="name">{{ userName }}さんようこそ！</p>
    <p class="wallet">残高：1000</p>
    <h1>ユーザ一覧</h1>
    <table>
      <tr>
        <th>ユーザー</th>
      </tr>
      <td>{{ userName }}</td>
      <td><button @click="openWallet">walletを見る</button></td>
      <td><button @click="openSend">送る</button></td>
    </table>

    <div class="overlay" v-show="showContent">
      <div class="content1">
        <p>{{}}さんの残高</p>
        <button class="btn" @click="closeWallet">Close</button>
      </div>
    </div>

    <div class="overlay" v-show="sendContent">
      <div class="content2">
        <p>あなたの残高：{{}}</p>
        <p>送る金額</p>
        <input type="number" />
        <button class="btn" @click="closeSend">送信</button>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "Home",
  data() {
    return {
      userName: "",
      showContent: false,
      sendContent: false,
    };
  },
  methods: {
    openWallet: function () {
      this.showContent = true;
    },
    closeWallet: function () {
      this.showContent = false;
    },
    openSend: function () {
      this.sendContent = true;
    },
    closeSend: function () {
      this.sendContent = false;
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
    name() {
      return this.$store.getters.name;
    },
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.userName = user.displayName;
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log = "true";
      } else {
        location.href = "/signin";
      }
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
