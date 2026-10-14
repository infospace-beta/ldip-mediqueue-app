<script setup lang="ts">
import DepartmentCard from '../components/DepartmentCard.vue'
import { departments } from '../data/mockData'
</script>

<template>
  <div class="page-shell__content">
    <section class="panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Department overview</p>
          <h3>Departments</h3>
        </div>
      </div>

      <div class="department-grid">
        <DepartmentCard v-for="department in departments" :key="department.id" :department="department" />
      </div>
    </section>
  </div>
</template>
