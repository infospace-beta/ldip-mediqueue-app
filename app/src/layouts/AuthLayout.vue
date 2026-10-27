<template>
  <div class="auth-layout">
    <div class="auth-frame">
      <figure class="auth-visual">
        <img
          :src="careImage"
          alt="Healthcare professional in a white coat with a stethoscope"
          class="auth-visual-image"
          width="3456"
          height="4777"
          fetchpriority="high"
        />
        <figcaption class="auth-visual-caption">
          <span class="auth-caption-accent" aria-hidden="true"></span>
          <p class="auth-caption-title">Care that starts with connection.</p>
          <p class="auth-caption-copy">
            Find your way to the care and support you need.
          </p>
        </figcaption>
      </figure>

      <section class="auth-panel" aria-label="Account access">
        <header class="auth-brand">
          <RouterLink
            :to="{ name: ROUTE_NAMES.landing }"
            aria-label="MediQueue home"
            class="auth-brand-link"
          >
            <AppLogo :with-wordmark="false" size="md" />
            <span class="auth-brand-name">MediQueue</span>
          </RouterLink>
        </header>

        <div class="auth-content">
          <slot />
        </div>

        <footer class="auth-footer">
          <RouterLink
            :to="{ name: ROUTE_NAMES.landing }"
            class="auth-footer-link"
          >
            Back to MediQueue
          </RouterLink>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppLogo from "@/components/common/AppLogo.vue";
import { ROUTE_NAMES } from "@/constants/routeNames";
import careImage from "@/assets/images/ato-aikins-TPT4pevJEmQ-unsplash.jpg";
</script>

<style scoped>
.auth-layout {
  --auth-navy: #17324f;
  --auth-green: #087f72;
  --auth-green-dark: #06685e;
  --auth-ink: #1e2d3d;
  --auth-muted: #637385;
  --auth-line: #dfe6eb;
  --auth-canvas: #f3f6f8;
  --auth-white: #fff;
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 32px;
  color: var(--auth-ink);
  background: var(--auth-canvas);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
}

.auth-frame {
  display: grid;
  width: min(1240px, 100%);
  min-height: min(760px, calc(100vh - 64px));
  grid-template-columns: minmax(0, 1fr) minmax(500px, 1fr);
  overflow: hidden;
  border: 1px solid var(--auth-line);
  border-radius: 16px;
  background: var(--auth-white);
  box-shadow: 0 1px 3px rgb(18 40 63 / 6%);
}

.auth-visual {
  position: relative;
  min-height: 100%;
  margin: 0;
  overflow: hidden;
  background: #e8eef0;
}

.auth-visual-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 760px;
  object-fit: cover;
  object-position: center 35%;
}

.auth-visual-caption {
  position: absolute;
  right: 32px;
  bottom: 32px;
  left: 32px;
  max-width: 430px;
  padding: 22px 24px;
  border: 1px solid rgb(223 230 235 / 90%);
  border-radius: 12px;
  background: var(--auth-white);
  box-shadow: 0 1px 3px rgb(18 40 63 / 6%);
}

.auth-caption-accent {
  display: block;
  width: 34px;
  height: 3px;
  margin-bottom: 12px;
  border-radius: 2px;
  background: var(--auth-green);
}

.auth-caption-title {
  margin: 0;
  color: var(--auth-navy);
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.auth-caption-copy {
  margin: 6px 0 0;
  color: var(--auth-muted);
  font-size: 14px;
  line-height: 1.5;
}

.auth-panel {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 38px clamp(32px, 5vw, 64px) 28px;
  background: var(--auth-white);
}

.auth-brand {
  margin-bottom: 38px;
}

.auth-brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  text-decoration: none;
}

.auth-brand-name {
  color: var(--auth-navy);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.auth-content {
  width: 100%;
  max-width: 500px;
  margin: auto;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
}

.auth-footer-link {
  color: var(--auth-muted);
  font-size: 13px;
  text-decoration: none;
}

.auth-footer-link:hover {
  color: var(--auth-green-dark);
  text-decoration: underline;
}

.auth-layout :deep(.auth-form-card) {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.auth-layout :deep(.auth-form-card > header),
.auth-layout :deep(.auth-form-card > footer) {
  padding-right: 0;
  padding-left: 0;
  border: 0;
}

.auth-layout :deep(.auth-form-card > header) {
  padding-top: 0;
  padding-bottom: 26px;
}

.auth-layout :deep(.auth-form-card > div) {
  padding: 0;
}

.auth-layout :deep(.auth-form-card > footer) {
  padding-top: 22px;
  padding-bottom: 0;
}

.auth-layout :deep(.auth-heading) {
  margin: 0;
  color: var(--auth-navy);
  font-size: clamp(26px, 3vw, 32px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.auth-layout :deep(.auth-eyebrow) {
  margin: 0 0 8px;
  color: var(--auth-green-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-layout :deep(.auth-supporting) {
  margin: 8px 0 0;
  color: var(--auth-muted);
  font-size: 14px;
  line-height: 1.55;
}

.auth-layout :deep(label) {
  margin-bottom: 7px;
  color: var(--auth-navy);
  font-size: 13px;
  font-weight: 600;
}

.auth-layout :deep(input) {
  min-height: 46px;
  padding: 11px 13px;
  border-color: var(--auth-line);
  border-radius: 8px;
  color: var(--auth-ink);
  background: var(--auth-white);
}

.auth-layout :deep(input::placeholder) {
  color: #83909c;
}

.auth-layout :deep(input:focus-visible) {
  border-color: var(--auth-green);
  outline-color: var(--auth-green);
}

.auth-layout :deep(button[aria-controls]) {
  color: var(--auth-green-dark);
}

.auth-layout :deep(button[aria-controls]:hover) {
  color: var(--auth-navy);
}

.auth-layout :deep(.auth-link) {
  color: var(--auth-green-dark);
  font-weight: 650;
  text-decoration: none;
}

.auth-layout :deep(.auth-link:hover) {
  color: var(--auth-navy);
  text-decoration: underline;
}

.auth-layout :deep(.auth-submit) {
  min-height: 48px;
  border-radius: 8px;
  background: var(--auth-green);
  box-shadow: none;
}

.auth-layout :deep(.auth-submit:hover:not(:disabled)) {
  background: var(--auth-green-dark);
}

.auth-layout :deep(.auth-note) {
  color: var(--auth-muted);
  font-size: 13px;
  line-height: 1.55;
}

.auth-layout :deep(.auth-note code) {
  color: var(--auth-navy);
}

@media (max-width: 900px) {
  .auth-layout {
    padding: 20px;
  }

  .auth-frame {
    min-height: min(820px, calc(100vh - 40px));
    grid-template-columns: minmax(0, 0.82fr) minmax(420px, 1fr);
  }

  .auth-visual-image {
    min-height: 820px;
  }

  .auth-panel {
    padding: 30px 32px 24px;
  }

  .auth-brand {
    margin-bottom: 28px;
  }
}

@media (max-width: 720px) {
  .auth-layout {
    display: block;
    min-height: 100vh;
    padding: 12px;
  }

  .auth-frame {
    width: 100%;
    min-height: 0;
    grid-template-columns: minmax(0, 1fr);
    border-radius: 14px;
  }

  .auth-visual {
    height: clamp(170px, 42vw, 240px);
    min-height: 0;
  }

  .auth-visual-image {
    height: 100%;
    min-height: 0;
    object-position: center 8%;
  }

  .auth-visual-caption {
    display: none;
  }

  .auth-panel {
    padding: 24px clamp(18px, 6vw, 32px) 22px;
  }

  .auth-brand {
    margin-bottom: 26px;
  }

  .auth-content {
    margin: 0 auto;
  }

  .auth-layout :deep(.auth-form-card > header) {
    padding-bottom: 20px;
  }
}
</style>
