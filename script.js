document.addEventListener('DOMContentLoaded', () => {
    // Input Elements
    const filamentPriceInput = document.getElementById('filamentPrice');
    const filamentWeightInput = document.getElementById('filamentWeight');
    const modelWeightInput = document.getElementById('modelWeight');
    const printTimeInput = document.getElementById('printTime');
    const printerPowerInput = document.getElementById('printerPower');
    const energyCostInput = document.getElementById('energyCost');
    const markupPercentInput = document.getElementById('markupPercent');
    const extraCostInput = document.getElementById('extraCost');

    // Display & Output Elements
    const markupValueDisplay = document.getElementById('markupValueDisplay');
    const printTimeUnitLabel = document.getElementById('printTimeUnitLabel');
    const filamentBreakdownLabel = document.getElementById('filamentBreakdownLabel');
    const energyBreakdownLabel = document.getElementById('energyBreakdownLabel');
    const profitBreakdownLabel = document.getElementById('profitBreakdownLabel');

    const resFilamentCost = document.getElementById('resFilamentCost');
    const resEnergyCost = document.getElementById('resEnergyCost');
    const resExtraCost = document.getElementById('resExtraCost');
    const resBaseCost = document.getElementById('resBaseCost');
    const resProfit = document.getElementById('resProfit');
    const resFinalPrice = document.getElementById('resFinalPrice');
    const resetBtn = document.getElementById('resetBtn');

    // Default values
    const defaultValues = {
        filamentPrice: '',
        filamentWeight: '1000',
        modelWeight: '',
        printTime: '',
        printerPower: '200',
        energyCost: '650',
        markupPercent: '100',
        extraCost: '5000'
    };

    // Update custom slider progress bar
    function updateSliderProgress() {
        const min = parseFloat(markupPercentInput.min) || 0;
        const max = parseFloat(markupPercentInput.max) || 300;
        const val = parseFloat(markupPercentInput.value) || 0;
        const percentage = ((val - min) / (max - min)) * 100;
        markupPercentInput.style.setProperty('--range-progress', `${percentage}%`);
    }

    // Load saved data from LocalStorage
    function loadSavedState() {
        const saved = localStorage.getItem('vipercost_final_state');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                filamentPriceInput.value = data.filamentPrice !== undefined ? data.filamentPrice : defaultValues.filamentPrice;
                filamentWeightInput.value = data.filamentWeight !== undefined ? data.filamentWeight : defaultValues.filamentWeight;
                modelWeightInput.value = data.modelWeight !== undefined ? data.modelWeight : defaultValues.modelWeight;
                printTimeInput.value = data.printTime !== undefined ? data.printTime : defaultValues.printTime;
                printerPowerInput.value = data.printerPower || defaultValues.printerPower;
                energyCostInput.value = data.energyCost || defaultValues.energyCost;
                markupPercentInput.value = data.markupPercent || defaultValues.markupPercent;
                extraCostInput.value = data.extraCost !== undefined ? data.extraCost : defaultValues.extraCost;
            } catch (e) {
                console.error('Error loading state', e);
            }
        }
    }

    // Save state to LocalStorage
    function saveState() {
        const data = {
            filamentPrice: filamentPriceInput.value,
            filamentWeight: filamentWeightInput.value,
            modelWeight: modelWeightInput.value,
            printTime: printTimeInput.value,
            printerPower: printerPowerInput.value,
            energyCost: energyCostInput.value,
            markupPercent: markupPercentInput.value,
            extraCost: extraCostInput.value
        };
        localStorage.setItem('vipercost_final_state', JSON.stringify(data));
    }

    function formatUZS(amount) {
        return Math.round(amount).toLocaleString('ru-RU') + ' сум';
    }

    function calculate() {
        const filamentPrice = parseFloat(filamentPriceInput.value) || 0;
        const filamentWeight = parseFloat(filamentWeightInput.value) || 0;
        const modelWeight = parseFloat(modelWeightInput.value) || 0;
        const printTime = parseFloat(printTimeInput.value) || 0;
        const printerPower = parseFloat(printerPowerInput.value) || 0;
        const energyCost = parseFloat(energyCostInput.value) || 0;
        const markupPercent = parseFloat(markupPercentInput.value) || 0;
        const extraCost = parseFloat(extraCostInput.value) || 0;

        // Update percent and slider track fill
        markupValueDisplay.textContent = markupPercent + '%';
        updateSliderProgress();

        // Update breakdown labels
        printTimeUnitLabel.textContent = (printTime || 0) + ' ч.';
        filamentBreakdownLabel.textContent = `Пластик ( ${modelWeight} г ):`;
        energyBreakdownLabel.textContent = `⚡ Электричество ( ${printTime} ч ):`;
        profitBreakdownLabel.textContent = `📈 Прибыль ( ${markupPercent} %):`;

        // Formulas
        const costPerGram = filamentWeight > 0 ? (filamentPrice / filamentWeight) : 0;
        const totalFilamentCost = costPerGram * modelWeight;

        const energyKWh = (printerPower / 1000) * printTime;
        const totalEnergyCost = energyKWh * energyCost;

        const baseCost = totalFilamentCost + totalEnergyCost + extraCost;
        const profit = baseCost * (markupPercent / 100);
        const finalPrice = baseCost + profit;

        // Render Outputs
        resFilamentCost.textContent = formatUZS(totalFilamentCost);
        resEnergyCost.textContent = formatUZS(totalEnergyCost);
        resExtraCost.textContent = formatUZS(extraCost);
        resBaseCost.textContent = formatUZS(baseCost);
        resProfit.textContent = '+ ' + formatUZS(profit);
        
        resFinalPrice.innerHTML = Math.round(finalPrice).toLocaleString('ru-RU') + ' <span>сум</span>';

        saveState();
    }

    // Stepper buttons handler (+ / -)
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const action = btn.getAttribute('data-action');
            const step = parseFloat(btn.getAttribute('data-step')) || 1;
            const input = document.getElementById(targetId);
            
            if (input) {
                let currentVal = parseFloat(input.value) || 0;
                if (action === 'increase') {
                    currentVal += step;
                } else if (action === 'decrease') {
                    currentVal = Math.max(0, currentVal - step);
                }
                input.value = currentVal;
                calculate();
            }
        });
    });

    // Reset button handler
    resetBtn.addEventListener('click', () => {
        filamentPriceInput.value = defaultValues.filamentPrice;
        filamentWeightInput.value = defaultValues.filamentWeight;
        modelWeightInput.value = defaultValues.modelWeight;
        printTimeInput.value = defaultValues.printTime;
        printerPowerInput.value = defaultValues.printerPower;
        energyCostInput.value = defaultValues.energyCost;
        markupPercentInput.value = defaultValues.markupPercent;
        extraCostInput.value = defaultValues.extraCost;
        
        resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            resetBtn.style.transform = 'none';
        }, 300);

        calculate();
    });

    // Event listeners on inputs
    const allInputs = [
        filamentPriceInput,
        filamentWeightInput,
        modelWeightInput,
        printTimeInput,
        printerPowerInput,
        energyCostInput,
        markupPercentInput,
        extraCostInput
    ];

    allInputs.forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Initialize
    loadSavedState();
    calculate();
});
