<template>
  <div class="overlay" v-show="showContent2">
    <div class="main-content">
      <p>あなたの残高 {{ val.myWallet }}</p>
      <p>送る金額</p>
      <input v-model="inputValue" type="number" />

      <div class="button-content">
        <p>
          <button @click="closeModal2" class="modal-button">送信</button>
        </p>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  props: {
    val: {
      type: null,
    },
  },
  data() {
    return {
      showContent2: false,
      userData: [],
      inputValue: "",
    };
  },
  methods: {
    openModal2() {
      this.$emit("open", this.showContent2);
    },
    closeModal2() {
      this.$emit("close", this.showContent2);
      this.$store.dispatch("closeModal2", {
        inputValue: this.inputValue,
      });
    },
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
