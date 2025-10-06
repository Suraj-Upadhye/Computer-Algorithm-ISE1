let array = [];
let steps = [];
let currentStep = 0;
let interval = null;
let speed = 500;
let comparisons = 0;
let swaps = 0;

const arrayContainer = document.getElementById("arrayContainer");
const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");

document.getElementById("userInputBtn").onclick = () => {
  const input = document.getElementById("customArray").value;
  if (input) {
    array = input.split(",").map(Number);
    resetVisualizer();
  }
};

document.getElementById("randomBtn").onclick = () => {
  array = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);
  resetVisualizer();
};

document.getElementById("bestBtn").onclick = () => {
  array = Array.from({ length: 10 }, (_, i) => i + 1);
  resetVisualizer();
};

document.getElementById("worstBtn").onclick = () => {
  array = Array.from({ length: 10 }, (_, i) => 10 - i);
  resetVisualizer();
};

document.getElementById("speedSelect").onchange = (e) => {
  speed = Number(e.target.value);
  if (interval) {
    clearInterval(interval);
    interval = setInterval(nextStep, speed);
  }
};

document.getElementById("playBtn").onclick = () => {
  if (!interval) interval = setInterval(nextStep, speed);
};
document.getElementById("pauseBtn").onclick = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};
document.getElementById("nextBtn").onclick = nextStep;
document.getElementById("prevBtn").onclick = prevStep;
document.getElementById("resetBtn").onclick = resetVisualizer;

function resetVisualizer() {
  comparisons = 0;
  swaps = 0;
  comparisonsEl.innerText = comparisons;
  swapsEl.innerText = swaps;
  currentStep = 0;
  steps = [];
  generateSteps([...array]);
  renderArray(array);
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function generateSteps(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ arr: [...arr], comparing: [minIdx, j], swapping: [] });
      comparisons++;
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      steps.push({ arr: [...arr], comparing: [], swapping: [i, minIdx] });
    }
  }
}

function renderArray(arr, comparing = [], swapping = []) {
  arrayContainer.innerHTML = "";
  const maxVal = Math.max(...arr);
  arr.forEach((val, idx) => {
    const bar = document.createElement("div");
    bar.className = "array-bar";
    if (comparing.includes(idx)) bar.classList.add("active");
    if (swapping.includes(idx)) bar.classList.add("min");
    bar.style.height = `${(val / maxVal) * 150 + 20}px`;
    bar.style.width = "30px";
    bar.innerText = val;
    arrayContainer.appendChild(bar);
  });
  comparisonsEl.innerText = comparisons;
  swapsEl.innerText = swaps;
}

function nextStep() {
  if (currentStep < steps.length) {
    const step = steps[currentStep];
    renderArray(step.arr, step.comparing, step.swapping);
    currentStep++;
  } else if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    const step = steps[currentStep];
    renderArray(step.arr, step.comparing, step.swapping);
  }
}
