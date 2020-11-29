import * as w from "./azState.js";
import {html, render} from 'https://unpkg.com/lit-html?module';


//window.state = w.createState({todos:[{ttl:"do this",status:'Active'}],todoFilter:"Active"},true);   

class todoList extends HTMLElement  {
    constructor() {
      super();
      this.genInput=document.createElement("input"); 
      this.genInput.id="genInput"; //use this to display an in[ut for changing a task

      this.addEventListener("click",(e)=>{          
          let ind=e.target?.getAttribute("kill-todo");
          let indDel=e.target?.getAttribute("del-todo");
          let filter = e.target?.getAttribute("filter");
          if (ind){ //clicked on complete chekbox            
              this.state.todos[ind].status="Complete"                            
          }                    
          if (indDel){  //clicked on remove button
            this.state.todos.splice(indDel,1);            
            
          }
          if (filter){ //clicked on filtering (active, done,all)
            this.state.todoFilter=filter;
          }     
      })
      this.addEventListener("change",(e)=>{
        if (e.target?.id=="newTask"){ //added a new task by typingin the large top inpute
            this.state.todos.push({ttl:e.target.value,status:"Active"})
            e.target.value="";              
        }        
        let ind=e.target?.getAttribute("task-edit");
        if (ind){
            this.state.todos[ind].ttl=e.target.value;
        }

      })
      this.addEventListener("dblclick",(e)=>{ //wants to chage a task
        let index=e.target?.getAttribute("todo-index"); 
        if (index){
            console.log("ZZZZ",index)
            this.genInput.id
        }
        
      })

      
    }
    bind(state){
        this.state=state;
        w.addWatch(this.state,()=>{this.render()});
        this.render();
    }
    render(){
        if (!this.state){return;}

        let tmpl = html`
            <style>
                @import "todo.css";
                @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                            
            </style>
            <div class="doto-container">
                <div><input id="newTask" class="new-todo" placeholder="What needs to be done?"></div>
                <div>
                    ${this.state.todos.map((el,ind)=>{return {el:el,ind:ind};}).filter((el)=>{                                 
                        if (this.state.todoFilter == "All"){return true;}
                        return (this.state.todoFilter == el.el.status);
                    }).map((el)=>{return html`
                            <div class="todo-line" todo-index=${el.ind}>
                            <i class=${el.el.status=="Complete"? "fa fa-check-square-o" : "fa fa-square-o"} kill-todo=${el.ind}></i>                                                                    
                            <span  todo-status=${el.el.status}><input class="azedit" value=${el.el.ttl} task-edit=${el.ind}></span> 
                            <span del-todo=${el.ind}>x</span>
                            <div>
                        `})}
                </div>            
                <div class="todo-footer" style=${this.state.todos.length>0?'':'display:none'}>
                    <span>${this.state.todos.filter(el=>{return el.status=="Active"}).length} items  left
                    <a href="#" filter="All" class=${this.state.todoFilter=="All" ? "h": "l"}>All</a>
                    <a href="#"  filter="Active" class=${this.state.todoFilter=="Active" ? "h": "l"}>Active</a>
                    <a href="#"  filter="Complete" class=${this.state.todoFilter=="Complete" ? "h": "l"}>Complete</a>
                    
                </div>
            </dic>
        `;
        render(tmpl, this);
    }    
  }

  customElements.define('todo-list', todoList);