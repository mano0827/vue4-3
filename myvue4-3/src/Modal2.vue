<template>
  <div class="overlay" v-show="showContent2">
    <div class="main-content">
      <p>あなたの残高 {{val.myWallet}}</p>
      <p>送る金額</p>
      <input type="number">

      <div class="button-content">
        <p>
          <button @click="closeModal2" class="modal-button">送信</button>
        </p>
      </div>
    </div>
  </div>
</template>



<script>
import firebase from "firebase";
export default {
   props: {val:Object},
  data() {
    return {
      showContent2: false,
      userData:[],
    };
  },
  methods: {
    openModal2() {
      this.$emit("open", this.showContent2);
    },
    closeModal2() {
      this.$emit("close", this.showContent2);
    },
       returnUserData(id) {
      const userData = this.userData.find((user) => user.uid === id);
      return userData;
    },
  },

  mounted() {
    firebase.auth().onAuthStateChanged(() => {
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
.main-content {
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

</style>
