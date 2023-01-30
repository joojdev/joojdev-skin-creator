const imageInput = document.querySelector('#imageInput')
const preview = document.querySelector('#preview')
const mainForm = document.querySelector('#mainForm')
const resultCanvasElement = document.querySelector('#result')
const memoryCanvasElement = document.querySelector('#memory')

const resultCanvas = resultCanvasElement.getContext('2d')
const memoryCanvas = memoryCanvasElement.getContext('2d')

const image = new Image()
image.src = './images/template.png'

image.onload = () => {
  resultCanvas.drawImage(image, 0, 0)
}

mainForm.onsubmit = (event) => {
  event.preventDefault()

  // Front

  drawAreaFromImage(memoryCanvas, 4, 0, 8, 8, resultCanvas, 8, 8) // Head
  drawAreaFromImage(memoryCanvas, 4, 8, 8, 12, resultCanvas, 20, 20) // Chest
  drawAreaFromImage(memoryCanvas, 0, 8, 4, 12, resultCanvas, 44, 20) // Right Arm
  drawAreaFromImage(memoryCanvas, 12, 8, 4, 12, resultCanvas, 36, 52) // Left Arm
  drawAreaFromImage(memoryCanvas, 4, 20, 4, 12, resultCanvas, 4, 20) // Right Leg
  drawAreaFromImage(memoryCanvas, 8, 20, 4, 12, resultCanvas, 20, 52) // Left Leg

  // Back

  drawAreaFromImage(memoryCanvas, 4, 0, 8, 8, resultCanvas, 24, 8, true) // Head
  drawAreaFromImage(memoryCanvas, 4, 8, 8, 12, resultCanvas, 32, 20, true) // Chest
  drawAreaFromImage(memoryCanvas, 0, 8, 4, 12, resultCanvas, 52, 20, true) // Right Arm
  drawAreaFromImage(memoryCanvas, 12, 8, 4, 12, resultCanvas, 44, 52, true) // Left Arm
  drawAreaFromImage(memoryCanvas, 4, 20, 4, 12, resultCanvas, 12, 20, true) // Right Leg
  drawAreaFromImage(memoryCanvas, 8, 20, 4, 12, resultCanvas, 28, 52, true) // Left Leg

  // Blends (don't even try to understand at this point.)

  // Chest

  drawRepeatedLines(memoryCanvas, 11, 8, 12, resultCanvas, 4, 28, 20)
  drawRepeatedLines(memoryCanvas, 4, 8, 12, resultCanvas, 4, 16, 20)
  drawRepeatedLines(memoryCanvas, 4, 8, 8, resultCanvas, 4, 20, 16, false)
  drawRepeatedLines(memoryCanvas, 4, 19, 8, resultCanvas, 4, 28, 16, false)

  // Head

  drawRepeatedLines(memoryCanvas, 11, 0, 8, resultCanvas, 8, 16, 8)
  drawRepeatedLines(memoryCanvas, 4, 0, 8, resultCanvas, 8, 0, 8)
  drawRepeatedLines(memoryCanvas, 4, 0, 8, resultCanvas, 8, 8, 0, false)
  drawRepeatedLines(memoryCanvas, 4, 7, 8, resultCanvas, 8, 16, 0, false)

  // Right Arm

  drawRepeatedLines(memoryCanvas, 3, 8, 12, resultCanvas, 4, 48, 20)
  drawRepeatedLines(memoryCanvas, 0, 8,  12, resultCanvas, 4, 40, 20)
  drawRepeatedLines(memoryCanvas, 0, 8, 4, resultCanvas, 4, 44, 16, false)
  drawRepeatedLines(memoryCanvas, 0, 19, 4, resultCanvas, 4, 48, 16, false)

  // Left Arm

  drawRepeatedLines(memoryCanvas, 15, 8, 12, resultCanvas, 4, 40, 52)
  drawRepeatedLines(memoryCanvas, 12, 8,  12, resultCanvas, 4, 32, 52)
  drawRepeatedLines(memoryCanvas, 12, 8, 4, resultCanvas, 4, 36, 48, false)
  drawRepeatedLines(memoryCanvas, 12, 19, 4, resultCanvas, 4, 40, 48, false)

  // Right Leg

  drawRepeatedLines(memoryCanvas, 7, 20, 12, resultCanvas, 4, 8, 20)
  drawRepeatedLines(memoryCanvas, 4, 20, 12, resultCanvas, 4, 0, 20)
  drawRepeatedLines(memoryCanvas, 4, 20, 4, resultCanvas, 4, 4, 16, false)
  drawRepeatedLines(memoryCanvas, 4, 31, 4, resultCanvas, 4, 8, 16, false)

  // Left Leg
  
  drawRepeatedLines(memoryCanvas, 11, 20, 12, resultCanvas, 4, 24, 52)
  drawRepeatedLines(memoryCanvas, 8, 20, 12, resultCanvas, 4, 16, 52)
  drawRepeatedLines(memoryCanvas, 8, 20, 4, resultCanvas, 4, 20, 48, false)
  drawRepeatedLines(memoryCanvas, 8, 31, 4, resultCanvas, 4, 24, 48, false)
}

imageInput.onchange = ({ target }) => {
  if (target.files && target.files[0]) {
    const reader = new FileReader()
    reader.onload = (event) => {
      preview.src = event.target.result
    }
    
    reader.readAsDataURL(target.files[0])
  }
}

preview.onload = () => {
  if (preview.naturalWidth != 16 || preview.naturalHeight != 32) {
    preview.src = ''
    imageInput.value = ''
  
    alert('The image must be 16 pixels (width) by 32 pixels (height)!')
  } else {
    memoryCanvas.drawImage(preview, 0, 0)
  }
}

function drawAreaFromImage(image, oldX, oldY, width, height, canvas, newX, newY, reverse = false) {
  let pixelRowArray = []

  for (let y = oldY; y < oldY + height; y++) {
    let pixelRow = []
    for (let x = oldX; x < oldX + width; x++) {
      const [r, g, b] = image.getImageData(x, y, 1, 1).data    
      pixelRow.push([r, g, b])
    }
    pixelRowArray.push(pixelRow)
  }

  if (reverse) {
    pixelRowArray = pixelRowArray.map(pixelRow => {
      return pixelRow.reverse()
    })
  }

  pixelRowArray.forEach((pixelRow, y) => {
    pixelRow.forEach(([r, g, b], x) => {
      canvas.fillStyle = `rgb(${r}, ${g}, ${b})`
      canvas.fillRect(newX + x, newY + y, 1, 1)
    })
  })
}

function drawRepeatedLines(image, fromX, fromY, size, canvas, iterations, newX, newY, vertical = true) {
  if (vertical) {
    let pixelColumn = []

    for (let y = fromY; y < fromY + size; y++) {
      const [r, g, b] = image.getImageData(fromX, y, 1, 1).data    
      pixelColumn.push([r, g, b])
    }

    for (let i = 0; i < iterations; i++) {
      pixelColumn.forEach(([r, g, b], y) => {
        canvas.fillStyle = `rgb(${r}, ${g}, ${b})`
        canvas.fillRect(newX + i, newY + y, 1, 1)
      })
    }
  } else {
    let pixelRow = []
    
    for (let x = fromX; x < fromX + size; x++) {
      const [r, g, b] = image.getImageData(x, fromY, 1, 1).data
      pixelRow.push([r, g, b])
    }

    for (let i = 0; i < iterations; i++) {
      pixelRow.forEach(([r, g, b], x) => {
        canvas.fillStyle = `rgb(${r}, ${g}, ${b})`
        canvas.fillRect(newX + x, newY + i, 1, 1)
      })
    }
  }
}