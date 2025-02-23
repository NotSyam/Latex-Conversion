document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const output = document.getElementById('output');

    convertBtn.addEventListener('click', async function() {
        const text = inputText.value.trim();
        
        if (!text) {
            alert('Please enter a LaTeX expression');
            return;
        }

        output.innerHTML = '';
        
        try {
            // Buat container untuk formula
            const container = document.createElement('div');
            container.className = 'formula-container';
            // Tambahkan delimiters untuk mode display math
            container.innerHTML = `\\[${text}\\]`;
            output.appendChild(container);
            
            // Tunggu MathJax selesai loading
            if (typeof MathJax !== 'undefined') {
                await MathJax.typesetPromise([container]).then(() => {
                    downloadBtn.disabled = false;
                });
            } else {
                console.error('MathJax not loaded');
            }
        } catch (error) {
            console.error('Error:', error);
            output.innerHTML = 'Error rendering formula';
        }
    });

    downloadBtn.addEventListener('click', async function() {
        const formula = output.querySelector('.MathJax');
        if (!formula) return;

        try {
            const canvas = await html2canvas(formula, {
                scale: 3,
                backgroundColor: '#FFFFFF',
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: function(clonedDoc) {
                    const clonedFormula = clonedDoc.querySelector('.MathJax');
                    if (clonedFormula) {
                        clonedFormula.style.margin = '0';
                        clonedFormula.style.padding = '20px';
                    }
                }
            });

            // Download image
            const link = document.createElement('a');
            link.download = 'formula.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
        }
    });

    inputText.addEventListener('input', function() {
        const hasText = this.value.trim().length > 0;
        convertBtn.disabled = !hasText;
        if (!hasText) {
            downloadBtn.disabled = true;
            output.innerHTML = '';
        }
    });

    convertBtn.disabled = !inputText.value.trim();
    downloadBtn.disabled = true;
});