<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="flex flex-col h-screen w-screen">
    <Navbar />
    <div class="flex-grow w-full flex justify-center">
      <router-view class="w-full max-w-6xl p-6" />
    </div>
  </div>
</template>
