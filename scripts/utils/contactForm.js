function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    enableFocusMainElements(false)
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    enableFocusMainElements()
}
