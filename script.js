document.addEventListener('DOMContentLoaded', function() {
    // Track the currently open dropdown
    let currentlyOpenDropdown = null;

    // Initialize all dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const header = dropdown.querySelector('.dropdown-header');
        const content = dropdown.querySelector('.dropdown-content');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        
        header.addEventListener('click', function() {
            const isHidden = content.style.display === 'none';
            
            // Close the currently open dropdown if it's not this one
            if (currentlyOpenDropdown && currentlyOpenDropdown !== dropdown) {
                currentlyOpenDropdown.querySelector('.dropdown-content').style.display = 'none';
                currentlyOpenDropdown.querySelector('.dropdown-arrow').classList.remove('open');
            }
            
            // Toggle this dropdown
            content.style.display = isHidden ? 'block' : 'none';
            arrow.classList.toggle('open', isHidden);
            
            // Update the currently open dropdown
            currentlyOpenDropdown = isHidden ? dropdown : null;
        });
        
        // Initialize dropdowns as closed (except first one if you prefer)
        content.style.display = 'none';
        arrow.classList.remove('open');
    });

    // Setup all range inputs for all cups
    for (let i = 1; i <= 5; i++) {
        // Setup horizontal range inputs
        setupRangeInput(`fragranceAroma${i}`, `fragranceValue${i}`);
        setupRangeInput(`flavor${i}`, `flavorValue${i}`);
        setupRangeInput(`aftertaste${i}`, `aftertasteValue${i}`);
        setupRangeInput(`acidity${i}`, `acidityValue${i}`);
        setupRangeInput(`body${i}`, `bodyValue${i}`);
        setupRangeInput(`overall${i}`, `overallValue${i}`);
        setupRangeInput(`balance${i}`, `balanceValue${i}`);
        
        // Setup vertical range inputs
        setupVerticalRangeInput(`dry${i}`, `dryValue${i}`);
        setupVerticalRangeInput(`break${i}`, `breakValue${i}`);
        
        // Setup intensity range
        const acidityIntensity = document.getElementById(`acidityIntensity${i}`);
        const acidityIntensityValue = document.getElementById(`acidityIntensityValue${i}`);
        if (acidityIntensity && acidityIntensityValue) {
            acidityIntensity.addEventListener('input', function() {
                acidityIntensityValue.textContent = this.value;
            });
        }
        
        // Setup level range
        const bodyLevel = document.getElementById(`bodyLevel${i}`);
        const bodyLevelValue = document.getElementById(`bodyLevelValue${i}`);
        if (bodyLevel && bodyLevelValue) {
            bodyLevel.addEventListener('input', function() {
                bodyLevelValue.textContent = this.value;
            });
        }
        
        // Add event listeners for radio buttons
        document.querySelectorAll(`input[name="uniformity${i}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                calculateTotalScore(i);
            });
        });
        document.querySelectorAll(`input[name="cleanCup${i}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                calculateTotalScore(i);
            });
        });
        document.querySelectorAll(`input[name="sweetness${i}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                calculateTotalScore(i);
            });
        });
        
        // Calculate defect points when defective cups or intensity changes
        document.getElementById(`defectiveCups${i}`).addEventListener('input', function() {
            calculateDefectPoints(i);
        });
        document.getElementById(`intensity${i}`).addEventListener('input', function() {
            calculateDefectPoints(i);
        });
    }
    
    // Setup range input function
    function setupRangeInput(inputId, valueId) {
        const input = document.getElementById(inputId);
        const valueDisplay = document.getElementById(valueId);
        
        if (input && valueDisplay) {
            input.addEventListener('input', function() {
                valueDisplay.textContent = parseFloat(this.value).toFixed(2);
                const cupNumber = inputId.match(/\d+/)?.[0] || '1';
                calculateTotalScore(cupNumber);
            });
        }
    }
    
    // Setup vertical range input function
    function setupVerticalRangeInput(inputId, valueId) {
        const input = document.getElementById(inputId);
        const valueDisplay = document.getElementById(valueId);
        
        if (input && valueDisplay) {
            input.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
            });
        }
    }

    // Calculate defect points based on defective cups and intensity
    function calculateDefectPoints(cupNumber) {
        const defectiveCups = parseInt(document.getElementById(`defectiveCups${cupNumber}`).value) || 0;
        const intensity = parseInt(document.getElementById(`intensity${cupNumber}`).value) || 0;
        
        // Calculate defect points (multiply cups by intensity)
        const defectPoints = defectiveCups * intensity;
        document.getElementById(`defectPoints${cupNumber}`).value = defectPoints;
        
        // Calculate final score
        calculateFinalScore(cupNumber);
    }
    
    // Calculate total score for a specific cup
    function calculateTotalScore(cupNumber) {
        let total = 0;
        
        // Add up all attribute scores
        total += parseFloat(document.getElementById(`fragranceAroma${cupNumber}`).value) || 0;
        total += parseFloat(document.getElementById(`flavor${cupNumber}`).value) || 0;
        total += parseFloat(document.getElementById(`aftertaste${cupNumber}`).value) || 0;
        total += parseFloat(document.getElementById(`acidity${cupNumber}`).value) || 0;
        total += parseFloat(document.getElementById(`body${cupNumber}`).value) || 0;
        
        // Add radio button values
        total += parseFloat(document.querySelector(`input[name="uniformity${cupNumber}"]:checked`).value) || 0;
        total += parseFloat(document.querySelector(`input[name="cleanCup${cupNumber}"]:checked`).value) || 0;
        total += parseFloat(document.getElementById(`balance${cupNumber}`).value) || 0;
        total += parseFloat(document.querySelector(`input[name="sweetness${cupNumber}"]:checked`).value) || 0;
        total += (parseFloat(document.getElementById(`overall${cupNumber}`).value) || 0) * 2; // Overall is weighted double
        
        // Cap the total score at 100
        total = Math.min(total, 100);
        
        document.getElementById(`totalScore${cupNumber}`).value = total.toFixed(2);
        calculateFinalScore(cupNumber);
    }
    
    // Calculate final score for a specific cup
    function calculateFinalScore(cupNumber) {
        const totalScore = parseFloat(document.getElementById(`totalScore${cupNumber}`).value) || 0;
        const defectPoints = parseFloat(document.getElementById(`defectPoints${cupNumber}`).value) || 0;
        
        // Calculate final score (total score minus defect points, minimum 0)
        const finalScore = Math.max(totalScore - defectPoints, 0);
        document.getElementById(`finalScore${cupNumber}`).value = finalScore.toFixed(2);
    }
    
    // Form submission
    document.getElementById('submitBtn').addEventListener('click', function() {
        // Simple validation
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const tableNo = document.getElementById('tableNo').value;
        
        if (!name || !date || !tableNo) {
            alert('Please fill in all required fields (Name, Date, Table no)');
            return;
        }
        
        // In a real app, you would send this data to a server
        // For now, we'll just show a success message
        document.getElementById('successMessage').classList.remove('hidden');
        this.disabled = true;
        
        // Scroll to show the success message
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Initialize total score calculation for all cups
    for (let i = 1; i <= 5; i++) {
        calculateTotalScore(i);
    }
});