// Main JavaScript 


const cursor = document.getElementById('custom-cursor');
const label = document.getElementById('cursor-label');

document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

  // Detect elements with custom label on hover
  document.querySelectorAll('[data-cursor-label]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      label.textContent = el.getAttribute('data-cursor-label');
      cursor.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      label.textContent = '';
      cursor.classList.remove('active');
    });
  });

  const customCursor = document.getElementById("custom-cursor");

  document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      customCursor.style.opacity = "0";
    });
    el.addEventListener("mouseleave", () => {
      customCursor.style.opacity = "1";
    });
  });

  
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



  // Header scroll effect
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    lastScrollTop = scrollTop
  })
})



// Code Animation
const codeAnimation = document.getElementById("codeAnimation");
const runButton = document.querySelector(".code-action--run");
const codeOutput = document.getElementById("codeOutput");
const consoleOutput = document.getElementById("consoleOutput");
const closeConsoleBtn = document.getElementById("closeConsoleBtn");

// Output lines without typing effect
const OutPut = [
 
  "Loading job description...",
  "Training skill matcher model...",
  "Matching developers to job requirements...",
  "Best candidate found.",
  "    ", 
  "Top match: Natnael K. (match: 96.0%)",
  "Recommendation: Invite for technical interview.",
  "Resume saved to: /candidates/natnael_k.pdf"
];

let restartPending = false; // new flag
let consoleOpen = false;
let animationCompleted = false;

function createCodeAnimation() {
  if (!codeAnimation) return;

  const codeLines = [
    // Imports
    "import json",
    "import pandas as pd",
    "from sklearn.model_selection import train_test_split",
    "from utils import (",
    "    preprocess,",
    "    extract_skills,",
    "    load_job_desc,",
    "    load_dataset,",
    "    train_skill_matcher",
    ")",
    "",
    "   ",
    // Function: analyze_developers
    "",
    "def analyze_developers(dataset):",
    '    """Process dev data and match skills to job requirements."""',
    "    results = {}",
    "",
    "    # Preprocess developer dataset",
    "    clean_data = preprocess(dataset)",
    "",
    "    # Extract skill features",
    "    features = extract_skills(clean_data)",
    "",
    "    # Load job position requirements",
    "    job_requirements = load_job_desc(\"position.json\")",
    "",
    "    # Train matching model", 
    "    model = train_skill_matcher(features, job_requirements)",  
    "",
    "    # Match developers to job",
    "    matches = model.predict(clean_data)",
    "",
    "    # Best candidate",
    "    results[\"top_match\"] = matches[0]",
    "    return results",
    "",
    "   ",
    "",
    "class SkillMatcherModel:",
    "    def __init__(self, config=None):",
    "        self.config = config or {}",
    "        self.model = None",
    "",
    "    def train(self, skills, reqrs):",
    '        print(\"Training model...\")',
    "        self.model = self._build_model(skills, reqrs)",
    "        return self",
    "",
    "    def predict(self, data):",
    "        if self.model is None:",
    '            raise ValueError(\"Not trained\")',
    "        return self.model.match(data)",
    "",
    "   ",
    "",
    "# Main execution",
    'if __name__ == \"__main__\":',
    '    dev_data = load_dataset(\"devs.csv\")',
    "    results = analyze_developers(dev_data)",
    '    print(f\"Top match: {results[\\\"top_match\\\"]}\")',
    "",
    "   ",
    "# Output: Top match: Natnael K. (match: 96.0%)"
  ];

  const codeContainer = document.createElement("div");
  codeContainer.className = "code-container";
  codeAnimation.appendChild(codeContainer);

  // Disable the run button initially
  runButton.disabled = true;
  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    if (lineIndex >= codeLines.length) {
      animationCompleted = true;
      runButton.disabled = false;

      // Wait 5 seconds before restarting only if console is not open
      setTimeout(() => {
        if (!consoleOpen) {
          restartAnimation();
        } else {
          restartPending = true;
        }
      }, 5000); // adjust delay as needed
      return;
    }

    const currentLine = codeLines[lineIndex];

    if (charIndex === 0) {
      const lineElement = document.createElement("div");
      lineElement.className = "code-line";
      codeContainer.appendChild(lineElement);
    }

    const currentLineElement = codeContainer.lastElementChild;

    if (charIndex < currentLine.length) {
      currentLineElement.textContent += currentLine.charAt(charIndex);
      charIndex++;
      codeContainer.scrollTop = codeContainer.scrollHeight;
      setTimeout(typeLine, 15);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLine, 80);
    }
  }

  function restartAnimation() {
    // Clear previous code and output
    codeContainer.innerHTML = "";
    codeOutput.textContent = "";
    consoleOutput.style.display = "none"; // Hide console output on restart

    lineIndex = 0;
    charIndex = 0;
    animationCompleted = false;
    runButton.disabled = true;
    typeLine();
  }

  typeLine();
}

runButton.addEventListener("click", () => {
  if (!animationCompleted) return;

  consoleOpen = true;
  codeOutput.textContent = "";  // Clear previous output
  consoleOutput.style.display = "block";

  let lineIndex = 0;

  // Show output one line at a time
  function showNextOutputLine() {
    if (lineIndex < OutPut.length) {
      // Append next line of output
      codeOutput.textContent += OutPut[lineIndex] + '\n';
      lineIndex++;

      // If there are more lines to show, schedule the next one
      if (lineIndex < OutPut.length) {
        setTimeout(showNextOutputLine, 1000);  // Delay between each line
      }
    }
  }

  showNextOutputLine();
});

closeConsoleBtn.addEventListener("click", () => {
  consoleOutput.style.display = "none";
  consoleOpen = false;

  // Restart the code animation when the console is closed
  if (restartPending) {
    // If the animation is pending restart, clear it and restart animation
    setTimeout(() => {
      codeOutput.textContent = "";
      consoleOutput.style.display = "none";
      restartAnimation();  // Restart the animation
    }, 500);
  }
  // If the console is closed and the restart is not pending, restart the animation immediately
  else {
    restartAnimation();
  }
});

createCodeAnimation();





// Footer Modal
const footerModal = document.getElementById('footerModal');
const closeBtn = document.getElementById('closeFooterModal');
const footerTrigger = document.getElementById('footer-trigger');

const footerObserver = new IntersectionObserver(
  ([entry]) => {
    footerModal.classList.toggle('active', entry.isIntersecting);
  },
  {
    threshold: 0.2, // Better for mobile, adjust if needed
  }
);

footerObserver.observe(footerTrigger);

closeBtn.addEventListener('click', () => {
  footerModal.classList.remove('active');
});

// Section Visibility
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section--visible');
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach(section => sectionObserver.observe(section));

// Dot Slider
document.addEventListener("DOMContentLoaded", function () {
  const dots = document.querySelectorAll(".dot");
  const sections = document.querySelectorAll("section");
  // Click scroll
  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const target = document.querySelector(dot.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Scroll active highlight
  window.addEventListener("scroll", function () {
    let currentSection = null;
    const scrollY = window.scrollY + window.innerHeight / 2;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section;
      }
    });

    dots.forEach((dot) => dot.classList.remove("active"));

    if (currentSection) {
     
      const activeDot = document.querySelector(
        `.dot[data-target="#${currentSection.id}"]`
      );
      if (activeDot) activeDot.classList.add("active");
      
    }
  });
});