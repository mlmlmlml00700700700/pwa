const form = document.querySelector('form');
const boxes = document.querySelectorAll('.list');

//출발, 이동(도착)시점 .list 의 id이름
let from;
let to;

let todoList =[];
let doingList =[];
let doneList =[];

let lists = { 
  todo : todoList,
  doing : doingList,
  done : doneList
}

//.list가 (item이)드래그되는걸 인식할때 발생하는 함수
const dragOver = (e) => {  
  e.preventDefault();   
  const { id : targetId } = e.target;  
  const listIds = Object.keys(lists); //오브젝트의 키값만 
  
  if(listIds.includes(targetId)){ 
    to = targetId 
  }
}

const dragStart = (e) => {  
  from = e.target.parentElement.id; 
  console.log(from)
}
const dragEnd = (e) => {
  if(from === to) {  
    return; 
  }
  e.target.remove();    
  
  const { id } = e.target;

  lists[from] = lists[from].filter((item) => {
    if(item.id !== id){
      return item
    } else { createItem(to,item) }
  })
  //console.log(from, lists[from])
  //console.log(to, lists[to])
  saveList(from);   //로컬 스토리지 업데이트
  saveList(to);
}

//오른쪽 마우스를 누르면 아이템을 삭제하는 함수
const removeItem =(e)=>{
  e.preventDefault();
  const { id } = e.target;
  const { id:parentId } = e.target.parentElement ;
  console.log(parentId);

  e.target.remove();
  lists[parentId] = lists[parentId].filter((aa) =>{
    return aa.id !== id;
  })
  saveList(parentId)
}


//item엘리먼트 만들어주는 함수선언
const createItem = (listId,aa) => {
  const list = document.querySelector(`#${listId}`);
  const item = document.createElement('div'); 
  
  item.id = aa.id; 
  item.innerText = aa.text;
  item.classList.add('item');
  item.draggable = 'true';  

  item.addEventListener('dragstart',dragStart); 
  item.addEventListener('dragend',dragEnd); 
  item.addEventListener('contextmenu',removeItem) //오른쪽 마우스를 누르면 아이템을 삭제하는 함수 실행


  list.appendChild(item);  
  lists[listId].push(aa);    
}

//로컬스토리지에 저장하는 함수 선언
const saveList =(aa)=>{
  localStorage.setItem(aa,JSON.stringify(lists[aa]))
}

//입력값을 받아오고, 아이디 만들고, 새로운 아이템 만들어주는 함수
const createTodo = (e) => {
  e.preventDefault();  
  const input = document.querySelector('input');
  const id = uuidv4();  

  const newTodo = {
    id,
    text :input.value,
  }  
  createItem('todo', newTodo) 
  input.value= '';  
  saveList('todo')
}
const loadList =()=>{
  const userTodoList = JSON.parse(localStorage.getItem('todo'));
  const userDoingList = JSON.parse(localStorage.getItem('doing'));
  const userDoneList = JSON.parse(localStorage.getItem('done'));

  if(userTodoList) {
    userTodoList.forEach((aa)=>{
    createItem('todo',aa)
    });
  }
  if(userDoingList) {
    userDoingList.forEach((aa)=>{
    createItem('doing',aa)
    });
  }
  if(userDoneList){
    userDoneList.forEach((aa)=>{
    createItem('done',aa)
    })
  }
}

loadList(); //로컬스토리지에 저장된 데이터를 불러옴
form.addEventListener('submit',createTodo);

boxes.forEach((box) =>{
  box.addEventListener('dragover',dragOver)
});
