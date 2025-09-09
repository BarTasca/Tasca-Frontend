<template>
  <div class="layout">
    <header class="layout__header">
      <nav class="layout__nav">
        <RouterLink to="/">Inicio</RouterLink>
      </nav>
    </header>

    <main class="layout__main">
      <RouterView />
    </main>
  </div>
</template>
