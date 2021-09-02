<template>
  <div class="overlay" v-show="showContent">
    <div class="main-content">
      <p>{{ val.name }}さんの残高</p>
      <p>{{ val.myWallet }}</p>
      <div id="button-content">
        <p>
          <button @click="closeModal" class="modal-button">close</button>
        </p>
      </div>
    </div>
  </div>
</template>



<script>
import firebase from "firebase";
export default {
  props: {
    val: {
      type: null,
    },
  },
  data() {
    return {
      showContent: false,
      userData: [],
    };
  },
  methods: {
    openModal() {
      this.$emit("open", this.showContent);
    },
    closeModal() {
      this.$emit("close", this.showContent);
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

.modal-button {
  position: relative;
  bottom: -22px;
}
</style>
