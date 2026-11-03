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
        <h1>Prepare a queue request</h1>
        <p>
          Review the visit details you would provide. This prototype does not
          submit a request or reserve a place in line.
        </p>
      </div>
      <button class="button button-quiet" type="button" @click="router.back()">
        <ArrowLeft :size="16" aria-hidden="true" /> Back
      </button>
    </div>
    <JoinQueueForm />
  </div>
</template>
