<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-content">
      <!-- Logo -->
      <RouterLink to="/" class="logo" @click="closeMobileMenu">
        <span class="logo-text">Quantum Mercator</span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <RouterLink to="/" class="nav-link" @click="closeMobileMenu">Dashboard</RouterLink>
        <RouterLink to="/scenario-lab" class="nav-link" @click="closeMobileMenu">Scenario Lab</RouterLink>
        <RouterLink to="/models" class="nav-link" @click="closeMobileMenu">Models</RouterLink>
        <RouterLink to="/about" class="nav-link" @click="closeMobileMenu">About</RouterLink>
      </nav>

      <!-- Mobile Menu Button -->
      <button
        class="mobile-menu-button"
        @click="toggleMobileMenu"
        :class="{ 'active': isMobileMenuOpen }"
        aria-label="Toggle mobile menu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" :class="{ 'open': isMobileMenuOpen }">
      <RouterLink to="/" class="mobile-nav-link" @click="closeMobileMenu">Dashboard</RouterLink>
      <RouterLink to="/scenario-lab" class="mobile-nav-link" @click="closeMobileMenu">Scenario Lab</RouterLink>
      <RouterLink to="/models" class="mobile-nav-link" @click="closeMobileMenu">Models</RouterLink>
      <RouterLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">About</RouterLink>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div
      class="mobile-menu-overlay"
      :class="{ 'open': isMobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(30, 25, 20, 0.95);
  backdrop-filter: blur(15px);
  border-bottom: 3px solid #d4af37;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.navbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
}

.navbar.scrolled {
  background: rgba(30, 25, 20, 0.98);
  border-bottom-color: #f4d03f;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.navbar-content {
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}


/* Logo */
.logo {
  color: #f4f1e8;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
}

.logo::before {
  content: '⚜';
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #d4af37;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo::after {
  content: '⚜';
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #d4af37;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo:hover::before,
.logo:hover::after {
  opacity: 1;
}

.logo:hover {
  color: #d4af37;
  text-shadow: 2px 2px 8px rgba(212, 175, 55, 0.5);
}

.logo-text {
  background: linear-gradient(135deg, #f4f1e8 0%, #d4af37 50%, #f4d03f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #d4af37;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 48%, rgba(212, 175, 55, 0.1) 50%, transparent 52%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link:hover {
  color: #f4d03f;
  border-color: rgba(212, 175, 55, 0.3);
  background: rgba(139, 69, 19, 0.1);
  text-shadow: 1px 1px 4px rgba(244, 208, 63, 0.3);
}

.nav-link.router-link-exact-active {
  color: #f4d03f;
  background: rgba(139, 69, 19, 0.15);
  border-color: #d4af37;
  text-shadow: 1px 1px 4px rgba(244, 208, 63, 0.5);
}

.nav-link.router-link-exact-active::after {
  content: '◆';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #d4af37;
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: rgba(139, 69, 19, 0.1);
  border: 2px solid #d4af37;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.mobile-menu-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #d4af37, #f4d03f, #d4af37);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-menu-button:hover::before {
  opacity: 1;
}

.mobile-menu-button:hover {
  background: rgba(139, 69, 19, 0.2);
  border-color: #f4d03f;
}

.mobile-menu-button.active {
  background: rgba(139, 69, 19, 0.3);
  border-color: #f4d03f;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: #d4af37;
  margin: 2px 0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.mobile-menu-button.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  background: #f4d03f;
}

.mobile-menu-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  background: #f4d03f;
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: rgba(30, 25, 20, 0.98);
  backdrop-filter: blur(15px);
  border-bottom: 3px solid #d4af37;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.mobile-nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.mobile-nav.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-link {
  display: block;
  padding: 1.25rem 2rem;
  color: #d4af37;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
}

.mobile-nav-link::before {
  content: '◆';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-nav-link:hover::before {
  opacity: 1;
}

.mobile-nav-link:hover {
  color: #f4d03f;
  background: rgba(139, 69, 19, 0.1);
  text-shadow: 1px 1px 4px rgba(244, 208, 63, 0.3);
}

.mobile-nav-link.router-link-exact-active {
  color: #f4d03f;
  background: rgba(139, 69, 19, 0.15);
  text-shadow: 1px 1px 4px rgba(244, 208, 63, 0.5);
}

.mobile-nav-link.router-link-exact-active::before {
  opacity: 1;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 998;
}

.mobile-menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-content {
    padding: 1rem;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: flex;
  }

  .logo {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    padding: 0.75rem;
  }

  .logo {
    font-size: 1.1rem;
  }

  .mobile-nav-link {
    padding: 0.875rem 1.5rem;
  }
}
</style>
