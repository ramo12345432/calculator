let isResultDisplayed = false;

function clearDisplay() {
  document.getElementById("display").value = "";
  document.getElementById("result").textContent = "";
  document.getElementById("equalSign").textContent = "";
  isResultDisplayed = false;
}

function appendToDisplay(value) {
  const display = document.getElementById("display");
  const currentValue = display.value;
  const lastChar = currentValue.slice(-1);

  if (isResultDisplayed && !["+", "-", "*", "/", "%"].includes(value)) {
    clearDisplay();
  }

  if (
    ["+", "-", "*", "/", "%"].includes(lastChar) &&
    ["+", "-", "*", "/", "%"].includes(value)
  ) {
    return;
  }

  if (
    value === "." &&
    (currentValue === "" || lastChar === "." || currentValue.includes("."))
  ) {
    return;
  }

  // Handle backspace
  if (value === "←") {
    display.value = currentValue.slice(0, -1);
  } else {
    display.value += value;
    document.getElementById("result").textContent = "";
    document.getElementById("equalSign").textContent = "";
  }

  isResultDisplayed = false;
}

function toggleSign() {
  const display = document.getElementById("display");
  let currentValue = display.value;

  // Split by operators to get the last operand
  const operands = currentValue.split(/([+\-*/])/);
  const lastOperand = operands[operands.length - 1];

  // Only proceed if the last operand is a number
  if (!isNaN(lastOperand) && lastOperand.trim() !== "") {
    let toggledOperand;

    // Toggle sign and add parentheses if result is negative
    if (lastOperand.startsWith("-")) {
      toggledOperand = lastOperand.slice(1); // Remove the minus sign
    } else {
      toggledOperand = "-" + lastOperand;
    }

    // Add parentheses if toggled operand is negative
    if (toggledOperand.startsWith("-")) {
      toggledOperand = `(${toggledOperand})`;
    }

    // Replace the last operand in the array
    operands[operands.length - 1] = toggledOperand;

    // Update the display value
    display.value = operands.join("");
  }
}




function applyPercentage() {
  const display = document.getElementById("display");
  const currentValue = parseFloat(display.value);

  if (!isNaN(currentValue)) {
    display.value = (currentValue / 100).toString();
  }
}

function calculate() {
  const display = document.getElementById("display");
  const resultDisplay = document.getElementById("result");
  const equalSign = document.getElementById("equalSign");

  try {
    const result = eval(display.value.replace(/x/g, "*"));
    if (result === undefined || result === Infinity || isNaN(result)) {
      throw new Error("Invalid calculation");
    }
    resultDisplay.textContent = result;
    equalSign.textContent = "=";
    display.value = result.toString();
    isResultDisplayed = true;
  } catch (e) {
    resultDisplay.textContent = "Error";
    equalSign.textContent = "";
  }
}
