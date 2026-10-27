<script setup>
import { ArrowRight, HeartPulse, ShieldAlert, ShieldCheck, Siren } from '@lucide/vue'
</script>

<template>
  <div class="section-page emergency-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">EMERGENCY INFORMATION</span>
        <h1>Emergency assistance</h1>
        <p>Important information about getting urgent help.</p>
      </div>
    </div>

    <section class="emergency-alert" aria-labelledby="emergency-alert-heading">
      <span class="emergency-alert-icon"><ShieldAlert :size="23" aria-hidden="true" /></span>
      <div>
        <h2 id="emergency-alert-heading">Need immediate help?</h2>
        <p>If you may be in immediate danger or need urgent medical care, contact your local emergency services directly.</p>
      </div>
    </section>

    <div class="emergency-content-grid">
      <section class="panel emergency-contact-panel" aria-labelledby="emergency-service-heading">
        <div class="panel-header">
          <div>
            <span class="eyebrow">MEDIQUEUE SERVICE STATUS</span>
            <h2 id="emergency-service-heading">Emergency requests</h2>
          </div>
          <span class="contact-shield"><HeartPulse :size="20" aria-hidden="true" /></span>
        </div>
        <p class="emergency-service-copy">
          Emergency dispatch is not connected in this prototype. MediQueue cannot send a request to responders or emergency services.
        </p>
        <p class="emergency-service-status" role="status">
          <ShieldCheck :size="17" aria-hidden="true" />
          No emergency service is connected. No request has been sent.
        </p>
        <p class="emergency-disclaimer">
          <Siren :size="16" aria-hidden="true" />
          <span>Do not use this page to seek emergency dispatch. Contact local emergency services directly.</span>
        </p>
      </section>

      <aside class="panel emergency-queue-note">
        <span class="emergency-note-icon"><ArrowRight :size="18" aria-hidden="true" /></span>
        <span class="eyebrow">NON-EMERGENCY CARE</span>
        <h2>Looking for routine care?</h2>
        <p>Use the queue form to prepare a non-emergency care request. It is not a substitute for emergency services.</p>
        <RouterLink class="button button-primary" to="/patient/join-queue">
          Go to Join Queue <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
      </aside>
    </div>
  </div>
</template>
