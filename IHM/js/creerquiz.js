var quizfinal=[]
var allquestions=document.getElementById("allquestions")
var questionfinal;
var assertlength=0
var ques=""
var tabassertions=[]
var bonnerep=""
var quest=document.getElementById("areaq")
var assert=document.getElementById("areaA")
ajouterQuestion=document.getElementById("btnq")
var btnA=document.getElementById("btnA")
var textq=document.getElementById("textq")
var ulA=document.getElementById("ulA")


ajouterQuestion.onclick=()=>{
    if(quest.value.length>5){
        textq.style="border: 2px solid rgb(58, 21, 21)"
    textq.innerHTML="Question: "+quest.value
    ques=quest.value
    quest.value=""
    }else{
        alert("veuillez mettre une question de plus de 5 caractères!")
    }
    
}

btnA.onclick=()=>{
    
    if(assert.value!=0){
                var p=document.getElementById("alertbonassertion")
                p.innerHTML="Cliquez sur la bonne assertion"
                var ass=document.createElement("li")
                ass.innerHTML=assert.value
                tabassertions.push(assert.value)
                assert.value=""
                assertlength=tabassertions.length
                ulA.appendChild(ass)
                ass.onclick=(event)=>
                { 
                event.preventDefault();

                const selectedChoice = event.target;
                
                if (selectedChoice.tagName === "LI") {
                document.querySelectorAll("#ulA li").forEach(e=>{
                    if(e!==selectedChoice){
                    e.classList.remove("assselected");
                    
                }else{
                    e.classList.add("assselected");
                    bonnerep=e.innerHTML
                }
                })
    
            }
    
    }
    }else{
        alert("N'ajoutez pas une assertion vide")
    }
    
}


const btncreerquestion=document.getElementById("btncreequestion")
btncreerquestion.onclick=()=>{
    
    questionfinal={}
    if(ques.length>5){
        if(tabassertions.length>=2){
            if (bonnerep!="") {
                document.getElementById("fermermodal").click()
                questionfinal.question=ques
                questionfinal.assertions=tabassertions
                questionfinal.bonnerep=bonnerep
                console.log(questionfinal);
                
                quizfinal.push(questionfinal)
                var quesx=document.createElement("p")
                quesx.innerHTML=ques
                var ulx=document.createElement("ul")
                ulx.classList.add("uladded")
                ulx.appendChild(quesx)
                for (let i = 0; i < tabassertions.length; i++) {
                    var assx=document.createElement("li")
                    assx.innerHTML=tabassertions[i]
                    if(assx.innerHTML==bonnerep){
                        assx.classList.add("bonne")
                    }
                    ulx.appendChild(assx)
                }
                
                allquestions.appendChild(ulx)
                vider()
                
            }else{
                alert("veuillez cliquez sur la bonne assertion!")
            }
        
        }else{
            console.log(tabassertions.length);
            alert("il faut au moins deux assertions!")
        }
        
    }else{
        alert("Veuillez mettre une question de plus de 5 caractères!")
    }
    
}

const btncreerquiz=document.getElementById("btncreerquiz")
btncreerquiz.onclick=()=>{
    const formquiz=document.getElementById("formquiz")
    const inputquiz=document.getElementById("inputquiz")
    const delai=document.getElementById("delai")
    const njoueurs=document.getElementById("njoueurs")
    const nomquiz=document.getElementById("nomquiz")
    const userid=document.getElementById("userid")
    if(nomquiz.value==''||njoueurs.value<=0||delai.value<=0||quizfinal.length==0){
        alert("veuillez bien tout completer!")
    }else{ 

    var uniqId=new Date().toISOString().replace(/[^0-9]/g,"")
    var idfinal=userid.value.toString()+"^"+uniqId.toString()
    quizfinal.unshift({nomquiz:nomquiz.value,id:idfinal,delai:delai.value,maxjoueurs:njoueurs.value,gamers:[]})
    var jsonstr=JSON.stringify(quizfinal)
    inputquiz.value=jsonstr
    formquiz.submit()
    console.log(inputquiz.value);
    }
}

document.getElementById("fermermodal").addEventListener("click",()=>{
    quest.value=""
    assert.value=""
})

function vider() {
    tabassertions=[]
    ulA.innerHTML=""
    textq.innerHTML=""
    textq.style.border=""

}