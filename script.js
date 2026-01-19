let currentCorrectAnswer = 12;
let widgetId = 'math-' + Date.now();
let previewTimeout = null; 

function updatePreview() {
    const equation = document.getElementById('equation').value;
    currentCorrectAnswer = parseFloat(document.getElementById('correctAnswer').value) || 0;
    
    let displayEquation = equation.replace(/\?/g, '<span class="question-mark">?</span>');
    document.getElementById('previewEquation').innerHTML = displayEquation;
    
    document.getElementById('previewResult').innerHTML = '';
    document.getElementById('previewResult').className = 'result-message';
}

function updatePreviewDelayed() {
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }
    previewTimeout = setTimeout(updatePreview, 300);
}

function checkPreview() {
    const input = document.getElementById('previewInput');
    const result = document.getElementById('previewResult');
    
    if (!input.value) {
        result.textContent = 'Введите ответ';
        result.className = 'result-message bg-danger text-white';
        return;
    }
    
    const userAnswer = parseFloat(input.value);
    
    if (Math.abs(userAnswer - currentCorrectAnswer) < 0.0001) {
        result.innerHTML = document.getElementById('successMessage').value;
        result.className = 'result-message bg-success text-white';
    } else {
        result.innerHTML = document.getElementById('errorMessage').value;
        result.className = 'result-message bg-danger text-white';
    }
}

function generateWidget(id, correctAnswer, successMessage, errorMessage, equation) {
    const displayEquation = equation.replace(/\?/g, '<span class="unknown-number">?</span>');
    
    // Генерируем HTML с data-атрибутами
    const html = `
<div class="widget-wrapper">
    <div class="math-widget" 
        data-math-widget="true"
        data-correct-answer="${correctAnswer}"
        data-success-message="${escapeHtml(successMessage)}"
        data-error-message="${escapeHtml(errorMessage)}">
        <div class="equation-wrapper">
            <span class="caption">Решите пример:</span>
            <span class="equation-text">${displayEquation}</span>
        </div>
        <div class="equation-check">
            <input type="number" class="answer-input" step="any" placeholder="Ваш ответ">
            <button class="check-btn">Проверить</button>
        </div>
        <div class="result-wrapper" style="display: none;">
            <div class="message-wrapper"></div>
        </div>
    </div>
</div>`;
    
    return { html, displayEquation, id };
}

function generateCode() {
    widgetId = 'math-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    const equation = document.getElementById('equation').value;
    const correctAnswer = parseFloat(document.getElementById('correctAnswer').value) || 0;
    const successMessage = escapeHtml(document.getElementById('successMessage').value);
    const errorMessage = escapeHtml(document.getElementById('errorMessage').value);
    
    const widget = generateWidget(widgetId, correctAnswer, successMessage, errorMessage, equation);
    
    const fullCode = `${widget.html}`;
    
    document.getElementById('code').textContent = fullCode;
    document.getElementById('codeOutput').style.display = 'block';
    document.getElementById('empty').style.display = 'none';
    
    createDemo(widget);
}

function createDemo(widget) {
    const demoDiv = document.getElementById('demo');
    
    demoDiv.innerHTML = widget.html;
    
    const demoWidget = demoDiv.querySelector('[data-math-widget]');
    if (demoWidget) {
        const correctAnswer = parseFloat(document.getElementById('correctAnswer').value) || 0;
        const successMessage = document.getElementById('successMessage').value;
        const errorMessage = document.getElementById('errorMessage').value;
        
        const answerInput = demoWidget.querySelector('.answer-input');
        const checkBtn = demoWidget.querySelector('.check-btn');
        const resultDiv = demoWidget.querySelector('.result-wrapper');
        const messageDiv = demoWidget.querySelector('.message-wrapper');
        
        function checkDemoAnswer() {
            const userValue = answerInput.value.trim();
            
            if (!userValue) {
                messageDiv.innerHTML = 'Пожалуйста, введите ответ';
                messageDiv.className = 'message-wrapper error-message';
                resultDiv.style.display = 'flex';
                return;
            }
            
            const userAnswer = parseFloat(userValue);
            
            if (Math.abs(userAnswer - correctAnswer) < 0.0001) {
                messageDiv.innerHTML = successMessage;
                messageDiv.className = 'message-wrapper success-message';
                resultDiv.style.display = 'flex';
            } else {
                messageDiv.innerHTML = errorMessage;
                messageDiv.className = 'message-wrapper error-message';
                resultDiv.style.display = 'flex';
            }
        }
        
        checkBtn.addEventListener('click', checkDemoAnswer);
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkDemoAnswer();
        });
    }
}

function copyCode() {
    const codeText = document.getElementById('code').textContent;
    
    const textarea = document.createElement('textarea');
    textarea.value = codeText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    const btn = document.querySelector('[onclick="copyCode()"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Скопировано!';
    btn.classList.remove('btn-light');
    btn.classList.add('btn-success');
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-light');
    }, 2000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function initGlobalCode() {
    const globalCodeElement = document.getElementById('global-code');
    if (globalCodeElement) {
        globalCodeElement.textContent = `<script src="https://kennyhouston-hw.github.io/Math-Gen/math-widget.js"><\/script><br><link rel="stylesheet" href="https://kennyhouston-hw.github.io/Math-Gen/widget-style.css">`;
    }
}

function copyGlobalCode() {
    const codeText = document.getElementById('global-code').textContent;
    
    const cleanText = codeText.replace(/<\\\/script>/g, '</script>');
    
    const textarea = document.createElement('textarea');
    textarea.value = cleanText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    const btn = document.querySelector('#global button');
    const originalText = btn.textContent;
    btn.textContent = '✓ Скопировано!';
    btn.classList.remove('btn-light');
    btn.classList.add('btn-success');
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-light');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    updatePreview();
    
    document.getElementById('equation').addEventListener('input', updatePreviewDelayed);
    document.getElementById('correctAnswer').addEventListener('input', updatePreviewDelayed);
    document.getElementById('successMessage').addEventListener('input', updatePreviewDelayed);
    document.getElementById('errorMessage').addEventListener('input', updatePreviewDelayed);
    
    document.getElementById('previewInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPreview();
        }
    });
    
    document.getElementById('previewInput').addEventListener('input', function() {
        document.getElementById('previewResult').innerHTML = '';
        document.getElementById('previewResult').className = 'result-message';
    });
    
    console.log('Приложение загружено и готово к работе!');

    initGlobalCode();
});

