<template>
  <div class="layout">
    <header class="layout__header">
      <nav class="layout__nav">
        <RouterLink to="/">Inicio</RouterLink>
        <span class="mx-2">·</span>
        <RouterLink to="/staff">Staff</RouterLink>
        <RouterLink to="/ticket/01K4ST1RTAQ0A9S75DG5418QG9">Ticket (demo)</RouterLink>
      </nav>
    </header>
    <main class="layout__main">
      <RouterView />
    </main>
  </div>
</template>
