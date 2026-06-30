/* ==========================================
   MAIN
========================================== */

async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) return;

    const response = await fetch(file);

    element.innerHTML = await response.text();

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("header", "/assets/components/header.html");

    await loadComponent("footer", "/assets/components/footer.html");

});