<template>
  <div class="fixed-center">
    <p>
      <img src="../../assets/logo.png" style="width:30vw;max-width:150px;" />
    </p>
    <p class="text-faded">
      Sorry, nothing here...
      <strong>(404)</strong>
    </p>
    <a-button type="primary" style="width:200px;" @click="$router.push('/')">Go back</a-button>
  </div>
</template>

<script>
export default {
  name: "Error404"
};
</script>

<style scoped>
.fixed-center {
  min-height: 80vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>