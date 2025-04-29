let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
let moodCalendar = JSON.parse(localStorage.getItem('moodCalendar')) || {};
let currentMood=null;
let currentRating=null;

let selectedDate=new Date();


let currentDate=new Date();

function getDateKey(date){
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');

    return `${y}-${m}-${d}`;
}


function setMood(mood) {
    currentMood = mood;
    selectedDate=new Date();
    const key = getDateKey(selectedDate);
    moodCalendar[key]=mood;
    localStorage.setItem('moodCalendar',JSON.stringify(moodCalendar));

    getCalendar();

    
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
    const rating = currentRating||document.getElementById('rating').value;
    const mood = currentMood;
    if (!reason) {
        alert("Please enter a reason for how you're feeling.");
        return;
    }
    if (!mood||!rating) {
        alert("Mood or rating is missing.");
        return;
    }
    const key = getDateKey(new Date());
    
    const currentDate = selectedDate.toLocaleString();
    moodHistory.push({ 
        mood: mood, 
        rating: rating, 
        reason: reason, 
        date: new Date().toLocaleDateString() 
    });
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    updateHistory();

    document.getElementById('reason-div').style.display = 'none';
    document.getElementById('rating').value = '';
    document.getElementById('reason-text').value = '';
}


function getCalendar(){
    const calendar = document.getElementById('calendarDays');
    const monthYear = document.getElementById('monthYear');
    calendar.innerHTML = ' ';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month,1).getDay();
    const totalDays = new Date(year, month+1,0).getDate();

    document.getElementById('monthYearText').textContent=`${currentDate.toLocaleString('default',{month:'long'})} ${year}`;



    
    

    for(let i =0;i<firstDay;i++){
        calendar.innerHTML += "<div></div>"
    }

    for(let day =1;day<=totalDays;day++){
        const date = new Date(year,month,day);
        const key = getDateKey(date);
        const div = document.createElement('div');
        div.textContent = day;
    
        
        if(moodCalendar[key]){
            div.classList.add(moodCalendar[key]);
        }
        if(getDateKey(date)===getDateKey (new Date())){
            div.style.border = '2px solid green';
        }

        div.addEventListener('click',()=>{
            selectedDate=date;
            

        });


        
        calendar.appendChild(div);
    }

}
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth()-1);
    getCalendar();
}

function nextMonth(){
    currentDate.setMonth(currentDate.getMonth()+1);
    getCalendar();
}

function updateHistory() {
    const historyList = document.getElementById('mood-history-list');
    historyList.innerHTML = '';

    moodHistory.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.date}: ${entry.mood} ${entry.rating ? `(Rating: ${entry.rating}) (Reason:${entry.reason})` : ''}`;
        
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm("Are you sure you want to clear your mood history?")) {
        moodHistory = [];
        localStorage.removeItem('moodHistory');
        localStorage.removeItem('moodCalendar');

        updateHistory();
        getCalendar();
    }
}


getCalendar();
updateHistory();

