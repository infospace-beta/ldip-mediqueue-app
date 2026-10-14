<script setup>
import { ArrowLeft } from '@lucide/vue'
import { useRouter } from 'vue-router'
import JoinQueueForm from '../components/JoinQueueForm.vue'

const router = useRouter()
</script>

<template>
  <div class="section-page"><div class="page-heading"><div><span class="eyebrow">FIND THE RIGHT CARE</span><h1>Join a queue</h1><p>Choose a hospital and service, then save your place in line.</p></div><button class="button button-quiet" type="button" @click="router.back()"><ArrowLeft :size="16" /> Back</button></div><JoinQueueForm /></div>
</template>

