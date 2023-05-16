<template>
  <q-layout view="hHh lpR ffr">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Sub-Troll
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/login" label="Login" />
        <!-- TODO: disable subscriptions if not logged in -->
        <q-route-tab to="/subscriptions" label="Subscriptions" />
        <q-route-tab to="/cards" label="Virtual Cards" />
        <q-route-tab to="/lithic" label="Lithic-API" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Sub-Troll: Gain controll of your subscriptions</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>
