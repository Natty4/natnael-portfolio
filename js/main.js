// Main JavaScript for Natnael 's Portfolio

const codeAnimation = document.getElementById("codeAnimation")
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav__menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
      navToggle.setAttribute("aria-expanded", navToggle.getAttribute("aria-expanded") === "false" ? "true" : "false")
    })
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav__link, .footer__link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
        navToggle.setAttribute("aria-expanded", "false")
      }

      // Only apply smooth scroll if it's an anchor link
      const targetId = this.getAttribute("href")
      if (targetId.startsWith("#") && targetId !== "#") {
        e.preventDefault()

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          const headerHeight = document.querySelector(".header").offsetHeight
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Form submission
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const formObject = Object.fromEntries(formData.entries())

      // Simulate form submission
      console.log("Form submitted:", formObject)

      // Show success message (in a real implementation, this would happen after API response)
      const successMessage = document.createElement("div")
      successMessage.className = "form-success"
      successMessage.textContent = "Thank you for your message! I will get back to you soon."
      successMessage.style.padding = "1rem"
      successMessage.style.marginTop = "1rem"
      successMessage.style.backgroundColor = "var(--color-success)"
      successMessage.style.color = "white"
      successMessage.style.borderRadius = "var(--radius-md)"

      contactForm.appendChild(successMessage)
      contactForm.reset()

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove()
      }, 5000)
    })
  }

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll(".skill-item__progress")

  function animateSkillBars() {
    skillBars.forEach((bar) => {
      const barPosition = bar.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.2

      if (barPosition < screenPosition) {
        bar.style.width = bar.style.width || bar.getAttribute("style").split("width:")[1].trim()
      } else {
        bar.style.width = "0%"
      }
    })
  }

  // Initial check for elements in viewport
  animateSkillBars()

  // Check on scroll
  window.addEventListener("scroll", animateSkillBars)

  // Header scroll effect
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      header.style.boxShadow = "var(--shadow-lg)"
    } else {
      header.style.boxShadow = "var(--shadow-md)"
    }

    lastScrollTop = scrollTop
  })
})


// Code Animation
function createCodeAnimation() {
  if (!codeAnimation) return
  
  const codeLines = [
    "def analyze_developers(dataset):",
    '    """Process dev data and match skills to job requirements."""',
    "    results = {}",
    "    ",
    "    # Preprocess developer dataset",
    "    clean_data = preprocess(dataset)",
    "    ",
    "    # Extract skill features",
    "    features = extract_skills(clean_data)",
    "    ",
    "    # Load job position requirements",
    "    job_requirements = load_job_description(\"position.json\")",
    "    ",
    "    # Train matching model",
    "    model = train_skill_matcher(features, job_requirements)",
    "    ",
    "    # Match developers to job",
    "    matches = model.predict(clean_data)",
    "    ",
    "    results[\"top_match\"] = matches[0]  # Best candidate",
    "    return results",
    "    ",
    "class SkillMatcherModel:",
    "    def __init__(self, config=None):",
    "        self.config = config or {}",
    "        self.model = None",
    "    ",
    "    def train(self, skills, requirements):",
    '        print("Training skill-matching model...")',
    "        self.model = self._build_model(skills, requirements)",
    "        return self",
    "    ",
    "    def predict(self, data):",
    "        if self.model is None:",
    '            raise ValueError("Model not trained")',
    "        return self.model.match(data)",
    "    ",
    "# Main execution",
    'if __name__ == "__main__":',
    '    dev_data = load_dataset("developers.csv")',
    "    results = analyze_developers(dev_data)",
    '    print(f"Top candidate: {results[\'top_match\']}")',
    '   ',
    '# Output: Top candidate: Natnael K. (match: 96.5%)',
  ];

  // Create code container
  const codeContainer = document.createElement("div")
  codeContainer.className = "code-container"
  codeAnimation.appendChild(codeContainer)

  // Add code lines with typing effect
  let lineIndex = 0
  let charIndex = 0

  function typeLine() {
    if (lineIndex >= codeLines.length) {
      // Start over when all lines are typed
      setTimeout(() => {
        codeContainer.innerHTML = ""
        lineIndex = 0
        typeLine()
      }, 3000)
      return
    }

    const currentLine = codeLines[lineIndex]

    if (charIndex === 0) {
      // Create new line element
      const lineElement = document.createElement("div")
      lineElement.className = "code-line"
      codeContainer.appendChild(lineElement)
    }

    const currentLineElement = codeContainer.lastElementChild

    if (charIndex < currentLine.length) {
      // Add character to current line
      currentLineElement.textContent += currentLine.charAt(charIndex)
      charIndex++
      setTimeout(typeLine, 20)
    } else {
      // Move to next line
      lineIndex++
      charIndex = 0
      setTimeout(typeLine, 100)
    }
  }

  // Start typing animation
  typeLine()

  // Add CSS for code animation
  const style = document.createElement("style")
  style.textContent = `
    .code-container {
      padding: 20px;
      font-family: 'Courier New', monospace;
      color:#4d4d0c;
      height: 100%;
      overflow: auto;
    }
    
    .code-line {
      line-height: 1.5;
      white-space: pre;
    }
    
    .light-theme .code-container {
      color: #272822;
    }
  `
  document.head.appendChild(style)
}

// Initialize code animation
createCodeAnimation()