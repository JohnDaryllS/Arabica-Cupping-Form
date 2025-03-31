let rightClickCount = 0;

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      rightClickCount++;

      if (rightClickCount >= 3) {
        showModal();
        rightClickCount = 0; // Reset counter after showing the message
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.ctrlKey &&
        ["u", "U", "s", "S", "i", "I", "j", "J"].includes(event.key)
      ) {
        event.preventDefault();
        showModal();
      }
    });

    function showModal() {
      let modal = document.getElementById("warningModal");
      modal.style.display = "block";

      // Automatically close after 3 seconds
      setTimeout(() => {
        modal.style.display = "none";
      }, 3000);
    }