import { useState } from 'react';
import { Delete } from 'lucide-react';

const CalculatorButton = ({ 
  label, 
  onClick, 
  className = "",
  variant = "default"
}: { 
  label: React.ReactNode, 
  onClick: () => void, 
  className?: string,
  variant?: "default" | "operator" | "action" | "equals"
}) => {
  const baseStyles = "h-16 text-xl font-medium rounded-2xl transition-all active:scale-95 flex items-center justify-center";
  
  const variants = {
    default: "bg-gray-800 hover:bg-gray-700 text-white",
    operator: "bg-orange-500 hover:bg-orange-400 text-white",
    action: "bg-gray-600 hover:bg-gray-500 text-white",
    equals: "bg-green-500 hover:bg-green-400 text-white"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || overwrite) {
      setDisplay(num);
      setOverwrite(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    if (prevValue === null) {
      setPrevValue(display);
    } else if (operation) {
      const result = calculate(parseFloat(prevValue), parseFloat(display), operation);
      setPrevValue(String(result));
      setDisplay(String(result));
    }
    setOperation(op);
    setOverwrite(true);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && prevValue) {
      const result = calculate(parseFloat(prevValue), parseFloat(display), operation);
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setOverwrite(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setOverwrite(false);
  };

  const handleDelete = () => {
    if (overwrite) {
      setDisplay('0');
      setOverwrite(false);
      return;
    }
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
  };

  const handleToggleSign = () => {
    const current = parseFloat(display);
    setDisplay(String(current * -1));
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-black rounded-3xl p-6 shadow-2xl border border-gray-800">
        {/* Display Area */}
        <div className="mb-6 flex flex-col items-end justify-end h-32 px-2">
          <div className="text-gray-400 text-lg h-6 mb-1">
            {prevValue} {operation}
          </div>
          <div className="text-5xl font-light tracking-tight truncate w-full text-right">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          <CalculatorButton label="AC" onClick={handleClear} variant="action" />
          <CalculatorButton label="±" onClick={handleToggleSign} variant="action" />
          <CalculatorButton label="%" onClick={handlePercent} variant="action" />
          <CalculatorButton label="÷" onClick={() => handleOperation('÷')} variant="operator" />

          <CalculatorButton label="7" onClick={() => handleNumber('7')} />
          <CalculatorButton label="8" onClick={() => handleNumber('8')} />
          <CalculatorButton label="9" onClick={() => handleNumber('9')} />
          <CalculatorButton label="×" onClick={() => handleOperation('×')} variant="operator" />

          <CalculatorButton label="4" onClick={() => handleNumber('4')} />
          <CalculatorButton label="5" onClick={() => handleNumber('5')} />
          <CalculatorButton label="6" onClick={() => handleNumber('6')} />
          <CalculatorButton label="-" onClick={() => handleOperation('-')} variant="operator" />

          <CalculatorButton label="1" onClick={() => handleNumber('1')} />
          <CalculatorButton label="2" onClick={() => handleNumber('2')} />
          <CalculatorButton label="3" onClick={() => handleNumber('3')} />
          <CalculatorButton label="+" onClick={() => handleOperation('+')} variant="operator" />

          <CalculatorButton label="." onClick={handleDecimal} />
          <CalculatorButton label="0" onClick={() => handleNumber('0')} />
          <CalculatorButton 
            label={<Delete size={20} />} 
            onClick={handleDelete} 
          />
          <CalculatorButton label="=" onClick={handleEquals} variant="equals" />
        </div>
      </div>
    </div>
  );
}