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
      <td><button>walletを見る</button></td>
      <td><button>送る</button></td>
    </table>
  </div>
</template>


<script>
import firebase from "firebase";

export default {
  name: "Home",
  data() {
    return {
      userName: "",
    };
  },
  methods: {
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
        location.href = "/home";
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
</style>
