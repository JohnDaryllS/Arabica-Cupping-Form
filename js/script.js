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

    // Setup all range inputs for all batches
    for (let i = 1; i <= 10; i++) {
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
        document.querySelectorAll(`input[name="batch${i}_uniformity"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                calculateTotalScore(i);
            });
        });
        document.querySelectorAll(`input[name="batch${i}_clean_cup"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                calculateTotalScore(i);
            });
        });
        document.querySelectorAll(`input[name="batch${i}_sweetness"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                calculateTotalScore(i);
            });
        });
        
        // Calculate defect points when defective cups or intensity changes
        const defectiveCupsInput = document.getElementById(`defectiveCups${i}`);
        const intensityInput = document.getElementById(`intensity${i}`);
        
        if (defectiveCupsInput) {
            defectiveCupsInput.addEventListener('input', function() {
                calculateDefectPoints(i);
            });
        }
        
        if (intensityInput) {
            intensityInput.addEventListener('input', function() {
                calculateDefectPoints(i);
            });
        }
    }
    
    // Setup range input function
    function setupRangeInput(inputId, valueId) {
        const input = document.getElementById(inputId);
        const valueDisplay = document.getElementById(valueId);
        
        if (input && valueDisplay) {
            input.addEventListener('input', function() {
                valueDisplay.textContent = parseFloat(this.value).toFixed(2);
                const batchNumber = inputId.match(/\d+/)?.[0] || '1';
                calculateTotalScore(batchNumber);
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
    function calculateDefectPoints(batchNumber) {
        const defectiveCups = parseInt(document.getElementById(`defectiveCups${batchNumber}`).value) || 0;
        const intensity = parseInt(document.getElementById(`intensity${batchNumber}`).value) || 0;
        
        // Calculate defect points (multiply cups by intensity)
        const defectPoints = defectiveCups * intensity;
        document.getElementById(`defectPoints${batchNumber}`).value = defectPoints;
        
        // Calculate final score
        calculateFinalScore(batchNumber);
    }
    
    // Calculate total score for a specific batch according to SCA standards
    function calculateTotalScore(batchNumber) {
        let total = 0;
        
        // Add up all attribute scores with their respective weights:
        // Fragrance/Aroma - 10 points
        total += parseFloat(document.getElementById(`fragranceAroma${batchNumber}`).value) || 0;
        // Flavor - 10 points
        total += parseFloat(document.getElementById(`flavor${batchNumber}`).value) || 0;
        // Aftertaste - 10 points
        total += parseFloat(document.getElementById(`aftertaste${batchNumber}`).value) || 0;
        // Acidity - 10 points
        total += parseFloat(document.getElementById(`acidity${batchNumber}`).value) || 0;
        // Body - 10 points
        total += parseFloat(document.getElementById(`body${batchNumber}`).value) || 0;
        
        // Uniformity - 10 points (radio button)
        const uniformity = document.querySelector(`input[name="batch${batchNumber}_uniformity"]:checked`);
        total += parseFloat(uniformity?.value) || 0;
        
        // Clean Cup - 10 points (radio button)
        const cleanCup = document.querySelector(`input[name="batch${batchNumber}_clean_cup"]:checked`);
        total += parseFloat(cleanCup?.value) || 0;
        
        // Sweetness - 10 points (radio button)
        const sweetness = document.querySelector(`input[name="batch${batchNumber}_sweetness"]:checked`);
        total += parseFloat(sweetness?.value) || 0;
        
        // Balance - 10 points
        total += parseFloat(document.getElementById(`balance${batchNumber}`).value) || 0;
        
        // Overall - 10 points
        total += parseFloat(document.getElementById(`overall${batchNumber}`).value) || 0;
        
        // Cap the total score at 100 (though with proper weights it shouldn't exceed this)
        total = Math.min(total, 100);
        
        document.getElementById(`totalScore${batchNumber}`).value = total.toFixed(2);
        calculateFinalScore(batchNumber);
    }
    
    // Calculate final score for a specific batch
    function calculateFinalScore(batchNumber) {
        const totalScore = parseFloat(document.getElementById(`totalScore${batchNumber}`).value) || 0;
        const defectPoints = parseFloat(document.getElementById(`defectPoints${batchNumber}`).value) || 0;
        
        // Calculate final score (total score minus defect points, minimum 0)
        const finalScore = Math.max(totalScore - defectPoints, 0);
        document.getElementById(`finalScore${batchNumber}`).value = finalScore.toFixed(2);
    }
    
    // Form submission handler
    const form = document.getElementById('cuppingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Simple validation
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const tableNo = document.getElementById('tableNo').value;
            
            if (!name || !date || !tableNo) {
                e.preventDefault(); // Prevent form submission
                alert('Please fill in all required fields (Name, Date, Table no)');
                return;
            }
            
            // Show success message
            document.getElementById('successMessage').classList.remove('hidden');
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
            
            // The form will submit to FormSubmit automatically
        });
    }
    
    // Initialize total score calculation for all batches
    for (let i = 1; i <= 10; i++) {
        calculateTotalScore(i);
    }
});