// Dark Mode Toggle Functionality

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

  // Check for saved theme preference or use the system preference
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add("dark-mode")
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")

    // Save preference to localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark")
      themeToggle.setAttribute("aria-label", "Switch to light mode")
    } else {
      localStorage.setItem("theme", "light")
      themeToggle.setAttribute("aria-label", "Switch to dark mode")
    }
  })

  // Update aria-label based on current theme
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.setAttribute("aria-label", "Switch to light mode")
  } else {
    themeToggle.setAttribute("aria-label", "Switch to dark mode")
  }
})
