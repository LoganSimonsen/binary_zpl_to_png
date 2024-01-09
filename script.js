document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData();
    var selectedDpmm = document.getElementById("dropdown").value;
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    formData.append("file", document.getElementById("zplFile").files[0]);

    try {
      const response = await fetch(
        `https://api.labelary.com/v1/printers/${selectedDpmm}/labels/${width}x${height}/0/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        document.getElementById(
          "result"
        ).innerHTML = `<img id="image" src="${imageUrl}" alt="Label"><br><button id="rotate-button" onclick="rotateImage()">Rotate</button>`;
      } else {
        console.error("Failed to convert ZPL to PNG");
      }
    } catch (error) {
      console.error(error);
    }
  });

let currentRotation = 0;

function rotateImage() {
  currentRotation += 90;
  document.getElementById(
    "image"
  ).style.transform = `rotate(${currentRotation}deg)`;
}
