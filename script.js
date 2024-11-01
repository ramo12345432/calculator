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

    // Clear display if result is shown and new input isn't an operator
    if (isResultDisplayed && !["+", "-", "*", "/", "%"].includes(value)) {
        clearDisplay();
    }

    // Prevent consecutive operators
    if (["+", "-", "*", "/", "%"].includes(lastChar) && ["+", "-", "*", "/", "%"].includes(value)) {
        return;
    }

    // Allow only one decimal point per number
    if (value === ".") {
        const currentNumber = currentValue.split(/[\+\-\*\/\%]/).pop();
        if (currentNumber.includes(".")) {
            return;
        }
    }

    // Add multiplication sign if a number follows a closing parenthesis
    if (lastChar === ")" && !isNaN(value)) {
        display.value += "*";
    }

    // Handle backspace
    if (value === "←") {
        display.value = currentValue.slice(0, -1);
    } else {
        display.value += value;
        document.getElementById("result").textContent = "";
        document.getElementById("equalSign").textContent = "";
    }

    isResultDisplayed = false; // Reset the result flag when a new value is added
}

function applyPercentage() {
    const display = document.getElementById("display");
    const currentValue = display.value;

    // Append "%" to the current display value if it doesn't already end with it
    if (!currentValue.endsWith("%")) {
        display.value += "%";
    }
}

function calculate() {
  const display = document.getElementById("display");
  const resultDisplay = document.getElementById("result");
  const equalSign = document.getElementById("equalSign");

  try {
      let expression = display.value;

      // Match and calculate expressions like "a%b" as (a/100) * b
      const percentageMatch = expression.match(/(\d+)%(\d+)/);
      if (percentageMatch) {
          const a = parseFloat(percentageMatch[1]); // First number (before %)
          const b = parseFloat(percentageMatch[2]); // Second number (after %)

          // Calculate percentage and replace in the expression
          const percentageValue = (a / 100) * b;
          expression = expression.replace(`${a}%${b}`, percentageValue.toString());
      }

      // Evaluate the final expression
      const result = eval(expression.replace(/x/g, "*"));
      if (result === undefined || result === Infinity || isNaN(result)) {
          throw new Error("Invalid calculation");
      }

      // Format the result to 7 decimal places
      const formattedResult = result.toFixed(2);

      resultDisplay.textContent = formattedResult;
      equalSign.textContent = "=";
      display.value = formattedResult; // Update the display with the formatted result
      isResultDisplayed = true; // Mark that the result is displayed
  } catch (e) {
      resultDisplay.textContent = "Error";
      equalSign.textContent = "";
  }
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

