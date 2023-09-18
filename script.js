document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", document.getElementById("zplFile").files[0]);

    try {
      const response = await fetch(
        "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
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
        ).innerHTML = `<img src="${imageUrl}" alt="Label">`;
      } else {
        console.error("Failed to convert ZPL to PNG");
      }
    } catch (error) {
      console.error(error);
    }
  });
