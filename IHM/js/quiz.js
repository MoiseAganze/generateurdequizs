const tabquiz=document.getElementById("tabquiz")
const quizData = JSON.parse(tabquiz.value);
const timeout=parseInt(quizData[0].delai)*60
const setscore=document.getElementById('setscore')
const settime=document.getElementById('settime')
const textdiv=document.querySelector(".textdiv .p")
const questionElement =document.getElementById("question");
const choicesElement = document.getElementById("choices");
const submitButton = document.getElementById("submit-btn");
const quizContainer= document.getElementById("quiz");
const resultContainer = document.getElementById("result-container");
const resultElement = document.getElementById("result");
const divq=document.querySelector(".divq2")
const beforeStyle=getComputedStyle(divq,"::before");
const afterStyle=getComputedStyle(divq,"::after");

let currentQuestion = 1;
let score = 0;
var duraton=30;
var interval;

var timerinterval;
var min=0


function startCountDown(){
    var countel=document.querySelector('.countload')
    var countvalue=11

    var countinterval=setInterval(function(){
      countvalue--;
      countel.textContent=countvalue
      if(countvalue===0){
        clearInterval(countinterval)
        countel.style.display='none'
        document.querySelector('#quiz-container').style.display='block'
        loadQuestion();
        startTimerr();
      }
    },1000)
}


function updateProgressBar(){
      quizContainer.style= "display:none;"
      progress=document.querySelector('.progress')
      progress.classList.remove('d-none')
      progressbar=document.querySelector('#progress-bar')
      let p=0

      const inerval=setInterval(()=>{
        p+=1
        if(p>100){
          p=100
          progress.classList.add('d-none')
          clearInterval(inerval);
          document.querySelector('#result-container').style.display='block'
        }
        progressbar.style.width=`${p}%`
        progressbar.setAttribute('aria-valuenow',p)
      },40)

}



function updatetimer(){
    min++;
    if (min==timeout) {
      showResult()
    }
    document.querySelector('.timefin').textContent="temps: "+min+"s / "+timeout+"s"
}

function startTimerr(){
    document.querySelector('.timefin').style.display='block'
    timerinterval=setInterval(updatetimer,1000)
}

function stoptimer(){
    clearInterval(timerinterval)
    document.querySelector('.timefin').style.display='none'
}



function loadQuestion() {

    const currentQuizData = quizData[currentQuestion];
    questionElement.textContent = currentQuizData.question;
    choicesElement.innerHTML = "";
    currentQuizData.assertions.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;
      li.classList.add('list-group-item')
      li.classList.add('list-group-item-action')
      choicesElement.appendChild(li);
      
    });
 
}


function checkAnswer() {
      event.preventDefault()
      
      window.scrollTo({
        top:0,
        behavior:'smooth'
      })
      const selectedChoice = document.querySelector("li.selected");
      if (selectedChoice){ 
      clearInterval(interval)
        }
      if (!selectedChoice) return;

      const selectedAnswer = selectedChoice.textContent;
      
      if (selectedAnswer == quizData[currentQuestion].bonnerep) {
        score++;
      }

      selectedChoice.classList.remove("selected");

      currentQuestion++;
      
      var number=5.5-currentQuestion/2
      var n=number.toString();
      
      if (currentQuestion < quizData.length) {
        loadQuestion();
      } else {
        showResult();
      }
 
}

function showResult() {
    stoptimer() 
    updateProgressBar()
    document.getElementById("setscore").value=score
    document.getElementById("settime").value=min
    resultElement.textContent = `Votre score : ${score} / ${quizData.length-1}`+`, temps: ${min} secondes`;

}




function liclick(event){
    event.preventDefault();
    
    const selectedChoice = event.target;
    
    if (selectedChoice.tagName === "LI") {
      document.querySelectorAll("li").forEach(e=>{
        if(e!==selectedChoice){
          e.classList.remove("selected");
      }else{
        e.classList.add("selected");
      }
      })   
   
 }
}


choicesElement.addEventListener("click", liclick);
submitButton.addEventListener("click", checkAnswer);