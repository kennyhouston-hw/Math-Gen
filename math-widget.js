// math-widget.js - Общий скрипт для всех математических виджетов
document.addEventListener('DOMContentLoaded', function() {
    // Находим все виджеты на странице
    const widgets = document.querySelectorAll('[data-math-widget]');
    
    widgets.forEach(function(widget) {
        // Получаем параметры из data-атрибутов
        const correctAnswer = parseFloat(widget.dataset.correctAnswer);
        const successMessage = widget.dataset.successMessage || 'Верно! 🎉';
        const errorMessage = widget.dataset.errorMessage || 'Попробуйте еще раз!';
        
        // Находим элементы внутри виджета
        const answerInput = widget.querySelector('.answer-input');
        const checkBtn = widget.querySelector('.check-btn');
        const resultDiv = widget.querySelector('.result-wrapper');
        const messageDiv = widget.querySelector('.message-wrapper');
        
        if (!answerInput || !checkBtn) return;
        
        function checkAnswer() {
            const userValue = answerInput.value.trim();
            
            if (!userValue) {
                showMessage('Пожалуйста, введите ответ', 'error');
                return;
            }
            
            const userAnswer = parseFloat(userValue);
            
            if (Math.abs(userAnswer - correctAnswer) < 0.0001) {
                showMessage(successMessage, 'success');
            } else {
                showMessage(errorMessage, 'error');
            }
        }
        
        function showMessage(text, type) {
            if (!messageDiv || !resultDiv) return;
            
            messageDiv.innerHTML = text;
            messageDiv.className = 'message-wrapper';
            messageDiv.classList.add(type === 'success' ? 'success-message' : 'error-message');
            resultDiv.style.display = 'flex';
        }
        
        // Добавляем обработчики
        checkBtn.addEventListener('click', checkAnswer);
        
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    });
});