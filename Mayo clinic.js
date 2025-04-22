let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
let currentMood = '';
let currentRating = '';

function setMood(mood) {
    currentMood = mood;
    document.getElementById('rating-div').style.display = 'block';
    document.getElementById('reason-div').style.display = 'none';
}

function submitRating() {
    const rating = document.getElementById('rating').value;

    if (rating < 1 || rating > 10) {
        alert("Please enter a rating between 1 and 10.");
        return;
    }

    currentRating = rating;
    document.getElementById('rating-div').style.display = 'none';
    document.getElementById('reason-div').style.display = 'block';
}

function saveMood() {
    const reason = document.getElementById('reason-text').value.trim();

    if (!reason) {
        alert("Please enter a reason for how you're feeling.");
        return;
    }

    const currentDate = new Date().toLocaleString();
    moodHistory.push({ mood: currentMood, rating: currentRating, reason: reason, date: currentDate });
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    updateHistory();

    document.getElementById('reason-div').style.display = 'none';
    document.getElementById('rating').value = '';
    document.getElementById('reason-text').value = '';
}

function updateHistory() {
    const historyList = document.getElementById('mood-history-list');
    historyList.innerHTML = '';

    moodHistory.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.mood} (Rating: ${entry.rating}) - ${entry.reason} - ${entry.date}`;
        historyList.appendChild(listItem);
    });
}

function clearHistory() {
    if (confirm("Are you sure you want to clear your mood history?")) {
        moodHistory = [];
        localStorage.removeItem('moodHistory');
        updateHistory();
    }
}

updateHistory();
