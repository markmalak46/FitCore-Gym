const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const backdrop = document.getElementById("backdrop");
const closeMenuBtn = document.getElementById("closeMenu");
const topbar = document.getElementById("topbar");
const toTop = document.querySelector(".to-top");

function openMenu() {
  if (!mobileMenu || !backdrop || !burger) return;

  mobileMenu.classList.add("show");
  backdrop.classList.add("show");
  mobileMenu.setAttribute("aria-hidden", "false");
  burger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!mobileMenu || !backdrop || !burger) return;

  mobileMenu.classList.remove("show");
  backdrop.classList.remove("show");
  mobileMenu.setAttribute("aria-hidden", "true");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

burger?.addEventListener("click", () => {
  const isOpen = mobileMenu?.classList.contains("show");
  isOpen ? closeMenu() : openMenu();
});

closeMenuBtn?.addEventListener("click", closeMenu);
backdrop?.addEventListener("click", closeMenu);

// Close menu when clicking any link inside mobile menu
mobileMenu?.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.tagName === "A") closeMenu();
});

// ESC closes menu
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu?.classList.contains("show")) closeMenu();
});

window.addEventListener("scroll", () => {
  const y = window.scrollY || 0;

  // topbar shadow
  if (topbar) {
    if (y > 10) topbar.classList.add("is-scrolled");
    else topbar.classList.remove("is-scrolled");
  }

  // back to top button
  if (toTop) {
    if (y > 600) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }
});

// BackToTop click (smooth)
toTop?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// اجمع روابط الديسكتوب + الموبايل (أي لينك يبدأ بـ #)
const navLinks = Array.from(
  document.querySelectorAll("header nav a, #mobileMenu a")
).filter((a) => (a.getAttribute("href") || "").startsWith("#"));

// سكاشن الصفحة المرتبطة باللينكات
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

// helper: فعل لينك واحد
function activateLinkById(id) {
  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === `#${id}`);
  });
}

// فعل لينك فور الضغط (قبل ما الـ observer يشتغل)
navLinks.forEach((a) => {
  a.addEventListener("click", () => {
    const id = (a.getAttribute("href") || "").replace("#", "");
    if (id) activateLinkById(id);
  });
});

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) activateLinkById(visible.target.id);
    },
    {
      root: null,
      rootMargin: "-90px 0px -55% 0px",
      threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

const faqItems = Array.from(document.querySelectorAll(".faq-item"));

function closeFaqItem(item) {
  const btn = item.querySelector(".qa");
  const panel = item.querySelector(".qa-panel");
  const ico = item.querySelector(".qa-ico");

  btn?.setAttribute("data-open", "false");
  btn?.setAttribute("aria-expanded", "false");
  panel?.classList.add("hidden");
  ico?.classList.remove("rotate-45");
}

function openFaqItem(item) {
  const btn = item.querySelector(".qa");
  const panel = item.querySelector(".qa-panel");
  const ico = item.querySelector(".qa-ico");

  btn?.setAttribute("data-open", "true");
  btn?.setAttribute("aria-expanded", "true");
  panel?.classList.remove("hidden");
  ico?.classList.add("rotate-45");
}

faqItems.forEach((item) => {
  const btn = item.querySelector(".qa");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("data-open") === "true";

    // اقفل أي كارد تاني
    faqItems.forEach((it) => {
      if (it !== item) closeFaqItem(it);
    });

    // افتح / اقفل الحالي
    if (isOpen) closeFaqItem(item);
    else openFaqItem(item);
  });
});
