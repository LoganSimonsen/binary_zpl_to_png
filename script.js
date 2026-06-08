const uploadForm = document.getElementById('uploadForm');
const zplFile = document.getElementById('zplFile');
const dropdown = document.getElementById('dropdown');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const status = document.getElementById('status');
const result = document.getElementById('result');
const rotateButton = document.getElementById('rotate-button');
const downloadButton = document.getElementById('download-button');
const clearButton = document.getElementById('clear-button');
const submitButton = uploadForm.querySelector('button[type="submit"]');
const dropzone = document.getElementById('dropzone');
const fileName = document.getElementById('fileName');

let currentRotation = 0;
let currentImageUrl = null;

function updateFileName() {
  const file = zplFile.files[0];
  fileName.textContent = file ? file.name : 'No file selected';
}

function setSelectedFile(files) {
  if (!files || files.length === 0) return;
  zplFile.files = files;
  updateFileName();
  clearStatus();
}

function setStatus(message, type = 'info') {
  status.textContent = message;
  status.className = `status status-${type}`;
}

function clearStatus() {
  status.textContent = '';
  status.className = 'status';
}

function resetForm() {
  uploadForm.reset();
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
    currentImageUrl = null;
  }
  currentRotation = 0;
  result.innerHTML = '';
  updateFileName();
  clearStatus();
  rotateButton.style.display = 'none';
  rotateButton.disabled = true;
  downloadButton.style.display = 'none';
  downloadButton.disabled = true;
  submitButton.disabled = false;
  dropzone.classList.remove('dragover');
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = zplFile.files[0];
  if (!file) {
    setStatus('Please select or drop a .zpl file to upload.', 'error');
    return;
  }

  const selectedDpmm = dropdown.value;
  const width = parseFloat(widthInput.value) || 4;
  const height = parseFloat(heightInput.value) || 6;

  const formData = new FormData();
  formData.append('file', file);

  submitButton.disabled = true;
  rotateButton.disabled = true;
  rotateButton.style.display = 'none';
  result.innerHTML = '';
  setStatus('Converting label to PNG...', 'info');

  try {
    const response = await fetch(
      `https://api.labelary.com/v1/printers/${selectedDpmm}/labels/${width}x${height}/0/`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      setStatus(`Failed to convert ZPL to PNG. ${response.status} ${response.statusText}. ${text}`, 'error');
      return;
    }

    const blob = await response.blob();
    if (currentImageUrl) {
      URL.revokeObjectURL(currentImageUrl);
      currentImageUrl = null;
    }
    const imageUrl = URL.createObjectURL(blob);
    currentImageUrl = imageUrl;
    result.innerHTML = `<img id="image" src="${imageUrl}" alt="ZPL label PNG">`;
    setStatus('PNG preview generated. Use Rotate or Download if needed.', 'success');
    rotateButton.style.display = 'inline-block';
    rotateButton.disabled = false;
    downloadButton.style.display = 'inline-block';
    downloadButton.disabled = false;
    currentRotation = 0;
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message || err}`, 'error');
  } finally {
    submitButton.disabled = false;
  }
});

zplFile.addEventListener('change', updateFileName);
clearButton.addEventListener('click', resetForm);

dropzone.addEventListener('dragenter', (event) => {
  event.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('dragover');
  const files = event.dataTransfer.files;
  if (files && files.length) {
    setSelectedFile(files);
  }
});

rotateButton.addEventListener('click', () => {
  const img = document.getElementById('image');
  if (!img) return;
  currentRotation = (currentRotation + 90) % 360;
  img.style.transform = `rotate(${currentRotation}deg)`;
});

downloadButton.addEventListener('click', () => {
  if (!currentImageUrl) return;
  const link = document.createElement('a');
  link.href = currentImageUrl;
  link.download = 'label.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

window.addEventListener('beforeunload', () => {
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
});
