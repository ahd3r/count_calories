// Strage controler
const Storage=(function(){
  return {
    getDataFromStorage:function(){
      const data = localStorage.getItem('data');
      return JSON.parse(data);
    },
    setAgainDataInStorage:function(data){
      localStorage.setItem('data',JSON.stringify(data));
    },
  }
})();

// Item controler
const ItemCTRL=(function(){
  // Data which we have
  const data = {
    items: function(){
      if(getDataFromStorage()){
        const timeData1=storage.getDataFromStorage();
        return timeData1;
      }else{
        storage.setAgainDataInStorage([]);
        const timeData2=storage.getDataFromStorage();
        return timeData2;
      }
    },//[{id:1,name:'Call',calories:200}]
    currentItem: null, // choiced item for edition
    // totalCalories: function(items){
    //   let res=0;
    //   items.forEach((item)=>{
    //     res+=item.calories;
    //   });
    //   return res;
    // }
  };
  return {
    getData:function(){
      return data.items;
    },
    getCalories:function(items){
      let res=0;
      items.forEach((item)=>{
        res+=item.calories;
      });
      return res;
    }
  };
})();

// UI comtroler
const UICTRL=(function(){
  return {
    calcAllCaloriesAndShow:function(calories){
      document.querySelector('.container').appendChild(document.createElement('div')).className='row secondrow';
      document.querySelector('.secondrow').appendChild(document.createElement('div')).className='col';
      document.querySelector('.secondrow>.col').appendChild(document.createElement('h3')).className='text-center';
      document.querySelector('h3').textContent=`Total calories: ${calories}`;
    },
    renderFoodData:function(items){
      document.querySelector('#food').value='';
      document.querySelector('#calories').value='';
      document.querySelector('.container').appendChild(document.createElement('div')).className='row thirdrow';
      document.querySelector('.thirdrow').appendChild(document.createElement('div')).className='col';
      document.querySelector('.thirdrow>.col').appendChild(document.createElement('ul')).className='collection';
      document.querySelector('.thirdrow>.col>.collection').setAttribute('id','item-list');
      items.forEach(item=>{
        document.querySelector('#item-list').appendChild(document.createElement('li')).className=`collection-item item-${item.id}`;
        document.querySelector(`.item-${item.id}`).appendChild(document.createElement('strong')).textContent=`${item.name}`;
        document.querySelector(`.item-${item.id}`).appendChild(document.createElement('em')).textContent=` | calories: ${item.calories}`;
        document.querySelector(`.item-${item.id}`).appendChild(document.createElement('a')).className='secondary-content';
        document.querySelector(`.item-${item.id}>a`).setAttribute('href','#!');
        document.querySelector(`.item-${item.id}>a`).appendChild(document.createElement('i')).className=`edit-for-${item.id} small material-icons classForOpacity`;
        document.querySelector(`.edit-for-${item.id}`).textContent='create';
        document.querySelector(`.item-${item.id}`).addEventListener('mouseover',function(){
          document.querySelector(`.edit-for-${item.id}`).className=`edit-for-${item.id} small material-icons`;
        });
        document.querySelector(`.item-${item.id}`).addEventListener('mouseout',function(){
          document.querySelector(`.edit-for-${item.id}`).className=`edit-for-${item.id} small material-icons classForOpacity`;
        });
      });
    },
    nothing:function(){
      if(document.querySelector('.secondrow') && document.querySelector('.thirdrow')){
        document.querySelector('.secondrow').remove();
        document.querySelector('.thirdrow').remove();
      }
      document.querySelector('.container').appendChild(document.createElement('div')).className='row nothing';
      document.querySelector('.nothing').appendChild(document.createElement('div')).className='col';
      document.querySelector('.nothing>.col').appendChild(document.createElement('h3')).className='text-center';
      document.querySelector('.nothing>.col>h3').textContent='You didn\'t eat nothing yet.';
    }
  };
})();

// App controler
const App = (function(ItemCTRL, UICTRL, Storage){
  const loadEventListeners=function(){
    document.querySelector('.addMeal').addEventListener('submit',function(e){
      const food = document.querySelector('#food').value;
      const calories = document.querySelector('#calories').value;
      if(food===''||calories===''){
        alert('Fill line');
      } else if(parseInt(calories)===0){
        alert('Calories can\'t be equel to 0');
      } else{
        const currentData=ItemCTRL.getData();
        if(currentData===[]){
          currentData.push({id:1,name:food,calories:parseInt(calories)});
        }else{
          const lastCurrentData=currentData[currentData.length - 1];
          currentData.push({id:lastCurrentData.id + 1,name:food,calories:parseInt(calories)});
        }
        Storage.setAgainDataInStorage(currentData);
        if(document.querySelector('.secondrow')){
          document.querySelector('.secondrow').remove();
          document.querySelector('.thirdrow').remove();
        }
        UICTRL.calcAllCaloriesAndShow(ItemCTRL.getCalories(currentData));
        UICTRL.renderFoodData(currentData);
      }
      e.preventDefault();
    });
  };
  return {
    event:loadEventListeners(),
    init: function(){
      const check=ItemCTRL.getData()
      if(check.length===0){
        UICTRL.nothing();
      }else{
        UICTRL.calcAllCaloriesAndShow(ItemCTRL.getCalories(ItemCTRL.getData()));
        UICTRL.renderFoodData(ItemCTRL.getData());
      }
    }
  };
})(ItemCTRL, UICTRL, Storage);

// Initialize App
App.init();
// App.event;
