<script setup>
import { ArrowLeft } from "@lucide/vue";
import { useRouter } from "vue-router";
import JoinQueueForm from "../components/JoinQueueForm.vue";

const router = useRouter();
</script>

<template>
  <div class="section-page join-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">QUEUE REQUEST</span>
        <h1>Join a queue</h1>
        <p>Select an active hospital department to create a live queue ticket.</p>
      </div>
      <button class="button button-quiet" type="button" @click="router.back()">
        <ArrowLeft :size="16" aria-hidden="true" /> Back
      </button>
    </div>
    <JoinQueueForm />
  </div>
</template>
