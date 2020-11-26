import * as w from "./azState.js";
import {html, render} from 'https://unpkg.com/lit-html?module';


//window.state = w.createState({todos:[{ttl:"do this",status:'Active'}],todoFilter:"Active"},true);   

class todoList extends HTMLElement  {
    constructor() {
      super();
      this.addEventListener("click",(e)=>{          
          let ind=e.target?.getAttribute("kill-todo");
          let indDel=e.target?.getAttribute("del-todo");
          let filter = e.target?.getAttribute("filter");
          if (ind){
              this.state.todos[ind].status="Complete"                            
          }                    
          if (filter){
            this.state.todoFilter=filter;
          }     
      })
      this.addEventListener("change",(e)=>{
        if (e.target?.id=="newTask"){
            this.state.todos.push({ttl:e.target.value,status:"Active"})
            e.target.value="";  
        }
      })
    }
    bind(state){
        this.state=state;
        w.addWatch(this.state,()=>{this.render()});
        this.render();
    }
    render(){
        console.log("zzz render")
        if (!this.state){return;}

        let tmpl = html`
            <style>
                @import "todo.css";
                @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
                            
            </style>
            <div><input id="newTask" class="new-todo" placeholder="What needs to be done?"></div>
            <div>
                ${this.state.todos.map((el,ind)=>{return {el:el,ind:ind};}).filter((el)=>{                                 
                    if (this.state.todoFilter == "All"){return true;}
                    return (this.state.todoFilter == el.el.status);
                }).map((el)=>{return html`
                        <div class="todo-line">
                        <i class="fa fa-square-o" kill-todo=${el.ind}  style=${el.el.status=="Complete"?'display:none':''}></i>                        
                        <i class="fa fa-check-square-o" style=${el.el.status!="Complete"?'display:none':''}></i>                       
                        <span  todo-status=${el.el.status}>${el.el.ttl}</span> 
                        <span del-todo>x</span>
                        <div>
                    `})}
            </div>            
            <div class="todo-footer" style=${this.state.todos.length>0?'':'display:none'}>
                <span>${this.state.todos.filter(el=>{return el.status=="Active"}).length} items  left
                <a href="#" filter="All" class=${this.state.todoFilter=="All" ? "h": "l"}>All</a>
                <a href="#"  filter="Active" class=${this.state.todoFilter=="Active" ? "h": "l"}>Active</a>
                <a href="#"  filter="Complete" class=${this.state.todoFilter=="Complete" ? "h": "l"}>Complete</a>
                
            </div>
        `;
        render(tmpl, this);
    }    
  }

  customElements.define('todo-list', todoList);