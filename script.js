let TC=$(".ticket-container")
let allFilters=$(".filter")
let modalVisible=false;

function loadtickets(color){

    let allTasks=localStorage.getItem("allTasks")
    if(allTasks!=null){
        allTasks=JSON.parse(allTasks)  //array
        if(color){
            allTasks=allTasks.filter(function(data){
                return data.priority==color
            })
        }

        for(let i=0;i<allTasks.length;i++){
            let ticket=$('<div></div>').addClass('ticket');
            ticket.html(`<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
            <div class="ticket-id">#${allTasks[i].ticketId}</div>
            <div class="task">${allTasks[i].task}</div>
            `)
            $(".ticket-container").append(ticket)
            
            //selecting the tickets to make it active/inactive
            ticket.bind("click",function(e){
                $(this).toggleClass("active");
            })

        }
    }
}

loadtickets()

$(allFilters).each(function(index,item){

    $(item).bind("click",filterHandler)
})

function filterHandler(e){

    $(TC).html("")
 
    if($(this).hasClass("active")){

        $(this).removeClass("active")
        loadtickets()
    }
    else{
        let activeFilter=$(".filter.active")
        if(activeFilter){
            activeFilter.removeClass("active")
        }
        $(this).addClass("active")
        let ticketPriority=$(this).children().attr("class").split("-")[0]
        console.log(ticketPriority)
        loadtickets(ticketPriority)
    }   
}

$(".add").bind("click",showModal)

$(".delete").bind("click",function(e){
    let selectedTickets=$(".ticket.active")
    let allTasks=JSON.parse(localStorage.getItem("allTasks"))

    for(let i=0;i<selectedTickets.length;i++){
        selectedTickets[i].remove();  //removing from html
        let ticketId=$(selectedTickets[i]).children()[1]
        ticketId=$(ticketId).text()
        allTasks=allTasks.filter(function(data){
            return (("#"+data.ticketId)!=ticketId)
        })
    }
    localStorage.setItem("allTasks",JSON.stringify(allTasks))

})

function showModal(){
    // console.log("hey")
    if(!modalVisible){
        let modal=$('<div></div>').addClass('modal');
        modal.html(`<div class="task-to-be-added" data-typed="false" contenteditable="true">Enter your task here</div>
            <div class="modal-priority-list">
            <div class="modal-pink-filter modal-filter active"></div>
            <div class="modal-blue-filter modal-filter"></div>
            <div class="modal-green-filter modal-filter"></div>
            <div class="modal-yellow-filter modal-filter"></div>
        </div>`)
        $(TC).append(modal)
        selectedPriority="pink"
        let taskModal=$(".task-to-be-added")
        taskModal.bind("click",function(e){
            if($(this).attr("data-typed")=="false"){
                $(this).text("")
                $(this).attr("data-typed","true")
            }

        })
        modalVisible=true
        taskModal.bind("keypress",addTicket.bind(this,taskModal));
        let modalfilters = $(".modal-filter");
        $(modalfilters).each(function (index, item) {
            $(item).bind("click", selectPriority.bind(this,taskModal));
        });
    }
}

//selecting the priority color of ticket to be made
function selectPriority(taskModal,e){

    $(".modal-filter.active").removeClass("active")
    $(this).addClass("active")
    taskModal.click()
    taskModal.focus()  //to make enter(to add ticket) work even when we are choosing the priority
    selectedPriority=$(this).attr("class").split(" ")[0].split("-")[1] //[modal,pink,filter]=>pink(1)

}

function addTicket(taskModal,e){

    //adding the ticket when enter is pressed
    if(e.key=="Enter" && e.shiftKey==false && taskModal.text().trim()!=""){
        let task=taskModal.text();
        // console.log(task)
        let id=uid()
        $(".modal").remove()  //removing the modal after ticket has been created
        
        modalVisible=false;

        //LOCAL STORAGE==============================
        let allTasks=localStorage.getItem("allTasks")
        if(allTasks==null){  //for first ticket
            let data=[{"ticketId":id,"task":task,"priority":selectedPriority}]
            localStorage.setItem("allTasks",JSON.stringify(data))
        }
        else{
            let data=JSON.parse(allTasks)
            data.push({"ticketId":id,"task":task,"priority":selectedPriority})
            localStorage.setItem("allTasks",JSON.stringify(data))
        }
        let activeFilter=$(".filter.active")
        //we are first saving in local storage n then we are loading tickets in html from local storage
        $(".ticket-container").html("")
        if(activeFilter[0]){
            let Priority=selectedPriority
            // console.log(Priority)
            loadtickets(Priority)
        }
        else{
            loadtickets()
        }
        // console.log(allTasks)

    }

    else if(e.key=="Enter" && e.shiftKey==false){
        e.preventDefault();  //to stop cursor from going downward even though we are clicking on enter without writing anything
        alert("You have not typed anything")
    }
}