<template>
  <div class="layout">
    <header class="layout__header">
      <nav class="layout__nav">
        <RouterLink to="/">Inicio</RouterLink>
        <span class="mx-2">·</span>
        <RouterLink to="/staff">Staff</RouterLink>
        <RouterLink to="/join">Ticket (demo)</RouterLink>
      </nav>
    </header>
    <main class="layout__main">
      <RouterView />
    </main>
  </div>
</template>
